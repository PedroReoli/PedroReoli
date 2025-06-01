/**
 * Atualiza a seção de tech stack no README - Versão Devicons Limpa
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const README_FILE = path.join(__dirname, "../README.md")
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")

function updateReadmeTechStack() {
  console.log("Atualizando README com ícones devicons...")

  try {
    // Ler README atual
    let readme = fs.readFileSync(README_FILE, "utf8")

    // Ler dados das tecnologias
    let technologies = []
    let totalTechs = 0

    if (fs.existsSync(TECH_DATA_FILE)) {
      const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))
      technologies = techData.technologies || []
      totalTechs = technologies.length
    }

    // Calcular grid (6 colunas por linha)
    const itemsPerRow = 6
    const rows = Math.ceil(technologies.length / itemsPerRow)

    // Gerar linhas da tabela
    const tableRows = []
    for (let i = 0; i < rows; i++) {
      const startIndex = i * itemsPerRow
      const rowTechs = technologies.slice(startIndex, startIndex + itemsPerRow)

      // Células com ícones
      const iconCells = rowTechs
        .map(
          (tech) =>
            `<td align="center" width="96"><img src="${tech.url}" width="48" height="48" alt="${tech.name}" /></td>`,
        )
        .join("")

      // Células com nomes
      const nameCells = rowTechs
        .map((tech) => `<td align="center" width="96"><sub><b>${tech.name}</b></sub></td>`)
        .join("")

      // Preencher células vazias se necessário
      const emptyCells = itemsPerRow - rowTechs.length
      const emptyIconFill = emptyCells > 0 ? "<td></td>".repeat(emptyCells) : ""
      const emptyNameFill = emptyCells > 0 ? "<td></td>".repeat(emptyCells) : ""

      tableRows.push(`  <tr>${iconCells}${emptyIconFill}</tr>`)
      tableRows.push(`  <tr>${nameCells}${emptyNameFill}</tr>`)
    }

    // Gerar conteúdo da tech stack
    const techStackContent = `<div align="center">
  <h3>🛠️ Tech Stack</h3>
  
  <table>
${tableRows.join("\n")}
  </table>
  
  <sub><i>${totalTechs} tecnologias • Sempre evoluindo</i></sub>
</div>`

    // Substituir conteúdo entre os marcadores
    const techStackRegex = /(<!-- INICIO_TECH_STACK -->)([\s\S]*?)(<!-- FIM_TECH_STACK -->)/

    if (techStackRegex.test(readme)) {
      readme = readme.replace(techStackRegex, `$1\n${techStackContent}\n$3`)
      console.log("✅ Tech Stack atualizada com ícones devicons!")
    } else {
      console.error("❌ Marcadores de Tech Stack não encontrados no README!")
      return
    }

    // Salvar README atualizado
    fs.writeFileSync(README_FILE, readme)

    console.log(`📊 Total de tecnologias: ${totalTechs}`)
    console.log(`📐 Layout: ${rows} linhas x ${itemsPerRow} colunas`)
    console.log("🎨 Usando ícones limpos do devicons")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
    throw error
  }
}

// Executar
updateReadmeTechStack()
