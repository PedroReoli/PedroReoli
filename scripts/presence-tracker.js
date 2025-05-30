/**
 * Status de Presença Online - V3.0 Minimalista
 * Gera cards modernos com ícones SVG customizados
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const GITHUB_TOKEN = process.env.TOKEN
const USERNAME = process.env.REPOSITORY_OWNER || "PedroReoli"
const OUTPUT_FILE = path.join(__dirname, "../assets/presence-status.json")

/**
 * Ícones SVG customizados minimalistas
 */
const ICONS = {
  online: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="4" fill="#48bb78">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="10" cy="10" r="7" stroke="#48bb78" stroke-width="1" fill="none" opacity="0.3"/>
  </svg>`,

  code: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 7L2 10L6 13" stroke="#6E56CF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 7L18 10L14 13" stroke="#6E56CF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 4L8 16" stroke="#718096" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  clock: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7" stroke="#718096" stroke-width="1.5"/>
    <path d="M10 6V10L13 13" stroke="#2d3748" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  activity: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12L6 9L10 13L17 6" stroke="#6E56CF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="2" y="15" width="2" height="3" fill="#48bb78" opacity="0.6"/>
    <rect x="6" y="13" width="2" height="5" fill="#48bb78" opacity="0.8"/>
    <rect x="10" y="11" width="2" height="7" fill="#48bb78"/>
    <rect x="14" y="14" width="2" height="4" fill="#48bb78" opacity="0.7"/>
  </svg>`,
}

/**
 * Inicializa Octokit dinamicamente
 */
async function createOctokit() {
  const { Octokit } = await import("@octokit/rest")
  return new Octokit({
    auth: GITHUB_TOKEN,
  })
}

/**
 * Obtém os dados de atividade do GitHub
 */
async function getGitHubActivity() {
  try {
    const octokit = await createOctokit()

    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username: USERNAME,
      per_page: 10,
    })

    if (events.length === 0) {
      return {
        lastActive: "Offline",
        activeRepo: "Nenhum projeto ativo",
        todayCommits: 0,
        isOnline: false,
      }
    }

    const lastEvent = events[0]
    const createdAt = new Date(lastEvent.created_at)
    const now = new Date()
    const diffMinutes = Math.floor((now - createdAt) / (1000 * 60))

    let lastActive
    let isOnline = false

    if (diffMinutes < 30) {
      lastActive = "Agora"
      isOnline = true
    } else if (diffMinutes < 60) {
      lastActive = `${diffMinutes}min`
      isOnline = true
    } else if (diffMinutes < 1440) {
      lastActive = `${Math.floor(diffMinutes / 60)}h`
      isOnline = diffMinutes < 360 // Online se menos de 6h
    } else {
      lastActive = `${Math.floor(diffMinutes / 1440)}d`
      isOnline = false
    }

    const activeRepo = lastEvent.repo ? lastEvent.repo.name.split("/")[1] : "Nenhum projeto ativo"

    // Contar commits de hoje
    const today = new Date().toISOString().split("T")[0]
    const todayCommits = events.filter(
      (event) => event.type === "PushEvent" && event.created_at.startsWith(today),
    ).length

    return { lastActive, activeRepo, todayCommits, isOnline }
  } catch (error) {
    console.error("Erro ao obter atividade do GitHub:", error)
    return {
      lastActive: "Offline",
      activeRepo: "Erro ao carregar",
      todayCommits: 0,
      isOnline: false,
    }
  }
}

/**
 * Analisa commits recentes para detectar linguagem principal
 */
async function getTopLanguageFromCommits() {
  try {
    const octokit = await createOctokit()

    const { data: repos } = await octokit.repos.listForUser({
      username: USERNAME,
      sort: "updated",
      per_page: 5,
    })

    if (repos.length === 0) return "Nenhuma"

    const { data: languages } = await octokit.repos.listLanguages({
      owner: USERNAME,
      repo: repos[0].name,
    })

    if (Object.keys(languages).length === 0) return "Nenhuma"

    const topLanguage = Object.keys(languages).reduce((a, b) => (languages[a] > languages[b] ? a : b))

    return topLanguage
  } catch (error) {
    console.error("Erro ao obter linguagens:", error)
    return "Desconhecida"
  }
}

