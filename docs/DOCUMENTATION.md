# 📚 Perfil Dinâmico do GitHub de Pedro Reoli - Documentação Completa

## 🌟 Visão Geral

Este é um sistema abrangente e automatizado de perfil do GitHub que cria um README dinâmico e vivo com insights em tempo real, gamificação e visualizações interativas. O sistema é **100% gratuito** e utiliza apenas APIs do GitHub.

## 🏗️ Arquitetura

### Componentes Principais

1. **Sistema de README Dinâmico**
   - Seções recolhíveis com navegação suave
   - Atualizações de status em tempo real
   - Design responsivo com suporte a temas claro/escuro

2. **Coleta Automatizada de Dados**
   - Integração com API do GitHub para análise de commits
   - Detecção de linguagens e análise de tendências
   - Reconhecimento de padrões de atividade

3. **Motor de Visualização**
   - Geração de SVG para gráficos
   - Constelação interativa de projetos
   - Gráficos animados de evolução de habilidades

4. **Sistema de Gamificação**
   - Cálculo de XP e níveis
   - Medalhas de conquistas
   - Detecção de cronotipo do desenvolvedor

5. **Internacionalização**
   - Versões em Português (principal) e Inglês
   - Sistema de tradução automatizado
   - Atualizações sincronizadas de conteúdo

## 📁 Estrutura de Arquivos

