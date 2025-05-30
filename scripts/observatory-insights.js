/**
 * Observatório Dev - Insights Semanais
 * Gera insights automáticos sobre padrões de desenvolvimento
 */

const fs = require("fs")
const path = require("path")
const { Octokit } = require("@octokit/rest")

// Configuração
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const USERNAME = process.env.GITHUB_REPOSITORY_OWNER || "PedroReoli"
const OUTPUT_DIR = path.join(__dirname, "../assets")

// Templates de insights
const INSIGHT_TEMPLATES = {
  matinal: [
    "Esta semana você foi um verdadeiro Dev Matinal ☀️! Sua produtividade máxima foi entre {peak_start}h e {peak_end}h.",
    "Começando cedo! Você mostrou ser um Dev Matinal ☀️ com {commits} commits entre {peak_start}h e {peak_end}h.",
    "Madrugador produtivo! Seu perfil matinal ☀️ rendeu {commits} commits nas primeiras horas do dia.",
  ],
  vespertino: [
    "Tarde produtiva! Você se destacou como Dev Vespertino 🌅 com pico entre {peak_start}h e {peak_end}h.",
    "Ritmo da tarde! Seu perfil vespertino 🌅 gerou {commits} commits no período mais produtivo.",
    "Energia da tarde! Como Dev Vespertino 🌅, você manteve consistência entre {peak_start}h e {peak_end}h.",
  ],
  noturno: [
    "Coruja do código! Você é um Dev Noturno 🌙 com {commits} commits entre {peak_start}h e {peak_end}h.",
    "Noites produtivas! Seu perfil noturno 🌙 brilhou com atividade intensa após as {peak_start}h.",
    "Energia noturna! Como Dev Noturno 🌙, você transformou a madrugada em código produtivo.",
  ],
  madrugador: [
    "Insônia produtiva! Você é um Dev Madrugador 🦉 com atividade entre {peak_start}h e {peak_end}h.",
    "Sem hora para parar! Seu perfil de madrugador 🦉 gerou {commits} commits nas horas mais silenciosas.",
    "Dedicação extrema! Como Dev Madrugador 🦉, você codifica quando o mundo dorme.",
  ],
}

const LANGUAGE_INSIGHTS = {
  JavaScript: [
    "JavaScript continua sendo sua linguagem de confiança com {count} commits.",
    "Dominando o ecossistema JS com {count} commits esta semana.",
    "JavaScript em alta! {count} commits mostram sua expertise crescente.",
  ],
  TypeScript: [
    "TypeScript está se tornando seu superpoder com {count} commits!",
    "Tipagem forte em foco! {count} commits em TypeScript esta semana.",
    "Evoluindo com TypeScript: {count} commits de código tipado.",
  ],
  React: [
    "React continua sendo sua paixão com {count} commits em componentes.",
    "Construindo interfaces incríveis! {count} commits em React esta semana.",
    "Componentização em alta! {count} commits mostram seu domínio em React.",
  ],
  Python: [
    "Python versátil! {count} commits explorando suas possibilidades.",
    "Simplicidade e poder: {count} commits em Python esta semana.",
    "Pythônico por natureza! {count} commits de código limpo e eficiente.",
  ],
  "C#": [
    "C# enterprise! {count} commits construindo soluções robustas.",
    "Orientação a objetos em ação: {count} commits em C# esta semana.",
    "Ecossistema .NET em foco com {count} commits produtivos.",
  ],
}

const ACHIEVEMENT_TEMPLATES = [
  "🏆 Conquistou o badge 'Commit Streak' com {streak} dias consecutivos!",
  "🎯 Desbloqueou 'Language Master' dominando {languages} linguagens!",
  "⚡ Ganhou 'Speed Coder' com {commits} commits em um único dia!",
  "🌟 Alcançou 'Project Juggler' trabalhando em {projects} projetos!",
  "🔥 Obteve 'Night Owl' com {night_commits} commits noturnos!",
  "☀️ Conquistou 'Early Bird' com {morning_commits} commits matinais!",
]

