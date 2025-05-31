/**
 * Atualiza a seção de tech stack no README - Versão Tabela Única
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

  // Remover todas as seções duplicadas de categorias antigas
  readme = readme.replace(/### Frontend & UI\s*\n[\s\S]*?(?=###|##|$)/g, "")
  readme = readme.replace(/### Backend & Languages\s*\n[\s\S]*?(?=###|##|$)/g, "")
  readme = readme.replace(/### Database & Storage\s*\n[\s\S]*?(?=###|##|$)/g, "")
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
 * Gera tabela única com todas as tecnologias
 */
function generateUnifiedTechTable(technologies) {
  // Definir quantas colunas por linha (6 tecnologias por linha)
  const itemsPerRow = 6
  const rows = []

  // Dividir tecnologias em grupos de 6
  for (let i = 0; i < technologies.length; i += itemsPerRow) {
    const rowTechs = technologies.slice(i, i + itemsPerRow)

    // Preencher linha com espaços vazios se necessário
    while (rowTechs.length < itemsPerRow) {
      rowTechs.push({ name: "", url: "" })
    }

    rows.push(rowTechs)
  }

  // Gerar cabeçalho da tabela
  let tableMarkdown = `| ${Array(itemsPerRow).fill("").join(" | ")} |\n`
  tableMarkdown += `| ${Array(itemsPerRow).fill(":---:").join(" | ")} |\n`

  // Gerar linhas de ícones
  rows.forEach((row) => {
    const iconRow = row
      .map((tech) => (tech.name ? `<img src="${tech.url}" alt="${tech.name}" width="40" height="40" />` : ""))
      .join(" | ")
    tableMarkdown += `| ${iconRow} |\n`

    // Gerar linha de nomes
    const nameRow = row.map((tech) => (tech.name ? `**${tech.name}**` : "")).join(" | ")
    tableMarkdown += `| ${nameRow} |\n`
  })

  return tableMarkdown
}

/**
 * Atualiza o README com as tecnologias em tabela única
 */
function updateReadmeTechStack() {
  console.log("Atualizando tech stack com tabela única...")

  try {
    // Verificar se arquivo de dados existe
    if (!fs.existsSync(TECH_DATA_FILE)) {
      console.error("Arquivo data/tech-stack.json não encontrado!")
      return
    }

    // Ler dados das tecnologias
    const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))

    // Atualizar timestamp
    techData.lastUpdated = new Date().toISOString()
    fs.writeFileSync(TECH_DATA_FILE, JSON.stringify(techData, null, 2))

    // Ler README atual
    let readme = fs.readFileSync(README_FILE, "utf8")

    // PRIMEIRO: Limpar todas as duplicações existentes
    readme = cleanupDuplicatedTechSections(readme)

    // Gerar tabela única
    const techTable = generateUnifiedTechTable(techData.technologies)

    // Gerar seção completa da tech stack
    const techStackMarkdown = `## Tech Stack

${techTable}
<div align="center">
  <sub><i>Stack sempre em evolução • ${techData.technologies.length} tecnologias • Atualizado via GitHub Actions</i></sub>
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
    console.log("Tech stack atualizada com tabela única!")

    // Log das tecnologias carregadas
    console.log(`Total de tecnologias: ${techData.technologies.length}`)
    console.log("Tecnologias incluídas:")
    techData.technologies.forEach((tech, index) => {
      console.log(`${index + 1}. ${tech.name}`)
    })
  } catch (error) {
    console.error("Erro ao atualizar tech stack:", error)
    throw error
  }
}

// Executar
updateReadmeTechStack()
