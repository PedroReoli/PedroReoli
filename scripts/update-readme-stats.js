/**
 * Atualiza README com o card de stats customizado
 */

const fs = require("fs")
const path = require("path")

function updateReadmeStats() {
  try {
    const statsFile = path.join(__dirname, "../assets/github-stats-data.json")
    const readmeFile = path.join(__dirname, "../README.md")

    if (!fs.existsSync(statsFile)) {
      console.log("Arquivo de dados de stats não encontrado!")
      return
    }

    const statsData = JSON.parse(fs.readFileSync(statsFile, "utf8"))
    const readme = fs.readFileSync(readmeFile, "utf8")

    // Gerar seção de stats
    const statsHtml = `<h2>GitHub Stats</h2>

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/github-stats-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/github-stats-light.svg">
    <img src="./assets/github-stats-dark.svg" alt="GitHub Stats" width="800">
  </picture>
  
  <br><br>
  
  <div style="display: flex; justify-content: center; gap: 10px;">
    <img width="400" height="158" src="https://github-readme-streak-stats.herokuapp.com/?user=${process.env.GITHUB_REPOSITORY_OWNER || "pedroreoli"}&theme=radical&hide_border=true" alt="GitHub Streak" />
  </div>
  
  <img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="300" alt="Pixel Art Developer" />
</div>`

    // Substituir seção de GitHub Stats
    const statsRegex =
      /<h2>GitHub Stats<\/h2>[\s\S]*?(?=<h2>|<div align="center">\s*<img src="https:\/\/capsule-render|$)/

    const newReadme = readme.replace(statsRegex, statsHtml + "\n\n")

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com stats customizados!")

    // Log dos dados
    console.log(`Stats atualizados:`)
    console.log(`- Repositórios: ${statsData.userStats.publicRepos}`)
    console.log(`- Streak: ${statsData.commitStreak} dias`)
    console.log(`- Stars: ${statsData.totalStars}`)
    console.log(`- Top linguagem: ${statsData.topLanguages[0]?.name || "N/A"}`)
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeStats()
