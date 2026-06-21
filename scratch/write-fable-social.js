const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Database = require('better-sqlite3');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AUTOMATION_API_KEY = process.env.AUTOMATION_API_KEY;
const VERCEL_API_URL = 'https://felixng.vercel.app/api/automation';
const DB_PATH = path.join(__dirname, '../../openclaw-dashboard/openclaw.db');

const TOPIC = "Anthropic Fable 5 Rebirth: Geopolitical KYC Era for AI Models";
const TYPE = "AI_NEWS";
const PILLAR = "Website Article (long-form)";
const SLUG = "anthropic-fable-5-rebirth-ai-kyc";
const COVER_IMAGE_URL = "https://image.pollinations.ai/p/futuristic_sleek_humanoid_robot_surrounded_by_neon_shields_and_cyber_security_gridlines,_concept_of_government_regulation_on_AI_models,_3d_render,_cinematic_lighting,_octane_style?width=1200&height=630&nologo=true&seed=88317";

const ARTICLE_CONTENT = `Sự trở lại của mô hình Fable 5 sau 6 ngày bị chính phủ Mỹ đình chỉ không đơn thuần là một bản cập nhật kỹ thuật. Nó đánh dấu một cột mốc lịch sử đối với sự phát triển của công nghệ toàn cầu: Kỷ nguyên xác minh danh tính bắt buộc (KYC) đối với các mô hình trí tuệ nhân tạo biên giới đã chính thức bắt đầu. Khi công nghệ vượt ngưỡng công cụ phần mềm thông thường để trở thành tài sản quốc gia mang tính lưỡng dụng, ranh giới giữa an ninh quốc phòng và đổi mới sáng tạo chưa bao giờ mỏng manh đến thế.

## 6 Ngày "Bốc Hơi" Và Áp Lực Từ Washington

Vào giữa tháng 6 năm 2026, toàn bộ giới phát triển phần mềm sử dụng API của Anthropic bất ngờ nhận được thông báo ngưng hoạt động khẩn cấp đối với mô hình Fable 5. Quyết định tạm ngưng này xuất phát trực tiếp từ các yêu cầu kiểm soát xuất khẩu của chính quyền liên bang Mỹ, liên quan đến các lo ngại về "deemed exports" (xuất khẩu ngầm).

Nỗi sợ hãi lớn nhất của các nhà hoạch định chính sách là việc các lập trình viên thuộc các quốc gia bị hạn chế có thể gián tiếp tiếp cận và khai thác các năng lực lưỡng dụng tiên tiến của Fable 5 qua môi trường API đám mây công cộng. Điều này bao gồm khả năng phát hiện lỗ hổng zero-day trong hạ tầng trọng yếu, tự động hóa thiết kế mã độc đa hình, hoặc phân tích cấu trúc phân tử sinh học có nguy cơ vũ khí hóa.

Trong suốt 6 ngày đóng cửa, các kỹ sư của Anthropic đã phải làm việc liên tục với các cơ quan an ninh của chính phủ để thiết kế một hệ thống phòng thủ đa lớp mới, dọn đường cho sự phục hồi hoạt động của mô hình này dưới một quy chuẩn kiểm soát nghiêm ngặt chưa từng có.

## Ba Hàng Rào Bảo Vệ Của Fable 5 "Tái Sinh"

Mô hình Fable 5 hoạt động trở lại không còn giống như phiên bản ban đầu. Để đáp ứng các yêu cầu khắt khe từ chính quyền, Anthropic đã triển khai ba hàng rào bảo mật mang tính kiến trúc:

1. **Bộ Phân Loại An Toàn Động (Tighter Safety Classifiers)**: Tích hợp trực tiếp ở cổng tiếp nhận dữ liệu đầu vào. Các bộ lọc an toàn thời gian thực có khả năng phát hiện các truy vấn mang tính lưỡng dụng cao (dual-use) và lập tức ngắt phiên làm việc trước khi thông tin được gửi tới lõi của mô hình.
2. **Quy Trình Xác Minh Danh Tính Bắt Buộc (Mandatory API KYC)**: Nhà phát triển không thể chỉ dùng thẻ tín dụng và địa chỉ email ảo để truy cập Fable 5 nữa. Tại các khu vực pháp lý nhạy cảm, Anthropic yêu cầu xác minh danh tính bằng giấy tờ tùy thân (hộ chiếu/ID) trước khi cấp quyền truy cập API.
3. **Quét Tuân Thủ Liên Tục (Enterprise Compliance Screening)**: Dành riêng cho phân khúc khách hàng doanh nghiệp lớn. Hệ thống sẽ liên tục kiểm toán lịch sử gọi API để phát hiện các hành vi "thu thập dữ liệu ngầm" (data harvesting) hoặc huấn luyện chéo mô hình.

## Tác Động Vĩ Mô Đến Chiến Lược AI Của Doanh Nghiệp

Sự kiện Fable 5 bị đình chỉ tạm thời là một hồi chuông cảnh tỉnh đối với mọi Giám đốc Công nghệ (CTO) và nhà sáng lập B2B. Nó phơi bày một rủi ro vận hành (operational risk) khổng lồ: Doanh nghiệp của bạn có thể bị tê liệt hoàn toàn nếu một ngày nhà cung cấp API đóng cửa mô hình theo lệnh của chính phủ.

Việc phụ thuộc 100% vào các mô hình nguồn đóng (closed-source models) qua API đám mây đã chứng minh tính dễ bị tổn thương cao trước các biến động địa chính trị. Khi AI tích hợp sâu vào quy trình vận hành cốt lõi, việc mất kết nối API trong vài giờ cũng có thể gây thiệt hại hàng triệu đô la.

Do đó, xu hướng chuyển dịch sang các mô hình nguồn mở (open-source) và kiến trúc lai (hybrid AI architectures) đang tăng tốc mạnh mẽ. Doanh nghiệp cần chủ động tự host các mô hình nhỏ (như Llama, DeepSeek) trên hạ tầng private cloud hoặc máy chủ nội bộ cho các tác vụ quan trọng, và chỉ sử dụng API nguồn đóng cho các tác vụ sáng tạo không nhạy cảm dữ liệu.

## Xây Dựng Kiến Trúc "Model-Swappable" Cho Tương Lai

Bài học lớn nhất từ Fable 5 là sự cần thiết của việc thiết kế hệ thống có khả năng thay thế linh hoạt (model-swappable architecture). Các nhà xây dựng hệ thống phần mềm không nên khóa chặt code của mình vào một SDK cụ thể của OpenAI hay Anthropic.

Thay vào đó, hãy sử dụng các cổng trung gian (API gateways) hoặc các tiêu chuẩn kết nối mở như Model Context Protocol (MCP) để có thể chuyển đổi toàn bộ luồng xử lý từ mô hình này sang mô hình khác chỉ trong vòng 5 phút khi xảy ra sự cố gián đoạn. Trong kỷ nguyên an ninh địa chính trị can thiệp sâu vào công nghệ, sự linh hoạt kiến trúc chính là rào cản phòng ngự tốt nhất cho doanh nghiệp của bạn.`;

