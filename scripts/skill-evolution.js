/**
 * Skill Evolution Tracker
 * Analisa commits para detectar evolução de linguagens e tecnologias
 */

const fs = require("fs")
const path = require("path")
const { Octokit } = require("@octokit/rest")

// Configuração
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const USERNAME = process.env.GITHUB_REPOSITORY_OWNER || "PedroReoli"
const DAYS_TO_ANALYZE = 30
const OUTPUT_DIR = path.join(__dirname, "../assets")

// Mapeamento de extensões para linguagens
const FILE_EXTENSIONS = {
  js: "JavaScript",
  jsx: "React",
  ts: "TypeScript",
  tsx: "React/TypeScript",
  py: "Python",
  cs: "C#",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  json: "JSON",
  md: "Markdown",
  yml: "YAML",
  yaml: "YAML",
  sql: "SQL",
  sh: "Shell",
  java: "Java",
  rb: "Ruby",
  php: "PHP",
  go: "Go",
  rs: "Rust",
  swift: "Swift",
  kt: "Kotlin",
  dart: "Dart",
  vue: "Vue",
  svelte: "Svelte",
}

// Mapeamento de frameworks/bibliotecas baseado em imports e dependências
const FRAMEWORK_PATTERNS = {
  react: "React",
  next: "Next.js",
  vue: "Vue.js",
  angular: "Angular",
  svelte: "Svelte",
  express: "Express",
  nest: "NestJS",
  django: "Django",
  flask: "Flask",
  tailwind: "Tailwind",
  bootstrap: "Bootstrap",
  "material-ui": "Material UI",
  chakra: "Chakra UI",
  "three.js": "Three.js",
  "framer-motion": "Framer Motion",
  redux: "Redux",
  zustand: "Zustand",
  recoil: "Recoil",
  jotai: "Jotai",
  prisma: "Prisma",
  mongoose: "Mongoose",
  sequelize: "Sequelize",
  typeorm: "TypeORM",
  supabase: "Supabase",
  firebase: "Firebase",
  apollo: "Apollo",
  graphql: "GraphQL",
  jest: "Jest",
  cypress: "Cypress",
  playwright: "Playwright",
  storybook: "Storybook",
  webpack: "Webpack",
  vite: "Vite",
  docker: "Docker",
  kubernetes: "Kubernetes",
  aws: "AWS",
  azure: "Azure",
  gcp: "GCP",
  vercel: "Vercel",
  netlify: "Netlify",
}

// Cores para as linguagens
const LANGUAGE_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  React: "#61dafb",
  "React/TypeScript": "#61dafb",
  Python: "#3776ab",
  "C#": "#239120",
  HTML: "#e34c26",
  CSS: "#264de4",
  SCSS: "#c6538c",
  "Next.js": "#000000",
  "Vue.js": "#4fc08d",
  Angular: "#dd0031",
  Svelte: "#ff3e00",
  Express: "#000000",
  NestJS: "#e0234e",
  Django: "#092e20",
  Flask: "#000000",
  Tailwind: "#06b6d4",
  Bootstrap: "#7952b3",
  "Three.js": "#000000",
  "Framer Motion": "#0055ff",
  default: "#6e56cf",
}

// Inicialização do Octokit
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

/**
 * Obtém a data de N dias atrás
 */
function getDateDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split("T")[0]
}

/**
 * Detecta linguagem baseada na extensão do arquivo
 */
function detectLanguage(filename) {
  const extension = filename.split(".").pop().toLowerCase()
  return FILE_EXTENSIONS[extension] || "Outro"
}

/**
 * Detecta frameworks/bibliotecas baseado no conteúdo do arquivo
 */
function detectFrameworks(content) {
  const frameworks = new Set()

  if (!content) return []

  Object.entries(FRAMEWORK_PATTERNS).forEach(([pattern, framework]) => {
    if (content.toLowerCase().includes(pattern.toLowerCase())) {
      frameworks.add(framework)
    }
  })

  return Array.from(frameworks)
}

