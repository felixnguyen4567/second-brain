# 🔑 Setup OpenAI Codex OAuth cho OpenClaw — 5 bước

## Bước 1: SSH vào EC2
Mở Terminal trên Mac, paste:
```bash
ssh -i "/Users/Felix/Documents/antigravity/openclaw awc/openclaw-key.pem" ubuntu@16.51.145.141
```

## Bước 2: Chạy wizard
```bash
openclaw onboard --auth-choice openai-codex
```

## Bước 3: Trả lời wizard
1. **Security disclaimer** → chọn **Yes** → Enter
2. **Setup mode** → chọn **QuickStart** → Enter
3. **Existing config** → nếu hỏi, chọn **Use existing values** → Enter

## Bước 4: OAuth URL
- Wizard sẽ hiện 1 URL dạng `https://auth.openai.com/...`
- **Copy URL đó** → paste vào browser trên Mac
- Đăng nhập tài khoản ChatGPT Plus → click **Continue/Authorize**
- Browser sẽ redirect về `localhost:1455?code=...` → **trang sẽ lỗi, BÌNH THƯỜNG**
- **Copy toàn bộ URL** trên thanh address bar (bao gồm `?code=...`)
- **Paste URL đó vào terminal** (wizard đang chờ)

## Bước 5: Set model
Sau khi wizard hoàn thành:
```bash
openclaw models set openai-codex/gpt-5.3-codex
openclaw models status --plain
pm2 restart openclaw-agent --update-env
```

## ⚠️ LƯU Ý
- ChatGPT Plus = 5 giờ/tuần Codex quota
- Nếu hết quota → cần fallback model:
  ```bash
  openclaw models fallbacks add minimax/MiniMax-M2.7
  ```
- KHÔNG bao giờ yêu cầu July (agent) tự chạy wizard

---

**Sau khi hoàn thành bước 4, paste OAuth URL (localhost:1455?code=...) cho Antigravity để em hoàn tất bước 5!**
