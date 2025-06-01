/**
 * Tech Stack SVG Generator - Versão com Ícones SVG Inline
 * Gera SVG dinâmico com ícones incorporados que funcionam no GitHub
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")
const OUTPUT_DIR = path.join(__dirname, "../assets")

/**
 * Ícones SVG inline para cada tecnologia
 */
const TECH_ICONS = {
  React: `<path fill="#61DAFB" d="M12 10.11c1.03 0 1.87.84 1.87 1.89s-.84 1.89-1.87 1.89-1.87-.84-1.87-1.89.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.37 1.95-1.47-.84-1.63-3.05-1.01-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1.01-5.63 1.46-.84 3.45.12 5.37 1.95 1.92-1.83 3.91-2.79 5.37-1.95z"/>`,

  "Next.js": `<path fill="#000000" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-.5 17.93c-4.63-.5-8.25-4.12-8.75-8.75h17.5c-.5 4.63-4.12 8.25-8.75 8.75z"/>`,

  Angular: `<path fill="#DD0031" d="M12 2L2 6l1.5 13L12 22l8.5-3L22 6l-10-4zm0 2.2l6.14 2.2-1.07 9.54L12 18.08l-5.07-2.14L5.86 6.4L12 4.2z"/><path fill="#C3002F" d="M12 4.2v13.88l5.07-2.14L18.14 6.4L12 4.2z"/>`,

  TypeScript: `<path fill="#3178C6" d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm8.5-3.5h3v1h-1v5h-1v-5h-1v-1zm4 0h1v1h1v1h-1v3h-1v-5z"/>`,

  "Tailwind CSS": `<path fill="#06B6D4" d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12z"/>`,

  "Node.js": `<path fill="#339933" d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l7.44 4.3c.48.28 1.08.28 1.56 0l7.44-4.3c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.51-.2-.78-.2z"/>`,

  Python: `<path fill="#3776AB" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 3h3c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5v-3c0-.83.67-1.5 1.5-1.5zm0 8h3c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5v-3c0-.83.67-1.5 1.5-1.5z"/>`,

  "C#": `<path fill="#239120" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm6-6h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1z"/>`,

  Git: `<path fill="#F05032" d="M21.62 11.108l-8.731-8.729a1.292 1.292 0 0 0-1.823 0L9.257 4.19l2.299 2.3a1.532 1.532 0 0 1 1.939 1.95l2.214 2.217a1.53 1.53 0 0 1 1.583 2.531c-.599.6-1.566.6-2.166 0a1.536 1.536 0 0 1-.337-1.662l-2.074-2.063V14.9c.146.071.286.169.407.29a1.537 1.537 0 0 1-2.174 2.173 1.537 1.537 0 0 1 0-2.173c.146-.147.319-.246.499-.317V9.481a1.529 1.529 0 0 1-.499-.317 1.541 1.541 0 0 1-.337-1.662L8.205 5.2 2.38 11.108a1.292 1.292 0 0 0 0 1.823l8.731 8.729a1.292 1.292 0 0 0 1.823 0l8.686-8.729a1.292 1.292 0 0 0 0-1.823"/>`,

  Docker: `<path fill="#2496ED" d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.186"/>`,

  "VS Code": `<path fill="#007ACC" d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352z"/>`,

  PostgreSQL: `<path fill="#336791" d="M23.111 5.441c-.777-2.722-2.718-4.47-5.208-4.695a6.56 6.56 0 0 0-.665-.033c-1.344 0-2.616.33-3.257.895-.641-.565-1.913-.895-3.257-.895a6.56 6.56 0 0 0-.665.033c-2.49.225-4.431 1.973-5.208 4.695C4.074 7.805 4 10.257 4 12s.074 4.195.851 6.559c.777 2.722 2.718 4.47 5.208 4.695.22.02.442.033.665.033 1.344 0 2.616-.33 3.257-.895.641.565 1.913.895 3.257.895.223 0 .445-.013.665-.033 2.49-.225 4.431-1.973 5.208-4.695C19.926 16.195 20 13.743 20 12s-.074-4.195-.889-6.559z"/>`,

  MongoDB: `<path fill="#47A248" d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296 5.17-3.972 4.292-11.375z"/>`,

  Vercel: `<path fill="#000000" d="M12 2L2 19h20L12 2z"/>`,

  // Ícones genéricos para tecnologias sem ícone específico
  default: `<rect width="20" height="20" rx="4" fill="#6366f1"/><text x="10" y="14" text-anchor="middle" font-size="12" fill="white">?</text>`,
}

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

      // Buscar ícone SVG inline
      const iconSVG = TECH_ICONS[tech.name] || TECH_ICONS["default"]

      return `
    <g class="tech-item" style="animation-delay: ${index * 0.05}s">
      <!-- Card background -->
      <rect x="${x - 50}" y="${y - 40}" width="100" height="80" rx="8" 
            fill="${colors.cardBg}" stroke="${colors.border}" stroke-width="1" 
            opacity="0.8" />
      
      <!-- Tech icon -->
      <g transform="translate(${x - 12}, ${y - 25})">
        <svg width="24" height="24" viewBox="0 0 24 24">
          ${iconSVG}
        </svg>
      </g>
      
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
  console.log("Gerando SVGs da tech stack com ícones inline...")

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

    // Criar diretório de saída
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })

    // Gerar SVGs para ambos os temas
    const darkSVG = generateSVG(technologies, "dark")
    const lightSVG = generateSVG(technologies, "light")

    // Salvar arquivos
    fs.writeFileSync(path.join(OUTPUT_DIR, "tech-stack-dark.svg"), darkSVG)
    fs.writeFileSync(path.join(OUTPUT_DIR, "tech-stack-light.svg"), lightSVG)

    // Atualizar timestamp no JSON
    techData.lastUpdated = new Date().toISOString()
    fs.writeFileSync(TECH_DATA_FILE, JSON.stringify(techData, null, 2))

    console.log("✅ SVGs da tech stack gerados com sucesso!")
    console.log(`📊 Tecnologias: ${technologies.length}`)
    console.log(
      `📐 Layout: ${calculateOptimalGrid(technologies.length).rows}x${calculateOptimalGrid(technologies.length).cols}`,
    )
    console.log("📁 Arquivos: tech-stack-dark.svg, tech-stack-light.svg")

    // Verificar quais tecnologias têm ícones personalizados
    const withCustomIcons = technologies.filter((tech) => TECH_ICONS[tech.name]).length
    const withDefaultIcons = technologies.length - withCustomIcons

    console.log(`🎨 Ícones personalizados: ${withCustomIcons}`)
    console.log(`🔧 Ícones padrão: ${withDefaultIcons}`)

    return {
      totalTechs: technologies.length,
      layout: calculateOptimalGrid(technologies.length),
      lastUpdated: techData.lastUpdated,
      customIcons: withCustomIcons,
      defaultIcons: withDefaultIcons,
    }
  } catch (error) {
    console.error("❌ Erro ao gerar SVGs da tech stack:", error)
    throw error
  }
}

// Executar
generateTechStackSVGs().catch(console.error)
