/**
 * Atualiza README com dados de skill evolution - Versão Corrigida
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

    // Gerar HTML completo com estilização
    const skillEvolutionHtml = `<div class="skill-evolution-container">
  <style>
    .skill-evolution-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px 0;
    }
    
    .skill-header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .skill-title {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 8px 0;
    }
    
    .skill-subtitle {
      font-size: 14px;
      color: #718096;
      margin: 0;
    }
    
    .skill-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin: 20px 0;
    }
    
    .skill-stat-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .skill-stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #6E56CF;
    }
    
    .skill-language {
      font-size: 16px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 8px;
    }
    
    .skill-commits {
      font-size: 24px;
      font-weight: 700;
      color: #6E56CF;
      margin-bottom: 4px;
    }
    
    .skill-trend {
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    
    .trend-up { color: #48bb78; }
    .trend-down { color: #f56565; }
    .trend-stable { color: #ed8936; }
    
    .skill-chart-container {
      margin: 20px 0;
      text-align: center;
    }
    
    .skill-chart-container img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .skill-footer {
      text-align: center;
      margin-top: 16px;
    }
    
    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      .skill-stat-card {
        background: #1a202c;
        border-color: #2d3748;
      }
      
      .skill-title {
        color: #f7fafc;
      }
      
      .skill-subtitle {
        color: #a0aec0;
      }
      
      .skill-language {
        color: #f7fafc;
      }
      
      .skill-stat-card:hover {
        background: #2d3748;
        border-color: #6E56CF;
      }
    }
    
    /* Mobile */
    @media (max-width: 640px) {
      .skill-stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      
      .skill-stat-card {
        padding: 12px;
      }
      
      .skill-language {
        font-size: 14px;
      }
      
      .skill-commits {
        font-size: 20px;
      }
      
      .skill-trend {
        font-size: 12px;
      }
    }
  </style>
  
  <div class="skill-header">
    <h2 class="skill-title">🧠 Evolução das Skills</h2>
    <p class="skill-subtitle">Análise dos últimos ${skillData.period.days} dias de commits</p>
  </div>
  
  <div class="skill-stats-grid">
    ${topLanguages
      .map((lang) => {
        const trendIcon = lang.trend === "up" ? "⬆️" : lang.trend === "down" ? "⬇️" : "↔️"
        const trendClass = lang.trend === "up" ? "trend-up" : lang.trend === "down" ? "trend-down" : "trend-stable"
        const trendText = lang.trend === "up" ? `+${lang.change}` : lang.trend === "down" ? `-${lang.change}` : "0"

        return `
    <div class="skill-stat-card">
      <div class="skill-language">${lang.name}</div>
      <div class="skill-commits">${lang.count}</div>
      <div class="skill-trend ${trendClass}">
        <span>${trendIcon}</span>
        <span>${trendText}</span>
      </div>
    </div>`
      })
      .join("")}
  </div>
  
  <div class="skill-chart-container">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./assets/skill-evolution-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="./assets/skill-evolution-light.svg">
      <img src="./assets/skill-evolution-dark.svg" alt="Skill Evolution Chart" width="800">
    </picture>
  </div>
  
  <div class="skill-footer">
    <small style="color: #718096; font-size: 12px;">
      Última atualização: ${new Date(skillData.lastUpdated).toLocaleString("pt-BR")}
    </small>
  </div>
</div>`

    const newReadme = readme.replace(
      /<details>\s*<summary><h2>Evolução das Skills<\/h2><\/summary>[\s\S]*?<\/details>/,
      `<details>
  <summary><h2>Evolução das Skills</h2></summary>
  ${skillEvolutionHtml}
</details>`,
    )

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com skill evolution corrigida!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeSkills()
