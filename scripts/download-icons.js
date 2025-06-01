/**
 * Download Icons Script
 * Baixa ícones de alta qualidade para a pasta icons/
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const ICONS_DIR = path.join(__dirname, "../icons")
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")

// URLs de ícones de alta qualidade
const ICON_URLS = {
  "react.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "nextjs.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  "angular.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
  "typescript.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "tailwindcss.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
  "vite.svg": "https://vitejs.dev/logo.svg",
  "nodejs.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "python.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "csharp.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  "express.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  "postgresql.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  "mongodb.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  "prisma.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
  "git.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  "docker.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  "vscode.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  "vercel.svg": "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
}

/**
 * Baixa um ícone da URL
 */
async function downloadIcon(filename, url) {
  try {
    console.log(`📥 Baixando ${filename}...`)

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const buffer = await response.arrayBuffer()
    const filePath = path.join(ICONS_DIR, filename)

    fs.writeFileSync(filePath, Buffer.from(buffer))
    console.log(`✅ ${filename} baixado com sucesso!`)

    return true
  } catch (error) {
    console.error(`❌ Erro ao baixar ${filename}:`, error.message)
    return false
  }
}

/**
 * Baixa todos os ícones
 */
async function downloadAllIcons() {
  console.log("🚀 Iniciando download dos ícones...")

  // Criar pasta se não existir
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true })
    console.log("📁 Pasta icons/ criada")
  }

  let downloaded = 0
  let failed = 0

  // Baixar cada ícone
  for (const [filename, url] of Object.entries(ICON_URLS)) {
    const success = await downloadIcon(filename, url)
    if (success) {
      downloaded++
    } else {
      failed++
    }

    // Pequena pausa para não sobrecarregar os servidores
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log(`\n📊 Resumo do download:`)
  console.log(`✅ Baixados: ${downloaded}`)
  console.log(`❌ Falharam: ${failed}`)
  console.log(`📁 Total de arquivos: ${Object.keys(ICON_URLS).length}`)

  // Listar arquivos na pasta icons
  const files = fs.readdirSync(ICONS_DIR)
  console.log(`\n📂 Arquivos na pasta icons/:`)
  files.forEach((file) => {
    console.log(`   - ${file}`)
  })
}

// Executar
downloadAllIcons().catch(console.error)
