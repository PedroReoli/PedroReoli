/**
 * Atualiza a seção de tech stack no README com layout em grid
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")
const README_FILE = path.join(__dirname, "../README.md")

/**
 * Gera seção de tecnologias em grid responsivo
 */
function generateTechSection(techs, title, emoji) {
  const techItems = techs
    .map((tech) => {
      return `
    <div class="tech-item">
      <img src="${tech.url}" alt="${tech.name}" width="40" height="40" />
      <span>${tech.name}</span>
    </div>`
    })
    .join("")

  return `
### ${emoji} ${title}

<div class="tech-grid">
${techItems}
</div>
`
}

/**
 * Atualiza o README com as tecnologias
 */
function updateReadmeTechStack() {
  console.log("Atualizando tech stack no README...")

  try {
    // Verificar se arquivo de dados existe
    if (!fs.existsSync(TECH_DATA_FILE)) {
      console.error("Arquivo data/tech-stack.json não encontrado!")
      return
    }

    // Ler dados das tecnologias
    const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))

    // Ler README atual
    let readme = fs.readFileSync(README_FILE, "utf8")

    // Gerar seções em grid
    const frontendSection = generateTechSection(techData.frontend, "Frontend & UI", "🎨")
    const backendSection = generateTechSection(techData.backend, "Backend & Languages", "⚙️")
    const databaseSection = generateTechSection(techData.database, "Database & Storage", "🗄️")
    const toolsSection = generateTechSection(techData.tools, "Tools & DevOps", "🛠️")

    // Gerar seção completa da tech stack com CSS
    const techStackMarkdown = `<details>
  <summary><h2>🚀 Tech Stack</h2></summary>

<style>
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin: 20px 0;
  padding: 0;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 8px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.tech-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #6E56CF;
}

.tech-item img {
  margin-bottom: 8px;
  border-radius: 4px;
}

.tech-item span {
  font-size: 14px;
  font-weight: 500;
  color: #2d3748;
  line-height: 1.2;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .tech-item {
    background: #2d3748;
    border-color: #4a5568;
  }
  
  .tech-item span {
    color: #f7fafc;
  }
  
  .tech-item:hover {
    background: #4a5568;
    border-color: #6E56CF;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 12px;
  }
  
  .tech-item {
    padding: 12px 6px;
  }
  
  .tech-item img {
    width: 32px;
    height: 32px;
  }
  
  .tech-item span {
    font-size: 12px;
  }
}
</style>

${frontendSection}

${backendSection}

${databaseSection}

${toolsSection}

</details>`

    // Substituir seção de tech stack
    const techStackRegex = /<details>\s*<summary><h2>(?:🚀\s*)?Tech Stack<\/h2><\/summary>[\s\S]*?<\/details>/

    if (techStackRegex.test(readme)) {
      readme = readme.replace(techStackRegex, techStackMarkdown)
    } else {
      console.log("Seção Tech Stack não encontrada, adicionando nova seção...")
      // Se não encontrar, adicionar após a seção "Sobre Mim"
      const aboutMeRegex = /(<\/details>\s*\n?)(?=\n*<!--)/
      readme = readme.replace(aboutMeRegex, `$1\n${techStackMarkdown}\n\n`)
    }

    // Salvar README atualizado
    fs.writeFileSync(README_FILE, readme)
    console.log("Tech stack atualizada com sucesso!")

    // Log das tecnologias carregadas
    console.log(`Frontend: ${techData.frontend.length} tecnologias`)
    console.log(`Backend: ${techData.backend.length} tecnologias`)
    console.log(`Database: ${techData.database.length} tecnologias`)
    console.log(`Tools: ${techData.tools.length} tecnologias`)
  } catch (error) {
    console.error("Erro ao atualizar tech stack:", error)
    throw error
  }
}

// Executar
updateReadmeTechStack()