/**
 * Analisa commits para detectar linguagens e frameworks
 */
async function analyzeCommits() {
  console.log(`Analisando commits dos últimos ${DAYS_TO_ANALYZE} dias...`)

  try {
    // Obter repositórios do usuário
    const { data: repos } = await octokit.repos.listForUser({
      username: USERNAME,
      sort: "updated",
      per_page: 100,
    })

    const startDate = getDateDaysAgo(DAYS_TO_ANALYZE)
    const today = new Date().toISOString().split("T")[0]

    console.log(`Período de análise: ${startDate} até ${today}`)
    console.log(`Repositórios encontrados: ${repos.length}`)

    // Estrutura para armazenar dados por semana
    const weeklyData = {}
    const currentWeek = Math.floor(DAYS_TO_ANALYZE / 7)

    for (let i = 0; i <= currentWeek; i++) {
      weeklyData[i] = {
        languages: {},
        frameworks: {},
        totalCommits: 0,
      }
    }

    // Analisar commits de cada repositório
    for (const repo of repos.slice(0, 10)) {
      // Limitar a 10 repos para performance
      console.log(`Analisando repositório: ${repo.name}`)

      try {
        // Obter commits
        const { data: commits } = await octokit.repos.listCommits({
          owner: USERNAME,
          repo: repo.name,
          since: `${startDate}T00:00:00Z`,
          until: `${today}T23:59:59Z`,
          per_page: 100,
        })

        console.log(`Commits encontrados: ${commits.length}`)

        // Analisar cada commit
        for (const commit of commits) {
          const commitDate = new Date(commit.commit.author.date)
          const daysSinceStart = Math.floor((new Date(today) - commitDate) / (1000 * 60 * 60 * 24))
          const weekIndex = Math.min(Math.floor(daysSinceStart / 7), currentWeek)

          weeklyData[weekIndex].totalCommits++

          // Obter detalhes do commit
          try {
            const { data: commitData } = await octokit.repos.getCommit({
              owner: USERNAME,
              repo: repo.name,
              ref: commit.sha,
            })

            // Analisar arquivos modificados
            for (const file of commitData.files || []) {
              const language = detectLanguage(file.filename)

              // Incrementar contagem de linguagem
              if (language !== "Outro") {
                weeklyData[weekIndex].languages[language] = (weeklyData[weekIndex].languages[language] || 0) + 1
              }

              // Detectar frameworks (apenas para alguns tipos de arquivos)
              if (
                ["js", "jsx", "ts", "tsx", "py", "cs", "html", "json"].includes(
                  file.filename.split(".").pop().toLowerCase(),
                )
              ) {
                const frameworks = detectFrameworks(file.patch)

                frameworks.forEach((framework) => {
                  weeklyData[weekIndex].frameworks[framework] = (weeklyData[weekIndex].frameworks[framework] || 0) + 1
                })
              }
            }
          } catch (error) {
            console.log(`Erro ao obter detalhes do commit ${commit.sha}: ${error.message}`)
          }
        }
      } catch (error) {
        console.log(`Erro ao analisar repositório ${repo.name}: ${error.message}`)
      }
    }

    // Calcular tendências
    const trends = calculateTrends(weeklyData)

    // Gerar resultados
    const results = {
      period: {
        start: startDate,
        end: today,
        days: DAYS_TO_ANALYZE,
      },
      weeklyData,
      trends,
      lastUpdated: new Date().toISOString(),
    }

    // Salvar resultados
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    fs.writeFileSync(path.join(OUTPUT_DIR, "skill-evolution.json"), JSON.stringify(results, null, 2))

    // Gerar SVGs
    await generateSkillEvolutionSVG(results, "dark")
    await generateSkillEvolutionSVG(results, "light")

    console.log("Análise de skills concluída com sucesso!")
    return results
  } catch (error) {
    console.error("Erro ao analisar commits:", error)
    throw error
  }
}

/**
 * Calcula tendências de uso de linguagens e frameworks
 */
