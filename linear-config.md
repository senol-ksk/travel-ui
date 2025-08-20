# Linear API Key Konfigürasyonu

## 🔑 API Key Alma Adımları

### 1. Linear.com'a Git
- https://linear.app/settings/api
- Settings → API → Create Key

### 2. Key Oluştur
- **Name:** `Cursor MCP Integration`
- **Permissions:** Read + Write
- **Create Key** butonuna tıkla

### 3. API Key'i Kopyala
- Format: `linear_xxx...`
- Bu key'i güvenli bir yerde sakla

## ⚙️ Config Güncelleme

### MCP Config Dosyası
```json
// c:\Users\basary\.cursor\mcp.json
"linear": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-linear"],
  "env": {
    "LINEAR_API_KEY": "linear_xxx..." // Gerçek API key'ini buraya koy
  }
}
```

### Environment Variables
```bash
# .env.local dosyası oluştur
LINEAR_API_KEY=linear_xxx...
# GITHUB_TOKEN=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
```

## 🚀 Test Etme

### Linear MCP Test
```bash
# MCP server'ı test et
npx -y @modelcontextprotocol/server-linear

# Cursor'da test et
/linear listIssues
```

## 📋 Checklist

- [ ] Linear.com'da API key oluştur
- [ ] API key'i kopyala
- [ ] MCP config dosyasını güncelle
- [ ] Cursor'ı restart et
- [ ] Linear MCP'yi test et
