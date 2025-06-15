const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Função para obter commits da última semana
function getWeeklyCommits() {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const commits = execSync(
    `git log --since="${lastWeek.toISOString()}" --pretty=format:"%h|%ad|%s" --date=short`
  ).toString().split('\n');
  
  return commits.map(commit => {
    const [hash, date, message] = commit.split('|');
    return { hash, date, message };
  });
}

// Função para analisar tecnologias dos commits
function analyzeCommitTechnologies(commits) {
  const techRegex = {
    'React': /react|jsx|tsx/i,
    'TypeScript': /typescript|ts/i,
    'JavaScript': /javascript|js/i,
    'Node.js': /node|express/i,
    'Python': /python|py/i,
    'C#': /csharp|cs|\.net/i,
    'HTML/CSS': /html|css|scss|sass/i,
    'SQL': /sql|mysql|postgres/i
  };

  const techCount = {};
  commits.forEach(commit => {
    Object.entries(techRegex).forEach(([tech, regex]) => {
      if (regex.test(commit.message)) {
        techCount[tech] = (techCount[tech] || 0) + 1;
      }
    });
  });

  return Object.entries(techCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([tech]) => tech);
}

// Função para gerar o gráfico de atividade
function generateActivityGraph(commits) {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');
  
  // Configurar estilo
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, 800, 400);
  
  // Título
  ctx.fillStyle = '#6e56cf';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Atividade Semanal', 400, 40);
  
  // Configurar grade
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hours = Array.from({length: 24}, (_, i) => i);
  
  // Desenhar grade
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  
  // Linhas horizontais
  hours.forEach((hour, i) => {
    const y = 60 + i * 15;
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(750, y);
    ctx.stroke();
    
    // Hora
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${hour}:00`, 45, y + 4);
  });
  
  // Linhas verticais
  days.forEach((day, i) => {
    const x = 50 + i * 100;
    ctx.beginPath();
    ctx.moveTo(x, 60);
    ctx.lineTo(x, 360);
    ctx.stroke();
    
    // Dia
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(day, x + 50, 50);
  });
  
  // Desenhar commits
  commits.forEach(commit => {
    const date = new Date(commit.date);
    const day = date.getDay();
    const hour = date.getHours();
    
    const x = 50 + day * 100 + 25;
    const y = 60 + hour * 15;
    
    // Círculo do commit
    ctx.fillStyle = '#6e56cf';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Tooltip (será mostrado no hover)
    commit.x = x;
    commit.y = y;
  });
  
  // Tecnologias mais usadas
  const topTechs = analyzeCommitTechnologies(commits);
  ctx.fillStyle = '#333';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Tecnologias mais usadas:', 50, 380);
  ctx.fillText(topTechs.join(', '), 200, 380);
  
  return canvas.toBuffer();
}

// Função para salvar os dados
function saveData(commits) {
  const assetsDir = path.join(__dirname, '../assets');
  
  // Salvar SVG
  fs.writeFileSync(
    path.join(assetsDir, 'weekly-activity.svg'),
    generateActivityGraph(commits)
  );
  
  // Salvar dados JSON
  fs.writeFileSync(
    path.join(assetsDir, 'weekly-activity-data.json'),
    JSON.stringify({
      commits,
      technologies: analyzeCommitTechnologies(commits),
      lastUpdated: new Date().toISOString()
    }, null, 2)
  );
}

// Função principal
function main() {
  const commits = getWeeklyCommits();
  saveData(commits);
}

main(); 