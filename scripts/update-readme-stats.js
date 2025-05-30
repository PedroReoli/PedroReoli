/**
 * Atualiza README com o card de stats customizado - Versão Markdown Puro
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

    // Gerar seção de stats usando apenas Markdown e HTML simples
    const statsMarkdown = `## 📈 GitHub Overview

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/github-stats-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/github-stats-light.svg">
    <img src="./assets/github-stats-dark.svg" alt="GitHub Overview" width="800">
  </picture>
  
  <br><br>
  
  <img width="400" height="158" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${
    process.env.REPOSITORY_OWNER || "pedroreoli"
  }&layout=compact&theme=radical&hide_border=true" alt="Top Languages" />
  <img width="400" height="158" src="https://github-readme-streak-stats.herokuapp.com/?user=${
    process.env.REPOSITORY_OWNER || "pedroreoli"
  }&theme=radical&hide_border=true" alt="GitHub Streak" />
  
  <br>
  
  <img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="300" alt="Developer Animation" />
</div>
`

    // Substituir seção de GitHub Stats
    const statsRegex =
      /<h2>GitHub Stats<\/h2>[\s\S]*?(?=<h2>|<div align="center">\s*<img src="https:\/\/capsule-render|$)/

    const newReadme = readme.replace(statsRegex, statsMarkdown + "\n\n")

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com stats em Markdown puro!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeStats()
