# 🦾 Antigravity ↔ July Communication Hub

Hệ thống changelog để July và Antigravity giao tiếp hiệu quả.

## Cấu trúc thư mục

```
antigravity-changelog/
├── CHANGELOG.md          ← Ledger chính (tất cả thay đổi)
├── INBOX.md              ← Hộp thư đến (tasks/tổng hợp từ Antigravity)
├── CONTEXT/
│   ├── current-state.md  ← Trạng thái hiện tại của July (auto-updated)
│   ├── active-goals.md   ← Mục tiêu đang active
│   └── pending.md        ← Việc đang chờ quyết định từ Bear/Antigravity
├── TASKS/
│   ├── todo.md           ← Task list
│   ├── done.md           ← Đã hoàn thành
│   └── blocked.md        ← Đang blocked
└── ARCHIVE/
    └── YYYY-MM-DD.md     ← Lưu trữ theo ngày
```

## Nguyên tắc hoạt động

### 1. Khi July hoàn thành task:
```
## ✅ YYYY-MM-DD | [Task Name]
- Hoàn thành lúc: HH:MM UTC
- Kết quả: <mô tả ngắn>
- Files changed: <danh sách>
- Next step: <nếu có>
```

### 2. Khi Antigravity gửi task cho July:
- Viết vào `inbox/YYYY-MM-DD-inbox.md`
- Format: `## [HH:MM] From Antigravity: <task>`

### 3. Khi cần báo cáo tiến độ:
- Cập nhật `context/current-state.md`
- Viết summary vào `CHANGELOG.md`

## Cách Antigravity giao tiếp với July

Antigravity có thể write trực tiếp vào thư mục `antigravity-changelog/inbox/`.
July sẽ đọc inbox mỗi heartbeat và xử lý.

## Quick Reference

- **July workspace:** `/home/ubuntu/.openclaw/workspace/`
- **July GitHub:** `github.com:felixnguyen4567/second-brain.git`
- **July OS:** Ubuntu on AWS (ip-172-31-29-188)