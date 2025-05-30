/**
 * Atualiza a seção de tech stack no README
 */

const fs = require("fs")
const path = require("path")

// Configuração
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")
const README_FILE = path.join(__dirname, "../README.md")

/**
 * Gera seção de tecnologias em Markdown puro
 */
function generateTechSection(techs, title, emoji) {
  const techRows = techs
    .map((tech) => {
      return `| <img src="${tech.url}" alt="${tech.name}" width="40" height="40" /> | **${tech.name}** |`
    })
    .join("\n")

  return `### ${emoji} ${title}

| Tecnologia | Nome |
|:---:|:---:|
${techRows}
`
}

/**
 * Atualiza o README com as tecnologias
 */
function updateReadmeTechStack() {
  console.log("Atualizando tech stack no README...")

  try {
    // Verificar se arquivo de dados existe
    if (!fs.existsSync(TECH_DATA_FILE)) {
      console.error("Arquivo data/tech-stack.json não encontrado!")
      return
    }

    // Ler dados das tecnologias
    const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))

    // Ler README atual
    let readme = fs.readFileSync(README_FILE, "utf8")

    // Gerar seções em Markdown puro
    const frontendSection = generateTechSection(techData.frontend, "Frontend & UI", "🎨")
    const backendSection = generateTechSection(techData.backend, "Backend & Languages", "⚙️")
    const databaseSection = generateTechSection(techData.database, "Database & Storage", "🗄️")
    const toolsSection = generateTechSection(techData.tools, "Tools & DevOps", "🛠️")

    // Gerar seção completa da tech stack
    const techStackMarkdown = `<details>
  <summary><h2>🚀 Tech Stack</h2></summary>

${frontendSection}

${backendSection}

${databaseSection}

${toolsSection}

<div align="center">
  
![Coding](https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif)

*Sempre aprendendo e evoluindo! 🚀*

</div>

</details>`

    // Substituir seção de tech stack
    const techStackRegex = /<details>\s*<summary><h2>(?:🚀\s*)?Tech Stack<\/h2><\/summary>[\s\S]*?<\/details>/

    if (techStackRegex.test(readme)) {
      readme = readme.replace(techStackRegex, techStackMarkdown)
    } else {
      console.log("Seção Tech Stack não encontrada, adicionando nova seção...")
      // Se não encontrar, adicionar após a seção "Sobre Mim"
      const aboutMeRegex = /(<\/details>\s*\n?)(?=\n*<!--)/
      readme = readme.replace(aboutMeRegex, `$1\n${techStackMarkdown}\n\n`)
    }

    // Salvar README atualizado
    fs.writeFileSync(README_FILE, readme)
    console.log("Tech stack atualizada com sucesso!")

    // Log das tecnologias carregadas
    console.log(`Frontend: ${techData.frontend.length} tecnologias`)
    console.log(`Backend: ${techData.backend.length} tecnologias`)
    console.log(`Database: ${techData.database.length} tecnologias`)
    console.log(`Tools: ${techData.tools.length} tecnologias`)
  } catch (error) {
    console.error("Erro ao atualizar tech stack:", error)
    throw error
  }
}

// Executar
updateReadmeTechStack()
