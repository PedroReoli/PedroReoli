/**
 * Atualiza README com dados do observatório
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

    const observatoryHtml = `<details>
  <summary><h2>🔭 Observatório Dev</h2></summary>
  <div align="center">
    
    <!-- Gamification -->
    <div style="background: linear-gradient(145deg, #1e1e2e, #2a2a3e); border-radius: 12px; padding: 20px; margin: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.3);">
      <h3>🎮 Status do Desenvolvedor</h3>
      <p>
        <img src="https://img.shields.io/badge/Level-${observatoryData.gamification.level}-6E56CF?style=for-the-badge&logo=levelsdotfyi&logoColor=white" alt="Level" />
        <img src="https://img.shields.io/badge/XP-${observatoryData.gamification.totalXP}-4CAF50?style=for-the-badge&logo=xp&logoColor=white" alt="XP" />
        <img src="https://img.shields.io/badge/Title-${encodeURIComponent(observatoryData.gamification.title)}-FF9800?style=for-the-badge&logo=crown&logoColor=white" alt="Title" />
      </p>
      
      <h4>🏆 Badges Conquistados</h4>
      <p>
        ${observatoryData.gamification.badges
          .map(
            (badge) =>
              `<img src="https://img.shields.io/badge/${encodeURIComponent(badge)}-Conquistado-success?style=flat-square" alt="${badge}" />`,
          )
          .join(" ")}
      </p>
    </div>
    
    <!-- Dev Chronotype -->
    <div style="background: linear-gradient(145deg, #2d1b69, #3d2b79); border-radius: 12px; padding: 20px; margin: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.3);">
      <h3>🧭 Dev Cronotipo</h3>
      <p><strong>Você é um Dev ${observatoryData.cronotipo.type}</strong></p>
      <p>Horário de pico de produtividade: <strong>${observatoryData.cronotipo.peakStart}h - ${observatoryData.cronotipo.peakEnd}h</strong></p>
      <p>Total de commits analisados: <strong>${observatoryData.cronotipo.totalCommits}</strong></p>
    </div>
    
    <!-- Weekly Insights -->
    <div style="background: linear-gradient(145deg, #0f3460, #1f4470); border-radius: 12px; padding: 20px; margin: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.3);">
      <h3>💡 Insights Semanais</h3>
      ${observatoryData.insights.map((insight) => `<p>• ${insight}</p>`).join("")}
    </div>
    
    <!-- Weekly Goals -->
    <div style="background: linear-gradient(145deg, #1e1e2e, #2a2a3e); border-radius: 12px; padding: 20px; margin: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.3);">
      <h3>🎯 Metas da Semana</h3>
      <table>
        <thead>
          <tr>
            <th>Meta</th>
            <th>Progresso</th>
          </tr>
        </thead>
        <tbody>
          ${observatoryData.weeklyGoals
            .slice(0, 5)
            .map((goal) => {
              const percentage = Math.round((goal.progress / goal.target) * 100)
              const progressBar = "█".repeat(Math.floor(percentage / 10)) + "░".repeat(10 - Math.floor(percentage / 10))
              return `<tr>
              <td>${goal.name}</td>
              <td>${progressBar} ${percentage}%</td>
            </tr>`
            })
            .join("")}
        </tbody>
      </table>
    </div>
    
    <br>
    <sub><i>Relatório atualizado em: ${new Date(observatoryData.lastUpdated).toLocaleString("pt-BR")}</i></sub>
  </div>
</details>`

    const newReadme = readme.replace(
      /<details>\s*<summary><h2>🔭 Observatório Dev<\/h2><\/summary>[\s\S]*?<\/details>/,
      observatoryHtml,
    )

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com dados do observatório!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeObservatory()
