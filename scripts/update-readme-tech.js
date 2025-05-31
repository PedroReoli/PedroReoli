/**
 * Atualiza a seção de tech stack no README - Versão com Limpeza de Duplicatas
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
 * Remove todas as duplicações de tech stack do README
 */
function cleanupDuplicatedTechSections(readme) {
  console.log("Limpando duplicações antigas...")

  // Remover todas as seções duplicadas de Frontend & UI
  readme = readme.replace(/### Frontend & UI\s*\n[\s\S]*?(?=###|##|$)/g, "")

  // Remover todas as seções duplicadas de Backend & Languages
  readme = readme.replace(/### Backend & Languages\s*\n[\s\S]*?(?=###|##|$)/g, "")

  // Remover todas as seções duplicadas de Database & Storage
  readme = readme.replace(/### Database & Storage\s*\n[\s\S]*?(?=###|##|$)/g, "")

  // Remover todas as seções duplicadas de Tools & DevOps
  readme = readme.replace(/### Tools & DevOps\s*\n[\s\S]*?(?=###|##|$)/g, "")

  // Remover divs de "Stack sempre em evolução" duplicadas
  readme = readme.replace(/<div align="center">\s*<sub><i>Stack sempre em evolução.*?<\/div>\s*/g, "")

  // Remover seção Tech Stack completa se existir
  readme = readme.replace(/## Tech Stack\s*\n[\s\S]*?(?=\n##|$)/g, "")

  // Limpar quebras de linha excessivas
  readme = readme.replace(/\n{3,}/g, "\n\n")

  return readme
}

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
  console.log("Atualizando tech stack com limpeza de duplicatas...")

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

    // PRIMEIRO: Limpar todas as duplicações existentes
    readme = cleanupDuplicatedTechSections(readme)

    // Gerar seções em formato simplificado
    const frontendSection = generateSimpleTechSection(techData.frontend, "Frontend & UI")
    const backendSection = generateSimpleTechSection(techData.backend, "Backend & Languages")
    const databaseSection = generateSimpleTechSection(techData.database, "Database & Storage")
    const toolsSection = generateSimpleTechSection(techData.tools, "Tools & DevOps")

    // Gerar seção completa da tech stack simplificada
    const techStackMarkdown = `## Tech Stack

${frontendSection}${backendSection}${databaseSection}${toolsSection}<div align="center">
  <sub><i>Stack sempre em evolução • Atualizado via GitHub Actions</i></sub>
</div>

`

    // Encontrar onde inserir a nova seção (após "Sobre Mim")
    const aboutMeRegex = /(## Sobre Mim[\s\S]*?)(\n##)/

    if (aboutMeRegex.test(readme)) {
      readme = readme.replace(aboutMeRegex, `$1\n\n${techStackMarkdown}$2`)
    } else {
      // Se não encontrar "Sobre Mim", adicionar antes de "GitHub Overview"
      const githubRegex = /(## GitHub Overview)/
      if (githubRegex.test(readme)) {
        readme = readme.replace(githubRegex, `${techStackMarkdown}$1`)
      } else {
        // Como último recurso, adicionar no final
        readme += `\n\n${techStackMarkdown}`
      }
    }

    // Salvar README atualizado
    fs.writeFileSync(README_FILE, readme)
    console.log("Tech stack atualizada e duplicatas removidas!")

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
