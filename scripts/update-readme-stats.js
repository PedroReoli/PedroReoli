/**
 * Atualiza README com o card de stats customizado - Versão com Marcadores Seguros
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
    let readme = fs.readFileSync(readmeFile, "utf8")

    // Verificar se SVGs existem
    const darkSVGExists = fs.existsSync(path.join(__dirname, "../assets/github-stats-dark.svg"))
    const lightSVGExists = fs.existsSync(path.join(__dirname, "../assets/github-stats-light.svg"))

    let statsContent

    if (darkSVGExists && lightSVGExists) {
      statsContent = `<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/github-stats-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/github-stats-light.svg">
    <img src="./assets/github-stats-dark.svg" alt="GitHub Overview" width="800">
  </picture>
  
  <br><br>
  
  <img width="400" height="158" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${process.env.REPOSITORY_OWNER || "pedroreoli"}&layout=compact&theme=radical&hide_border=true&hide_title=true" alt="Linguagens" />
  <img width="400" height="158" src="https://github-readme-streak-stats.herokuapp.com/?user=${process.env.REPOSITORY_OWNER || "pedroreoli"}&theme=radical&hide_border=true" alt="GitHub Streak" />
  
  <br>
  
  <img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="300" alt="Developer Animation" />
</div>`
    } else {
      // Fallback se SVGs não existirem
      statsContent = `<div align="center">
  <p>📊 <strong>GitHub Overview sendo gerado...</strong></p>
  
  <br>
  
  <img width="400" height="158" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${process.env.REPOSITORY_OWNER || "pedroreoli"}&layout=compact&theme=radical&hide_border=true&hide_title=true" alt="Linguagens" />
  <img width="400" height="158" src="https://github-readme-streak-stats.herokuapp.com/?user=${process.env.REPOSITORY_OWNER || "pedroreoli"}&theme=radical&hide_border=true" alt="GitHub Streak" />
  
  <br>
  
  <img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="300" alt="Developer Animation" />
</div>`
    }

    // Substituir APENAS entre os marcadores específicos
    const statsRegex = /(<!-- INICIO_GITHUB_STATS -->)([\s\S]*?)(<!-- FIM_GITHUB_STATS -->)/

    if (statsRegex.test(readme)) {
      readme = readme.replace(statsRegex, `$1\n${statsContent}\n$3`)
      console.log("✅ GitHub Stats atualizado com sucesso!")

      if (!darkSVGExists || !lightSVGExists) {
        console.log("⚠️  SVGs de stats não encontrados, usando fallback")
      }
    } else {
      console.error("❌ Marcadores de GitHub Stats não encontrados no README!")
      return
    }

    fs.writeFileSync(readmeFile, readme)
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeStats()
