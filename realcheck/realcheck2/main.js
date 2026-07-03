const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const https = require('https')

const CONFIG_PATH = path.join(app.getPath('userData'), 'config.json')

function loadConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) } catch { return {} }
}

function saveConfig(data) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2))
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 700,
    minHeight: 560,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#080C12',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  })

  win.loadFile(path.join(__dirname, 'src', 'index.html'))
}

ipcMain.handle('get-api-key', () => loadConfig().apiKey || '')

ipcMain.handle('save-api-key', (_, key) => {
  saveConfig({ ...loadConfig(), apiKey: key })
  return true
})

ipcMain.handle('analyze', async (_, { apiKey, resumeText }) => {
  return new Promise((resolve, reject) => {
    const prompt = `You are an expert in detecting AI-generated text in professional resumes.

Analyze the resume and return ONLY a raw JSON object (no markdown, no fences):
{
  "score": <0-100, where 0=definitely human, 100=definitely AI>,
  "signals": [
    {"type": "ai|human|mixed", "label": "Short label", "detail": "One sentence explanation."}
  ],
  "summary": "2-3 sentence plain-language verdict."
}

Include 4-5 signals. Look for: buzzword density, metric specificity (irregular numbers = human, round = AI), sentence length variation, candid departure/context notes, action verb repetition, tool specificity, generic vs personal phrasing.

Resume:
---
${resumeText.slice(0, 4000)}
---`

    const body = JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) return reject(new Error(parsed.error.message))
          const text = parsed.content.map(b => b.text || '').join('').trim()
          const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
          resolve(JSON.parse(clean))
        } catch (e) {
          reject(new Error('Failed to parse response: ' + e.message))
        }
      })
    })

    req.on('error', reject)
    req.write(body)
    req.end()
  })
})

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
