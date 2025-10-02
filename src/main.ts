import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <header class="section">
      <h1 class="calm-header">Your Name</h1>
      <p class="subtitle">Web Developer | Designer | Creator</p>
    </header>

    <section id="about" class="section">
      <h2 class="calm-header">About Me</h2>
      <p>
        Welcome to my personal space on the web. I specialize in creating beautiful, functional, and calm digital experiences. I am passionate about clean code, user-centric design, and continuous learning.
      </p>
    </section>

    <section id="projects" class="section">
      <h2 class="calm-header">Projects</h2>
      <div class="project-grid">
        <div class="card">
          <h3>Project One</h3>
          <p>A brief description of the project, its purpose, and the technologies used.</p>
          <a href="#" class="btn">View Project</a>
        </div>
        <div class="card">
          <h3>Project Two</h3>
          <p>A brief description of the project, its purpose, and the technologies used.</p>
          <a href="#" class="btn">View Project</a>
        </div>
        <div class="card">
          <h3>Project Three</h3>
          <p>A brief description of the project, its purpose, and the technologies used.</p>
          <a href="#" class="btn">View Project</a>
        </div>
      </div>
    </section>

    <section id="contact" class="section">
      <h2 class="calm-header">Get in Touch</h2>
      <p>Feel free to reach out via email or connect with me on social media.</p>
      <a href="mailto:your-email@example.com" class="btn">Email Me</a>
    </section>

    <footer class="footer">
      <p>&copy; ${new Date().getFullYear()} Tristan. All rights reserved.</p>
    </footer>
  </div>
`