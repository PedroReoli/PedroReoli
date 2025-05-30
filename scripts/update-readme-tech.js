/**
 * Atualiza a seção de tech stack no README - Versão Ultra Moderna
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
 * Gera seção de tecnologias em formato ultra moderno
 */
function generateModernTechSection(techs, title, emoji) {
  // Dividir em grupos de 8 para ocupar mais espaço
  const rows = []
  for (let i = 0; i < techs.length; i += 8) {
    rows.push(techs.slice(i, i + 8))
  }

  let sectionMarkdown = `### ${emoji} ${title}\n\n`

  rows.forEach((row, rowIndex) => {
    // Criar tabela moderna com mais espaço
    const iconCells = row.map(() => "").join(" | ")
    const separatorCells = row.map(() => ":---:").join(" | ")
    const nameCells = row.map(() => "").join(" | ")

    // Linha de ícones grandes
    const iconRow = row.map((tech) => `<img src="${tech.url}" alt="${tech.name}" width="60" height="60" />`).join(" | ")

    // Linha de nomes com formatação moderna
    const nameRow = row.map((tech) => `<sub><b>${tech.name}</b></sub>`).join(" | ")

    sectionMarkdown += `<table align="center">\n`
    sectionMarkdown += `<tr>\n`
    sectionMarkdown += `${row.map(() => `<td align="center" width="120"></td>`).join("")}\n`
    sectionMarkdown += `</tr>\n`
    sectionMarkdown += `<tr>\n`
    sectionMarkdown += `${row.map((tech) => `<td align="center"><img src="${tech.url}" alt="${tech.name}" width="60" height="60" /></td>`).join("")}\n`
    sectionMarkdown += `</tr>\n`
    sectionMarkdown += `<tr>\n`
    sectionMarkdown += `${row.map((tech) => `<td align="center"><sub><b>${tech.name}</b></sub></td>`).join("")}\n`
    sectionMarkdown += `</tr>\n`
    sectionMarkdown += `</table>\n\n`
  })

  return sectionMarkdown
}

/**
 * Gera seção de tecnologias em grid moderno alternativo
 */
function generateGridTechSection(techs, title, emoji) {
  let sectionMarkdown = `### ${emoji} ${title}\n\n`

  // Criar grid usando HTML table com espaçamento moderno
  sectionMarkdown += `<table>\n<tr>\n`

  techs.forEach((tech, index) => {
    if (index > 0 && index % 6 === 0) {
      sectionMarkdown += `</tr>\n<tr>\n`
    }

    sectionMarkdown += `<td align="center" width="150">\n`
    sectionMarkdown += `  <img src="${tech.url}" alt="${tech.name}" width="65" height="65" /><br>\n`
    sectionMarkdown += `  <sub><b>${tech.name}</b></sub>\n`
    sectionMarkdown += `</td>\n`
  })

  // Preencher células vazias se necessário
  const remaining = 6 - (techs.length % 6)
  if (remaining !== 6) {
    for (let i = 0; i < remaining; i++) {
      sectionMarkdown += `<td></td>\n`
    }
  }

  sectionMarkdown += `</tr>\n</table>\n\n`

  return sectionMarkdown
}

/**
 * Gera seção de tecnologias em formato card moderno
 */
function generateCardTechSection(techs, title, emoji) {
  let sectionMarkdown = `### ${emoji} ${title}\n\n`

  // Criar cards usando divs e tabelas
  sectionMarkdown += `<div align="center">\n\n`

  // Dividir em grupos de 4 para layout mais espaçoso
  const rows = []
  for (let i = 0; i < techs.length; i += 4) {
    rows.push(techs.slice(i, i + 4))
  }

  rows.forEach((row) => {
    sectionMarkdown += `<table>\n<tr>\n`

    row.forEach((tech) => {
      sectionMarkdown += `<td align="center" width="200" style="padding: 20px;">\n`
      sectionMarkdown += `  <img src="${tech.url}" alt="${tech.name}" width="70" height="70" style="border-radius: 10px;" /><br><br>\n`
      sectionMarkdown += `  <strong>${tech.name}</strong>\n`
      sectionMarkdown += `</td>\n`
    })

    // Preencher células vazias
    const remaining = 4 - row.length
    for (let i = 0; i < remaining; i++) {
      sectionMarkdown += `<td width="200"></td>\n`
    }

    sectionMarkdown += `</tr>\n</table>\n\n`
  })

  sectionMarkdown += `</div>\n\n`

  return sectionMarkdown
}

/**
 * Gera seção de tecnologias em formato showcase ultra moderno
 */
function generateShowcaseTechSection(techs, title, emoji) {
  let sectionMarkdown = `### ${emoji} ${title}\n\n`

  sectionMarkdown += `<div align="center">\n\n`

  // Criar showcase com espaçamento generoso
  const itemsPerRow = 5
  const rows = []
  for (let i = 0; i < techs.length; i += itemsPerRow) {
    rows.push(techs.slice(i, i + itemsPerRow))
  }

  rows.forEach((row, rowIndex) => {
    sectionMarkdown += `<table border="0" cellpadding="15" cellspacing="0">\n<tr>\n`

    row.forEach((tech) => {
      sectionMarkdown += `<td align="center" valign="top" width="180">\n`
      sectionMarkdown += `  <img src="${tech.url}" alt="${tech.name}" width="80" height="80" />\n`
      sectionMarkdown += `  <br><br>\n`
      sectionMarkdown += `  <strong>${tech.name}</strong>\n`
      sectionMarkdown += `</td>\n`
    })

    // Preencher células vazias para manter alinhamento
    const remaining = itemsPerRow - row.length
    for (let i = 0; i < remaining; i++) {
      sectionMarkdown += `<td width="180"></td>\n`
    }

    sectionMarkdown += `</tr>\n</table>\n\n`

    // Adicionar espaçamento entre linhas
    if (rowIndex < rows.length - 1) {
      sectionMarkdown += `<br>\n\n`
    }
  })

  sectionMarkdown += `</div>\n\n`

  return sectionMarkdown
}

/**
 * Atualiza o README com as tecnologias em formato ultra moderno
 */
function updateReadmeTechStack() {
  console.log("Atualizando tech stack com design ultra moderno...")

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

    // Gerar seções em formato showcase ultra moderno
    const frontendSection = generateShowcaseTechSection(techData.frontend, "Frontend & UI", "🎨")
    const backendSection = generateShowcaseTechSection(techData.backend, "Backend & Languages", "⚙️")
    const databaseSection = generateShowcaseTechSection(techData.database, "Database & Storage", "🗄️")
    const toolsSection = generateShowcaseTechSection(techData.tools, "Tools & DevOps", "🛠️")

    // Gerar seção completa da tech stack ultra moderna
    const techStackMarkdown = `## Tech Stack

<div align="center">
  <h3>🚀 Tecnologias que domino e uso no dia a dia</h3>
  <br>
</div>

${frontendSection}

${backendSection}

${databaseSection}

${toolsSection}

<div align="center">
  <br>
  <sub><i>Stack sempre em evolução • Atualizado via GitHub Actions</i></sub>
</div>
`

    // Substituir seção de tech stack
    const techStackRegex = /## Tech Stack[\s\S]*?(?=##|$)/

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
    console.log("Tech stack atualizada com design ultra moderno!")

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
