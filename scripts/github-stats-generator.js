/**
 * GitHub Stats Generator - Versão Limpa e Profissional
 * Gera um SVG customizado com design minimalista
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const GITHUB_TOKEN = process.env.TOKEN
const USERNAME = process.env.REPOSITORY_OWNER || "PedroReoli"
const OUTPUT_DIR = path.join(__dirname, "../assets")

// Cores para linguagens
const LANGUAGE_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  React: "#61dafb",
  Python: "#3776ab",
  "C#": "#239120",
  HTML: "#e34c26",
  CSS: "#264de4",
  SCSS: "#c6538c",
  Java: "#b07219",
  PHP: "#4F5D95",
  default: "#6e56cf",
}

/**
 * Ícones SVG minimalistas
 */
const ICONS = {
  repo: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
  </svg>`,

  followers: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
    <path d="M8 7a2 2 0 100-4 2 2 0 000 4zm3 2v6H5V9a3 3 0 016 0z"/>
  </svg>`,

  streak: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1112 0A6 6 0 012 8z"/>
    <path d="M8 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V.75A.75.75 0 018 0zM0 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H.75A.75.75 0 010 8zm13.25-.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zM8 13.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z"/>
  </svg>`,

  star: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
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
 * Obtém estatísticas do usuário
 */
async function getUserStats() {
  try {
    const octokit = await createOctokit()

    const { data: user } = await octokit.users.getByUsername({
      username: USERNAME,
    })

    return {
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at,
    }
  } catch (error) {
    console.error("Erro ao obter stats do usuário:", error)
    return {
      publicRepos: 0,
      followers: 0,
      following: 0,
      createdAt: new Date().toISOString(),
    }
  }
}

/**
 * Obtém top 5 linguagens de todos os repositórios
 */
async function getTopLanguages() {
  try {
    const octokit = await createOctokit()

    const { data: repos } = await octokit.repos.listForUser({
      username: USERNAME,
      per_page: 100,
    })

    const languageStats = {}
    let totalBytes = 0

    // Processar repositórios em lotes para evitar rate limit
    for (const repo of repos.slice(0, 20)) {
      try {
        const { data: languages } = await octokit.repos.listLanguages({
          owner: USERNAME,
          repo: repo.name,
        })

        Object.entries(languages).forEach(([language, bytes]) => {
          languageStats[language] = (languageStats[language] || 0) + bytes
          totalBytes += bytes
        })
      } catch (error) {
        console.log(`Erro ao obter linguagens do repo ${repo.name}`)
      }
    }

    // Calcular percentuais e pegar top 5
    const topLanguages = Object.entries(languageStats)
      .map(([language, bytes]) => ({
        name: language,
        percentage: ((bytes / totalBytes) * 100).toFixed(1),
        color: LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default,
      }))
      .sort((a, b) => Number.parseFloat(b.percentage) - Number.parseFloat(a.percentage))
      .slice(0, 5)

    return topLanguages
  } catch (error) {
    console.error("Erro ao obter linguagens:", error)
    return []
  }
}

/**
 * Calcula streak de commits
 */
async function getCommitStreak() {
  try {
    const octokit = await createOctokit()

    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username: USERNAME,
      per_page: 100,
    })

    const pushEvents = events.filter((event) => event.type === "PushEvent")

    if (pushEvents.length === 0) return 0

    // Agrupar por data
    const commitDates = new Set()
    pushEvents.forEach((event) => {
      const date = new Date(event.created_at).toDateString()
      commitDates.add(date)
    })

    // Calcular streak atual
    let streak = 0
    const today = new Date()

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)

      if (commitDates.has(checkDate.toDateString())) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    return streak
  } catch (error) {
    console.error("Erro ao calcular streak:", error)
    return 0
  }
}

/**
 * Conta total de stars recebidas
 */
async function getTotalStars() {
  try {
    const octokit = await createOctokit()

    const { data: repos } = await octokit.repos.listForUser({
      username: USERNAME,
      per_page: 100,
    })

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    return totalStars
  } catch (error) {
    console.error("Erro ao contar stars:", error)
    return 0
  }
}

/**
 * Gera SVG com stats customizados - Design Limpo
 */
async function generateStatsCard(theme = "dark") {
  console.log(`Gerando card de stats limpo (tema: ${theme})...`)

  const isDark = theme === "dark"

  // Configurações de cores minimalistas
  const colors = {
    background: isDark ? "#0d1117" : "#ffffff",
    cardBg: isDark ? "#161b22" : "#f6f8fa",
    text: isDark ? "#e6edf3" : "#24292f",
    textSecondary: isDark ? "#7d8590" : "#656d76",
    border: isDark ? "#21262d" : "#d0d7de",
    accent: "#6366f1",
    success: isDark ? "#238636" : "#1a7f37",
    warning: isDark ? "#d29922" : "#bf8700",
  }

  try {
    // Obter todos os dados
    const [userStats, topLanguages, commitStreak, totalStars] = await Promise.all([
      getUserStats(),
      getTopLanguages(),
      getCommitStreak(),
      getTotalStars(),
    ])

    // Calcular anos no GitHub
    const yearsOnGitHub = new Date().getFullYear() - new Date(userStats.createdAt).getFullYear()

    // Dimensões
    const width = 800
    const height = 280
    const padding = 24

    // Stats principais com ícones
    const mainStats = [
      {
        label: "Repositórios",
        value: userStats.publicRepos,
        icon: ICONS.repo,
        color: colors.accent,
      },
      {
        label: "Seguidores",
        value: userStats.followers,
        icon: ICONS.followers,
        color: colors.success,
      },
      {
        label: "Streak",
        value: `${commitStreak}d`,
        icon: ICONS.streak,
        color: colors.warning,
      },
      {
        label: "Stars",
        value: totalStars,
        icon: ICONS.star,
        color: colors.accent,
      },
    ]

    // Gerar elementos de stats
    const statsElements = mainStats
      .map((stat, index) => {
        const x = 40 + (index % 2) * 180
        const y = 120 + Math.floor(index / 2) * 60

        return `
        <g class="stat-item" style="animation-delay: ${index * 0.1}s">
          <rect x="${x - 12}" y="${y - 20}" width="160" height="45" rx="8" 
                fill="${colors.cardBg}" stroke="${colors.border}" stroke-width="1" />
          
          <g transform="translate(${x}, ${y})">
            <g fill="${stat.color}">
              ${stat.icon}
            </g>
            <text x="24" y="0" font-size="18" font-weight="600" fill="${colors.text}">${stat.value}</text>
            <text x="24" y="14" font-size="12" fill="${colors.textSecondary}">${stat.label}</text>
          </g>
        </g>`
      })
      .join("")

    // Gerar barras de linguagens (mais compactas)
    const languageBars = topLanguages
      .slice(0, 4) // Apenas top 4 para não poluir
      .map((lang, index) => {
        const x = 420
        const y = 110 + index * 32
        const barWidth = (Number.parseFloat(lang.percentage) / 100) * 160

        return `
        <g class="lang-item" style="animation-delay: ${(index + 4) * 0.1}s">
          <text x="${x}" y="${y}" font-size="13" font-weight="500" fill="${colors.text}">${lang.name}</text>
          <rect x="${x}" y="${y + 6}" width="160" height="8" rx="4" fill="${colors.border}" />
          <rect x="${x}" y="${y + 6}" width="${barWidth}" height="8" rx="4" fill="${lang.color}">
            <animate attributeName="width" from="0" to="${barWidth}" dur="1s" begin="${index * 0.2}s" />
          </rect>
          <text x="${x + 170}" y="${y}" font-size="12" fill="${colors.textSecondary}">${lang.percentage}%</text>
        </g>`
      })
      .join("")

    // SVG completo com design limpo
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        
        .stat-item, .lang-item { 
          animation: fadeInUp 0.6s ease-out forwards; 
          opacity: 0;
        }
        
        text { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif; 
        }
        
        .title-text { 
          animation: fadeInUp 0.8s ease-out; 
        }
      </style>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="${colors.background}" rx="12" />
      
      <!-- Card Background -->
      <rect x="${padding}" y="${padding}" width="${width - padding * 2}" height="${height - padding * 2}" 
            fill="${colors.cardBg}" stroke="${colors.border}" stroke-width="1" rx="8" />
      
      <!-- Header -->
      <g class="title-text">
        <text x="40" y="50" font-size="20" font-weight="600" fill="${colors.text}">
          GitHub Overview
        </text>
        <text x="40" y="70" font-size="13" fill="${colors.textSecondary}">
          ${yearsOnGitHub} anos no GitHub • Atualizado ${new Date().toLocaleDateString("pt-BR")}
        </text>
        <line x1="40" y1="85" x2="${width - 40}" y2="85" stroke="${colors.border}" stroke-width="1" />
      </g>
      
      <!-- Stats principais -->
      ${statsElements}
      
      <!-- Linguagens -->
      <g>
        <text x="420" y="100" font-size="15" font-weight="600" fill="${colors.text}">Top Linguagens</text>
        ${languageBars}
      </g>
      
      <!-- Footer -->
      <text x="${width - 24}" y="${height - 12}" text-anchor="end" font-size="10" fill="${colors.textSecondary}">
        github.com/${USERNAME}
      </text>
      
      <!-- Accent line -->
      <rect x="0" y="0" width="${width}" height="3" fill="${colors.accent}" rx="2" />
    </svg>`

    // Salvar arquivo
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    fs.writeFileSync(path.join(OUTPUT_DIR, `github-stats-${theme}.svg`), svg)

    console.log(`Stats card limpo gerado: github-stats-${theme}.svg`)

    return {
      userStats,
      topLanguages,
      commitStreak,
      totalStars,
      yearsOnGitHub,
    }
  } catch (error) {
    console.error("Erro ao gerar stats card:", error)
    throw error
  }
}

/**
 * Gera cards para ambos os temas
 */
async function generateAllStatsCards() {
  const data = await generateStatsCard("dark")
  await generateStatsCard("light")

  // Salvar dados para referência
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "github-stats-data.json"),
    JSON.stringify({ ...data, lastUpdated: new Date().toISOString() }, null, 2),
  )

  console.log("Todos os cards de stats limpos gerados com sucesso!")
  return data
}

// Executar
generateAllStatsCards().catch(console.error)