/**
 * Gera HTML dos cards de status
 */
function generateStatusCards(data) {
  const { githubActivity, topLanguage } = data

  const cards = [
    {
      icon: ICONS.online,
      value: githubActivity.isOnline ? "Online" : "Offline",
      label: "Status atual",
      accent: githubActivity.isOnline,
    },
    {
      icon: ICONS.code,
      value: githubActivity.activeRepo,
      label: "Projeto ativo",
      accent: githubActivity.activeRepo !== "Nenhum projeto ativo",
    },
    {
      icon: ICONS.clock,
      value: githubActivity.lastActive,
      label: "Última atividade",
      accent: false,
    },
    {
      icon: ICONS.activity,
      value: githubActivity.todayCommits.toString(),
      label: "Commits hoje",
      accent: githubActivity.todayCommits > 0,
    },
  ]

  const cardHTML = cards
    .map(
      (card) => `
    <div class="status-card ${card.accent ? "accent" : ""}">
      <div class="card-icon">
        ${card.icon}
      </div>
      <div class="card-content">
        <div class="card-value">${card.value}</div>
        <div class="card-label">${card.label}</div>
      </div>
    </div>
  `,
    )
    .join("")

  return `
    <div class="status-live-container">
      <style>
        .status-live-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 0;
        }
        
        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          margin: 16px 0;
        }
        
        .status-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px 16px;
          text-align: center;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .status-card.accent {
          border-color: #6E56CF;
          background: linear-gradient(135deg, #ffffff 0%, #f8f7ff 100%);
        }
        
        .card-icon {
          margin-bottom: 12px;
          display: flex;
          justify-content: center;
        }
        
        .card-value {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 4px;
          line-height: 1.2;
        }
        
        .card-label {
          font-size: 12px;
          color: #718096;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-header {
          text-align: center;
          margin-bottom: 8px;
        }
        
        .status-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }
        
        .status-subtitle {
          font-size: 12px;
          color: #718096;
          margin: 4px 0 0 0;
        }
        
        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .status-card {
            background: #1a202c;
            border-color: #2d3748;
          }
          
          .status-card.accent {
            border-color: #6E56CF;
            background: linear-gradient(135deg, #1a202c 0%, #2d1b69 100%);
          }
          
          .card-value {
            color: #f7fafc;
          }
          
          .card-label {
            color: #a0aec0;
          }
          
          .status-title {
            color: #f7fafc;
          }
          
          .status-subtitle {
            color: #a0aec0;
          }
        }
        
        /* Mobile responsivo */
        @media (max-width: 640px) {
          .status-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          
          .status-card {
            padding: 16px 12px;
          }
          
          .card-value {
            font-size: 14px;
          }
          
          .card-label {
            font-size: 11px;
          }
        }
      </style>
      
      <div class="status-header">
        <h2 class="status-title">Últimas Atualizações</h2>
        <p class="status-subtitle">Atualizado em tempo real</p>
      </div>
      
      <div class="status-grid">
        ${cardHTML}
      </div>
      
      <div style="text-align: center; margin-top: 16px;">
        <small style="color: #718096; font-size: 11px;">
          Última atualização: ${new Date().toLocaleString("pt-BR")}
        </small>
      </div>
    </div>
  `
}

/**
 * Gera os dados de status
 */
async function generateStatusData() {
  console.log("Gerando status de presença minimalista...")

  // Obter dados de atividade
  const [githubActivity, topLanguage] = await Promise.all([getGitHubActivity(), getTopLanguageFromCommits()])

  // Criar objeto de status
  const status = {
    lastUpdated: new Date().toISOString(),
    github: githubActivity,
    coding: {
      topLanguage: topLanguage,
    },
    html: generateStatusCards({ githubActivity, topLanguage }),
  }

  // Salvar dados
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(status, null, 2))

  console.log("Status de presença gerado com sucesso!")
  console.log(`- Status: ${githubActivity.isOnline ? "Online" : "Offline"}`)
  console.log(`- Projeto ativo: ${githubActivity.activeRepo}`)
  console.log(`- Última atividade: ${githubActivity.lastActive}`)
  console.log(`- Commits hoje: ${githubActivity.todayCommits}`)

  return status
}

// Executar
generateStatusData().catch(console.error)