\`\`\`
pedroreoli/
├── README.md                          # README principal em Português
├── EnglishVersion/
│   └── README.en.md                   # Versão em Inglês
├── .devgoals.yml                      # Configuração de metas semanais
├── .github/workflows/
│   ├── daily-update.yml              # Atualizações diárias de presença
│   ├── weekly-insights.yml           # Análise semanal de habilidades
│   ├── constellation.yml             # Constelação de projetos
│   ├── observatory.yml               # Insights do observatório
│   ├── main.yml                      # Estatísticas gerais
│   ├── pacman.yml                    # Animação do Pacman
│   ├── profile-summary.yml           # Cards de perfil
│   └── wakatime-stats.yml           # Integração com WakaTime
├── scripts/
│   ├── presence-tracker.js           # Rastreamento de status ao vivo
│   ├── skill-evolution.js            # Análise de habilidades
│   ├── constellation-generator.js    # Visualização de projetos
│   ├── observatory-insights.js       # Insights semanais
│   └── update-english-readme.js      # Tradução para inglês
├── assets/
│   ├── presence-status.json          # Dados de status atual
│   ├── skill-evolution.json          # Dados de habilidades
│   ├── skill-evolution-dark.svg      # Gráfico tema escuro
│   ├── skill-evolution-light.svg     # Gráfico tema claro
│   ├── constellation-dark.svg        # Constelação tema escuro
│   ├── constellation-light.svg       # Constelação tema claro
│   ├── constellation-data.json       # Dados da constelação
│   └── observatory-report.json       # Relatório semanal
└── docs/
    └── DOCUMENTATION.md               # Este arquivo
\`\`\`

## 🔧 Funcionalidades

### 1. Rastreamento de Status ao Vivo
- **Badges em tempo real** mostrando atividade atual
- **Detecção de linguagem** a partir de commits recentes
- **Contagem de commits** para atividade diária
- **Análise de horários** de atividade

### 2. Evolução de Habilidades
- **Análise de 30 dias** de commits com detecção de linguagem
- **Cálculo de tendências semanais** (alta/baixa/estável)
- **Gráficos SVG interativos** com animações
- **Detecção de frameworks** a partir de padrões de código

### 3. Constelação de Projetos
- **Visualização de repositórios** como constelação de estrelas
- **SVG interativo** com efeitos de hover
- **Agrupamento por linguagem** com código de cores
- **Tamanho baseado em atividade** e estrelas

### 4. Observatório Dev
- **Detecção de cronotipo** (manhã/tarde/noite/madrugada)
- **Insights inteligentes** usando sistema de templates
- **Rastreamento de gamificação** com XP e níveis
- **Gerenciamento de metas semanais** via arquivo YAML

### 5. Sistema de Gamificação
- **Cálculo de XP:**
  - 10 XP por commit
  - 50 XP por linguagem única
  - 100 XP por dia ativo
  - XP bônus para padrões especiais

- **Sistema de Níveis:**
  - 1000 XP = 1 Nível
  - Títulos dinâmicos baseados no nível
  - Medalhas de conquistas

- **Medalhas:**
  - 🏆 Mestre dos Commits (50+ commits)
  - 🎯 Poliglota (5+ linguagens)
  - ⚡ Rei da Consistência (7+ dias ativos)
  - 🦉 Coruja Noturna (commits na madrugada)
  - ☀️ Passarinho Matinal (commits pela manhã)

## ⚙️ Configuração

### Variáveis de Ambiente
\`\`\`bash
GITHUB_TOKEN=seu_token_github
GITHUB_REPOSITORY_OWNER=PedroReoli
\`\`\`

### Metas Semanais (.devgoals.yml)
\`\`\`yaml
goals:
  - name: "Completar funcionalidade de autenticação"
    progress: 85
    target: 100
  - name: "Estudar Three.js"
    progress: 45
    target: 100

long_term:
  - name: "Dominar TypeScript"
    progress: 80
  - name: "Contribuir para open source"
    progress: 55
\`\`\`

## 🚀 Agenda de Automação

| Workflow | Frequência | Propósito |
|----------|-----------|---------|
| daily-update.yml | A cada 6 horas | Atualizar status ao vivo |
| weekly-insights.yml | Todo domingo | Análise de evolução de habilidades |
| constellation.yml | Todo domingo | Constelação de projetos |
| observatory.yml | Toda segunda | Relatório de insights semanais |
| main.yml | A cada 12 horas | Atualização de estatísticas gerais |

## 🎨 Personalização

### Adicionando Novas Linguagens
Edite `FILE_EXTENSIONS` e `LANGUAGE_COLORS` em:
- `scripts/skill-evolution.js`
- `scripts/constellation-generator.js`

### Modificando Templates de Insights
Edite `INSIGHT_TEMPLATES` em `scripts/observatory-insights.js`:

\`\`\`javascript
const INSIGHT_TEMPLATES = {
  matinal: [
    "Template de insight matinal personalizado com {variáveis}",
    // Adicione mais templates
  ],
  // Adicione mais cronotipos
}
\`\`\`

### Personalizando Gamificação
Modifique o cálculo de XP em `scripts/observatory-insights.js`:

\`\`\`javascript
function calculateGamification(weeklyData, cronotipo) {
  let totalXP = 0
  
  // Personalize as regras de XP aqui
  totalXP += totalCommits * 10  // 10 XP por commit
  totalXP += uniqueLanguages.size * 50  // 50 XP por linguagem
  
  // Adicione bônus personalizados
  if (customCondition) totalXP += bonusXP
  
  return { totalXP, level, title, badges }
}
\`\`\`

## 🔍 Solução de Problemas

### Problemas Comuns

1. **Workflows não executando**
   - Verifique permissões do GitHub Actions
   - Confirme se GITHUB_TOKEN tem os escopos corretos

2. **SVGs não exibindo**
   - Certifique-se que os assets estão commitados no repositório
   - Verifique os caminhos dos arquivos no README

3. **Dados não atualizando**
   - Verifique a execução do workflow na aba Actions
   - Verifique limites de taxa da API

4. **Problemas de tradução**
   - Atualize templates de tradução em `update-english-readme.js`
   - Verifique caminhos dos arquivos para versão em inglês

### Modo Debug
Adicione logs de debug aos scripts:

\`\`\`javascript
console.log("Debug: Dados atuais:", JSON.stringify(data, null, 2))
\`\`\`

## 📈 Performance

- **Chamadas de API:** Otimizadas para ficar dentro dos limites de taxa do GitHub
- **Tamanho do Arquivo:** SVGs são otimizados para carregamento rápido
- **Cache:** Dados são cacheados entre execuções para reduzir chamadas de API
- **Tratamento de Erros:** Fallbacks graciosos para falhas de API

## 🤝 Contribuindo

Para contribuir com este sistema:

1. Faça um fork do repositório
2. Crie uma branch de feature
3. Teste suas alterações completamente
4. Envie um pull request com descrição detalhada

## 📄 Licença

Este projeto é open source e está disponível sob a Licença MIT.

## 🙏 Agradecimentos

- API do GitHub por fornecer acesso abrangente aos dados
- Skill Icons pelos ícones bonitos de tecnologia
- GitHub Actions pela automação confiável
- A comunidade open source pela inspiração

---

**Criado com ❤️ por Pedro Reoli**
