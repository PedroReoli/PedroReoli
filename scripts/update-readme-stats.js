/**
 * Atualiza README com o card de stats customizado - Versão Limpa
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

    // Gerar seção de stats limpa e profissional
    const statsHtml = `<div class="github-stats-container">
  <style>
    .github-stats-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px 0;
    }
    
    .stats-header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .stats-title {
      font-size: 24px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 8px 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin: 20px 0;
    }
    
    .stats-overview {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .stats-overview img {
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }
    
    .stats-overview img:hover {
      transform: translateY(-2px);
    }
    
    .stats-secondary {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .stats-secondary img {
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease;
    }
    
    .stats-secondary img:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .stats-footer {
      text-align: center;
      margin-top: 20px;
    }
    
    .developer-gif {
      margin-top: 20px;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }
    
    .developer-gif:hover {
      opacity: 1;
    }
    
    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      .stats-title {
        color: #f7fafc;
      }
      
      .stats-overview img,
      .stats-secondary img {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
    }
    
    /* Mobile */
    @media (max-width: 768px) {
      .stats-secondary {
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
      
      .stats-secondary img {
        max-width: 100%;
        height: auto;
      }
    }
  </style>
  
  <div class="stats-header">
    <h2 class="stats-title">GitHub Stats</h2>
  </div>
  
  <div class="stats-grid">
    <!-- Overview Principal -->
    <div class="stats-overview">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="./assets/github-stats-dark.svg">
        <source media="(prefers-color-scheme: light)" srcset="./assets/github-stats-light.svg">
        <img src="./assets/github-stats-dark.svg" alt="GitHub Overview" width="800" height="280">
      </picture>
    </div>
    
    <!-- Stats Secundários -->
    <div class="stats-secondary">
      <img width="400" height="158" 
           src="https://github-readme-stats.vercel.app/api/top-langs/?username=${process.env.REPOSITORY_OWNER || "pedroreoli"}&layout=compact&theme=radical&hide_border=true&card_width=400" 
           alt="Top Languages" />
      <img width="400" height="158" 
           src="https://github-readme-streak-stats.herokuapp.com/?user=${process.env.REPOSITORY_OWNER || "pedroreoli"}&theme=radical&hide_border=true" 
           alt="GitHub Streak" />
    </div>
  </div>
  
  <div class="stats-footer">
    <img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" 
         width="300" alt="Developer Animation" class="developer-gif" />
  </div>
</div>`

    // Substituir seção de GitHub Stats
    const statsRegex =
      /<h2>GitHub Stats<\/h2>[\s\S]*?(?=<h2>|<div align="center">\s*<img src="https:\/\/capsule-render|$)/

    const newReadme = readme.replace(statsRegex, statsHtml + "\n\n")

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com stats limpos e profissionais!")

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
