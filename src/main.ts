import "./style.css";
import gamesData from "./data/games.json";
import projectsData from "./data/projects.json";

interface Game {
  widgetId: string;
  title: string;
  tags: string[];
  contributions: string[];
  year: number;
  details?: string;
}

interface ProjectConfig {
  user: string;
  repo: string;
}

const games: Game[] = gamesData;
const projects: ProjectConfig[] = projectsData;

function createGameCard(game: Game) {
  const contributionsHtml = game.contributions
    .map(
      (tag) =>
        `<span class="contribution-tag text-sm px-2 py-1 bg-[rgba(231,243,167,0.15)] border border-[rgba(231,243,167,0.3)] rounded text-[rgba(231,243,167,0.9)]">${tag}</span>`,
    )
    .join("");

  const tagsHtml = game.tags
    .map(
      (tag) =>
        `<span class="game-tag text-sm px-2 py-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded text-[rgba(255,255,255,0.6)]">${tag}</span>`,
    )
    .join("");

  const detailsHtml = game.details
    ? `<div class="game-details-content mt-2 mb-4 text-base text-[rgba(240,246,240,0.7)] leading-relaxed">${game.details}</div>`
    : "";

  const detailsButtonHtml = game.details
    ? `<button class="details-button p-1 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 z-10">
        <svg class="w-5 h-5 text-[rgba(231,243,167,0.7)] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>`
    : "";

  const yearBadgeHtml = `<span class="year-badge text-sm px-2 py-1 bg-[rgba(231,243,167,0.15)] border border-[rgba(231,243,167,0.3)] rounded text-[var(--color-accent1)]">${game.year}</span>`;

  return `
    <div class="card game-card relative overflow-hidden rounded-[8px] p-4 transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group">
      <div class="absolute top-3 right-3 flex items-center gap-2 z-10">
        ${yearBadgeHtml}
        ${detailsButtonHtml}
      </div>
      <div class="card-header cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <h3 class="card-title text-xl font-bold text-[var(--color-accent1)] flex-1 pr-4">${game.title}</h3>
        </div>
        <div class="flex flex-wrap gap-2 mb-3">${contributionsHtml}${tagsHtml}</div>
      </div>
      <div class="game-details overflow-hidden max-h-0 transition-all duration-300 ease-in-out">
        ${detailsHtml}
      </div>
      <div>
        <iframe
          class="rounded-lg itch-embed"
          frameborder="0"
          src="https://itch.io/embed/${game.widgetId}?border_width=0&bg_color=2a2b2b&fg_color=f0f6f0&link_color=e7f3a7" 
          width="100%" 
          height="167">
        </iframe>
      </div>
    </div>
  `;
}

function createProjectCard(project: any) {
  const tags = [project.language, `⭐ ${project.stargazers_count}`].filter(
    Boolean,
  );
  const tagsHtml = tags
    .map(
      (tag) =>
        `<span class="text-sm px-2 py-1 bg-[rgba(231,243,167,0.1)] border border-[rgba(231,243,167,0.2)] rounded text-[rgba(231,243,167,0.8)]">${tag}</span>`,
    )
    .join("");

  const year = new Date(project.created_at).getFullYear();

  return `
    <div class="card relative overflow-hidden rounded-[8px] p-4 transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group min-h-[200px]">
      <div class="flex items-start justify-between mb-3">
        <h3 class="card-title text-xl font-bold text-[var(--color-accent1)] flex-1">${project.name}</h3>
        <span class="year-badge text-sm px-2 py-1 bg-[rgba(231,243,167,0.15)] border border-[rgba(231,243,167,0.3)] rounded text-[var(--color-accent1)]">${year}</span>
      </div>
      <div class="flex flex-wrap gap-2 mb-3">${tagsHtml}</div>
      <p class="text-base text-[rgba(240,246,240,0.7)] leading-relaxed mb-3">${project.description || "A project I built"}</p>
      <a href="${project.html_url}" target="_blank" class="card-link inline-block text-base text-[var(--color-accent1)] no-underline transition-all duration-200 hover:underline">View on GitHub →</a>
    </div>
  `;
}

async function fetchGitHubProjects() {
  const fetchedProjects = [];

  for (const p of projects) {
    const cacheKey = `github_${p.user}_${p.repo}`;
    const cached = localStorage.getItem(cacheKey);
    let repoData = null;

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 3600 * 1000) {
        repoData = data;
      }
    }

    if (!repoData) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${p.user}/${p.repo}`,
        );
        if (!response.ok) throw new Error(`Repo not found`);
        repoData = await response.json();
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data: repoData, timestamp: Date.now() }),
        );
      } catch (error) {
        console.error(`Failed to fetch ${p.repo}:`, error);
        continue;
      }
    }
    fetchedProjects.push(repoData);
  }

  return fetchedProjects;
}

async function initializeCards() {
  const gamesContainer = document.getElementById("games-grid");
  const projectsContainer = document.getElementById("projects-grid");

  if (!gamesContainer || !projectsContainer) return;

  // Pre-render skeleton cards to prevent layout shift
  gamesContainer.innerHTML = games
    .map(() => '<div class="card-skeleton"></div>')
    .join("");

  projectsContainer.innerHTML = projects
    .map(() => '<div class="card-skeleton"></div>')
    .join("");

  // Small delay to ensure skeletons render
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Render actual game cards
  gamesContainer.innerHTML = games.map((game) => createGameCard(game)).join("");

  // Add click listeners to game cards
  document.querySelectorAll(".game-card .card-header").forEach((header) => {
    header.addEventListener("click", () => {
      const card = header.closest(".game-card");
      const details = card?.querySelector<HTMLDivElement>(".game-details");
      if (details && details.innerHTML.trim() !== "") {
        card?.classList.toggle("expanded");
        const arrow = card?.querySelector(".details-button svg");
        if (card?.classList.contains("expanded")) {
          details.style.maxHeight = details.scrollHeight + "px";
          arrow?.classList.add("rotate-180");
        } else {
          details.style.maxHeight = "0px";
          arrow?.classList.remove("rotate-180");
        }
      }
    });
  });

  // Add click listeners to details buttons
  document.querySelectorAll(".game-card .details-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent header click event from firing
      const card = button.closest(".game-card");
      const details = card?.querySelector<HTMLDivElement>(".game-details");
      if (details && details.innerHTML.trim() !== "") {
        card?.classList.toggle("expanded");
        const arrow = card?.querySelector(".details-button svg");
        if (card?.classList.contains("expanded")) {
          details.style.maxHeight = details.scrollHeight + "px";
          arrow?.classList.add("rotate-180");
        } else {
          details.style.maxHeight = "0px";
          arrow?.classList.remove("rotate-180");
        }
      }
    });
  });

  // Fetch and render project cards
  const fetchedProjects = await fetchGitHubProjects();
  projectsContainer.innerHTML = fetchedProjects
    .map((project) => createProjectCard(project))
    .join("");
}

document.addEventListener("DOMContentLoaded", initializeCards);

document.querySelector<HTMLDivElement>("#bottom")!.innerHTML = `
  <footer class="text-center py-4 mt-8 border-t border-[rgba(231,243,167,0.2)]">
    <p class="text-base opacity-70">&copy; ${new Date().getFullYear()} Tristan. All rights reserved.</p>
  </footer>
`;
