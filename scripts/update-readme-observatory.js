/**
 * Atualiza README com dados do observatório - Versão Corrigida
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

    // Gerar HTML completo com estilização
    const observatoryHtml = `<div class="observatory-container">
  <style>
    .observatory-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px 0;
    }
    
    .observatory-header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .observatory-title {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 8px 0;
    }
    
    .observatory-subtitle {
      font-size: 14px;
      color: #718096;
      margin: 0;
    }
    
    .observatory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    
    .observatory-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 20px;
      color: white;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .observatory-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    }
    
    .card-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .gamification-card {
      background: linear-gradient(135deg, #6E56CF 0%, #9333EA 100%);
    }
    
    .chronotype-card {
      background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
    }
    
    .insights-card {
      background: linear-gradient(135deg, #10B981 0%, #047857 100%);
    }
    
    .goals-card {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    }
    
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 0;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      backdrop-filter: blur(10px);
    }
    
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .stat-value {
      font-size: 16px;
      font-weight: 600;
    }
    
    .badge-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    
    .badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      backdrop-filter: blur(10px);
    }
    
    .insight-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 12px;
      border-radius: 8px;
      margin: 8px 0;
      backdrop-filter: blur(10px);
    }
    
    .goal-progress {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 8px 0;
    }
    
    .progress-bar {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    .observatory-footer {
      text-align: center;
      margin-top: 20px;
    }
    
    /* Mobile */
    @media (max-width: 640px) {
      .observatory-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .observatory-card {
        padding: 16px;
      }
      
      .stat-row {
        padding: 6px 10px;
      }
      
      .goal-progress {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }
    }
  </style>
  
  <div class="observatory-header">
    <h2 class="observatory-title">🔭 Observatório Dev</h2>
    <p class="observatory-subtitle">Insights automáticos sobre padrões de desenvolvimento</p>
  </div>
  
  <div class="observatory-grid">
    <!-- Gamification Card -->
    <div class="observatory-card gamification-card">
      <div class="card-title">
        <span>🎮</span>
        <span>Status do Desenvolvedor</span>
      </div>
      
      <div class="stat-row">
        <span class="stat-label">Level</span>
        <span class="stat-value">${observatoryData.gamification.level}</span>
      </div>
      
      <div class="stat-row">
        <span class="stat-label">XP Total</span>
        <span class="stat-value">${observatoryData.gamification.totalXP.toLocaleString()}</span>
      </div>
      
      <div class="stat-row">
        <span class="stat-label">Título</span>
        <span class="stat-value">${observatoryData.gamification.title}</span>
      </div>
      
      <div class="badge-container">
        ${observatoryData.gamification.badges.map((badge) => `<span class="badge">${badge}</span>`).join("")}
      </div>
    </div>
    
    <!-- Chronotype Card -->
    <div class="observatory-card chronotype-card">
      <div class="card-title">
        <span>🧭</span>
        <span>Dev Cronotipo</span>
      </div>
      
      <div class="stat-row">
        <span class="stat-label">Tipo</span>
        <span class="stat-value">Dev ${observatoryData.cronotipo.type}</span>
      </div>
      
      <div class="stat-row">
        <span class="stat-label">Horário de Pico</span>
        <span class="stat-value">${observatoryData.cronotipo.peakStart}h - ${observatoryData.cronotipo.peakEnd}h</span>
      </div>
      
      <div class="stat-row">
        <span class="stat-label">Total de Commits</span>
        <span class="stat-value">${observatoryData.cronotipo.totalCommits}</span>
      </div>
    </div>
    
    <!-- Insights Card -->
    <div class="observatory-card insights-card">
      <div class="card-title">
        <span>💡</span>
        <span>Insights Semanais</span>
      </div>
      
      ${observatoryData.insights
        .slice(0, 3)
        .map((insight) => `<div class="insight-item">${insight}</div>`)
        .join("")}
    </div>
    
    <!-- Goals Card -->
    <div class="observatory-card goals-card">
      <div class="card-title">
        <span>🎯</span>
        <span>Metas da Semana</span>
      </div>
      
      ${observatoryData.weeklyGoals
        .slice(0, 3)
        .map((goal) => {
          const percentage = Math.round((goal.progress / goal.target) * 100)
          return `
        <div class="goal-progress">
          <div style="min-width: 120px;">
            <div style="font-size: 14px; font-weight: 500;">${goal.name}</div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
          <div style="min-width: 40px; text-align: right; font-weight: 600;">
            ${percentage}%
          </div>
        </div>`
        })
        .join("")}
    </div>
  </div>
  
  <div class="observatory-footer">
    <small style="color: #718096; font-size: 12px;">
      Relatório atualizado em: ${new Date(observatoryData.lastUpdated).toLocaleString("pt-BR")}
    </small>
  </div>
</div>`

    const newReadme = readme.replace(
      /<details>\s*<summary><h2>🔭 Observatório Dev<\/h2><\/summary>[\s\S]*?<\/details>/,
      `<details>
  <summary><h2>🔭 Observatório Dev</h2></summary>
  ${observatoryHtml}
</details>`,
    )

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com observatório corrigido!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeObservatory()
