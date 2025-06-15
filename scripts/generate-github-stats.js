const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createCanvas } = require('canvas');

// Função para obter estatísticas do GitHub
async function getGitHubStats() {
  const username = 'pedroreoli';
  const token = process.env.GITHUB_TOKEN;
  
  const stats = {
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    totalContributions: 0,
    topLanguages: [],
    recentActivity: [],
    skillEvolution: [],
    presence: {
      status: 'offline',
      lastActive: new Date().toISOString(),
      currentProject: 'PedroReoli'
    }
  };
  
  try {
    // Obter repositórios
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: { Authorization: `token ${token}` }
    });
    
    stats.totalRepos = reposResponse.data.length;
    
    // Calcular estrelas e forks
    reposResponse.data.forEach(repo => {
      stats.totalStars += repo.stargazers_count;
      stats.totalForks += repo.forks_count;
    });
    
    // Obter contribuições
    const contributionsResponse = await axios.get(`https://github-contributions-api.jogruber.de/v4/${username}`, {
      headers: { Authorization: `token ${token}` }
    });
    
    stats.totalContributions = contributionsResponse.data.total;
    
    // Obter linguagens mais usadas
    const languages = {};
    for (const repo of reposResponse.data) {
      const langResponse = await axios.get(repo.languages_url, {
        headers: { Authorization: `token ${token}` }
      });
      
      Object.entries(langResponse.data).forEach(([lang, bytes]) => {
        languages[lang] = (languages[lang] || 0) + bytes;
      });
    }
    
    stats.topLanguages = Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([lang]) => lang);
    
    // Obter atividade recente
    const eventsResponse = await axios.get(`https://api.github.com/users/${username}/events`, {
      headers: { Authorization: `token ${token}` }
    });
    
    stats.recentActivity = eventsResponse.data
      .slice(0, 5)
      .map(event => ({
        type: event.type,
        repo: event.repo.name,
        date: new Date(event.created_at)
      }));
      
    // Gerar evolução de habilidades
    stats.skillEvolution = generateSkillEvolution(stats.topLanguages);
    
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
  }
  
  return stats;
}

// Função para gerar evolução de habilidades
function generateSkillEvolution(languages) {
  const evolution = [];
  const months = 6;
  const now = new Date();
  
  for (let i = 0; i < months; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    evolution.push({
      date: date.toISOString(),
      skills: languages.map(lang => ({
        name: lang,
        level: Math.floor(Math.random() * 30) + 70 // Simulação de progresso
      }))
    });
  }
  
  return evolution;
}

// Função para gerar o SVG das estatísticas
function generateStatsSVG(stats) {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');
  
  // Configurar estilo
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, 800, 400);
  
  // Título
  ctx.fillStyle = '#6e56cf';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GitHub Overview', 400, 40);
  
  // Estatísticas Gerais
  ctx.fillStyle = '#333';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'left';
  
  const statsList = [
    ['Total Repositories', stats.totalRepos],
    ['Total Stars', stats.totalStars],
    ['Total Forks', stats.totalForks],
    ['Total Contributions', stats.totalContributions]
  ];
  
  statsList.forEach(([label, value], i) => {
    ctx.fillText(label, 50, 80 + i * 40);
    ctx.fillStyle = '#6e56cf';
    ctx.font = '20px sans-serif';
    ctx.fillText(value.toString(), 250, 80 + i * 40);
    ctx.fillStyle = '#333';
    ctx.font = '16px sans-serif';
  });
  
  // Linguagens Mais Usadas
  ctx.fillText('Top Languages', 400, 80);
  stats.topLanguages.forEach((lang, i) => {
    ctx.fillText(lang, 400, 110 + i * 30);
  });
  
  // Atividade Recente
  ctx.fillText('Recent Activity', 50, 250);
  stats.recentActivity.forEach((activity, i) => {
    ctx.fillText(
      `${activity.type} in ${activity.repo} (${activity.date.toLocaleDateString()})`,
      50,
      280 + i * 30
    );
  });
  
  return canvas.toBuffer();
}

// Função para salvar os dados
function saveData(stats) {
  const assetsDir = path.join(__dirname, '../assets');
  
  // Salvar SVG
  fs.writeFileSync(
    path.join(assetsDir, 'github-stats-dark.svg'),
    generateStatsSVG(stats)
  );
  
  // Salvar dados JSON
  fs.writeFileSync(
    path.join(assetsDir, 'github-stats-data.json'),
    JSON.stringify(stats, null, 2)
  );
  
  // Salvar status de presença
  fs.writeFileSync(
    path.join(assetsDir, 'presence-status.json'),
    JSON.stringify(stats.presence, null, 2)
  );
}

// Função principal
async function main() {
  const stats = await getGitHubStats();
  saveData(stats);
}

main(); 