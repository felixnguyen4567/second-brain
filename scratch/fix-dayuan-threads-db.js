const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../openclaw-dashboard/openclaw.db');

const newThreadsContent = `WeChat doanh nghiệp (WeCom) vừa tích hợp AI Agent "Dayuan" chạy trên DeepSeek V4 để dọn dẹp việc văn phòng tự động! 🧑‍💻🏢

Không còn nỗi sợ lội hàng tá tin nhắn group chat hay trả lời hàng chục email thủ công mỗi sáng.

Chi tiết các tính năng tự trị cực đỉnh của Dayuan ở dưới đây nhé 👇

---

Nhiều người nghĩ AI văn phòng chỉ là viết email hộ. Nhưng Dayuan đi xa hơn thế nhiều nhờ động cơ DeepSeek V4 (tiết kiệm 90% chi phí token so với GPT):

1. Tóm tắt hội thoại nhóm: Gom tin nhắn theo ngữ cảnh để báo cáo: Ai đang gặp vấn đề gì, đầu việc tiếp theo là gì.
2. Tự động hóa lịch họp: Nghe hiểu câu chat hẹn gặp của nhân viên để tự động lên lịch WeCom Calendar và gửi lời mời.

---

Bảo mật dữ liệu công ty thế nào khi cho AI quét chat và email?
Tencent giải quyết bằng cơ chế Sandbox cô lập tuyệt đối. Dữ liệu hội thoại không đi ra ngoài Internet và cam kết không dùng để huấn luyện các mô hình AI thương mại khác.

Một bước chuyển dịch thực sự từ chatbot thụ động sang Cognitive Enterprise Agent tự trị, giải phóng sức lao động văn phòng!

Anh em có muốn công ty mình tích hợp công nghệ này sớm không? 👇`;

try {
  const db = new Database(DB_PATH);
  
  // Verify post ID 61 exists
  const post = db.prepare('SELECT id, content FROM social_posts WHERE id = 61').get();
  if (!post) {
    console.error('Post with ID 61 not found!');
    db.close();
    process.exit(1);
  }
  
  console.log(`Found post 61: "${post.content.substring(0, 100)}..."`);
  
  // Update content_threads
  const stmt = db.prepare('UPDATE social_posts SET content_threads = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 61');
  stmt.run(newThreadsContent);
  
  console.log('Successfully updated content_threads for post ID 61 in SQLite!');
  db.close();
} catch (err) {
  console.error('Database update failed:', err.message);
}
