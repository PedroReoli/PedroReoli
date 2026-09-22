const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url, token) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'PedroReoli-HUD-Generator',
        'Accept': 'application/vnd.github+json'
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', err => resolve(null));
  });
}

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_PAT;
  
  const user = await fetchJson('https://api.github.com/users/PedroReoli', token) || {
    public_repos: 45,
    followers: 20,
    following: 15
  };

  const repos = await fetchJson('https://api.github.com/users/PedroReoli/repos?per_page=100&sort=updated', token) || [];

  const totalPublic = Array.isArray(repos) ? repos.length : (user.public_repos || 45);
  const languages = {};
  if (Array.isArray(repos)) {
    repos.forEach(r => {
      if (r.language) {
        languages[r.language] = (languages[r.language] || 0) + 1;
      }
    });
  }

  const topLangs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([lang]) => lang)
    .join(' · ') || 'TypeScript · React · Python · Go';

  const dateStr = new Date().toISOString().split('T')[0];

  const svgContent = `<svg fill="none" width="800" height="280" viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.95); }
        }
        @keyframes scan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .container {
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          background: #090d16;
          background-image: radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.08) 0%, transparent 40%),
                            radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%);
          border-radius: 16px;
          padding: 24px 28px;
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-sizing: border-box;
          height: 280px;
          position: relative;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 6px 12px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .dot {
          width: 7px;
          height: 7px;
          background-color: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 10px #10b981;
          animation: pulse 2s infinite ease-in-out;
        }
        .title {
          font-size: 18px;
          font-weight: 800;
          background: linear-gradient(90deg, #38bdf8, #8b5cf6, #ec4899);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: scan 6s infinite alternate;
          letter-spacing: -0.5px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
        }
        .card-label {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
          font-weight: 600;
        }
        .card-val {
          font-size: 22px;
          font-weight: 800;
          color: #f1f5f9;
        }
        .subtext {
          font-size: 11px;
          color: #38bdf8;
          margin-top: 4px;
        }
        .footer {
          margin-top: 18px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #64748b;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 12px;
        }
      </style>
      <div class="container">
        <div class="header">
          <div class="title">REOLI OS // SYSTEM HUD METRICS</div>
          <div class="status-badge">
            <div class="dot"></div>
            SYSTEM ACTIVE
          </div>
        </div>
        <div class="grid">
          <div class="card">
            <div class="card-label">Public Repositories</div>
            <div class="card-val">${totalPublic}</div>
            <div class="subtext">Active Projects</div>
          </div>
          <div class="card">
            <div class="card-label">Core Architecture</div>
            <div class="card-val" style="font-size: 16px; margin-top: 4px;">AI &amp; Full Stack</div>
            <div class="subtext">Spec-Driven Engine</div>
          </div>
          <div class="card">
            <div class="card-label">Dominant Stack</div>
            <div class="card-val" style="font-size: 14px; margin-top: 6px;">${topLangs}</div>
            <div class="subtext">Updated ${dateStr}</div>
          </div>
        </div>
        <div class="footer">
          <span>HOST: PEDRO REOLI</span>
          <span>AUTONOMOUS ENGINE: ACTIVE</span>
          <span>LOCATION: BRAZIL (UTC-3)</span>
        </div>
      </div>
    </div>
  </foreignObject>
</svg>`;

  const assetsDir = path.join(__dirname, '..', 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(assetsDir, 'profile-hud.svg'), svgContent, 'utf-8');
  console.log('HUD SVG generated successfully!');
}

main().catch(console.error);
