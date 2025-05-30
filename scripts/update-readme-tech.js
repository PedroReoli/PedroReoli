/**
 * Atualiza a seção de tech stack no README
 */

const fs = require("fs")
const path = require("path")

// Configuração
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")
const README_FILE = path.join(__dirname, "../README.md")

/**
 * Gera HTML para uma categoria de tecnologias
 */
function generateTechSection(techs, title) {
  const techItems = techs
    .map((tech) => {
      return `      <div class="tech-item">
        <img src="${tech.url}" alt="${tech.name}" width="60" height="60" />
        <span>${tech.name}</span>
      </div>`
    })
    .join("\n")

  return `    <div class="tech-category">
      <h3>${title}</h3>
      <div class="tech-grid">
${techItems}
      </div>
    </div>`
}

/**
 * Atualiza o README com as tecnologias
 */
function updateReadmeTechStack() {
  console.log("Atualizando tech stack no README...")

  try {
    // Ler dados das tecnologias
    const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))

    // Ler README atual
    const readme = fs.readFileSync(README_FILE, "utf8")

    // Gerar seções
    const frontendSection = generateTechSection(techData.frontend, "Frontend & UI")
    const backendSection = generateTechSection(techData.backend, "Backend & Languages")
    const databaseSection = generateTechSection(techData.database, "Database & Storage")
    const toolsSection = generateTechSection(techData.tools, "Tools & DevOps")

    // Gerar HTML completo da tech stack
    const techStackHtml = `<details>
  <summary><h2>Tech Stack</h2></summary>
  <div class="tech-container">
    <style>
      .tech-container {
        display: flex;
        flex-direction: column;
        gap: 30px;
        padding: 20px;
      }
      .tech-category {
        background: linear-gradient(145deg, #1a1a2e, #16213e);
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      .tech-category h3 {
        color: #64ffda;
        margin-bottom: 20px;
        font-size: 1.4em;
        text-align: center;
      }
      .tech-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 20px;
        justify-items: center;
      }
      .tech-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        min-width: 100px;
      }
      .tech-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(100, 255, 218, 0.2);
      }
      .tech-item img {
        border-radius: 8px;
        object-fit: contain;
      }
      .tech-item span {
        color: #e6f1ff;
        font-size: 0.9em;
        font-weight: 500;
        text-align: center;
      }
      @media (max-width: 768px) {
        .tech-grid {
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 15px;
        }
        .tech-item {
          padding: 10px;
        }
        .tech-item img {
          width: 50px !important;
          height: 50px !important;
        }
      }
    </style>

${frontendSection}

${backendSection}

${databaseSection}

${toolsSection}

    <div align="center" style="margin-top: 30px;">
      <img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="200" alt="Coding Animation" />
    </div>
  </div>
</details>`

    // Substituir seção de tech stack
    const newReadme = readme.replace(/<details[^>]*>\s*<summary><h2>Tech Stack.*?<\/details>/s, techStackHtml)

    // Salvar README atualizado
    fs.writeFileSync(README_FILE, newReadme)
    console.log("Tech stack atualizada com sucesso!")
  } catch (error) {
    console.error("Erro ao atualizar tech stack:", error)
    throw error
  }
}

// Executar
updateReadmeTechStack()
