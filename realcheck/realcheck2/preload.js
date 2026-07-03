const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('realcheck', {
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  saveApiKey: (key) => ipcRenderer.invoke('save-api-key', key),
  analyze: (apiKey, resumeText) => ipcRenderer.invoke('analyze', { apiKey, resumeText })
})
