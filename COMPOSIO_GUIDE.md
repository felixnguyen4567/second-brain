# Hướng Dẫn Sử Dụng Composio MCP cho OpenClaw (July)

## Composio là gì?

Composio là nền tảng kết nối AI agent với hơn 1000+ ứng dụng bên ngoài — Gmail, Slack, GitHub, Google Calendar, Notion, Asana, Trello, X/Twitter, Instagram, và nhiều hơn nữa. Thay vì phải viết code tích hợp cho từng app, Composio cung cấp một bộ **meta-tools** để tự động tìm kiếm, xác thực và thực thi tool phù hợp.

---

## Kiến Trúc Meta-Tools

Composio **KHÔNG** cung cấp tool Gmail, Slack, v.v. trực tiếp. Thay vào đó, bạn được cung cấp **7 meta-tools**. Bạn phải dùng chúng theo đúng workflow.

### Danh sách Meta-Tools

| Tool | Mục đích | Khi nào gọi |
|------|----------|-------------|
| `COMPOSIO_SEARCH_TOOLS` | Tìm kiếm tools phù hợp cho tác vụ | **Luôn gọi đầu tiên** khi cần thực hiện bất kỳ tác vụ nào |
| `COMPOSIO_GET_TOOL_SCHEMAS` | Lấy schema đầy đủ cho tool | Khi tool trả về `schemaRef` thay vì `input_schema` |
| `COMPOSIO_MULTI_EXECUTE_TOOL` | Thực thi một hoặc nhiều tools | Sau khi đã có tool slug và biết input schema |
| `COMPOSIO_MANAGE_CONNECTIONS` | Quản lý kết nối app (tạo, kiểm tra) | Khi app chưa được kết nối hoặc cần kết nối mới |
| `COMPOSIO_WAIT_FOR_CONNECTIONS` | Đợi user hoàn tất xác thực | Sau khi đã gửi link xác thực cho user |
| `COMPOSIO_REMOTE_WORKBENCH` | Chạy Python code trong sandbox | Khi cần xử lý dữ liệu lớn, bulk operations |
| `COMPOSIO_REMOTE_BASH_TOOL` | Chạy lệnh bash trong sandbox | Khi cần thao tác file đơn giản hoặc trích xuất dữ liệu |

---

## Workflow Chuẩn (BẮT BUỘC TUÂN THEO)

### Bước 1: Tìm kiếm tools — `COMPOSIO_SEARCH_TOOLS`

**Luôn luôn gọi tool này đầu tiên** khi nhận được yêu cầu liên quan đến ứng dụng bên ngoài.

```json
{
  "queries": [
    {
      "use_case": "send an email via gmail",
      "known_fields": "recipient:user@example.com"
    }
  ],
  "session": {
    "generate_id": true
  }
}
```

**Quy tắc viết `use_case`:**
- Mô tả rõ ràng bằng tiếng Anh, tập trung vào hành động cụ thể
- Nêu tên app nếu user đã chỉ định (ví dụ: "gmail", "slack", "asana")
- KHÔNG đưa thông tin cá nhân (tên, email, ID) vào `use_case` — đưa vào `known_fields`

**Quy tắc viết `known_fields`:**
- Chuỗi key:value ngắn gọn, cách nhau bằng dấu phẩy
- Chỉ đưa thông tin ổn định: tên, email, ID, timezone
- KHÔNG đưa nội dung dài (message body, notes)

**Kết quả trả về bao gồm:**
- **Tool slugs**: Tên tool cụ thể (ví dụ: `GMAIL_SEND_EMAIL`)
- **Input schema**: Tham số cần thiết để gọi tool
- **Connection status**: App đã kết nối hay chưa
- **Execution plan**: Hướng dẫn các bước thực thi

**Về `session`:**
- Dùng `{"generate_id": true}` cho workflow/tác vụ MỚI
- Dùng `{"id": "SESSION_ID_CU"}` để tiếp tục workflow đang dở
- **LUÔN** truyền `session` trong mọi lời gọi meta-tool

### Bước 2: Kiểm tra kết nối

Sau khi `COMPOSIO_SEARCH_TOOLS` trả về, kiểm tra **Connection status**:

- ✅ **ACTIVE**: App đã kết nối → chuyển sang Bước 3
- ❌ **NOT CONNECTED**: Cần kết nối → gọi `COMPOSIO_MANAGE_CONNECTIONS`

