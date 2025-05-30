/**
 * Analytics Avançado - Métricas mais profundas
 */

const fs = require("fs")
const path = require("path")
const { Octokit } = require("@octokit/rest")

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const USERNAME = process.env.GITHUB_REPOSITORY_OWNER || "PedroReoli"
const OUTPUT_DIR = path.join(__dirname, "../assets")

const octokit = new Octokit({ auth: GITHUB_TOKEN })

/**
 * Análise de qualidade de código
 */
async function analyzeCodeQuality() {
  try {
    const { data: repos } = await octokit.repos.listForUser({
      username: USERNAME,
      sort: "updated",
      per_page: 10,
    })

    const qualityMetrics = {
      avgFileSize: 0,
      totalLines: 0,
      complexityScore: 0,
      documentationRatio: 0,
      testCoverage: 0,
    }

    for (const repo of repos) {
      try {
        // Analisar estrutura do repositório
        const { data: contents } = await octokit.repos.getContent({
          owner: USERNAME,
          repo: repo.name,
          path: "",
        })

        let totalFiles = 0
        let totalSize = 0
        let docFiles = 0
        let testFiles = 0

        for (const item of contents) {
          if (item.type === "file") {
            totalFiles++
            totalSize += item.size || 0

            // Detectar arquivos de documentação
            if (item.name.match(/\.(md|txt|rst)$/i)) {
              docFiles++
            }

            // Detectar arquivos de teste
            if (item.name.match(/\.(test|spec)\./i) || item.path?.includes("test")) {
              testFiles++
            }
          }
        }

        // Calcular métricas
        qualityMetrics.avgFileSize += totalFiles > 0 ? totalSize / totalFiles : 0
        qualityMetrics.documentationRatio += totalFiles > 0 ? docFiles / totalFiles : 0
        qualityMetrics.testCoverage += totalFiles > 0 ? testFiles / totalFiles : 0
      } catch (error) {
        console.log(`Erro ao analisar ${repo.name}: ${error.message}`)
      }
    }

    // Calcular médias
    const repoCount = repos.length
    qualityMetrics.avgFileSize = Math.round(qualityMetrics.avgFileSize / repoCount)
    qualityMetrics.documentationRatio = Math.round((qualityMetrics.documentationRatio / repoCount) * 100)
    qualityMetrics.testCoverage = Math.round((qualityMetrics.testCoverage / repoCount) * 100)

    return qualityMetrics
  } catch (error) {
    console.error("Erro na análise de qualidade:", error)
    return null
  }
}

/**
 * Análise de colaboração
 */
async function analyzeCollaboration() {
  try {
    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username: USERNAME,
      per_page: 100,
    })

    const collaboration = {
      pullRequests: 0,
      issues: 0,
      reviews: 0,
      forks: 0,
      collaborators: new Set(),
    }

    events.forEach((event) => {
      switch (event.type) {
        case "PullRequestEvent":
          collaboration.pullRequests++
          break
        case "IssuesEvent":
          collaboration.issues++
          break
        case "PullRequestReviewEvent":
          collaboration.reviews++
          break
        case "ForkEvent":
          collaboration.forks++
          break
      }

      // Rastrear colaboradores únicos
      if (event.actor && event.actor.login !== USERNAME) {
        collaboration.collaborators.add(event.actor.login)
      }
    })

    collaboration.collaborators = collaboration.collaborators.size

    return collaboration
  } catch (error) {
    console.error("Erro na análise de colaboração:", error)
    return null
  }
}

/**
 * Heatmap de atividade por hora
 */
async function generateActivityHeatmap() {
  try {
    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username: USERNAME,
      per_page: 100,
    })

    // Matriz 24h x 7 dias
    const heatmap = Array(7)
      .fill()
      .map(() => Array(24).fill(0))

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    events
      .filter((event) => event.type === "PushEvent")
      .forEach((event) => {
        const date = new Date(event.created_at)
        const day = date.getDay()
        const hour = date.getHours()
        heatmap[day][hour]++
      })

    // Encontrar pico de atividade
    let maxActivity = 0
    let peakDay = 0
    let peakHour = 0

    heatmap.forEach((day, dayIndex) => {
      day.forEach((hour, hourIndex) => {
        if (hour > maxActivity) {
          maxActivity = hour
          peakDay = dayIndex
          peakHour = hourIndex
        }
      })
    })

    return {
      heatmap,
      peak: {
        day: dayNames[peakDay],
        hour: peakHour,
        activity: maxActivity,
      },
    }
  } catch (error) {
    console.error("Erro no heatmap:", error)
    return null
  }
}

/**
 * Sugestões inteligentes
 */
function generateSmartSuggestions(analytics) {
  const suggestions = []

  // Sugestões baseadas em qualidade
  if (analytics.quality) {
    if (analytics.quality.documentationRatio < 30) {
      suggestions.push({
        type: "documentation",
        priority: "high",
        message: "Consider adding more documentation to your projects (README, comments)",
        action: "Add README files and inline documentation",
      })
    }

    if (analytics.quality.testCoverage < 20) {
      suggestions.push({
        type: "testing",
        priority: "medium",
        message: "Your projects could benefit from more test coverage",
        action: "Add unit tests and integration tests",
      })
    }
  }

  // Sugestões baseadas em colaboração
  if (analytics.collaboration) {
    if (analytics.collaboration.pullRequests < 5) {
      suggestions.push({
        type: "collaboration",
        priority: "medium",
        message: "Try contributing to more open source projects",
        action: "Find projects on GitHub and submit PRs",
      })
    }
  }

  // Sugestões baseadas em atividade
  if (analytics.heatmap) {
    const { peak } = analytics.heatmap
    suggestions.push({
      type: "productivity",
      priority: "low",
      message: `Your peak coding time is ${peak.day} at ${peak.hour}:00`,
      action: "Schedule important coding tasks during peak hours",
    })
  }

  return suggestions
}

/**
 * Gerar relatório completo
 */
async function generateAdvancedAnalytics() {
  console.log("🔍 Gerando analytics avançado...")

  const analytics = {
    quality: await analyzeCodeQuality(),
    collaboration: await analyzeCollaboration(),
    heatmap: await generateActivityHeatmap(),
    timestamp: new Date().toISOString(),
  }

  analytics.suggestions = generateSmartSuggestions(analytics)

  // Salvar dados
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUTPUT_DIR, "advanced-analytics.json"), JSON.stringify(analytics, null, 2))

  console.log("✅ Analytics avançado gerado!")
  console.log(`📊 Qualidade média: ${analytics.quality?.documentationRatio || 0}% documentação`)
  console.log(`🤝 Colaboração: ${analytics.collaboration?.collaborators || 0} colaboradores únicos`)
  console.log(
    `⏰ Pico de atividade: ${analytics.heatmap?.peak?.day || "N/A"} às ${analytics.heatmap?.peak?.hour || 0}h`,
  )

  return analytics
}

// Executar
generateAdvancedAnalytics().catch(console.error)
