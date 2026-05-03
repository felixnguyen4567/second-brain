# 📋 Bear's Project Registry

> Danh sách tất cả dự án của Bear. July tham khảo file này để hiểu context khi được hỏi.
> Cập nhật lần cuối: 2026-05-03

---

## 🟢 Production (Đang chạy)

### 1. felixng.dev — Personal Website
- **Stack:** Next.js 16, Tailwind 4, Supabase, Prisma
- **Deploy:** Vercel (https://felixng.vercel.app)
- **Workspace:** Antigravity → `personal website/`
- **Repo:** Private
- **Mô tả:** Website cá nhân với 3 content silos: Projects, Journal, AI News. Có Automation API cho bot submit draft.
- **API:** `POST /api/automation` (Bearer token)
- **Liên kết July:** Content Pipeline skill gửi draft lên đây

### 2. OpenClaw Agent (July)
- **Stack:** OpenClaw, Node.js, PM2, systemd
- **Deploy:** AWS EC2 t2.micro (ip-172-31-29-188)
- **Workspace:** EC2 → `/home/ubuntu/.openclaw/workspace/`
- **Repo:** github.com/felixnguyen4567/second-brain
- **Mô tả:** AI assistant tự động: email check, trending news, wiki ingest, content pipeline
- **Cron Jobs:** 4 active (07:00-07:30 ACST daily)

---

## 🟡 In Development (Đang phát triển)

### 3. Chiêm Tinh — Astrology App
- **Stack:** Next.js, TypeScript
- **Deploy:** TBD
- **Workspace:** Antigravity → `chiem tinh/`
- **Mô tả:** Ứng dụng chiêm tinh học. Đang trong giai đoạn development.
- **Liên kết July:** Không — Bear tự handle

### 4. Trang Content Creator
- **Stack:** Vite SPA, JavaScript
- **Deploy:** TBD
- **Workspace:** Antigravity → `trang content creator/`
- **Mô tả:** Tool tạo nội dung cho Hồng Thi (Trang). 3 pillars: Chinese Language, Soft Discipline, Multilingual Motherhood. Có AI pillar isolation.
- **Liên kết July:** Không — Bear tự handle

---

## 🔵 Showcase / R&D

### 5. CivicConnect
- **Stack:** Vite, Tailwind CSS
- **Deploy:** Demo only
- **Workspace:** Antigravity → `civic connect/`
- **Mô tả:** Platform engagement demo cho civic participation. Showcase project.

### 6. Local LLM Lab
- **Stack:** llama.cpp, Gemma models
- **Deploy:** Local only
- **Workspace:** Antigravity → `Local LLM/`
- **Mô tả:** Thí nghiệm chạy LLM local (Gemma 4, etc.). R&D purpose.

---

## 📦 Supporting Tools

### 7. Content Creation Scripts
- **Stack:** Python scripts
- **Workspace:** Antigravity → `content creation/`
- **Mô tả:** Scripts hỗ trợ sản xuất nội dung. Đang được migrate vào Content Pipeline skill trên EC2.

### 8. Second Brain Dashboard (Legacy?)
- **Stack:** Next.js
- **Workspace:** Antigravity → `second brain/`
- **Mô tả:** Có thể là dashboard cũ hoặc prototype. Cần Bear xác nhận status.

---

## ⚪ Inactive / Test

### 9. test 3
- **Workspace:** Antigravity → `test 3/`
- **Nội dung:** 3 file HTML/CSS/JS test

### 10. test basic
- **Workspace:** Antigravity → `test basic/`
- **Nội dung:** quota_checker.py, ai-portfolio test

---

## 🤝 Cognify Tech (Business)
- **Loại:** Doanh nghiệp AI Solutions
- **Email:** cognifytech91@gmail.com
- **Liên kết July:** Daily email check cron job

---

## 🏠 Personal
- **Apartment:** Carey St, Darwin — đang tìm mua 3BR
- **Timezone:** ACST (Australia/Darwin, +09:30)

---

## July's Coverage Map

| Dự án | July hỗ trợ? | Cách thức |
|-------|-------------|-----------|
| felixng.dev | ✅ | Content Pipeline → submit draft |
| OpenClaw | ✅ | Self-managed (cron, heartbeat) |
| Chiêm Tinh | ❌ | Bear only |
| Trang CC | ❌ | Bear only |
| CivicConnect | ❌ | Bear only |
| Local LLM | ❌ | Bear only |
| Cognify Tech | ✅ | Email monitoring |
