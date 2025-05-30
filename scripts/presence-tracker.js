/**
 * Status de Presença Online - V2.5 (100% Gratuito)
 * Gera badges dinâmicos usando apenas GitHub API
 */

const fs = require("fs")
const path = require("path")
const { Octokit } = require("@octokit/rest")

// Configuração
const TOKEN = process.env.TOKEN
const USERNAME = process.env.REPOSITORY_OWNER || "PedroReoli"
const OUTPUT_FILE = path.join(__dirname, "../assets/presence-status.json")

// Inicialização do Octokit
const octokit = new Octokit({
  auth: TOKEN,
})

/**
 * Obtém os dados de atividade do GitHub
 */
async function getGitHubActivity() {
  try {
    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username: USERNAME,
      per_page: 10,
    })

    if (events.length === 0) {
      return { lastActive: "Inativo", activeRepo: null, todayCommits: 0 }
    }

    const lastEvent = events[0]
    const createdAt = new Date(lastEvent.created_at)
    const now = new Date()
    const diffMinutes = Math.floor((now - createdAt) / (1000 * 60))

    let lastActive
    if (diffMinutes < 60) {
      lastActive = `${diffMinutes} min atrás`
    } else if (diffMinutes < 1440) {
      lastActive = `${Math.floor(diffMinutes / 60)}h atrás`
    } else {
      lastActive = `${Math.floor(diffMinutes / 1440)}d atrás`
    }

    const activeRepo = lastEvent.repo ? lastEvent.repo.name.split("/")[1] : null

    // Contar commits de hoje
    const today = new Date().toISOString().split("T")[0]
    const todayCommits = events.filter(
      (event) => event.type === "PushEvent" && event.created_at.startsWith(today),
    ).length

    return { lastActive, activeRepo, todayCommits }
  } catch (error) {
    console.error("Erro ao obter atividade do GitHub:", error)
    return { lastActive: "Desconhecido", activeRepo: null, todayCommits: 0 }
  }
}

/**
 * Analisa commits recentes para detectar linguagem principal
 */
async function getTopLanguageFromCommits() {
  try {
    // Obter repositórios do usuário
    const { data: repos } = await octokit.repos.listForUser({
      username: USERNAME,
      sort: "updated",
      per_page: 5,
    })

    if (repos.length === 0) return null

    // Obter linguagens do repositório mais ativo
    const { data: languages } = await octokit.repos.listLanguages({
      owner: USERNAME,
      repo: repos[0].name,
    })

    // Encontrar linguagem principal
    const topLanguage = Object.keys(languages).reduce((a, b) => (languages[a] > languages[b] ? a : b))

    return topLanguage
  } catch (error) {
    console.error("Erro ao obter linguagens:", error)
    return null
  }
}

/**
 * Calcula tempo estimado de codificação baseado em commits
 */
async function estimateCodingTime() {
  try {
    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username: USERNAME,
      per_page: 50,
    })

    const pushEvents = events.filter((event) => event.type === "PushEvent")

    if (pushEvents.length < 2) return 0

    // Calcular intervalos entre commits
    let totalMinutes = 0
    let sessions = 0

    for (let i = 0; i < pushEvents.length - 1; i++) {
      const current = new Date(pushEvents[i].created_at)
      const next = new Date(pushEvents[i + 1].created_at)
      const diffMinutes = Math.abs(current - next) / (1000 * 60)

      // Considerar como sessão se intervalo for menor que 4 horas
      if (diffMinutes <= 240) {
        totalMinutes += diffMinutes
        sessions++
      }
    }

    // Estimar tempo médio de sessão
    const avgSessionTime = sessions > 0 ? totalMinutes / sessions : 0
    const estimatedHours = Math.round((avgSessionTime / 60) * 10) / 10

    return estimatedHours
  } catch (error) {
    console.error("Erro ao calcular tempo de codificação:", error)
    return 0
  }
}

/**
 * Detecta o "Dev Cronotipo" baseado em horários de commit
 */
async function detectDevCronotipo() {
  try {
    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username: USERNAME,
      per_page: 100,
    })

    const pushEvents = events.filter((event) => event.type === "PushEvent")

    if (pushEvents.length === 0) return "Desconhecido"

    // Analisar horários dos commits
    const hours = pushEvents.map((event) => {
      const date = new Date(event.created_at)
      return date.getHours()
    })

    // Calcular horário médio
    const avgHour = hours.reduce((sum, hour) => sum + hour, 0) / hours.length

    // Determinar cronotipo
    if (avgHour >= 6 && avgHour < 12) {
      return "Matinal ☀️"
    } else if (avgHour >= 12 && avgHour < 18) {
      return "Vespertino 🌅"
    } else if (avgHour >= 18 && avgHour < 24) {
      return "Noturno 🌙"
    } else {
      return "Madrugador 🦉"
    }
  } catch (error) {
    console.error("Erro ao detectar cronotipo:", error)
    return "Desconhecido"
  }
}

/**
 * Gera os badges de status
 */
async function generateStatusBadges() {
  console.log("Gerando status de presença...")

  // Obter dados de atividade
  const [githubActivity, topLanguage, codingTime, cronotipo] = await Promise.all([
    getGitHubActivity(),
    getTopLanguageFromCommits(),
    estimateCodingTime(),
    detectDevCronotipo(),
  ])

  // Criar objeto de status
  const status = {
    lastUpdated: new Date().toISOString(),
    github: {
      lastActive: githubActivity.lastActive,
      activeRepo: githubActivity.activeRepo,
      todayCommits: githubActivity.todayCommits,
    },
    coding: {
      topLanguage: topLanguage,
      estimatedHours: codingTime,
      cronotipo: cronotipo,
    },
    badges: [],
  }

  // Gerar badges
  if (topLanguage) {
    status.badges.push({
      text: `🧑‍💻 Focado em: ${topLanguage}`,
      color: "61DAFB",
      logo: "visualstudiocode",
      logoColor: "white",
    })
  }

  if (githubActivity.todayCommits > 0) {
    status.badges.push({
      text: `📝 ${githubActivity.todayCommits} commits hoje`,
      color: "4CAF50",
      logo: "git",
      logoColor: "white",
    })
  }

  if (githubActivity.activeRepo) {
    status.badges.push({
      text: `🚀 Projeto: ${githubActivity.activeRepo}`,
      color: "6E56CF",
      logo: "github",
      logoColor: "white",
    })
  }

  status.badges.push({
    text: `⏱️ Última atividade: ${githubActivity.lastActive}`,
    color: githubActivity.lastActive.includes("min") ? "4CAF50" : "FF9800",
    logo: "clockify",
    logoColor: "white",
  })

  if (codingTime > 0) {
    status.badges.push({
      text: `⚡ ~${codingTime}h de código estimado`,
      color: "9C27B0",
      logo: "lightning",
      logoColor: "white",
    })
  }

  status.badges.push({
    text: `🧭 Dev ${cronotipo}`,
    color: "FF5722",
    logo: "clock",
    logoColor: "white",
  })

  // Salvar dados
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(status, null, 2))

  console.log("Status de presença gerado com sucesso!")
  console.log(`- Linguagem principal: ${topLanguage || "N/A"}`)
  console.log(`- Commits hoje: ${githubActivity.todayCommits}`)
  console.log(`- Tempo estimado: ${codingTime}h`)
  console.log(`- Cronotipo: ${cronotipo}`)

  return status
}

// Executar
generateStatusBadges().catch(console.error)