const SOCIAL_COPIES = {
  x: `Anthropic vừa mở lại mô hình Fable 5 sau 6 ngày bị chính phủ Mỹ đình chỉ.

Thương vụ này không đơn giản là cập nhật kỹ thuật. Kỷ nguyên "KYC bắt buộc" khi sử dụng AI đã chính thức bắt đầu.

Chuyện gì đang xảy ra? 🧵

1/6 Lý do đình chỉ:
Chính quyền Mỹ lo ngại về "deemed exports" (xuất khẩu ngầm).
↳ Các lập trình viên nước ngoài có thể tiếp cận gián tiếp qua API để khai thác năng lực nguy hiểm của Fable 5.
↳ Ví dụ: tìm lỗ hổng bảo mật zero-day, thiết kế mã độc hoặc phân tích cấu trúc sinh học lưỡng dụng.

2/6 Fable 5 quay trở lại với 3 nâng cấp phòng vệ:
↳ Safety Classifiers: lọc câu hỏi nhạy cảm và ngắt kết nối thời gian thực.
↳ Mandatory KYC: yêu cầu xác minh hộ chiếu/ID tại một số khu vực pháp lý trước khi cấp quyền API.
↳ Compliance Screening: quét liên tục hành vi gọi API của doanh nghiệp.

3/6 Lần đầu tiên trong lịch sử, bạn cần "hộ chiếu" để dùng một mô hình AI.
Điều này khẳng định AI biên giới đã vượt ngưỡng một công cụ phần mềm thông thường. Nó hiện là tài sản quốc gia chịu kiểm soát ngặt nghèo.

4/6 Bài học lớn cho các CTO & Founder:
Rủi ro vận hành (operational risk) khi phụ thuộc 100% vào mô hình nguồn đóng qua API đám mây.
↳ Nếu chính phủ đóng cửa mô hình, hệ thống của bạn sẽ tê liệt hoàn toàn.

5/6 Giải pháp sống còn:
↳ Chuyển dịch sang mô hình lai (Hybrid AI): tự host mô hình nguồn mở (DeepSeek, Llama) cho các tác vụ nội bộ cốt lõi.
↳ Thiết kế kiến trúc "Model-swappable" bằng API Gateway hoặc MCP để có thể đổi mô hình nền tảng chỉ trong 5 phút.

6/6 Trong kỷ nguyên địa chính trị can thiệp sâu vào công nghệ, sự linh hoạt kiến trúc chính là lá chắn tốt nhất của doanh nghiệp.

Anh em nghĩ sao về việc KYC khi dùng AI? Chia sẻ dưới comment nhé! 👇`,

  fb: `🚀 THE GEOPOLITICAL AI KYC ERA HAS BEGUN: Anthropic restores Fable 5 with mandatory identity verification!

After a six-day shutdown directed by the U.S. government due to national security concerns, Anthropic has restored its frontier Fable 5 model. But it comes with a major catch: tighter safety classifiers, continuous enterprise compliance screening, and mandatory identity verification (KYC) for API access in certain jurisdictions. 

For B2B systems builders, this marks a massive inflection point. AI models are no longer simple software tools—they are dual-use national assets subject to geopolitical leverage.

---

🚀 KỶ NGUYÊN KYC AI ĐỊA CHÍNH TRỊ BẮT ĐẦU: Anthropic khôi phục Fable 5 kèm xác minh danh tính bắt buộc!

Sau 6 ngày ngưng hoạt động theo lệnh của chính phủ Mỹ do lo ngại về an ninh quốc gia, Anthropic đã chính thức mở lại mô hình Fable 5. Tuy nhiên, sự trở lại này đi kèm các rào cản nghiêm ngặt: thắt chặt bộ lọc an toàn thời gian thực, quét tuân thủ liên tục đối với doanh nghiệp và bắt buộc xác minh KYC (hộ chiếu/ID) để truy cập API tại một số quốc gia.

Đối với các nhà xây dựng hệ thống B2B, đây là hồi chuông cảnh tỉnh lớn. AI biên giới không còn là công cụ phần mềm thông thường—chúng là tài sản lưỡng dụng chịu kiểm soát địa chính trị trực tiếp.

#AI #Safety #Anthropic #Fable5 #Geopolitics #VietnamTech`,

  li: `Geopolitics just disrupted the software development lifecycle. Are you prepared?

Anthropic recently restored its Fable 5 model after a six-day government-ordered shutdown. The model is back, but the operational landscape has changed forever. 

To satisfy national security requirements, Anthropic has implemented:
↳ Mandatory API KYC: Developers in select jurisdictions must verify their identity via ID/passport before accessing the API.
↳ Active Ingress Classifiers: Filters that block and terminate sessions processing sensitive dual-use queries in real-time.
↳ Continuous Compliance Auditing: Tracking API usage patterns for data harvesting attempts.

This event exposes a massive vulnerability in enterprise AI strategies: vendors and APIs can be turned off overnight by regulatory mandates.

Action items for engineering leaders in 2026:
↳ Build "Model-Swappable" Architectures: Avoid vendor lock-in by routing API calls through abstraction layers or standards like Model Context Protocol (MCP).
↳ Invest in Hybrid AI: Self-host open-source models (like Llama or DeepSeek) locally for mission-critical core workloads, using public APIs only for non-sensitive tasks.
↳ Own Your Token Capital: Establish independent learning loops so your business intelligence isn't hollowed out if a specific model provider goes offline.

Sovereignty and system resilience are no longer optional. How is your team insulating its stack from platform and policy risks this year?

#AI #EngineeringLeadership #CTO #Security #Geopolitics #EnterpriseArchitecture`,

  ig: `📸 Dùng AI sắp cần cả hộ chiếu? 🌍

Anthropic vừa mở lại mô hình Fable 5 sau 6 ngày bị chính phủ Mỹ dừng khẩn cấp. Nhưng lần này, bạn sẽ phải KYC xác minh danh tính mới được dùng API.

AI không còn là phần mềm thông thường nữa — nó là tài sản lưỡng dụng an ninh quốc gia.

Swipe để xem phân tích tác động và giải pháp cho doanh nghiệp 👉

.
.
.
#AI #Anthropic #Fable5 #Geopolitics #CTO #DeveloperTools #TechNews #FelixAIDaily #SovereignAI

=== CAROUSEL OUTLINE ===
Slide 1 — Hook:
"DÙNG AI CẦN HỘ CHIẾU? 🌍"
Subtitle: Fable 5 trở lại kèm KYC bắt buộc theo yêu cầu từ chính phủ Mỹ.

Slide 2 — The Shutdown:
"6 ngày biến mất bí ẩn"
↳ Mỹ lo ngại lập trình viên nước ngoài tiếp cận năng lực nguy hiểm qua API.
↳ Các nguy cơ: rà lỗ hổng zero-day, sinh mã độc, thiết kế vũ khí sinh học.

Slide 3 — The Rebirth:
"3 hàng rào bảo mật mới"
↳ Safety Classifiers: ngắt kết nối thời gian thực khi hỏi tin nhạy cảm.
↳ Mandatory KYC: xác minh hộ chiếu/ID trước khi cấp API.
↳ Compliance: quét hành vi gọi API của doanh nghiệp.

Slide 4 — The Risk:
"Rủi ro vận hành khổng lồ"
↳ Phụ thuộc 100% vào mô hình nguồn đóng qua API đám mây rất nguy hiểm.
↳ Nếu API bị khóa đột ngột, toàn bộ hệ thống doanh nghiệp sẽ tê liệt.

Slide 5 — The Solution:
"Xây dựng kiến trúc lai (Hybrid AI)"
↳ Tự host mô hình nguồn mở (DeepSeek, Llama) cho các nghiệp vụ lõi.
↳ Chỉ dùng mô hình nguồn đóng cho các tác vụ sáng tạo thông thường.

Slide 6 — The Architecture:
"Thiết kế Model-Swappable"
↳ Dùng API Gateway hoặc MCP để có thể đổi mô hình nền tảng trong 5 phút.
↳ Độc lập thiết kế giúp giảm rủi ro gián đoạn dịch vụ.

Slide 7 — CTA:
"Resilience là chìa khóa 🔑"
Bạn nghĩ thế nào về quy định KYC khi dùng AI?
Follow @felixng.dev để cập nhật xu hướng công nghệ mỗi ngày!

=== REEL IDEA ===
[VISUAL: Visual of a passport stamped with an AI brain icon. Text overlay: "Passport required for AI?"]
Did you know Anthropic's Fable 5 was shut down for 6 days?
[VISUAL: Transition to a government building outline with data streams]
The US government forced a pause over security concerns, fearing foreign developers could use the API for dual-use capabilities like creating malware or bio-weapons.
[VISUAL: Screen recording showing a user uploading an ID to an API console]
It is back now, but developers in sensitive areas must submit passport verification just to get API keys.
[VISUAL: Diagram of a multi-model gateway switching from one provider to another]
This is a wakeup call for CTOs. Relying on one closed API is a single point of failure. You need a swappable architecture.
[SOUND: Fast cyber tech beat fading out]
Is AI regulation going too far, or is it necessary? Drop your thoughts below!`,

  tt: `[0-2s HOOK — Nói thẳng vào camera, tay cầm hộ chiếu]
"Sắp tới dùng AI có khi bạn sẽ phải trình cả hộ chiếu!"

[2-5s CONTEXT]
"Anthropic vừa khôi phục mô hình Fable 5 sau 6 ngày bị chính phủ Mỹ đình chỉ khẩn cấp."

[5-15s KEY POINT 1]
[VISUAL CUE: Hiện hình ảnh logo Anthropic và biểu tượng khóa bảo mật]
"Chính quyền Mỹ lo ngại các nhà phát triển nước ngoài có thể dùng API này để quét lỗ hổng zero-day hoặc thiết kế mã độc. AI giờ được quản lý như tài sản quân sự lưỡng dụng."

[15-25s KEY POINT 2]
[VISUAL CUE: Hiện màn hình console bắt buộc xác thực ID/Passport]
"Fable 5 quay lại nhưng bắt buộc xác minh KYC hộ chiếu trước khi cấp API, thắt chặt bộ lọc thời gian thực và quét hành vi doanh nghiệp liên tục."

[25-35s KEY POINT 3]
[VISUAL CUE: Sơ đồ kiến trúc chuyển đổi linh hoạt Model-Swappable]
"Đây là bài học cho các CTO: Phụ thuộc vào một API đám mây là điểm yếu chí mạng. Hãy tự host mô hình nguồn mở hoặc xây hệ thống Model-Swappable chuyển đổi mô hình trong 5 phút."

[35-40s CTA]
[VISUAL CUE: Follow + Like overlay]
"Bạn nghĩ sao về việc KYC khi dùng AI? Comment và follow để cập nhật AI news hàng ngày nhé!"`,

  threads: `Sự trở lại của Fable 5 sau 6 ngày bị chính phủ Mỹ đình chỉ đánh dấu bước ngoặt lớn: Kỷ nguyên KYC AI địa chính trị đã chính thức bắt đầu! 🤖🇺🇸

Nó phơi bày ranh giới rất mỏng manh giữa an ninh quốc gia và sự phát triển công nghệ.

Chi tiết về các rào cản mới và bài học cho CTO ở phần comment nhé anh em 👇

---

Để khôi phục hoạt động của Fable 5, Anthropic đã triển khai 3 rào cản bảo mật:
1. Safety Classifiers: bộ lọc động thời gian thực ngăn chặn câu hỏi lưỡng dụng (vũ khí sinh học, mã độc).
2. Mandatory KYC: yêu cầu xác minh hộ chiếu/ID tại một số khu vực pháp lý nhạy cảm.
3. Compliance Screening: kiểm toán liên tục hành vi gọi API.

---

Tác động lớn nhất đến doanh nghiệp là Rủi ro vận hành (Operational Risk).

If hệ thống của bạn phụ thuộc 100% vào một API nguồn đóng của nước ngoài, bạn có thể bị ngắt kết nối bất cứ lúc nào khi chính sách địa chính trị thay đổi.

---

Do đó, các CTO cần hành động ngay:
1. Xây dựng kiến trúc Model-Swappable bằng API Gateway hoặc tiêu chuẩn MCP để đổi mô hình trong 5 phút khi xảy ra sự cố.
2. Áp dụng Hybrid AI: tự host mô hình nguồn mở (DeepSeek, Llama) cho nghiệp vụ lõi, chỉ dùng API cho tác vụ thông thường.

Anh em nghĩ sao về việc phải cung cấp hộ chiếu/ID để dùng API AI? Chia sẻ dưới comment nhé! 👇`
};