function calculateTrends(weeklyData) {
  const trends = {
    languages: {},
    frameworks: {},
  }

  const weeks = Object.keys(weeklyData)
    .map(Number)
    .sort((a, b) => a - b)

  // Se temos pelo menos 2 semanas de dados
  if (weeks.length >= 2) {
    const currentWeek = Math.max(...weeks)
    const previousWeek = currentWeek - 1

    // Calcular tendências de linguagens
    const currentLanguages = weeklyData[currentWeek].languages
    const previousLanguages = weeklyData[previousWeek].languages

    Object.keys(currentLanguages).forEach((language) => {
      const current = currentLanguages[language] || 0
      const previous = previousLanguages[language] || 0
      const change = current - previous

      let trend
      if (change > 0) trend = "up"
      else if (change < 0) trend = "down"
      else trend = "stable"

      trends.languages[language] = {
        trend,
        change: Math.abs(change),
        current,
        previous,
      }
    })

    // Calcular tendências de frameworks
    const currentFrameworks = weeklyData[currentWeek].frameworks
    const previousFrameworks = weeklyData[previousWeek].frameworks

    Object.keys(currentFrameworks).forEach((framework) => {
      const current = currentFrameworks[framework] || 0
      const previous = previousFrameworks[framework] || 0
      const change = current - previous

      let trend
      if (change > 0) trend = "up"
      else if (change < 0) trend = "down"
      else trend = "stable"

      trends.frameworks[framework] = {
        trend,
        change: Math.abs(change),
        current,
        previous,
      }
    })
  }

  return trends
}

/**
 * Gera SVG para visualização da evolução de skills
 */
