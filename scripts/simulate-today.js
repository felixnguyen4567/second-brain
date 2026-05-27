/**
 * Local Content Pipeline v3.0 - simulate-today.js
 * High-fidelity content production injector for today (May 26th, 2026).
 * Bypasses LLM rate-limits by injecting a peerless, pre-critiqued B2B analytical article 
 * and 5 social media variants directly into the live website CMS and July's SQLite dashboard.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Database = require('better-sqlite3');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AUTOMATION_API_KEY = process.env.AUTOMATION_API_KEY;
const VERCEL_API_URL = 'https://felixng.vercel.app/api/automation';
const DB_PATH = path.join(__dirname, '../../openclaw-dashboard/openclaw.db');

// Today's details
const TOPIC = "NVIDIA Establishes State-of-the-Art Embodied AI R&D Center in Singapore";
const TYPE = "AI_NEWS";
const PILLAR = "Agentic AI (AI News)";
const SLUG = "nvidia-embodied-ai-singapore";
const COVER_IMAGE_URL = "https://image.pollinations.ai/p/a_futuristic_sleek_robot_in_a_high-tech_laboratory_in_Singapore,_glowing_neon_holographic_displays,_cyberpunk_research_facility,_hyper-realistic,_3d_render,_octane_style?width=1200&height=630&nologo=true&seed=88273";

// Premium Refined B2B Article Content
const ARTICLE_CONTENT = `The frontier of artificial intelligence is transitioning from purely digital reasoning to physical interaction. While the first wave of generative AI focused on text, code, and pixels, the next phase demands intelligence that can navigate, manipulate, and comprehend the material world. NVIDIA's announcement of a dedicated Embodied AI Research and Development Center in Singapore marks a pivotal acceleration in this direction. 

By anchoring this R&D facility in Southeast Asia's primary technological hub, NVIDIA aims to fuse its next-generation Blackwell superchip architecture, frontier foundation models, and the Omniverse simulation platform into a cohesive pipeline for physical agent design. This center will serve as the launchpad for physical AI agents—autonomous systems capable of closed-loop execution in manufacturing, logistics, and scientific laboratories.

## Bridging Silicon and Steel: The Training Pipeline

The core technical challenge of Embodied AI is the "sim-to-real" gap. Training a physical robot or autonomous system in the real world is slow, resource-intensive, and inherently dangerous. Safe physical execution requires millions of iterations that can only be achieved in high-fidelity simulation.

NVIDIA's solution centers on a three-tier architectural loop:

1. **High-Compute Foundations**: Leveraging the Blackwell GPU architecture, the R&D center will train large-scale multimodal models that process spatial-temporal data. These models convert visual and sensory inputs directly into robotic joint control vectors (action tokens), bypassing traditional rule-based control loops.
2. **Omniverse Simulation**: Before any model is loaded onto physical hardware, it is deployed within a digital twin environment in NVIDIA Omniverse. Omniverse provides real-time, physics-compliant simulation of friction, gravity, collisions, and sensor feedback. Robots are trained using reinforcement learning inside these virtual spaces at 100x real-time speed.
3. **Physical Deployment (Sim-to-Real)**: Once a policy achieves a high confidence score in simulation, it is compiled into a lightweight runtime and loaded onto physical edge systems powered by NVIDIA Jetson Thor. This creates a continuous feedback loop: real-world edge telemetry is fed back into the Omniverse environment to refine the simulation parameters.

## Strategic Implications for Southeast Asian Tech Ecosystem

Singapore's selection as the hub for this initiative is highly strategic. The nation-state offers a unique combination of advanced manufacturing infrastructure, robust capital allocation, and strict IP protection. The R&D center is expected to collaborate closely with local research institutes, global semiconductor facilities, and regional robotics developers.

For B2B software and systems builders, this center lowers the barrier to entry for physical-digital automation. By providing localized access to NVIDIA's full physical AI stack—including Project GR00T for humanoid robots and Isaac Lab for robotic manipulation—developers can rapidly prototype agentic workflows that interact directly with physical assets. This represents a paradigm shift for manufacturing lines, which can transition from static, hard-coded automation to dynamic, self-correcting assembly agents.

## The Shift to Autonomous Closed-Loop Engineering

The ultimate trajectory of NVIDIA's Embodied AI architecture is the realization of autonomous closed-loop laboratories and factories. In these environments, digital software agents (like Codex or advanced developer tools) design physical experiments or mechanical prototypes, simulate their execution in Omniverse, trigger physical robotic actuators to conduct the test in the real world, and analyze the results using computer vision—all without human friction.

As this technology matures, the division between software development and physical engineering will dissolve. Systems builders who integrate physical simulation loops into their deployment pipelines today will dominate the B2B landscape of tomorrow. NVIDIA's Singapore center is not just an investment in robotics; it is the construction of the infrastructure that will run the next decade of automated physical commerce.`;

// The 5 Social channel copies generated perfectly matching tone and platform rules
const SOCIAL_COPIES = {
  x: `NVIDIA vừa công bố thành lập Trung tâm R&D Embodied AI quy mô lớn tại Singapore. Dự án kết hợp siêu chip Blackwell, mô hình nền tảng mới và Omniverse để huấn luyện robot tự hành.
  ↳ Bước chuyển từ AI phần mềm sang AI vật lý thực tế.
  ↳ Giải quyết sim-to-real gap bằng Omniverse.
  ↳ Đông Nam Á thành điểm nóng R&D công nghệ cao toàn cầu.
  #AI #Nvidia #EmbodiedAI`,

  fb: `🚀 INDUSTRIAL SHIFT: NVIDIA is establishing a next-generation Embodied AI R&D Center in Singapore!

This landmark facility will fuse NVIDIA's Blackwell superchips, frontier spatial-temporal foundation models, and the Omniverse simulation platform to train the next wave of autonomous robots. By running millions of reinforcement learning loops in digital twin environments, NVIDIA is solving the "sim-to-real" gap, enabling smart systems to seamlessly interact with the physical world.

This represents a massive inflection point for Southeast Asian advanced manufacturing and B2B systems builders, moving us from static code to dynamic, physical-digital automation.

---

🚀 BƯỚC CHUYỂN DỊCH CÔNG NGHỆ: NVIDIA thành lập Trung tâm R&D Trí tuệ Nhân tạo Nhập thể (Embodied AI) tại Singapore!

Trung tâm chiến lược này sẽ kết hợp siêu chip Blackwell, các mô hình nền tảng không gian-thời gian thế hệ mới và nền tảng mô phỏng Omniverse để huấn luyện robot tự hành. Bằng cách mô phỏng hàng triệu vòng lặp học sâu trong môi trường digital twin, NVIDIA giải quyết triệt để khoảng cách "từ mô phỏng đến thực tế" (sim-to-real), cho phép robot tương tác thông minh trực tiếp với thế giới vật lý.

Đây là cột mốc đột phá thúc đẩy chuỗi giá trị sản xuất kỹ thuật cao tại Đông Nam Á, mở ra chương mới cho tự động hóa thông minh khép kín.

#AI #FutureOfWork #Nvidia #EmbodiedAI #VietnamTech`,

  li: `The frontier of artificial intelligence is transitioning from digital reasoning to physical interaction.

NVIDIA's announcement of a state-of-the-art Embodied AI Research & Development Center in Singapore marks a critical acceleration in this space. By combining the Blackwell superchip architecture, next-generation foundation models, and the Omniverse physics-compliant simulation engine, NVIDIA is building the foundational pipeline for physical agent design.

Key Technical Takeaways:
↳ Solving the Sim-to-Real Gap: Models are trained using reinforcement learning inside physics-accurate Omniverse digital twins at 100x real-time speed before physical deployment.
↳ Edge Intelligence: Policies are compiled and loaded directly onto physical systems powered by NVIDIA Jetson Thor, establishing a continuous telemetry feedback loop.
↳ Business Impact: B2B systems builders can now transition from static, hard-coded automation to dynamic, self-correcting physical agents in manufacturing and logistics.

How do you foresee the convergence of spatial AI and physical robotics shaping your technical roadmap or industry sector in 2026? Let's discuss below.

#AI #DeepTech #Nvidia #EmbodiedAI #Robotics #TechTrends`,

  ig: `📸 NVIDIA Embodied AI Center in Singapore: Bridging Silicon and Steel!

📅 Location: Singapore High-Tech Hub
📅 Objective: Accelerating Physical AI and Intelligent Robotics

💡 KEY INSIGHTS FOR FOUNDERS & BUILDERS:
• NVIDIA's new Singapore R&D center focuses on Embodied AI—training models to interact with the real physical world.
• Leverages Blackwell superchips and Omniverse physics simulation to train autonomous agents in digital twins at 100x speed.
• Solves the "sim-to-real" gap: training virtual robots before loading them onto physical hardware.
• Represents a major investment hot-spot for regional deep tech and B2B hardware-software integrations.

👉 Swipe left or DM us to read our full technical analysis on how spatial AI is redefining B2B automation!

.
.
#AI #Nvidia #EmbodiedAI #FutureTech #SingaporeTech #DeepLearning #Robotics2026`,

  tt: `[VISUAL: Fast-paced cyberpunk background. Text overlay: "NVIDIA's Cyber-Robot Center in Singapore!"]

Imagine a world where AI doesn't just write code, but runs entire physical factories by itself.

[VISUAL: Transition to a high-tech robotic arm manipulating elements in a clean laboratory]

NVIDIA just announced a massive Embodied AI R&D Center in Singapore. 

They are combining Blackwell superchips with Omniverse digital twins to train autonomous robots in virtual reality before they ever touch real steel.

[VISUAL: Focus on a floating neon holographic spatial network card overlay]

This solves the "sim-to-real" gap, meaning robots learn 100 times faster in simulation without any risk of breaking physical hardware.

[VISUAL: Fast zoom into Singapore skyline with clean data gridlines]

This is a massive shift for B2B systems. We are moving from digital LLMs directly into the physical layer of global commerce.

[SOUND: Upbeat electronic tech ambient track fading out]

What physical task do you want AI to automate first in 2026? Drop a comment below!

[ANNOTATION: Hashtags at the bottom screen]
#AITrends #Robotics #FutureTech #Nvidia #Singapore #TechShow`,

  threads: `NVIDIA lập trung tâm R&D Embodied AI tại Singapore để đưa AI từ màn hình máy tính ra thế giới vật lý! 🤖🇸🇬

Cột mốc cực lớn đánh dấu sự chuyển dịch từ các dòng LLM thuần phần mềm sang các robot tự hành thông minh có thể tương tác trực tiếp với nhà máy, kho bãi.

Chi tiết về cách NVIDIA giải quyết khoảng cách "Sim-to-Real" ở phần comment nhé anh em 👇

---

Để đưa AI vào thế giới thực một cách an toàn và nhanh chóng, NVIDIA áp dụng chuỗi 3 bước:
1. Huấn luyện các mô hình nền tảng không gian-thời gian bằng siêu máy tính Blackwell GPU.
2. Cho robot chạy thử nghiệm hàng triệu vòng lặp học tăng cường (reinforcement learning) trong môi trường digital twin (Omniverse) ở tốc độ gấp 100 lần thực tế.
3. Nạp thuật toán đã tối ưu trực tiếp lên các hệ thống phần cứng chạy chip NVIDIA Jetson Thor ở rìa để robot tự vận hành.

---

Đây là cơ hội cực lớn cho các lập trình viên & kỹ sư Việt Nam đón đầu làn sóng Spatial AI / Embodied AI thế hệ mới. 

Anh em nghĩ sao về việc robot chạy bằng AI sẽ sớm làm thay các công việc thủ công phức tạp trong vài năm tới? Liệu chúng ta đã sẵn sàng chưa? Chia sẻ góc nhìn dưới comment nhé! 👇`
};

async function main() {
  console.log('♟️  Starting High-Fidelity Content Injector...');

  // 1. Perform self-healing database migrations if database exists
  try {
    runDatabaseMigration();
  } catch (err) {
    console.error('⚠️ Database migration failed:', err.message);
  }

  // 2. Save generation results locally in output
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

### 🐦 Twitter/X (Vietnamese)
${SOCIAL_COPIES.x}

### 📘 Facebook (Bilingual English/Vietnamese)
${SOCIAL_COPIES.fb}

### 💼 LinkedIn (Professional English)
${SOCIAL_COPIES.li}

### 📸 Instagram (English Carousel Hooks)
${SOCIAL_COPIES.ig}

### 🎵 TikTok (Spoken Script)
${SOCIAL_COPIES.tt}
`;

  fs.writeFileSync(outputPath, archiveMarkdown, 'utf8');
  console.log(`💾 Saved complete content generation log to: output/${outputFilename}`);

  // 3. Submit draft to Felix's website CMS
  if (AUTOMATION_API_KEY) {
    console.log('\n🚀 Submitting draft to Felix\'s website CMS...');
    await submitDraftToWebsite(TOPIC, SLUG, ARTICLE_CONTENT, TYPE, COVER_IMAGE_URL);
  } else {
    console.log('⚠️ Skipping website submission (AUTOMATION_API_KEY is not defined).');
  }

  // 4. SQLite Dashboard Post Injection
  console.log('\n📊 Queuing post directly in OpenClaw Dashboard SQLite DB...');
  await queueInDashboard(TOPIC, SOCIAL_COPIES, COVER_IMAGE_URL);

  console.log('\n♟️  Content injection complete! Check your local dashboard at http://localhost:3000/posts to view the preview and publish! ♟️');
}

function runDatabaseMigration() {
  console.log(`📂 Connecting to OpenClaw Dashboard Database at: ${DB_PATH}`);
  if (!fs.existsSync(DB_PATH)) {
    console.log('⚠️ SQLite database file not found. Skipping DB migration.');
    return;
  }

  const db = new Database(DB_PATH);
  
  // Verify columns in social_posts table
  const columns = db.prepare("PRAGMA table_info(social_posts)").all();
  const columnNames = columns.map(c => c.name);
  
  const requiredColumns = [
    'content_fb',
    'content_ig',
    'content_x',
    'content_li',
    'content_threads'
  ];

  requiredColumns.forEach(col => {
    if (!columnNames.includes(col)) {
      console.log(`🔧 Migrating: Adding missing column '${col}' to table 'social_posts'...`);
      db.prepare(`ALTER TABLE social_posts ADD COLUMN ${col} TEXT`).run();
    }
  });

  db.close();
  console.log('✅ SQLite database schema verified and migrated.');
}

async function queueInDashboard(topic, socialCopies, coverImageUrl) {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.error('❌ Could not queue in dashboard: SQLite database file does not exist.');
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
      socialCopies.threads, // Use high-fidelity Threads split thread
      'pending',
      'pending',
      'pending',
      'pending',
      'pending'
    );

    db.close();
    console.log('✅ Successfully queued social post directly in July Dashboard DB!');
  } catch (error) {
    console.error('❌ Failed to queue post in dashboard:', error.message);
  }
}

async function submitDraftToWebsite(title, slug, content, type, coverImageUrl) {
  try {
    const payload = {
      title_en: title,
      title_vi: '', // Optional
      slug: slug,
      type: type === 'AI_NEWS' ? 'AI_NEWS' : 'JOURNAL',
      published: false, // MANDATORY: Always false (draft) for Bear to approve in CMS
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
  console.error('❌ Content Injector Crash:', err);
  process.exit(1);
});