async function main() {
  console.log('♟️ Starting Fable 5 Content Generation & Injection...');

  // 1. Save locally in output/
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const outputFilename = `${todayStr}-social.md`;
  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, outputFilename);

  const archiveMarkdown = `# Content Production Log | ${todayStr}

## 🎯 Topic: ${TOPIC}
- **Type**: ${TYPE}
- **Pillar**: ${PILLAR}
- **Slug**: ${SLUG}
- **Cover Image**: ${COVER_IMAGE_URL}

---

## 📝 Refined Article (Website Draft)

${ARTICLE_CONTENT}

---

## 📢 Multi-Channel Social Content

### 🐦 Twitter/X (Vietnamese Thread)
${SOCIAL_COPIES.x}

### 📘 Facebook (Bilingual English/Vietnamese)
${SOCIAL_COPIES.fb}

### 💼 LinkedIn (Professional English - NTHacker)
${SOCIAL_COPIES.li}

### 📸 Instagram (Caption + Carousel Outline + Reel)
${SOCIAL_COPIES.ig}

### 🎵 TikTok (Spoken Script)
${SOCIAL_COPIES.tt}

### 🧵 Threads (Thread Chained)
${SOCIAL_COPIES.threads}
`;

  fs.writeFileSync(outputPath, archiveMarkdown, 'utf8');
  console.log(`💾 Saved complete content generation log to: output/${outputFilename}`);

  // 2. Submit draft to Website CMS API
  if (AUTOMATION_API_KEY) {
    console.log('\n🚀 Submitting draft to Felix\'s website CMS...');
    await submitDraftToWebsite(TOPIC, SLUG, ARTICLE_CONTENT, TYPE, COVER_IMAGE_URL);
  } else {
    console.log('⚠️ Skipping website submission (AUTOMATION_API_KEY is not defined).');
  }

  // 3. SQLite Dashboard Post Injection
  console.log('\n📊 Queuing post directly in OpenClaw Dashboard SQLite DB...');
  await queueInDashboard(TOPIC, SOCIAL_COPIES, COVER_IMAGE_URL);

  console.log('\n♟️ Content generation & injection complete! Check your dashboard at http://localhost:3838/posts ! ♟️');
}