// Inicialização do Octokit
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

/**
 * Analisa padrões de commit para detectar cronotipo
 */
async function analyzeDevCronotipo() {
  try {
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
  const totalCommits = Object.values(weeklyData.weeklyData).reduce((sum, week) => sum + week.totalCommits, 0)
  totalXP += totalCommits * 10

  // XP por linguagens diferentes (50 XP por linguagem)
  const uniqueLanguages = new Set()
  Object.values(weeklyData.weeklyData).forEach((week) => {
    Object.keys(week.languages).forEach((lang) => uniqueLanguages.add(lang))
  })
  totalXP += uniqueLanguages.size * 50

  // XP por consistência (100 XP por dia ativo)
  const activeDays = Object.values(weeklyData.weeklyData).filter((week) => week.totalCommits > 0).length
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
  if (uniqueLanguages.size >= 5) badges.push("🎯 Polyglot")
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
      uniqueLanguages: uniqueLanguages.size,
      activeDays,
    },
  }
}

/**
 * Gera insights usando templates inteligentes
 */
function generateInsights(weeklyData, cronotipo, gamification) {
  const insights = []

  // Insight sobre cronotipo
  const cronotypeTemplates = INSIGHT_TEMPLATES[cronotipo.type] || INSIGHT_TEMPLATES.matinal
  const cronotypeTemplate = cronotypeTemplates[Math.floor(Math.random() * cronotypeTemplates.length)]

  const cronotypeInsight = cronotypeTemplate
    .replace("{peak_start}", cronotipo.peakStart)
    .replace("{peak_end}", cronotipo.peakEnd)
    .replace("{commits}", cronotipo.totalCommits)

  insights.push(cronotypeInsight)

  // Insight sobre linguagem principal
  const currentWeek = Math.max(...Object.keys(weeklyData.weeklyData).map(Number))
  const currentLanguages = weeklyData.weeklyData[currentWeek].languages

  if (Object.keys(currentLanguages).length > 0) {
    const topLanguage = Object.entries(currentLanguages).sort((a, b) => b[1] - a[1])[0]
    const [language, count] = topLanguage

    const languageTemplates = LANGUAGE_INSIGHTS[language] || [
      `${language} em destaque com {count} commits esta semana!`,
    ]
    const languageTemplate = languageTemplates[Math.floor(Math.random() * languageTemplates.length)]

    const languageInsight = languageTemplate.replace("{count}", count)
    insights.push(languageInsight)
  }

  // Insight sobre gamificação
  if (gamification.badges.length > 0) {
    const latestBadge = gamification.badges[gamification.badges.length - 1]
    insights.push(`🎉 Conquista desbloqueada: ${latestBadge}!`)
  }

  // Insight sobre evolução
  if (weeklyData.trends && Object.keys(weeklyData.trends.languages).length > 0) {
    const trendingUp = Object.entries(weeklyData.trends.languages)
      .filter(([_, data]) => data.trend === "up")
      .sort((a, b) => b[1].change - a[1].change)

    if (trendingUp.length > 0) {
      const [language, data] = trendingUp[0]
      insights.push(`📈 ${language} em alta! Crescimento de +${data.change} commits esta semana.`)
    }
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
    // Carregar dados existentes
    const skillFile = path.join(OUTPUT_DIR, "skill-evolution.json")
    let weeklyData = { weeklyData: {}, trends: {} }

    if (fs.existsSync(skillFile)) {
      weeklyData = JSON.parse(fs.readFileSync(skillFile, "utf8"))
    }

    // Analisar cronotipo
    const cronotipo = await analyzeDevCronotipo()

    // Calcular gamificação
    const gamification = calculateGamification(weeklyData, cronotipo)

    // Gerar insights
    const insights = generateInsights(weeklyData, cronotipo, gamification)

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