#### Nếu cần kết nối app:

```json
// Gọi COMPOSIO_MANAGE_CONNECTIONS
{
  "toolkit": "gmail"
}
```

Tool sẽ trả về một **Connect Link** — gửi link này cho user và bảo họ click vào để xác thực. Sau đó gọi `COMPOSIO_WAIT_FOR_CONNECTIONS`:

```json
{
  "toolkits": ["gmail"],
  "mode": "any",
  "session_id": "SESSION_ID_TU_BUOC_1"
}
```

### Bước 3: Lấy schema (nếu cần) — `COMPOSIO_GET_TOOL_SCHEMAS`

Nếu tool trả về `schemaRef` thay vì `input_schema` đầy đủ, phải gọi:

```json
{
  "tool_slugs": ["GMAIL_SEND_EMAIL"],
  "session_id": "SESSION_ID",
  "include": ["input_schema"]
}
```

### Bước 4: Thực thi tool — `COMPOSIO_MULTI_EXECUTE_TOOL`

Sau khi có đầy đủ tool slug và input schema:

```json
{
  "tool_slug": "GMAIL_SEND_EMAIL",
  "arguments": {
    "recipient_email": "user@example.com",
    "subject": "Test email",
    "body": "Nội dung email test",
    "is_html": false
  },
  "session_id": "SESSION_ID"
}
```

**Lưu ý quan trọng:**
- Phải truyền tham số **ĐÚNG CHÍNH XÁC** theo schema
- Kiểm tra các trường required trước khi gọi
- Luôn truyền `session_id` để duy trì context

---

## Ví Dụ Thực Tế

### Ví dụ 1: Gửi email qua Gmail

```
User: "Gửi email cho hello@example.com với tiêu đề 'Meeting Tomorrow'"

Workflow:
1. Gọi COMPOSIO_SEARCH_TOOLS:
   → queries: [{"use_case": "send email via gmail", "known_fields": "recipient:hello@example.com"}]
   → session: {"generate_id": true}

2. Nhận kết quả:
   → Tool: GMAIL_SEND_EMAIL
   → Connection: ACTIVE (đã kết nối Gmail)
   → Input schema: recipient_email, subject, body, is_html

3. Gọi COMPOSIO_MULTI_EXECUTE_TOOL:
   → tool_slug: "GMAIL_SEND_EMAIL"
   → arguments: {recipient_email: "hello@example.com", subject: "Meeting Tomorrow", body: "..."}

4. Trả kết quả cho user
```

### Ví dụ 2: Đọc email mới nhất

```
User: "Kiểm tra email mới nhất của tôi"

Workflow:
1. Gọi COMPOSIO_SEARCH_TOOLS:
   → queries: [{"use_case": "fetch latest emails from gmail"}]
   → session: {"generate_id": true}

2. Nhận kết quả:
   → Tool: GMAIL_FETCH_EMAILS
   → Connection: ACTIVE

3. Gọi COMPOSIO_MULTI_EXECUTE_TOOL:
   → tool_slug: "GMAIL_FETCH_EMAILS"
   → arguments: {max_results: 5}

4. Tóm tắt email và trả kết quả cho user
```

### Ví dụ 3: Tác vụ đa ứng dụng

```
User: "Đọc email mới nhất và tạo task Asana từ nội dung đó"

Workflow:
1. Gọi COMPOSIO_SEARCH_TOOLS với NHIỀU queries:
   → queries: [
       {"use_case": "fetch latest emails from gmail"},
       {"use_case": "create a task in asana"}
     ]
   → session: {"generate_id": true}

2. Kiểm tra connection cho cả Gmail và Asana

3. Gọi COMPOSIO_MULTI_EXECUTE_TOOL cho GMAIL_FETCH_EMAILS

4. Phân tích kết quả email

5. Gọi COMPOSIO_MULTI_EXECUTE_TOOL cho ASANA_CREATE_TASK
   với nội dung từ email
```

---

## Xử Lý Dữ Liệu Lớn

Khi kết quả trả về quá lớn (ví dụ: hàng trăm email), sử dụng:

### `COMPOSIO_REMOTE_WORKBENCH`
Chạy Python code trong sandbox bảo mật:
- Lọc, phân tích, tổng hợp dữ liệu lớn
- Gọi `invoke_llm` để xử lý bằng AI trong sandbox
- Thao tác bulk (gắn nhãn 100 email, xử lý CSV)

