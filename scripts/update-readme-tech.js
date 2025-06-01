/**
 * Atualiza a seção de tech stack no README - Versão com Badges
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const README_FILE = path.join(__dirname, "../README.md")
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")

// Mapeamento de tecnologias para badges do shields.io
const TECH_BADGES = {
  React: "https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB",
  "Next.js": "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white",
  Angular: "https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white",
  TypeScript: "https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white",
  "Tailwind CSS":
    "https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white",
  Vite: "https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white",
  ShadCN: "https://img.shields.io/badge/ShadCN-000000?style=for-the-badge&logo=shadcnui&logoColor=white",
  "Framer Motion": "https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white",
  "Node.js": "https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white",
  Python: "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white",
  "C#": "https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white",
  Blazor: "https://img.shields.io/badge/Blazor-512BD4?style=for-the-badge&logo=blazor&logoColor=white",
  Express: "https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white",
  PostgreSQL: "https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white",
  MongoDB: "https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white",
  Supabase: "https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white",
  Prisma: "https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white",
  JWT: "https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens",
  "Socket.io": "https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101",
  Git: "https://img.shields.io/badge/Git-E34F26?style=for-the-badge&logo=git&logoColor=white",
  Docker: "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white",
  "VS Code":
    "https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white",
  Postman: "https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white",
  Swagger: "https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black",
  Vercel: "https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white",
}

function updateReadmeTechStack() {
  console.log("Atualizando README com badges da tech stack...")

  try {
    // Ler README atual
    let readme = fs.readFileSync(README_FILE, "utf8")

    // Ler dados das tecnologias
    let technologies = []
    let totalTechs = 0

    if (fs.existsSync(TECH_DATA_FILE)) {
      const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))
      technologies = techData.technologies || []
      totalTechs = technologies.length
    }

    // Gerar badges organizados em categorias
    const frontendTechs = [
      "React",
      "Next.js",
      "Angular",
      "TypeScript",
      "Tailwind CSS",
      "Vite",
      "ShadCN",
      "Framer Motion",
    ]
    const backendTechs = ["Node.js", "Python", "C#", "Blazor", "Express"]
    const databaseTechs = ["PostgreSQL", "MongoDB", "Supabase", "Prisma"]
    const toolsTechs = ["Git", "Docker", "VS Code", "Postman", "Swagger", "Vercel", "JWT", "Socket.io"]

    function generateBadgeSection(title, techList) {
      const badges = techList
        .filter((tech) => technologies.some((t) => t.name === tech))
        .map((tech) => {
          const badgeUrl =
            TECH_BADGES[tech] || `https://img.shields.io/badge/${encodeURIComponent(tech)}-gray?style=for-the-badge`
          return `  <img src="${badgeUrl}" alt="${tech}" />`
        })
        .join("\n")

      return badges ? `**${title}**\n${badges}\n` : ""
    }

    // Gerar conteúdo da tech stack
    const techStackContent = `<div align="center">

${generateBadgeSection("Frontend", frontendTechs)}
${generateBadgeSection("Backend", backendTechs)}
${generateBadgeSection("Database", databaseTechs)}
${generateBadgeSection("Tools & Others", toolsTechs)}

<sub><i>${totalTechs} tecnologias • Stack sempre em evolução • Atualizado via GitHub Actions</i></sub>
</div>`

    // IMPORTANTE: Limpar conteúdo existente e substituir
    const techStackRegex = /(<!-- INICIO_TECH_STACK -->)([\s\S]*?)(<!-- FIM_TECH_STACK -->)/

    if (techStackRegex.test(readme)) {
      // Substituir completamente o conteúdo entre os marcadores
      readme = readme.replace(techStackRegex, `$1\n${techStackContent}\n$3`)
      console.log("✅ Tech Stack atualizada com badges!")
    } else {
      console.error("❌ Marcadores de Tech Stack não encontrados no README!")
      return
    }

    // Salvar README atualizado
    fs.writeFileSync(README_FILE, readme)

    console.log(`📊 Total de tecnologias: ${totalTechs}`)
    console.log("🎨 Usando badges do shields.io para máxima compatibilidade")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
    throw error
  }
}

// Executar
updateReadmeTechStack()
