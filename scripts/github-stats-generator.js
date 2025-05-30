/**
 * GitHub Stats Generator - Sistema Único e Compacto
 * Gera um SVG customizado com stats essenciais
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
 * Gera SVG com stats customizados
 */
async function generateStatsCard(theme = "dark") {
  console.log(`Gerando card de stats (tema: ${theme})...`)

  const isDark = theme === "dark"

  // Configurações de cores
  const colors = {
    background: isDark ? "#0d1117" : "#ffffff",
    cardBg: isDark ? "#161b22" : "#f6f8fa",
    text: isDark ? "#c9d1d9" : "#24292e",
    textSecondary: isDark ? "#8b949e" : "#57606a",
    border: isDark ? "#30363d" : "#d1d9e0",
    accent: "#6e56cf",
    success: isDark ? "#3fb950" : "#1a7f37",
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
    const height = 300
    const padding = 20

    // Gerar barras de linguagens
    const languageBars = topLanguages
      .map((lang, index) => {
        const y = 120 + index * 25
        const barWidth = (Number.parseFloat(lang.percentage) / 100) * 200

        return `
        <g>
          <rect x="420" y="${y}" width="200" height="12" rx="6" fill="${colors.border}" />
          <rect x="420" y="${y}" width="${barWidth}" height="12" rx="6" fill="${lang.color}">
            <animate attributeName="width" from="0" to="${barWidth}" dur="1s" begin="${index * 0.2}s" />
          </rect>
          <text x="410" y="${y + 9}" text-anchor="end" font-size="12" fill="${colors.text}">${lang.name}</text>
          <text x="630" y="${y + 9}" font-size="12" fill="${colors.textSecondary}">${lang.percentage}%</text>
        </g>
      `
      })
      .join("")

    // Stats principais
    const mainStats = [
      { label: "Repositórios", value: userStats.publicRepos, icon: "📁" },
      { label: "Seguidores", value: userStats.followers, icon: "👥" },
      { label: "Streak", value: `${commitStreak} dias`, icon: "🔥" },
      { label: "Stars", value: totalStars, icon: "⭐" },
    ]

    const statsElements = mainStats
      .map((stat, index) => {
        const x = 40 + (index % 2) * 160
        const y = 180 + Math.floor(index / 2) * 50

        return `
        <g class="stat-item">
          <rect x="${x - 10}" y="${y - 25}" width="140" height="40" rx="8" fill="${colors.cardBg}" stroke="${colors.border}" stroke-width="1" />
          <text x="${x}" y="${y - 5}" font-size="24" fill="${colors.text}">${stat.icon}</text>
          <text x="${x + 35}" y="${y - 8}" font-size="16" font-weight="bold" fill="${colors.text}">${stat.value}</text>
          <text x="${x + 35}" y="${y + 8}" font-size="12" fill="${colors.textSecondary}">${stat.label}</text>
        </g>
      `
      })
      .join("")

    // SVG completo
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
        .stat-item { animation: fadeIn 0.6s ease-out forwards; }
        .stat-item:nth-child(1) { animation-delay: 0.1s; }
        .stat-item:nth-child(2) { animation-delay: 0.2s; }
        .stat-item:nth-child(3) { animation-delay: 0.3s; }
        .stat-item:nth-child(4) { animation-delay: 0.4s; }
        
        text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
        
        .title { animation: slideIn 0.8s ease-out; }
        .languages { animation: fadeIn 1s ease-out 0.5s both; }
      </style>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="${colors.background}" rx="12" />
      
      <!-- Card Background -->
      <rect x="${padding}" y="${padding}" width="${width - padding * 2}" height="${height - padding * 2}" 
            fill="${colors.cardBg}" stroke="${colors.border}" stroke-width="1" rx="8" />
      
      <!-- Header -->
      <g class="title">
        <text x="40" y="60" font-size="24" font-weight="bold" fill="${colors.text}">
          GitHub Stats Overview
        </text>
        <text x="40" y="80" font-size="14" fill="${colors.textSecondary}">
          ${yearsOnGitHub} anos construindo código • Atualizado ${new Date().toLocaleDateString("pt-BR")}
        </text>
        <line x1="40" y1="95" x2="760" y2="95" stroke="${colors.border}" stroke-width="1" />
      </g>
      
      <!-- Stats principais -->
      ${statsElements}
      
      <!-- Linguagens -->
      <g class="languages">
        <text x="420" y="130" font-size="16" font-weight="bold" fill="${colors.text}">Top Linguagens</text>
        ${languageBars}
      </g>
      
      <!-- Footer -->
      <text x="${width - 20}" y="${height - 10}" text-anchor="end" font-size="10" fill="${colors.textSecondary}">
        Gerado automaticamente • github.com/${USERNAME}
      </text>
      
      <!-- Accent line -->
      <rect x="0" y="0" width="${width}" height="4" fill="url(#gradient)" rx="2" />
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${colors.accent};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.success};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>
    `

    // Salvar arquivo
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    fs.writeFileSync(path.join(OUTPUT_DIR, `github-stats-${theme}.svg`), svg)

    console.log(`Stats card gerado: github-stats-${theme}.svg`)

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

  console.log("Todos os cards de stats gerados com sucesso!")
  return data
}

// Executar
generateAllStatsCards().catch(console.error)