### `COMPOSIO_REMOTE_BASH_TOOL`
Chạy lệnh bash đơn giản:
- Dùng `jq`, `awk`, `sed`, `grep` để trích xuất dữ liệu
- Thao tác file cơ bản

---

## Quy Tắc Quan Trọng

### ✅ PHẢI LÀM:
1. **Luôn gọi `COMPOSIO_SEARCH_TOOLS` trước** — không bao giờ đoán tool slug
2. **Luôn truyền `session`** trong mọi lời gọi meta-tool
3. **Kiểm tra connection status** trước khi thực thi
4. **Đọc kỹ input schema** và truyền tham số đúng format
5. **Dùng `session_id` nhất quán** xuyên suốt một workflow
6. **Phân tách tác vụ phức tạp** thành nhiều queries nhỏ trong SEARCH_TOOLS

### ❌ KHÔNG ĐƯỢC LÀM:
1. **Không đoán hoặc bịa tool slug** — luôn search trước
2. **Không bỏ qua bước kiểm tra connection** — sẽ gây lỗi execution
3. **Không đưa thông tin cá nhân vào `use_case`** — đưa vào `known_fields`
4. **Không gọi tool khi app chưa ACTIVE** — phải kết nối trước
5. **Không trả về kết quả chưa đầy đủ** khi có pagination — paginate hết

---

## Danh Sách Toolkits Phổ Biến

| Toolkit | Ví dụ tools |
|---------|------------|
| `gmail` | GMAIL_SEND_EMAIL, GMAIL_FETCH_EMAILS, GMAIL_SEARCH_EMAILS |
| `googlecalendar` | GOOGLECALENDAR_CREATE_EVENT, GOOGLECALENDAR_LIST_EVENTS |
| `googledrive` | GOOGLEDRIVE_UPLOAD_FILE, GOOGLEDRIVE_LIST_FILES |
| `googlesheets` | GOOGLESHEETS_ADD_ROW, GOOGLESHEETS_GET_SHEET_DATA |
| `slack` | SLACK_SEND_MESSAGE, SLACK_LIST_CHANNELS |
| `github` | GITHUB_CREATE_ISSUE, GITHUB_CREATE_PR |
| `asana` | ASANA_CREATE_TASK, ASANA_LIST_TASKS |
| `notion` | NOTION_CREATE_PAGE, NOTION_SEARCH |
| `trello` | TRELLO_CREATE_CARD, TRELLO_LIST_BOARDS |
| `twitter` | TWITTER_POST_TWEET, TWITTER_SEARCH |

> **Lưu ý:** Đây chỉ là ví dụ. Luôn dùng `COMPOSIO_SEARCH_TOOLS` để tìm tool slug chính xác vì tên có thể thay đổi.

---

## Xử Lý Lỗi

| Lỗi | Nguyên nhân | Cách xử lý |
|-----|-------------|-------------|
| "No active connection" | App chưa được kết nối | Gọi `COMPOSIO_MANAGE_CONNECTIONS` |
| "Invalid input" | Tham số không đúng schema | Gọi `COMPOSIO_GET_TOOL_SCHEMAS` để lấy schema chính xác |
| "Tool not found" | Tool slug sai | Gọi lại `COMPOSIO_SEARCH_TOOLS` |
| "Rate limited" | Quá nhiều request | Đợi và thử lại |
| "Authentication expired" | Token hết hạn | Gọi `COMPOSIO_MANAGE_CONNECTIONS` để refresh |

---

## Tóm Tắt Nhanh

```
NHẬN YÊU CẦU TỪ USER
        │
        ▼
COMPOSIO_SEARCH_TOOLS (tìm tool + kiểm tra connection)
        │
        ├── Connection ACTIVE? ──► COMPOSIO_MULTI_EXECUTE_TOOL
        │                                    │
        │                                    ▼
        │                              Trả kết quả
        │
        └── Chưa connected? ──► COMPOSIO_MANAGE_CONNECTIONS
                                         │
                                         ▼
                                 Gửi link cho user
                                         │
                                         ▼
                              COMPOSIO_WAIT_FOR_CONNECTIONS
                                         │
                                         ▼
                              COMPOSIO_MULTI_EXECUTE_TOOL
                                         │
                                         ▼
                                   Trả kết quả
```
