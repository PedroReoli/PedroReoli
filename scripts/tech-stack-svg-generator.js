/**
 * Tech Stack SVG Generator - Versão com Ícones Locais
 * Gera SVG dinâmico usando ícones da pasta ./icons/
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")
const OUTPUT_DIR = path.join(__dirname, "../assets")
const ICONS_DIR = path.join(__dirname, "../icons")

/**
 * Calcula o grid ideal para distribuir as tecnologias
 */
function calculateOptimalGrid(total) {
  if (total <= 6) return { rows: 1, cols: total }
  if (total <= 12) return { rows: 2, cols: 6 }
  if (total <= 20) return { rows: 4, cols: 5 }
  if (total <= 30) return { rows: 5, cols: 6 }

  // Para mais de 30, calcular o mais próximo de um quadrado
  const sqrt = Math.sqrt(total)
  const cols = Math.ceil(sqrt)
  const rows = Math.ceil(total / cols)

  return { rows, cols }
}

/**
 * Verifica se o ícone existe na pasta icons
 */
function checkIconExists(iconPath) {
  const fullPath = path.join(__dirname, "..", iconPath)
  return fs.existsSync(fullPath)
}

/**
 * Gera ícone fallback SVG
 */
function generateFallbackIcon(techName) {
  const firstLetter = techName.charAt(0).toUpperCase()
  const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]
  const color = colors[techName.length % colors.length]

  return `<rect width="40" height="40" rx="8" fill="${color}"/>
          <text x="20" y="28" text-anchor="middle" font-size="18" font-weight="bold" fill="white">${firstLetter}</text>`
}

/**
 * Gera SVG com tema específico
 */
function generateSVG(technologies, theme = "dark") {
  const { rows, cols } = calculateOptimalGrid(technologies.length)

  // Configurações de tema
  const themes = {
    dark: {
      background: "#0d1117",
      cardBg: "#161b22",
      text: "#e6edf3",
      textSecondary: "#7d8590",
      border: "#21262d",
      accent: "#6366f1",
    },
    light: {
      background: "#ffffff",
      cardBg: "#f6f8fa",
      text: "#24292f",
      textSecondary: "#656d76",
      border: "#d0d7de",
      accent: "#6366f1",
    },
  }

  const colors = themes[theme]

  // Dimensões
  const itemWidth = 120
  const itemHeight = 100
  const padding = 20
  const svgWidth = cols * itemWidth + padding * 2
  const svgHeight = rows * itemHeight + padding * 2 + 60 // Extra para título

  // Gerar elementos das tecnologias
  const techElements = technologies
    .map((tech, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      const x = padding + col * itemWidth + itemWidth / 2
      const y = padding + 50 + row * itemHeight + itemHeight / 2

      // Verificar se ícone existe
      const iconExists = checkIconExists(tech.url)
      let iconElement

      if (iconExists) {
        // Usar ícone local
        iconElement = `<image x="${x - 20}" y="${y - 25}" width="40" height="40" href="${tech.url}" />`
      } else {
        // Usar fallback
        iconElement = `<g transform="translate(${x - 20}, ${y - 25})">
          <svg width="40" height="40" viewBox="0 0 40 40">
            ${generateFallbackIcon(tech.name)}
          </svg>
        </g>`
      }

      return `
    <g class="tech-item" style="animation-delay: ${index * 0.05}s">
      <!-- Card background -->
      <rect x="${x - 50}" y="${y - 40}" width="100" height="80" rx="8" 
            fill="${colors.cardBg}" stroke="${colors.border}" stroke-width="1" 
            opacity="0.8" />
      
      <!-- Tech icon -->
      ${iconElement}
      
      <!-- Tech name -->
      <text x="${x}" y="${y + 25}" text-anchor="middle" 
            font-size="11" font-weight="500" fill="${colors.text}">
        ${tech.name}
      </text>
    </g>`
    })
    .join("")

  // SVG completo
  const svg = `
<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes fadeInUp { 
      from { opacity: 0; transform: translateY(10px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    
    .tech-item { 
      animation: fadeInUp 0.6s ease-out forwards; 
      opacity: 0;
    }
    
    text { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif; 
    }
    
    .title-text { 
      animation: fadeInUp 0.8s ease-out; 
    }
    
    .tech-item:hover rect {
      fill: ${colors.accent};
      opacity: 0.2;
    }
  </style>
  
  <!-- Background -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="${colors.background}" rx="12" />
  
  <!-- Header -->
  <g class="title-text">
    <text x="${svgWidth / 2}" y="35" text-anchor="middle" font-size="18" font-weight="600" fill="${colors.text}">
      Tech Stack
    </text>
    <line x1="${padding}" y1="45" x2="${svgWidth - padding}" y2="45" stroke="${colors.border}" stroke-width="1" />
  </g>
  
  <!-- Tech items -->
  ${techElements}
  
  <!-- Footer -->
  <text x="${svgWidth / 2}" y="${svgHeight - 15}" text-anchor="middle" font-size="10" fill="${colors.textSecondary}">
    ${technologies.length} tecnologias • Atualizado automaticamente
  </text>
  
  <!-- Accent line -->
  <rect x="0" y="0" width="${svgWidth}" height="3" fill="${colors.accent}" rx="2" />
</svg>`

  return svg.trim()
}

