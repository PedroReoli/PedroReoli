/**
 * Atualiza a seção de tech stack no README - Versão Simplificada
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
 * Gera seção de tecnologias em formato simplificado
 */
function generateSimpleTechSection(techs, title) {
  let sectionMarkdown = `### ${title}\n\n`

  // Criar tabela simples
  sectionMarkdown += `| ${techs.map(() => "").join(" | ")} |\n`
  sectionMarkdown += `| ${techs.map(() => ":---:").join(" | ")} |\n`

  // Linha de ícones
  sectionMarkdown += `| ${techs.map((tech) => `<img src="${tech.url}" alt="${tech.name}" width="40" height="40" />`).join(" | ")} |\n`

  // Linha de nomes
  sectionMarkdown += `| ${techs.map((tech) => `**${tech.name}**`).join(" | ")} |\n\n`

  return sectionMarkdown
}

/**
 * Atualiza o README com as tecnologias em formato simplificado
 */
function updateReadmeTechStack() {
  console.log("Atualizando tech stack com design simplificado...")

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

    // Gerar seções em formato simplificado
    const frontendSection = generateSimpleTechSection(techData.frontend, "Frontend & UI")
    const backendSection = generateSimpleTechSection(techData.backend, "Backend & Languages")
    const databaseSection = generateSimpleTechSection(techData.database, "Database & Storage")
    const toolsSection = generateSimpleTechSection(techData.tools, "Tools & DevOps")

    // Gerar seção completa da tech stack simplificada
    const techStackMarkdown = `## Tech Stack\n\n${frontendSection}${backendSection}${databaseSection}${toolsSection}<div align="center">\n  <sub><i>Stack sempre em evolução • Atualizado via GitHub Actions</i></sub>\n</div>\n\n`

    // Substituir seção de tech stack - usando uma regex mais precisa para evitar duplicação
    const techStackRegex = /## Tech Stack\s*\n[\s\S]*?(?=\n##|$)/

    if (techStackRegex.test(readme)) {
      readme = readme.replace(techStackRegex, techStackMarkdown)
    } else {
      console.log("Seção Tech Stack não encontrada, adicionando nova seção...")
      // Se não encontrar, adicionar após a seção "Sobre Mim"
      const aboutMeRegex = /(## Sobre Mim[\s\S]*?)(?=\n##|$)/
      readme = readme.replace(aboutMeRegex, `$1\n\n${techStackMarkdown}`)
    }

    // Salvar README atualizado
    fs.writeFileSync(README_FILE, readme)
    console.log("Tech stack atualizada com design simplificado!")

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