async function queueInDashboard(topic, socialCopies, coverImageUrl) {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.error('❌ Could not queue in dashboard: SQLite database file does not exist at ' + DB_PATH);
      return;
    }

    const db = new Database(DB_PATH);

    // Standardized content title block that matches openclaw-dashboard matcher
    const structuredContent = `🎯 TIÊU ĐIỂM: ${topic}\n\n📝 CHI TIẾT: ${socialCopies.li.slice(0, 300)}...`;
    const mediaUrls = JSON.stringify([coverImageUrl]);

    const stmt = db.prepare(`
      INSERT INTO social_posts (
        content, media_urls, 
        content_fb, content_ig, content_x, content_li, content_threads,
        platform_fb_status, platform_ig_status, platform_x_status, platform_li_status, platform_threads_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      structuredContent,
      mediaUrls,
      socialCopies.fb,
      socialCopies.ig,
      socialCopies.x,
      socialCopies.li,
      socialCopies.threads,
      'pending',
      'pending',
      'pending',
      'pending',
      'pending'
    );

    db.close();
    console.log('✅ Successfully queued social post directly in SQLite DB!');
  } catch (error) {
    console.error('❌ Failed to queue post in dashboard:', error.message);
  }
}

async function submitDraftToWebsite(title, slug, content, type, coverImageUrl) {
  try {
    const payload = {
      title_en: title,
      title_vi: '', 
      slug: slug,
      type: type === 'AI_NEWS' ? 'AI_NEWS' : 'JOURNAL',
      published: false, // Always false (draft)
      coverImageUrl: coverImageUrl,
      content_en: content
    };

    console.log(`Submitting draft payload to ${VERCEL_API_URL}...`);
    const response = await axios.post(VERCEL_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTOMATION_API_KEY}`
      }
    });

    if (response.status === 200 || response.status === 201) {
      console.log('✅ Website draft submitted successfully!');
    } else {
      console.error('❌ Website submission failed with status:', response.status, response.data);
    }
  } catch (error) {
    console.error('❌ Connection error to Vercel API:', error.response ? error.response.data : error.message);
  }
}

main().catch(err => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
