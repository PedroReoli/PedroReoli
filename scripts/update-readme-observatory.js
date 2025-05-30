/**
 * Atualiza README com dados do observatório - Versão Simplificada
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function updateReadmeObservatory() {
  try {
    const observatoryFile = path.join(__dirname, "../assets/observatory-report.json")
    const readmeFile = path.join(__dirname, "../README.md")

    if (!fs.existsSync(observatoryFile)) {
      console.log("Arquivo de relatório do observatório não encontrado!")
      return
    }

    const observatoryData = JSON.parse(fs.readFileSync(observatoryFile, "utf8"))
    const readme = fs.readFileSync(readmeFile, "utf8")

    // Formatar insights em primeira pessoa
    const insights = observatoryData.insights.map((insight) => `> ${insight}`).join("\n\n")

    // Gerar seção do observatório simplificada
    const observatoryMarkdown = `## Observatorio Dev

<div align="center">
  <h4>Insights automáticos sobre meus padrões de desenvolvimento</h4>
</div>

### Dev Cronotipo

| Atributo | Valor |
|:---------|:------|
| **Tipo** | Dev ${observatoryData.cronotipo.type} |
| **Horário de Pico** | ${observatoryData.cronotipo.peakStart}h - ${observatoryData.cronotipo.peakEnd}h (Brasília) |
| **Total de Commits** | ${observatoryData.cronotipo.totalCommits} |

### Insights Semanais

${insights}

<div align="center">
  <sub><i>Atualizado via GitHub Actions</i></sub>
</div>
`

    const newReadme = readme.replace(/## 🔭 Observatório Dev[\s\S]*?(?=##|$)/, observatoryMarkdown)

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com observatório simplificado!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeObservatory()
