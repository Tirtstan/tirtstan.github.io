import "./style.css";

// Theme toggle functionality
function initThemeToggle() {
    const toggleButton = document.createElement("button");
    toggleButton.className = "theme-toggle";
    toggleButton.innerHTML = "🌓";
    toggleButton.setAttribute("aria-label", "Toggle theme");

    // Check for saved theme or default to system preference
    const storedTheme =
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    if (storedTheme) {
        document.documentElement.setAttribute("data-theme", storedTheme);
    }

    toggleButton.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        let targetTheme = "light";

        if (currentTheme === "light") {
            targetTheme = "dark";
        }

        document.documentElement.setAttribute("data-theme", targetTheme);
        localStorage.setItem("theme", targetTheme);
    });

    document.body.appendChild(toggleButton);
}

document.querySelector<HTMLDivElement>("#bottom")!.innerHTML = `
    <footer class="footer">
      <p>&copy; ${new Date().getFullYear()} Tristan. All rights reserved.</p>
    </footer>
`;

// Initialize theme toggle when DOM is loaded
initThemeToggle();