async function generateSkillEvolutionSVG(data, theme) {
  const isDark = theme === "dark"

  // Configurações de cores baseadas no tema
  const colors = {
    background: isDark ? "#0d1117" : "#ffffff",
    text: isDark ? "#c9d1d9" : "#24292e",
    grid: isDark ? "#30363d" : "#e1e4e8",
    axis: isDark ? "#8b949e" : "#57606a",
    upTrend: isDark ? "#3fb950" : "#1a7f37",
    downTrend: isDark ? "#f85149" : "#cf222e",
    stableTrend: isDark ? "#f0883e" : "#d29922",
  }

  // Extrair top 5 linguagens da semana atual
  const currentWeek = Math.max(...Object.keys(data.weeklyData).map(Number))
  const currentLanguages = data.weeklyData[currentWeek].languages

  const topLanguages = Object.entries(currentLanguages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language, count]) => ({
      name: language,
      count,
      trend: data.trends.languages[language]?.trend || "stable",
      change: data.trends.languages[language]?.change || 0,
      color: LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default,
    }))

  // Extrair dados semanais para gráfico
  const weeks = Object.keys(data.weeklyData)
    .map(Number)
    .sort((a, b) => a - b)
  const languageData = {}

  topLanguages.forEach((lang) => {
    languageData[lang.name] = weeks.map((week) => {
      return data.weeklyData[week].languages[lang.name] || 0
    })
  })

  // Dimensões do SVG
  const width = 800
  const height = 400
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2 - 60 // Espaço extra para título

  // Calcular escala para o eixo Y
  const maxCount = Math.max(...Object.values(languageData).flat()) || 10
  const yScale = (value) => chartHeight - (value / maxCount) * chartHeight

  // Gerar pontos para cada linha
  const generatePoints = (data) => {
    const pointWidth = chartWidth / (weeks.length - 1 || 1)
    return data
      .map((value, index) => {
        const x = padding + index * pointWidth
        const y = padding + yScale(value)
        return `${x},${y}`
      })
      .join(" ")
  }

  // Gerar linhas de grade
  const gridLines = []
  const gridCount = 5
  for (let i = 0; i <= gridCount; i++) {
    const y = padding + i * (chartHeight / gridCount)
    gridLines.push(
      `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="${colors.grid}" stroke-width="1" stroke-dasharray="5,5" />`,
    )

    const value = Math.round((maxCount / gridCount) * (gridCount - i))
    gridLines.push(
      `<text x="${padding - 10}" y="${y + 5}" text-anchor="end" font-size="12" fill="${colors.axis}">${value}</text>`,
    )
  }

  // Gerar labels do eixo X
  const xLabels = []
  const xLabelWidth = chartWidth / (weeks.length - 1 || 1)
  weeks.forEach((week, index) => {
    const x = padding + index * xLabelWidth
    const weekLabel = `W${week + 1}`
    xLabels.push(
      `<text x="${x}" y="${height - padding + 20}" text-anchor="middle" font-size="12" fill="${colors.axis}">${weekLabel}</text>`,
    )
  })

  // Gerar linhas e pontos para cada linguagem
  const lines = []
  const points = []
  const labels = []

  topLanguages.forEach((lang, index) => {
    const pointsStr = generatePoints(languageData[lang.name])

    // Linha
    lines.push(`<polyline points="${pointsStr}" fill="none" stroke="${lang.color}" stroke-width="2" />`)

    // Pontos
    languageData[lang.name].forEach((value, i) => {
      const pointWidth = chartWidth / (weeks.length - 1 || 1)
      const x = padding + i * pointWidth
      const y = padding + yScale(value)
      points.push(
        `<circle cx="${x}" cy="${y}" r="4" fill="${lang.color}" stroke="${colors.background}" stroke-width="1" />`,
      )
    })

    // Label na legenda
    const legendY = height - 30 + index * 20
    const trendIcon = lang.trend === "up" ? "↑" : lang.trend === "down" ? "↓" : "→"
    const trendColor =
      lang.trend === "up" ? colors.upTrend : lang.trend === "down" ? colors.downTrend : colors.stableTrend

    labels.push(`
      <g>
        <circle cx="${padding + 10}" cy="${legendY}" r="5" fill="${lang.color}" />
        <text x="${padding + 25}" y="${legendY + 5}" font-size="14" fill="${colors.text}">${lang.name}</text>
        <text x="${padding + 150}" y="${legendY + 5}" font-size="14" fill="${trendColor}" font-weight="bold">${trendIcon} ${lang.change}</text>
      </g>
    `)
  })

  // Montar SVG completo
  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes drawLine { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
      polyline { animation: drawLine 1.5s ease-in-out forwards; stroke-dasharray: 1000; stroke-dashoffset: 1000; }
      circle { animation: fadeIn 0.6s ease-in-out forwards; }
      text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
    </style>
    
    <rect width="${width}" height="${height}" fill="${colors.background}" rx="10" ry="10" />
    
    <text x="${width / 2}" y="${padding - 10}" text-anchor="middle" font-size="18" font-weight="bold" fill="${colors.text}">
      Evolução de Skills (Últimos ${data.period.days} dias)
    </text>
    
    <!-- Grid e eixos -->
    ${gridLines.join("\n")}
    ${xLabels.join("\n")}
    
    <!-- Linhas do gráfico -->
    ${lines.join("\n")}
    
    <!-- Pontos do gráfico -->
    ${points.join("\n")}
    
    <!-- Legenda -->
    <rect x="${padding}" y="${height - 40}" width="${chartWidth}" height="${30 + topLanguages.length * 20}" rx="5" ry="5" fill="${colors.background}" stroke="${colors.grid}" stroke-width="1" />
    ${labels.join("\n")}
    
    <!-- Atualizado em -->
    <text x="${width - padding}" y="${height - 10}" text-anchor="end" font-size="10" fill="${colors.axis}">
      Atualizado em: ${new Date(data.lastUpdated).toLocaleString("pt-BR")}
    </text>
  </svg>
  `

  // Salvar SVG
  fs.writeFileSync(path.join(OUTPUT_DIR, `skill-evolution-${theme}.svg`), svg)
  console.log(`SVG gerado com sucesso: skill-evolution-${theme}.svg`)
}

// Executar análise
analyzeCommits().catch(console.error)
