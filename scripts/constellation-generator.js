/**
 * Constelação de Projetos
 * Gera visualização SVG dos repositórios como uma constelação
 */

const fs = require("fs")
const path = require("path")
const { Octokit } = require("@octokit/rest")

// Configuração
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const USERNAME = process.env.GITHUB_REPOSITORY_OWNER || "PedroReoli"
const OUTPUT_DIR = path.join(__dirname, "../assets")

// Mapeamento de linguagens para cores
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
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  default: "#6e56cf",
}

// Inicialização do Octokit
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

/**
 * Obtém dados dos repositórios do usuário
 */
async function getRepositories() {
  try {
    const { data: repos } = await octokit.repos.listForUser({
      username: USERNAME,
      sort: "updated",
      per_page: 100,
    })

    console.log(`Repositórios encontrados: ${repos.length}`)

    // Obter linguagens para cada repositório
    const reposWithLanguages = await Promise.all(
      repos.map(async (repo) => {
        try {
          const { data: languages } = await octokit.repos.listLanguages({
            owner: USERNAME,
            repo: repo.name,
          })

          // Determinar linguagem principal
          const mainLanguage = Object.keys(languages).reduce(
            (a, b) => (languages[a] > languages[b] ? a : b),
            Object.keys(languages)[0] || "default",
          )

          // Obter estatísticas de commits
          const { data: stats } = await octokit.repos.getCommitActivityStats({
            owner: USERNAME,
            repo: repo.name,
          })

          // Calcular total de commits recentes (últimas 4 semanas)
          const recentCommits = stats ? stats.slice(-4).reduce((sum, week) => sum + week.total, 0) : 0

          return {
            name: repo.name,
            description: repo.description || "",
            url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            mainLanguage,
            languages: Object.keys(languages),
            size: repo.size,
            recentCommits,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
          }
        } catch (error) {
          console.log(`Erro ao obter dados do repositório ${repo.name}: ${error.message}`)
          return {
            name: repo.name,
            description: repo.description || "",
            url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            mainLanguage: "default",
            languages: [],
            size: repo.size,
            recentCommits: 0,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
          }
        }
      }),
    )

    return reposWithLanguages
  } catch (error) {
    console.error("Erro ao obter repositórios:", error)
    throw error
  }
}

/**
 * Gera posições para os nós da constelação
 */
function generateConstellationPositions(repos) {
  const width = 900
  const height = 500
  const padding = 50

  // Agrupar por linguagem principal
  const languageGroups = {}
  repos.forEach((repo) => {
    if (!languageGroups[repo.mainLanguage]) {
      languageGroups[repo.mainLanguage] = []
    }
    languageGroups[repo.mainLanguage].push(repo)
  })

  // Calcular posições para cada grupo
  const positions = {}
  const groupCount = Object.keys(languageGroups).length
  let groupIndex = 0

  Object.entries(languageGroups).forEach(([language, groupRepos]) => {
    // Posição central do grupo
    const centerX = padding + ((width - padding * 2) / (groupCount + 1)) * (groupIndex + 1)
    const centerY = height / 2

    // Distribuir repositórios em círculo ao redor do centro
    const radius = Math.min(80, 30 + groupRepos.length * 5)

    groupRepos.forEach((repo, i) => {
      const angle = (2 * Math.PI * i) / groupRepos.length
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      positions[repo.name] = { x, y, group: language }
    })

    groupIndex++
  })

  return positions
}

/**
 * Gera SVG da constelação de projetos
 */
