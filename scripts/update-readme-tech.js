/**
 * Atualiza a seção de tech stack no README - Versão HTML Table (suporta GIFs)
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const README_FILE = path.join(__dirname, "../README.md")
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")

/**
 * Gera tabela HTML com todas as tecnologias (suporta GIFs)
 */
function generateTechTable(technologies) {
  // Definir quantas colunas por linha
  const itemsPerRow = 6
  const rows = []

  // Dividir tecnologias em grupos
  for (let i = 0; i < technologies.length; i += itemsPerRow) {
    const rowTechs = technologies.slice(i, i + itemsPerRow)

    // Preencher linha com espaços vazios se necessário
    while (rowTechs.length < itemsPerRow) {
      rowTechs.push({ name: "", url: "" })
    }

    rows.push(rowTechs)
  }

  // Gerar cabeçalho da tabela
  let tableHTML = `<table align="center">\n`

  // Gerar linhas
  rows.forEach((row) => {
    // Linha de ícones
    tableHTML += `  <tr>\n`
    row.forEach((tech) => {
      if (tech.name) {
        tableHTML += `    <td align="center" width="96">\n`
        tableHTML += `      <img src="${tech.url}" alt="${tech.name}" width="48" height="48" />\n`
        tableHTML += `    </td>\n`
      } else {
        tableHTML += `    <td align="center" width="96"></td>\n`
      }
    })
    tableHTML += `  </tr>\n`

    // Linha de nomes
    tableHTML += `  <tr>\n`
    row.forEach((tech) => {
      if (tech.name) {
        tableHTML += `    <td align="center"><strong>${tech.name}</strong></td>\n`
      } else {
        tableHTML += `    <td align="center"></td>\n`
      }
    })
    tableHTML += `  </tr>\n`

    // Espaçamento entre grupos
    if (rows.indexOf(row) < rows.length - 1) {
      tableHTML += `  <tr><td colspan="${itemsPerRow}" height="20"></td></tr>\n`
    }
  })

  tableHTML += `</table>`

  return tableHTML
}

function updateReadmeTechStack() {
  console.log("Atualizando README com tabela HTML da tech stack...")

  try {
    // Ler README atual
    let readme = fs.readFileSync(README_FILE, "utf8")

    // Verificar se arquivo de dados existe
    if (!fs.existsSync(TECH_DATA_FILE)) {
      console.error("Arquivo data/tech-stack.json não encontrado!")
      return
    }

    // Ler dados das tecnologias
    const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))
    const technologies = techData.technologies

    if (!technologies || technologies.length === 0) {
      console.error("Nenhuma tecnologia encontrada no JSON!")
      return
    }

    // Gerar tabela HTML
    const techTable = generateTechTable(technologies)

    // Gerar conteúdo completo
    const techStackContent = `<div align="center">
  ${techTable}
  
  <br>
  <sub><i>${technologies.length} tecnologias • Stack sempre em evolução • Atualizado via GitHub Actions</i></sub>
</div>`

    // Substituir APENAS entre os marcadores específicos
    const techStackRegex = /(<!-- INICIO_TECH_STACK -->)([\s\S]*?)(<!-- FIM_TECH_STACK -->)/

    if (techStackRegex.test(readme)) {
      readme = readme.replace(techStackRegex, `$1\n${techStackContent}\n$3`)
      console.log("Tech Stack atualizada com tabela HTML!")
      console.log(`Total de tecnologias: ${technologies.length}`)
    } else {
      console.error("Marcadores de Tech Stack não encontrados no README!")
      return
    }

    // Salvar README atualizado
    fs.writeFileSync(README_FILE, readme)
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
    throw error
  }
}

// Executar
updateReadmeTechStack()
