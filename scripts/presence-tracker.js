/**
 * Status de Presença Online - V2.5 (100% Gratuito)
 * Gera badges dinâmicos usando apenas GitHub API
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
    const octokit = await createOctokit()

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

    if (Object.keys(languages).length === 0) return null

    // Encontrar linguagem principal
    const topLanguage = Object.keys(languages).reduce((a, b) => (languages[a] > languages[b] ? a : b))

    return topLanguage
  } catch (error) {
    console.error("Erro ao obter linguagens:", error)
    return null
  }
}

/**
 * Detecta o "Dev Cronotipo" baseado em horários de commit
 */
async function detectDevCronotipo() {
  try {
    const octokit = await createOctokit()

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
  const [githubActivity, topLanguage, cronotipo] = await Promise.all([
    getGitHubActivity(),
    getTopLanguageFromCommits(),
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
  console.log(`- Cronotipo: ${cronotipo}`)

  return status
}

// Executar
generateStatusBadges().catch(console.error)
