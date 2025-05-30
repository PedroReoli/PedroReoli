/**
 * Atualiza README com dados da constelação - Versão Corrigida
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function updateReadmeConstellation() {
  try {
    const dataFile = path.join(__dirname, "../assets/constellation-data.json")
    const readmeFile = path.join(__dirname, "../README.md")

    if (!fs.existsSync(dataFile)) {
      console.log("Arquivo de dados da constelação não encontrado!")
      return
    }

    const constellationData = JSON.parse(fs.readFileSync(dataFile, "utf8"))
    const readme = fs.readFileSync(readmeFile, "utf8")

    // Gerar HTML completo com estilização
    const constellationHtml = `<div class="constellation-container">
  <style>
    .constellation-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px 0;
    }
    
    .constellation-header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .constellation-title {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 8px 0;
    }
    
    .constellation-subtitle {
      font-size: 14px;
      color: #718096;
      margin: 0 0 16px 0;
    }
    
    .constellation-chart {
      text-align: center;
      margin: 20px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .constellation-chart img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    
    .constellation-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin: 20px 0;
    }
    
    .constellation-info-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      transition: all 0.2s ease;
    }
    
    .constellation-info-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #6E56CF;
    }
    
    .info-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }
    
    .info-text {
      font-size: 14px;
      color: #4a5568;
      line-height: 1.4;
    }
    
    .constellation-footer {
      text-align: center;
      margin-top: 20px;
    }
    
    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      .constellation-info-card {
        background: #1a202c;
        border-color: #2d3748;
      }
      
      .constellation-title {
        color: #f7fafc;
      }
      
      .constellation-subtitle {
        color: #a0aec0;
      }
      
      .info-text {
        color: #a0aec0;
      }
      
      .constellation-info-card:hover {
        background: #2d3748;
        border-color: #6E56CF;
      }
    }
    
    /* Mobile */
    @media (max-width: 640px) {
      .constellation-chart {
        padding: 16px;
      }
      
      .constellation-info {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .constellation-info-card {
        padding: 12px;
      }
    }
  </style>
  
  <div class="constellation-header">
    <h2 class="constellation-title">🌌 Constelação de Projetos</h2>
    <p class="constellation-subtitle">Visualização interativa dos repositórios como uma constelação estelar</p>
  </div>
  
  <div class="constellation-chart">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./assets/constellation-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="./assets/constellation-light.svg">
      <img src="./assets/constellation-dark.svg" alt="Constelação de Projetos" width="900">
    </picture>
  </div>
  
  <div class="constellation-info">
    <div class="constellation-info-card">
      <div class="info-icon">⭐</div>
      <div class="info-text">Tamanho da estrela = número de commits</div>
    </div>
    <div class="constellation-info-card">
      <div class="info-icon">✨</div>
      <div class="info-text">Brilho da estrela = quantidade de stars</div>
    </div>
    <div class="constellation-info-card">
      <div class="info-icon">🎨</div>
      <div class="info-text">Cor da estrela = linguagem principal</div>
    </div>
    <div class="constellation-info-card">
      <div class="info-icon">🔗</div>
      <div class="info-text">Clique nas estrelas para visitar os repositórios</div>
    </div>
  </div>
  
  <div class="constellation-footer">
    <small style="color: #718096; font-size: 12px;">
      Última atualização: ${new Date(constellationData.lastUpdated).toLocaleString("pt-BR")}
    </small>
  </div>
</div>`

    const newReadme = readme.replace(
      /<details>\s*<summary><h2>Constelação de Projetos<\/h2><\/summary>[\s\S]*?<\/details>/,
      `<details>
  <summary><h2>Constelação de Projetos</h2></summary>
  ${constellationHtml}
</details>`,
    )

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com constelação corrigida!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeConstellation()