/**
 * Gera SVGs para ambos os temas
 */
async function generateTechStackSVGs() {
  console.log("Gerando SVGs da tech stack com ícones locais...")

  try {
    // Verificar se arquivo de dados existe
    if (!fs.existsSync(TECH_DATA_FILE)) {
      console.error("❌ Arquivo data/tech-stack.json não encontrado!")
      return
    }

    // Ler dados das tecnologias
    const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))
    const technologies = techData.technologies

    if (!technologies || technologies.length === 0) {
      console.error("❌ Nenhuma tecnologia encontrada no JSON!")
      return
    }

    // Verificar pasta de ícones
    if (!fs.existsSync(ICONS_DIR)) {
      console.log("📁 Criando pasta icons...")
      fs.mkdirSync(ICONS_DIR, { recursive: true })
    }

    // Criar diretório de saída
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })

    // Verificar quais ícones existem
    const iconsStatus = technologies.map((tech) => ({
      name: tech.name,
      exists: checkIconExists(tech.url),
      path: tech.url,
    }))

    const existingIcons = iconsStatus.filter((icon) => icon.exists).length
    const missingIcons = iconsStatus.filter((icon) => !icon.exists)

    console.log(`📊 Status dos ícones:`)
    console.log(`✅ Existem: ${existingIcons}/${technologies.length}`)
    console.log(`❌ Faltando: ${missingIcons.length}`)

    if (missingIcons.length > 0) {
      console.log("\n📝 Ícones faltando:")
      missingIcons.forEach((icon) => {
        console.log(`   - ${icon.name} (${icon.path})`)
      })
    }

    // Gerar SVGs para ambos os temas
    const darkSVG = generateSVG(technologies, "dark")
    const lightSVG = generateSVG(technologies, "light")

    // Salvar arquivos
    fs.writeFileSync(path.join(OUTPUT_DIR, "tech-stack-dark.svg"), darkSVG)
    fs.writeFileSync(path.join(OUTPUT_DIR, "tech-stack-light.svg"), lightSVG)

    // Atualizar timestamp no JSON
    techData.lastUpdated = new Date().toISOString()
    fs.writeFileSync(TECH_DATA_FILE, JSON.stringify(techData, null, 2))

    console.log("\n✅ SVGs da tech stack gerados com sucesso!")
    console.log(`📊 Tecnologias: ${technologies.length}`)
    console.log(
      `📐 Layout: ${calculateOptimalGrid(technologies.length).rows}x${calculateOptimalGrid(technologies.length).cols}`,
    )
    console.log("📁 Arquivos: tech-stack-dark.svg, tech-stack-light.svg")

    return {
      totalTechs: technologies.length,
      layout: calculateOptimalGrid(technologies.length),
      lastUpdated: techData.lastUpdated,
      existingIcons,
      missingIcons: missingIcons.length,
    }
  } catch (error) {
    console.error("❌ Erro ao gerar SVGs da tech stack:", error)
    throw error
  }
}

// Executar
generateTechStackSVGs().catch(console.error)
