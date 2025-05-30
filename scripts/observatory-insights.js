/**
 * Observatório Dev - Insights Semanais
 * Gera insights automáticos sobre padrões de desenvolvimento
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
 * Analisa padrões de commit para detectar cronotipo
 */
async function analyzeDevCronotipo() {
  try {
    const octokit = await createOctokit()

    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username: USERNAME,
      per_page: 100,
    })

    const pushEvents = events.filter((event) => event.type === "PushEvent")

    if (pushEvents.length === 0) {
      return {
        type: "Desconhecido",
        peakStart: 9,
        peakEnd: 17,
        distribution: {},
        totalCommits: 0,
      }
    }

    // Analisar distribuição por hora
    const hourDistribution = {}
    for (let i = 0; i < 24; i++) {
      hourDistribution[i] = 0
    }

    pushEvents.forEach((event) => {
      const date = new Date(event.created_at)
      const hour = date.getHours()
      hourDistribution[hour]++
    })

    // Encontrar período de maior atividade
    let maxCommits = 0
    let peakHour = 9

    Object.entries(hourDistribution).forEach(([hour, commits]) => {
      if (commits > maxCommits) {
        maxCommits = commits
        peakHour = Number.parseInt(hour)
      }
    })

    // Determinar cronotipo baseado no pico
    let cronotipo
    let peakStart, peakEnd

    if (peakHour >= 6 && peakHour < 12) {
      cronotipo = "matinal"
      peakStart = 6
      peakEnd = 12
    } else if (peakHour >= 12 && peakHour < 18) {
      cronotipo = "vespertino"
      peakStart = 12
      peakEnd = 18
    } else if (peakHour >= 18 && peakHour < 24) {
      cronotipo = "noturno"
      peakStart = 18
      peakEnd = 24
    } else {
      cronotipo = "madrugador"
      peakStart = 0
      peakEnd = 6
    }

    return {
      type: cronotipo,
      peakStart,
      peakEnd,
      distribution: hourDistribution,
      totalCommits: pushEvents.length,
      peakHour,
    }
  } catch (error) {
    console.error("Erro ao analisar cronotipo:", error)
    return {
      type: "Desconhecido",
      peakStart: 9,
      peakEnd: 17,
      distribution: {},
      totalCommits: 0,
    }
  }
}

/**
 * Calcula XP e level baseado na atividade
 */
function calculateGamification(weeklyData, cronotipo) {
  let totalXP = 0

  // XP por commits (10 XP por commit)
  const totalCommits = cronotipo.totalCommits
  totalXP += totalCommits * 10

  // XP por consistência (100 XP por dia ativo)
  const activeDays = Math.min(totalCommits, 30) // Máximo 30 dias
  totalXP += activeDays * 100

  // XP por cronotipo especial
  if (cronotipo.type === "madrugador") totalXP += 200 // Bonus por dedicação extrema
  if (cronotipo.totalCommits > 50) totalXP += 300 // Bonus por alta produtividade

  // Calcular level (cada 1000 XP = 1 level)
  const level = Math.floor(totalXP / 1000) + 1

  // Determinar título baseado no level
  let title
  if (level >= 10) title = "Code Architect"
  else if (level >= 8) title = "Senior Developer"
  else if (level >= 6) title = "Full Stack Developer"
  else if (level >= 4) title = "Frontend Specialist"
  else if (level >= 2) title = "Junior Developer"
  else title = "Code Apprentice"

  // Gerar badges conquistados
  const badges = []
  if (totalCommits >= 50) badges.push("🏆 Commit Master")
  if (activeDays >= 7) badges.push("⚡ Consistency King")
  if (cronotipo.type === "madrugador") badges.push("🦉 Night Owl")
  if (cronotipo.type === "matinal") badges.push("☀️ Early Bird")

  return {
    totalXP,
    level,
    title,
    badges,
    stats: {
      totalCommits,
      activeDays,
    },
  }
}

/**
 * Gera insights usando templates inteligentes
 */
