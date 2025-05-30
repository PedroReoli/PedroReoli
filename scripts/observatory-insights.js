/**
 * Observatório Dev - Insights Semanais Corrigidos
 * Gera insights em primeira pessoa e horários do Brasil
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
 * Analisa padrões de commit para detectar cronotipo (horário do Brasil)
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

    // Analisar distribuição por hora (convertendo para horário do Brasil - UTC-3)
    const hourDistribution = {}
    for (let i = 0; i < 24; i++) {
      hourDistribution[i] = 0
    }

    pushEvents.forEach((event) => {
      const utcDate = new Date(event.created_at)
      // Converter para horário do Brasil (UTC-3)
      const brazilDate = new Date(utcDate.getTime() - 3 * 60 * 60 * 1000)
      const hour = brazilDate.getHours()
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

    // Determinar cronotipo baseado no pico (horário do Brasil)
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
 * Gera insights usando templates em primeira pessoa
 */
function generateInsights(cronotipo) {
  const insights = []

  // Insight sobre cronotipo em primeira pessoa
  const cronotypeInsights = {
    matinal: `Esta semana fui um verdadeiro Dev Matinal! Minha produtividade máxima foi entre ${cronotipo.peakStart}h e ${cronotipo.peakEnd}h (horário de Brasília).`,
    vespertino: `Tarde produtiva! Me destaquei como Dev Vespertino com pico entre ${cronotipo.peakStart}h e ${cronotipo.peakEnd}h (horário de Brasília).`,
    noturno: `Coruja do código! Sou um Dev Noturno com ${cronotipo.totalCommits} commits entre ${cronotipo.peakStart}h e ${cronotipo.peakEnd}h (horário de Brasília).`,
    madrugador: `Insônia produtiva! Sou um Dev Madrugador com atividade entre ${cronotipo.peakStart}h e ${cronotipo.peakEnd}h (horário de Brasília).`,
  }

  insights.push(cronotypeInsights[cronotipo.type] || "Padrão de desenvolvimento único!")

  // Insight sobre produtividade em primeira pessoa
  if (cronotipo.totalCommits > 20) {
    insights.push(`Semana produtiva com ${cronotipo.totalCommits} commits! Estou no ritmo certo.`)
  } else if (cronotipo.totalCommits > 10) {
    insights.push(`Mantive um bom ritmo com ${cronotipo.totalCommits} commits esta semana.`)
  } else {
    insights.push(`Semana mais tranquila com ${cronotipo.totalCommits} commits. Foco na qualidade!`)
  }

  return insights
}

/**
 * Gera relatório simplificado do observatório
 */
async function generateObservatoryReport() {
  console.log("Gerando relatório simplificado do Observatório Dev...")

  try {
    // Analisar cronotipo
    const cronotipo = await analyzeDevCronotipo()

    // Gerar insights em primeira pessoa
    const insights = generateInsights(cronotipo)

    // Criar relatório simplificado
    const report = {
      week: new Date().toISOString().split("T")[0],
      cronotipo,
      insights,
      summary: {
        totalCommits: cronotipo.totalCommits,
        activeHours: `${cronotipo.peakStart}h - ${cronotipo.peakEnd}h (Brasília)`,
        type: cronotipo.type,
      },
      lastUpdated: new Date().toISOString(),
    }

    // Salvar relatório
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    fs.writeFileSync(path.join(OUTPUT_DIR, "observatory-report.json"), JSON.stringify(report, null, 2))

    console.log("Relatório do Observatório gerado com sucesso!")
    console.log(`Cronotipo: Dev ${cronotipo.type} (${cronotipo.peakStart}h-${cronotipo.peakEnd}h Brasília)`)
    console.log(`Total de commits: ${cronotipo.totalCommits}`)

    return report
  } catch (error) {
    console.error("Erro ao gerar relatório:", error)
    throw error
  }
}

// Executar
generateObservatoryReport().catch(console.error)
