/**
 * Tech Stack Generator - Versão Compatível com GitHub
 * Gera HTML table em vez de SVG para evitar problemas de CSP
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
 * Converte SVG para base64
 */
function svgToBase64(svgPath) {
  try {
    if (fs.existsSync(svgPath)) {
      const svgContent = fs.readFileSync(svgPath, "utf8")
      const base64 = Buffer.from(svgContent).toString("base64")
      return `data:image/svg+xml;base64,${base64}`
    }
  } catch (error) {
    console.log(`Erro ao converter ${svgPath}:`, error.message)
  }
  return null
}

/**
 * Gera ícone fallback simples
 */
function generateFallbackIcon(techName, theme = "dark") {
  const firstLetter = techName.charAt(0).toUpperCase()
  const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]
  const bgColor = colors[techName.length % colors.length]
  const textColor = theme === "dark" ? "#ffffff" : "#ffffff"

  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="${bgColor}"/>
      <text x="20" y="28" text-anchor="middle" font-size="18" font-weight="bold" fill="${textColor}" font-family="Arial, sans-serif">${firstLetter}</text>
    </svg>
  `).toString("base64")}`
}

/**
 * Calcula grid otimizado
 */
function calculateOptimalGrid(total) {
  if (total <= 5) return { rows: 1, cols: total }
  if (total <= 10) return { rows: 2, cols: 5 }
  if (total <= 20) return { rows: 4, cols: 5 }
  if (total <= 30) return { rows: 5, cols: 6 }

  const sqrt = Math.sqrt(total)
  const cols = Math.ceil(sqrt)
  const rows = Math.ceil(total / cols)
  return { rows, cols }
}

/**
 * Gera HTML da tech stack
 */
function generateTechStackHTML(technologies, theme = "dark") {
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

  // Dividir tecnologias em linhas
  const techRows = []
  for (let i = 0; i < technologies.length; i += cols) {
    techRows.push(technologies.slice(i, i + cols))
  }

  // Gerar células das tecnologias
  const techCells = techRows
    .map((row) => {
      const cells = row
        .map((tech) => {
          // Tentar carregar ícone local
          const iconPath = path.join(__dirname, "..", tech.url)
          let iconSrc = svgToBase64(iconPath)

          // Se não conseguir, usar fallback
          if (!iconSrc) {
            iconSrc = generateFallbackIcon(tech.name, theme)
          }

          return `
        <td align="center" style="padding: 16px; border: 1px solid ${colors.border}; background: ${colors.cardBg}; border-radius: 8px; min-width: 120px;">
          <img src="${iconSrc}" alt="${tech.name}" width="40" height="40" style="display: block; margin: 0 auto 8px auto;" />
          <div style="font-size: 11px; font-weight: 500; color: ${colors.text}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            ${tech.name}
          </div>
        </td>`
        })
        .join("")

      // Preencher células vazias se necessário
      const emptyCells = cols - row.length
      const emptyFill = emptyCells > 0 ? "<td></td>".repeat(emptyCells) : ""

      return `<tr>${cells}${emptyFill}</tr>`
    })
    .join("")

  // HTML completo
  const html = `
<div align="center" style="background: ${colors.background}; padding: 24px; border-radius: 12px; border: 1px solid ${colors.border};">
  <h3 style="color: ${colors.text}; margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 18px; font-weight: 600;">
    Tech Stack
  </h3>
  
  <table style="border-collapse: separate; border-spacing: 8px; margin: 0 auto;">
    ${techCells}
  </table>
  
  <p style="color: ${colors.textSecondary}; font-size: 10px; margin: 16px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    ${technologies.length} tecnologias • Atualizado automaticamente
  </p>
</div>`

  return html.trim()
}

// Executar
async function runTechStackGenerator() {
  console.log("Gerando HTML da tech stack compatível com GitHub...")

  try {
    // Verificar arquivo de dados
    if (!fs.existsSync(TECH_DATA_FILE)) {
      console.error("❌ Arquivo data/tech-stack.json não encontrado!")
      return
    }

    // Ler dados
    const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))
    const technologies = techData.technologies

    if (!technologies || technologies.length === 0) {
      console.error("❌ Nenhuma tecnologia encontrada!")
      return
    }

    // Criar diretório de saída
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })

    // Verificar status dos ícones
    const iconsStatus = technologies.map((tech) => {
      const iconPath = path.join(__dirname, "..", tech.url)
      return {
        name: tech.name,
        exists: fs.existsSync(iconPath),
        path: tech.url,
      }
    })

    const existingIcons = iconsStatus.filter((icon) => icon.exists).length
    const missingIcons = iconsStatus.filter((icon) => !icon.exists)

    console.log(`📊 Status dos ícones:`)
    console.log(`✅ Existem: ${existingIcons}/${technologies.length}`)
    console.log(`❌ Faltando: ${missingIcons.length}`)

    if (missingIcons.length > 0) {
      console.log("\n📝 Ícones faltando (usando fallback):")
      missingIcons.forEach((icon) => {
        console.log(`   - ${icon.name} (${icon.path})`)
      })
    }

    // Gerar HTML para ambos os temas
    const darkHTML = generateTechStackHTML(technologies, "dark")
    const lightHTML = generateTechStackHTML(technologies, "light")

    // Salvar arquivos HTML
    fs.writeFileSync(path.join(OUTPUT_DIR, "tech-stack-dark.html"), darkHTML)
    fs.writeFileSync(path.join(OUTPUT_DIR, "tech-stack-light.html"), lightHTML)

    // Atualizar timestamp
    techData.lastUpdated = new Date().toISOString()
    fs.writeFileSync(TECH_DATA_FILE, JSON.stringify(techData, null, 2))

    console.log("\n✅ HTML da tech stack gerado com sucesso!")
    console.log(`📊 Tecnologias: ${technologies.length}`)
    console.log(
      `📐 Layout: ${calculateOptimalGrid(technologies.length).rows}x${calculateOptimalGrid(technologies.length).cols}`,
    )
    console.log("📁 Arquivos: tech-stack-dark.html, tech-stack-light.html")

    return {
      totalTechs: technologies.length,
      layout: calculateOptimalGrid(technologies.length),
      lastUpdated: techData.lastUpdated,
      existingIcons,
      missingIcons: missingIcons.length,
    }
  } catch (error) {
    console.error("❌ Erro ao gerar HTML da tech stack:", error)
    throw error
  }
}

runTechStackGenerator().catch(console.error)