async function generateConstellationSVG(theme) {
  console.log(`Gerando constelação de projetos (tema: ${theme})...`)

  const isDark = theme === "dark"

  // Configurações de cores baseadas no tema
  const colors = {
    background: isDark ? "#0d1117" : "#ffffff",
    text: isDark ? "#c9d1d9" : "#24292e",
    line: isDark ? "rgba(201, 209, 217, 0.2)" : "rgba(36, 41, 46, 0.2)",
    highlight: isDark ? "#6e56cf" : "#6e56cf",
    groupLabel: isDark ? "#8b949e" : "#57606a",
  }

  try {
    // Obter dados dos repositórios
    const repos = await getRepositories()

    // Gerar posições
    const positions = generateConstellationPositions(repos)

    // Dimensões do SVG
    const width = 900
    const height = 500

    // Gerar conexões entre repositórios do mesmo grupo
    const connections = []

    Object.entries(positions).forEach(([repoName, position]) => {
      const repo = repos.find((r) => r.name === repoName)
      const group = position.group

      // Conectar com outros repositórios do mesmo grupo
      Object.entries(positions)
        .filter(([otherName, otherPos]) => otherName !== repoName && otherPos.group === group)
        .forEach(([otherName, otherPos]) => {
          // Evitar duplicações (A->B e B->A)
          if (repoName < otherName) {
            connections.push({
              x1: position.x,
              y1: position.y,
              x2: otherPos.x,
              y2: otherPos.y,
              group,
            })
          }
        })
    })

    // Gerar nós para cada repositório
    const nodes = repos
      .map((repo) => {
        const position = positions[repo.name]
        if (!position) return null

        // Calcular tamanho do nó baseado em stars e commits
        const baseSize = 5
        const commitFactor = Math.min(10, Math.log(repo.recentCommits + 1) * 2)
        const starFactor = Math.min(10, Math.log(repo.stars + 1) * 3)
        const size = baseSize + commitFactor + starFactor

        // Calcular brilho baseado em stars
        const glow = repo.stars > 0 ? Math.min(15, 5 + repo.stars * 0.5) : 0

        // Cor baseada na linguagem principal
        const color = LANGUAGE_COLORS[repo.mainLanguage] || LANGUAGE_COLORS.default

        return {
          name: repo.name,
          x: position.x,
          y: position.y,
          size,
          color,
          glow,
          group: position.group,
          url: repo.url,
          description: repo.description,
          stars: repo.stars,
          recentCommits: repo.recentCommits,
        }
      })
      .filter(Boolean)

    // Agrupar nós por linguagem para gerar labels
    const groups = {}
    nodes.forEach((node) => {
      if (!groups[node.group]) {
        groups[node.group] = {
          name: node.group,
          nodes: [],
          x: 0,
          y: 0,
        }
      }
      groups[node.group].nodes.push(node)
    })

    // Calcular posição central de cada grupo
    Object.values(groups).forEach((group) => {
      const sumX = group.nodes.reduce((sum, node) => sum + node.x, 0)
      const sumY = group.nodes.reduce((sum, node) => sum + node.y, 0)

      group.x = sumX / group.nodes.length
      group.y = sumY / group.nodes.length - 40 // Posicionar acima do grupo
    })

    // Gerar SVG
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes pulse { 
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes drawLine { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
        
        .repo-node:hover { cursor: pointer; }
        .repo-node:hover + .repo-label { opacity: 1; }
        .repo-label { opacity: 0; transition: opacity 0.2s; }
        .repo-node:hover + .repo-label + .repo-tooltip { opacity: 1; }
        .repo-tooltip { opacity: 0; transition: opacity 0.2s; pointer-events: none; }
        
        .constellation-line { animation: drawLine 1.5s ease-in-out forwards; stroke-dasharray: 100; stroke-dashoffset: 100; }
        .repo-node { animation: fadeIn 0.6s ease-in-out forwards; }
        .star-glow { animation: pulse 3s infinite; }
        
        text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
      </style>
      
      <rect width="${width}" height="${height}" fill="${colors.background}" rx="10" ry="10" />
      
      <text x="${width / 2}" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="${colors.text}">
        Constelação de Projetos
      </text>
      
      <!-- Conexões entre repositórios -->
      ${connections
        .map((conn) => {
          const color = LANGUAGE_COLORS[conn.group] || LANGUAGE_COLORS.default
          return `<line x1="${conn.x1}" y1="${conn.y1}" x2="${conn.x2}" y2="${conn.y2}" stroke="${color}" stroke-width="1" opacity="0.3" class="constellation-line" />`
        })
        .join("\n")}
      
      <!-- Labels de grupos -->
      ${Object.values(groups)
        .map((group) => {
          const color = LANGUAGE_COLORS[group.name] || LANGUAGE_COLORS.default
          return `
          <g>
            <circle cx="${group.x}" cy="${group.y}" r="15" fill="${color}" opacity="0.2" />
            <text x="${group.x}" y="${group.y - 20}" text-anchor="middle" font-size="14" fill="${colors.groupLabel}" font-weight="bold">
              ${group.name}
            </text>
          </g>
        `
        })
        .join("\n")}
      
      <!-- Nós dos repositórios -->
      ${nodes
        .map((node) => {
          // Gerar estrela com brilho
          return `
          <!-- ${node.name} -->
          <a href="${node.url}" target="_blank">
            ${node.glow > 0 ? `<circle cx="${node.x}" cy="${node.y}" r="${node.size + node.glow}" fill="${node.color}" opacity="0.15" class="star-glow" />` : ""}
            <circle cx="${node.x}" cy="${node.y}" r="${node.size}" fill="${node.color}" class="repo-node" />
          </a>
          <text x="${node.x}" y="${node.y - node.size - 5}" text-anchor="middle" font-size="12" fill="${colors.text}" class="repo-label">
            ${node.name}
          </text>
          <g class="repo-tooltip">
            <rect x="${node.x + 10}" y="${node.y - 40}" width="180" height="80" rx="5" ry="5" fill="${colors.background}" stroke="${colors.line}" stroke-width="1" />
            <text x="${node.x + 20}" y="${node.y - 20}" font-size="12" font-weight="bold" fill="${colors.text}">${node.name}</text>
            <text x="${node.x + 20}" y="${node.y}" font-size="10" fill="${colors.text}" width="160" height="40">
              ${node.description ? (node.description.length > 60 ? node.description.substring(0, 60) + "..." : node.description) : "Sem descrição"}
            </text>
            <text x="${node.x + 20}" y="${node.y + 20}" font-size="10" fill="${colors.highlight}">
              ⭐ ${node.stars} stars | 📝 ${node.recentCommits} commits recentes
            </text>
          </g>
        `
        })
        .join("\n")}
      
      <!-- Legenda -->
      <g transform="translate(20, ${height - 70})">
        <rect width="200" height="60" rx="5" ry="5" fill="${colors.background}" stroke="${colors.line}" stroke-width="1" />
        <text x="10" y="20" font-size="12" font-weight="bold" fill="${colors.text}">Legenda:</text>
        <circle cx="20" cy="40" r="5" fill="${colors.highlight}" />
        <text x="35" y="44" font-size="12" fill="${colors.text}">Repositório</text>
        <circle cx="100" cy="40" r="10" fill="${colors.highlight}" opacity="0.15" />
        <text x="120" y="44" font-size="12" fill="${colors.text}">Stars</text>
      </g>
      
      <!-- Atualizado em -->
      <text x="${width - 20}" y="${height - 20}" text-anchor="end" font-size="10" fill="${colors.groupLabel}">
        Atualizado em: ${new Date().toLocaleString("pt-BR")}
      </text>
    </svg>
    `

    // Salvar SVG
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    fs.writeFileSync(path.join(OUTPUT_DIR, `constellation-${theme}.svg`), svg)

    console.log(`SVG da constelação gerado com sucesso: constellation-${theme}.svg`)

    // Salvar dados para referência
    fs.writeFileSync(
      path.join(OUTPUT_DIR, "constellation-data.json"),
      JSON.stringify({ repos, positions, connections, nodes, lastUpdated: new Date().toISOString() }, null, 2),
    )

    return { repos, positions, connections, nodes }
  } catch (error) {
    console.error("Erro ao gerar constelação:", error)
    throw error
  }
}

// Gerar constelações para ambos os temas
async function generateConstellations() {
  await generateConstellationSVG("dark")
  await generateConstellationSVG("light")
}

// Executar
generateConstellations().catch(console.error)
