import "./style.css";

document.querySelector<HTMLDivElement>("#bottom")!.innerHTML = `
    <footer class="footer">
      <p>&copy; ${new Date().getFullYear()} Tristan. All rights reserved.</p>
    </footer>
`;
