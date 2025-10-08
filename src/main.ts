import "./style.css";

const games = [
  {
    widgetId: "3909012",
    title: "pro_cessed",
    tags: ["Unity", "Action Platformer", "2 Player", "Networked Multiplayer"],
    contributions: ["Programming", "UI/UX", "SFX", "Core Gameplay"],
  },
  {
    widgetId: "3101444",
    title: "deliveralot",
    tags: ["Unity", "Arcade"],
    contributions: ["Programming", "UI/UX", "Core Gameplay"],
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

function createGameCard(game: {
  widgetId: string;
  title: string;
  tags: string[];
  contributions: string[];
}) {
  const tagsHtml = game.tags
    .map((tag) => `<span class="game-tag">${tag}</span>`)
    .join("");
  const contributionsHtml = game.contributions
    .map((tag) => `<span class="contribution-tag">${tag}</span>`)
    .join("");

  return `
    <div class="game-card">
      <h3 class="font-bold text-lg mb-2">${game.title}</h3>
      <div class="flex row-auto gap-4 mb-3">
        <div class="flex flex-wrap gap-2">
            ${contributionsHtml}
        </div>
        <div class="flex flex-wrap gap-2">
            ${tagsHtml}
        </div>
      </div>
      <iframe 
        frameborder="0" 
        src="https://itch.io/embed/${game.widgetId}?border_width=0&bg_color=2a2b2b&fg_color=f0f6f0&link_color=e7f3a7" 
        width="100%" 
        height="167">
      </iframe>
    </div>
  `;
}

function createProjectCard(project: any) {
  return `
    <div class="project-card flex flex-col">
      <div class="flex-grow">
        <h3 class="font-bold text-lg mb-2">${project.name}</h3>
        <p class="text-sm mb-3 opacity-80">${project.description || "No description available."}</p>
      </div>
      <div class="flex justify-between items-center mt-auto pt-2">
        <span class="text-xs bg-[var(--color-accent1)] text-[var(--color-bg)] px-2 py-1 rounded font-bold">
          ${project.language || "N/A"}
        </span>
        <a href="${project.html_url}" target="_blank" class="text-button text-sm">
          View on GitHub
        </a>
      </div>
    </div>
  `;
}

async function fetchGitHubProjects() {
  const projectsContainer = document.getElementById("projects-container");
  if (!projectsContainer) return;

  projectsContainer.innerHTML = `<p class="text-center opacity-50">Fetching projects...</p>`;

  const fetchedProjects = [];
  for (const p of projects) {
    const cacheKey = `github_${p.user}_${p.repo}`;
    const cached = localStorage.getItem(cacheKey);
    let repoData = null;

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Cache is valid for 1 hour
      if (Date.now() - timestamp < 3600 * 1000) {
        repoData = data;
      }
    }

    if (!repoData) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${p.user}/${p.repo}`,
        );
        if (!response.ok)
          throw new Error(`Repo not found or API limit reached.`);
        repoData = await response.json();
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data: repoData, timestamp: Date.now() }),
        );
      } catch (error) {
        console.error(`Failed to fetch ${p.repo}:`, error);
        continue; // Skip this project if fetch fails
      }
    }
    fetchedProjects.push(repoData);
  }

  if (fetchedProjects.length > 0) {
    projectsContainer.innerHTML = fetchedProjects
      .map(createProjectCard)
      .join("");
  } else {
    projectsContainer.innerHTML = `<p class="text-center opacity-50">Could not load projects.</p>`;
  }
}

// --- INITIALIZE PAGE ---
document.addEventListener("DOMContentLoaded", () => {
  const gamesContainer = document.getElementById("games-container");

  // Populate games immediately
  if (gamesContainer) {
    gamesContainer.innerHTML = games.map(createGameCard).join("");
  }

  // Fetch and populate GitHub projects
  fetchGitHubProjects();
});

// --- FOOTER ---
document.querySelector<HTMLDivElement>("#bottom")!.innerHTML = `
  <footer class="text-center py-4 border-t border-[var(--color-accent1)]/20">
    <p class="text-sm opacity-70">&copy; ${new Date().getFullYear()} Tristan. All rights reserved.</p>
  </footer>
`;
