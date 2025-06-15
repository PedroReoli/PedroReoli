const fs = require('fs');
const path = require('path');

// Função para ler o template do README
function readTemplate() {
  const templatePath = path.join(__dirname, '../templates/README.template.md');
  return fs.readFileSync(templatePath, 'utf8');
}

// Função para ler os dados da tech stack
function readTechStack() {
  const techStackPath = path.join(__dirname, '../data/tech-stack.json');
  return JSON.parse(fs.readFileSync(techStackPath, 'utf8'));
}

// Função para ler os dados sobre mim
function readAboutMe() {
  const aboutMePath = path.join(__dirname, '../data/about-me.json');
  return JSON.parse(fs.readFileSync(aboutMePath, 'utf8'));
}

// Função para gerar a seção de tech stack
function generateTechStackSection(techStack) {
  let section = '<div align="center">\n  <h2>🛠️ Tech Stack & GitHub Overview</h2>\n\n  <table>\n    <tr>\n      <td width="50%">\n        <!-- Tech Stack -->\n        <h3>Tech Stack</h3>\n        <div align="center">\n';
  
  // Adicionar cada categoria
  Object.entries(techStack.categories).forEach(([key, category]) => {
    section += `          <!-- ${category.name} -->\n          <h4>${category.name}</h4>\n`;
    category.technologies.forEach(tech => {
      section += `          <img src="${tech.url}" width="40" height="40" alt="${tech.name}" />\n`;
    });
    section += '\n';
  });
  
  section += '        </div>\n      </td>\n      <td width="50%">\n        <!-- GitHub Overview -->\n        <h3>GitHub Overview</h3>\n        <picture>\n          <source media="(prefers-color-scheme: dark)" srcset="./assets/github-stats-dark.svg">\n          <source media="(prefers-color-scheme: light)" srcset="./assets/github-stats-light.svg">\n          <img src="./assets/github-stats-dark.svg" alt="GitHub Overview" width="100%">\n        </picture>\n\n        <img width="100%" src="https://github-readme-stats.vercel.app/api/top-langs/?username=pedroreoli&layout=compact&theme=radical&hide_border=true&hide_title=true" alt="Linguagens" />\n        <img width="100%" src="https://github-readme-streak-stats.herokuapp.com/?user=pedroreoli&theme=radical&hide_border=true" alt="GitHub Streak" />\n      </td>\n    </tr>\n  </table>\n</div>';
  
  return section;
}

// Função para gerar a seção sobre mim
function generateAboutMeSection(aboutMe) {
  return `## Sobre Mim

<!-- INICIO_SOBRE_MIM -->
<img align="right" alt="Chill gif" src="${aboutMe.avatar}" width="300" height="160" />

${aboutMe.description}

${aboutMe.highlights.map(highlight => `- ${highlight}`).join('\n')}
<!-- FIM_SOBRE_MIM -->`;
}

// Função para gerar a seção de contribuições
function generateContributionsSection() {
  return `## Contribuições

<div align="center">
  <h3>Atividade Semanal</h3>
  <img src="./assets/weekly-activity.svg" alt="Weekly Activity" width="100%" />
  
  <h3>Matriz de Contribuições 3D</h3>
  <img src="./profile-3d-contrib/profile-night-green.svg" alt="3D Profile" width="100%" />
  
  <h3>Pacman Contribution Graph</h3>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/PedroReoli/PedroReoli/output/pacman-contribution-graph-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/PedroReoli/PedroReoli/output/pacman-contribution-graph.svg">
    <img alt="pacman contribution graph" src="https://raw.githubusercontent.com/PedroReoli/PedroReoli/output/pacman-contribution-graph.svg" width="100%">
  </picture>
</div>`;
}

// Função principal
function main() {
  // Ler dados
  const template = readTemplate();
  const techStack = readTechStack();
  const aboutMe = readAboutMe();
  
  // Gerar seções
  const techStackSection = generateTechStackSection(techStack);
  const aboutMeSection = generateAboutMeSection(aboutMe);
  const contributionsSection = generateContributionsSection();
  
  // Substituir placeholders no template
  const readme = template
    .replace('{{TECH_STACK}}', techStackSection)
    .replace('{{ABOUT_ME}}', aboutMeSection)
    .replace('{{CONTRIBUTIONS}}', contributionsSection);
  
  // Salvar README
  const readmePath = path.join(__dirname, '../README.md');
  fs.writeFileSync(readmePath, readme);
}

main(); 