/**
 * Atualiza README com dados de skill evolution - Versão Markdown Puro
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function updateReadmeSkills() {
  try {
    const skillFile = path.join(__dirname, "../assets/skill-evolution.json")
    const readmeFile = path.join(__dirname, "../README.md")

    if (!fs.existsSync(skillFile)) {
      console.log("Arquivo de skill evolution não encontrado!")
      return
    }

    const skillData = JSON.parse(fs.readFileSync(skillFile, "utf8"))
    const readme = fs.readFileSync(readmeFile, "utf8")

    const currentWeek = Math.max(...Object.keys(skillData.weeklyData).map(Number))
    const currentLanguages = skillData.weeklyData[currentWeek].languages

    const topLanguages = Object.entries(currentLanguages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([language, count]) => ({
        name: language,
        count,
        trend: skillData.trends.languages[language]?.trend || "stable",
        change: skillData.trends.languages[language]?.change || 0,
      }))

    // Gerar tabela de linguagens em Markdown puro
    const languageRows = topLanguages
      .map((lang) => {
        const trendIcon = lang.trend === "up" ? "⬆️" : lang.trend === "down" ? "⬇️" : "↔️"
        const trendText = lang.trend === "up" ? `+${lang.change}` : lang.trend === "down" ? `-${lang.change}` : "0"
        return `| **${lang.name}** | ${lang.count} | ${trendIcon} ${trendText} |`
      })
      .join("\n")

    // Gerar seção de skills usando apenas Markdown e HTML simples
    const skillEvolutionMarkdown = `## 🧠 Evolução das Skills

<div align="center">
  <h4>Análise dos últimos ${skillData.period.days} dias de commits</h4>
  
  | Linguagem | Commits | Tendência |
  |:----------|:-------:|:----------|
  ${languageRows}
  
  <br>
  
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/skill-evolution-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/skill-evolution-light.svg">
    <img src="./assets/skill-evolution-dark.svg" alt="Skill Evolution" width="800">
  </picture>
  
  <br>
  <sub><i>Atualizado em: ${new Date(skillData.lastUpdated).toLocaleString("pt-BR")}</i></sub>
</div>
`

    const newReadme = readme.replace(
      /<details>\s*<summary><h2>Evolução das Skills<\/h2><\/summary>[\s\S]*?<\/details>/,
      skillEvolutionMarkdown,
    )

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com skill evolution em Markdown puro!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeSkills()
