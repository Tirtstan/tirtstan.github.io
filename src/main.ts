import "./style.css";

const games = [
  {
    widgetId: "3909012",
    title: "pro_cessed",
    tags: ["Unity", "Multiplayer", "Platformer"],
    contributions: ["Programming", "UI/UX", "SFX"],
  },
  {
    widgetId: "3101444",
    title: "deliveralot",
    tags: ["Unity", "Arcade"],
    contributions: ["Programming", "UI/UX"],
  },
  {
    widgetId: "2787537",
    title: "Daring Damsel",
    tags: ["Unity", "Puzzle"],
    contributions: ["Programming", "UX"],
  },
  {
    widgetId: "3039219",
    title: "Canvas Conundrum",
    tags: ["Unity", "Puzzle"],
    contributions: ["Programming", "UX"],
  },
];

const projects = [
  { user: "tirtstan", repo: "Sentinal" },
  { user: "tirtstan", repo: "Pathways" },
  { user: "tirtstan", repo: "Tweening-Components" },
  { user: "tirtstan", repo: "Godot-Unity-Gaming-Services" },
];

function createGameCard(game: (typeof games)[0]) {
  const tagsHtml = [...game.contributions, ...game.tags]
    .slice(0, 4)
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  return `
    <div class="card">
      <h3 class="card-title">${game.title}</h3>
      <div class="card-tags">${tagsHtml}</div>
      <iframe 
        class="itch-widget"
        frameborder="0" 
        src="https://itch.io/embed/${game.widgetId}?border_width=0&bg_color=1a1a1a&fg_color=f0f6f0&link_color=e7f3a7" 
        width="100%" 
        height="150">
      </iframe>
    </div>
  `;
}

function createProjectCard(project: any) {
  const tags = [project.language, `⭐ ${project.stargazers_count}`].filter(
    Boolean,
  );
  const tagsHtml = tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  return `
    <div class="card">
      <h3 class="card-title">${project.name}</h3>
      <div class="card-tags">${tagsHtml}</div>
      <p class="card-description">${project.description || "A project I built"}</p>
      <a href="${project.html_url}" target="_blank" class="card-link">View on GitHub →</a>
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

  // Add game cards
  gamesContainer.innerHTML = games.map((game) => createGameCard(game)).join("");

  // Fetch and add project cards
  const fetchedProjects = await fetchGitHubProjects();
  projectsContainer.innerHTML = fetchedProjects
    .map((project) => createProjectCard(project))
    .join("");
}

document.addEventListener("DOMContentLoaded", initializeCards);

// --- FOOTER ---
document.querySelector<HTMLDivElement>("#bottom")!.innerHTML = `
  <footer class="text-center py-4 mt-8 border-t border-[var(--color-accent1)]/20">
    <p class="text-sm opacity-70">&copy; ${new Date().getFullYear()} Tristan. All rights reserved.</p>
  </footer>
`;
