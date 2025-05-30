/**
 * Atualiza a seção de tech stack no README - Versão Markdown Puro
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
 * Atualiza o README com as tecnologias em formato Markdown
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

    // Gerar seções em Markdown puro
    const frontendSection = generateTechSection(techData.frontend, "Frontend & UI", "🎨")
    const backendSection = generateTechSection(techData.backend, "Backend & Languages", "⚙️")
    const databaseSection = generateTechSection(techData.database, "Database & Storage", "🗄️")
    const toolsSection = generateTechSection(techData.tools, "Tools & DevOps", "🛠️")

    // Gerar seção completa da tech stack
    const techStackMarkdown = `## 🚀 Tech Stack

${frontendSection}

${backendSection}

${databaseSection}

${toolsSection}
`

    // Substituir seção de tech stack
    const techStackRegex = /<details>\s*<summary><h2>(?:🚀\s*)?Tech Stack<\/h2><\/summary>[\s\S]*?<\/details>/

    if (techStackRegex.test(readme)) {
      readme = readme.replace(techStackRegex, techStackMarkdown)
    } else {
      console.log("Seção Tech Stack não encontrada, adicionando nova seção...")
      // Se não encontrar, adicionar após a seção "Sobre Mim"
      const aboutMeRegex = /(## Sobre Mim[\s\S]*?)(?=##|$)/
      readme = readme.replace(aboutMeRegex, `$1\n${techStackMarkdown}\n`)
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

/**
 * Gera seção de tecnologias em formato Markdown
 */
function generateTechSection(techs, title, emoji) {
  // Dividir em grupos de 5 para melhor visualização
  const rows = []
  for (let i = 0; i < techs.length; i += 5) {
    rows.push(techs.slice(i, i + 5))
  }

  // Gerar tabela em Markdown
  const techTable = rows
    .map((row) => {
      const icons = row.map((tech) => `<img src="${tech.url}" alt="${tech.name}" width="40" height="40" />`).join(" ")
      const names = row.map((tech) => `<b>${tech.name}</b>`).join(" | ")
      return `| ${icons} |\n| ${names} |`
    })
    .join("\n")

  return `### ${emoji} ${title}\n\n${techTable}`
}

// Executar
updateReadmeTechStack()