function generateInsights(cronotipo, gamification) {
  const insights = []

  // Insight sobre cronotipo
  const cronotypeInsights = {
    matinal: `Esta semana você foi um verdadeiro Dev Matinal ☀️! Sua produtividade máxima foi entre ${cronotipo.peakStart}h e ${cronotipo.peakEnd}h.`,
    vespertino: `Tarde produtiva! Você se destacou como Dev Vespertino 🌅 com pico entre ${cronotipo.peakStart}h e ${cronotipo.peakEnd}h.`,
    noturno: `Coruja do código! Você é um Dev Noturno 🌙 com ${cronotipo.totalCommits} commits entre ${cronotipo.peakStart}h e ${cronotipo.peakEnd}h.`,
    madrugador: `Insônia produtiva! Você é um Dev Madrugador 🦉 com atividade entre ${cronotipo.peakStart}h e ${cronotipo.peakEnd}h.`,
  }

  insights.push(cronotypeInsights[cronotipo.type] || "Padrão de desenvolvimento único!")

  // Insight sobre gamificação
  if (gamification.badges.length > 0) {
    const latestBadge = gamification.badges[gamification.badges.length - 1]
    insights.push(`🎉 Conquista desbloqueada: ${latestBadge}!`)
  }

  // Insight sobre produtividade
  if (cronotipo.totalCommits > 20) {
    insights.push(`🚀 Semana produtiva com ${cronotipo.totalCommits} commits! Você está no ritmo certo.`)
  }

  return insights
}

/**
 * Lê metas da semana do arquivo .devgoals.yml
 */
function readWeeklyGoals() {
  const goalsFile = path.join(__dirname, "../.devgoals.yml")

  if (!fs.existsSync(goalsFile)) {
    // Criar arquivo de exemplo se não existir
    const exampleGoals = `# Metas da Semana
goals:
  - name: "Finalizar feature de autenticação"
    progress: 80
    target: 100
  - name: "Estudar Three.js"
    progress: 30
    target: 100
  - name: "Refatorar componentes React"
    progress: 60
    target: 100
  - name: "Escrever testes unitários"
    progress: 40
    target: 100

# Metas de longo prazo
long_term:
  - name: "Dominar TypeScript"
    progress: 75
  - name: "Contribuir para open source"
    progress: 45
`

    fs.writeFileSync(goalsFile, exampleGoals)
    console.log("Arquivo .devgoals.yml criado com metas de exemplo")
  }

  try {
    const content = fs.readFileSync(goalsFile, "utf8")
    // Parse simples do YAML (apenas para este caso específico)
    const goals = []
    const lines = content.split("\n")
    let currentGoal = null

    lines.forEach((line) => {
      const trimmed = line.trim()
      if (trimmed.startsWith("- name:")) {
        if (currentGoal) goals.push(currentGoal)
        currentGoal = {
          name: trimmed.match(/"([^"]+)"/)?.[1] || "Meta sem nome",
          progress: 0,
          target: 100,
        }
      } else if (trimmed.startsWith("progress:") && currentGoal) {
        currentGoal.progress = Number.parseInt(trimmed.split(":")[1].trim()) || 0
      } else if (trimmed.startsWith("target:") && currentGoal) {
        currentGoal.target = Number.parseInt(trimmed.split(":")[1].trim()) || 100
      }
    })

    if (currentGoal) goals.push(currentGoal)

    return goals
  } catch (error) {
    console.error("Erro ao ler metas:", error)
    return []
  }
}

/**
 * Gera relatório completo do observatório
 */
async function generateObservatoryReport() {
  console.log("Gerando relatório do Observatório Dev...")

  try {
    // Analisar cronotipo
    const cronotipo = await analyzeDevCronotipo()

    // Calcular gamificação
    const gamification = calculateGamification({}, cronotipo)

    // Gerar insights
    const insights = generateInsights(cronotipo, gamification)

    // Ler metas da semana
    const weeklyGoals = readWeeklyGoals()

    // Criar relatório completo
    const report = {
      week: new Date().toISOString().split("T")[0],
      cronotipo,
      gamification,
      insights,
      weeklyGoals,
      summary: {
        totalCommits: cronotipo.totalCommits,
        activeHours: `${cronotipo.peakStart}h - ${cronotipo.peakEnd}h`,
        level: gamification.level,
        title: gamification.title,
        xp: gamification.totalXP,
      },
      lastUpdated: new Date().toISOString(),
    }

    // Salvar relatório
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    fs.writeFileSync(path.join(OUTPUT_DIR, "observatory-report.json"), JSON.stringify(report, null, 2))

    console.log("Relatório do Observatório gerado com sucesso!")
    console.log(`Level: ${gamification.level} - ${gamification.title}`)
    console.log(`XP Total: ${gamification.totalXP}`)
    console.log(`Cronotipo: Dev ${cronotipo.type} (${cronotipo.peakStart}h-${cronotipo.peakEnd}h)`)

    return report
  } catch (error) {
    console.error("Erro ao gerar relatório:", error)
    throw error
  }
}

// Executar
generateObservatoryReport().catch(console.error)
