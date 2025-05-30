/**
 * Atualiza README com dados de skill evolution
 */

const fs = require("fs")
const path = require("path")

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

    const skillEvolutionHtml = `<details>
  <summary><h2>Evolução das Skills</h2></summary>
  <div align="center">
    <p>Análise dos últimos ${skillData.period.days} dias de commits</p>
    
    <table>
      <thead>
        <tr>
          <th>Linguagem</th>
          <th>Commits</th>
          <th>Tendência</th>
        </tr>
      </thead>
      <tbody>
        ${topLanguages
          .map((lang) => {
            const trendIcon = lang.trend === "up" ? "⬆️" : lang.trend === "down" ? "⬇️" : "↔️"
            const trendText = lang.trend === "up" ? `+${lang.change}` : lang.trend === "down" ? `-${lang.change}` : "0"

            return `<tr>
            <td><strong>${lang.name}</strong></td>
            <td align="center">${lang.count}</td>
            <td align="center">${trendIcon} ${trendText}</td>
          </tr>`
          })
          .join("\n        ")}
      </tbody>
    </table>
    
    <br>
    
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./assets/skill-evolution-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="./assets/skill-evolution-light.svg">
      <img src="./assets/skill-evolution-dark.svg" alt="Skill Evolution" width="800">
    </picture>
    
    <br>
    <sub><i>Atualizado em: ${new Date(skillData.lastUpdated).toLocaleString("pt-BR")}</i></sub>
  </div>
</details>`

    const newReadme = readme.replace(
      /<details>\s*<summary><h2>Evolução das Skills<\/h2><\/summary>[\s\S]*?<\/details>/,
      skillEvolutionHtml,
    )

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com sucesso!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeSkills()
