/**
 * Atualiza README com dados do observatório - Versão Markdown Puro
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

    // Formatar badges
    const badges = observatoryData.gamification.badges.map((badge) => `\`${badge}\``).join(" ")

    // Formatar insights
    const insights = observatoryData.insights.map((insight) => `> ${insight}`).join("\n\n")

    // Formatar metas
    const goals = observatoryData.weeklyGoals
      .slice(0, 3)
      .map((goal) => {
        const percentage = Math.round((goal.progress / goal.target) * 100)
        const progressBar = "█".repeat(Math.floor(percentage / 10)) + "░".repeat(10 - Math.floor(percentage / 10))
        return `| ${goal.name} | ${progressBar} ${percentage}% |`
      })
      .join("\n")

    // Gerar seção do observatório usando apenas Markdown e HTML simples
    const observatoryMarkdown = `## 🔭 Observatório Dev

<div align="center">
  <h4>Insights automáticos sobre padrões de desenvolvimento</h4>
</div>

### 🎮 Status do Desenvolvedor

| Atributo | Valor |
|:---------|:------|
| **Level** | ${observatoryData.gamification.level} |
| **XP Total** | ${observatoryData.gamification.totalXP.toLocaleString()} |
| **Título** | ${observatoryData.gamification.title} |

**Badges:** ${badges}

### 🧭 Dev Cronotipo

| Atributo | Valor |
|:---------|:------|
| **Tipo** | Dev ${observatoryData.cronotipo.type} |
| **Horário de Pico** | ${observatoryData.cronotipo.peakStart}h - ${observatoryData.cronotipo.peakEnd}h |
| **Total de Commits** | ${observatoryData.cronotipo.totalCommits} |

### 💡 Insights Semanais

${insights}

### 🎯 Metas da Semana

| Meta | Progresso |
|:-----|:----------|
${goals}

<div align="center">
  <sub><i>Relatório atualizado em: ${new Date(observatoryData.lastUpdated).toLocaleString("pt-BR")}</i></sub>
</div>
`

    const newReadme = readme.replace(
      /<details>\s*<summary><h2>🔭 Observatório Dev<\/h2><\/summary>[\s\S]*?<\/details>/,
      observatoryMarkdown,
    )

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com observatório em Markdown puro!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeObservatory()
