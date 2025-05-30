/**
 * Atualiza a seção de tech stack no README - Versão Tabela Corrigida
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
 * Gera seção de tecnologias em formato de tabela correta
 */
function generateTechSection(techs, title, emoji) {
  // Dividir em grupos de 6 para melhor alinhamento
  const rows = []
  for (let i = 0; i < techs.length; i += 6) {
    rows.push(techs.slice(i, i + 6))
  }

  // Gerar tabela em Markdown com alinhamento correto
  let tableMarkdown = `### ${emoji} ${title}\n\n`

  rows.forEach((row) => {
    // Linha de ícones
    const iconRow = row.map((tech) => `<img src="${tech.url}" alt="${tech.name}" width="40" height="40" />`).join(" | ")

    // Linha de nomes
    const nameRow = row.map((tech) => `**${tech.name}**`).join(" | ")

    // Linha de separação
    const separatorRow = row.map(() => ":---:").join(" | ")

    tableMarkdown += `| ${iconRow} |\n`
    tableMarkdown += `| ${separatorRow} |\n`
    tableMarkdown += `| ${nameRow} |\n\n`
  })

  return tableMarkdown
}

/**
 * Atualiza o README com as tecnologias em formato de tabela
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

    // Gerar seções em tabelas corretas
    const frontendSection = generateTechSection(techData.frontend, "Frontend & UI", "🎨")
    const backendSection = generateTechSection(techData.backend, "Backend & Languages", "⚙️")
    const databaseSection = generateTechSection(techData.database, "Database & Storage", "🗄️")
    const toolsSection = generateTechSection(techData.tools, "Tools & DevOps", "🛠️")

    // Gerar seção completa da tech stack
    const techStackMarkdown = `## Tech Stack

${frontendSection}

${backendSection}

${databaseSection}

${toolsSection}
`

    // Substituir seção de tech stack
    const techStackRegex = /## 🚀 Tech Stack[\s\S]*?(?=##|$)/

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
    console.log("Tech stack atualizada com tabelas corretas!")

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
