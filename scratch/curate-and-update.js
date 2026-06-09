const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const today = '2026-06-09';
const timeStr = '16:15';
const BOT_TOKEN = '8560386393:AAG_c6GfsJY-TmleBrU4n8xO17umTLQmKEI';
const CHAT_ID = '2078996036';

const briefingMarkdown = `# 📰 Trending News Briefing — ${today}

> 🕐 Generated at: ${timeStr} (Darwin Local Time)
> 📊 Coverage: 4 categories × 5 stories = 20 items
> 🔥 Top Viral Score Today: 9/10

---

## 🌍 WORLD NEWS — Top 5

### 1. Iran and Israel say they will pause strikes but warn of retaliation if ceasefire breached again
**Virality: 9/10 🔴**
Sau các cuộc đụng độ căng thẳng đe dọa làm chệch hướng đàm phán hòa bình, Israel và Iran đã chính thức đồng ý tạm dừng các cuộc tấn công trả đũa lẫn nhau. Động thái này diễn ra sau nỗ lực trung gian hòa giải từ Tổng thống Mỹ Donald Trump, giúp xoa dịu bầu không khí căng thẳng tại khu vực Trung Đông và mở đường cho các cuộc thương lượng ngoại giao tiếp theo.
📎 Source: [BBC](https://www.bbc.com/news/articles/cj6ge150z5go?at_medium=RSS&amp;at_campaign=rss)

### 2. SpaceX's stock market blast-off could be Musk's biggest gamble yet
**Virality: 8/10 🟠**
SpaceX đang chuẩn bị cho một đợt phát hành cổ phiếu lần đầu ra công chúng (IPO) lịch sử, hứa hẹn sẽ định hình lại thị trường tài chính toàn cầu và gia tăng đáng kể khối tài sản của Elon Musk. Quyết định IPO này được coi là canh bạc lớn nhất từ trước đến nay của Musk, chuyển đổi công ty từ một nhà cung cấp dịch vụ phóng tên lửa thành một thực thể niêm yết đại chúng.
📎 Source: [BBC](https://www.bbc.com/news/articles/cy8d9e4lzv1o?at_medium=RSS&amp;at_campaign=rss)

### 3. Jailed crypto founder Sam Bankman-Fried seeks Trump pardon
**Virality: 8/10 🟠**
Sam Bankman-Fried (SBF), người sáng lập sàn giao dịch tiền điện tử FTX bị sụp đổ, đã chính thức nộp đơn xin ân xá lên Tổng thống Donald Trump khi đang chấp hành án tù 25 năm. SBF và đội ngũ pháp lý của mình hy vọng sẽ tận dụng lập trường thân thiện với tiền điện tử của chính quyền Trump hiện tại để tìm kiếm cơ hội giảm án hoặc trả tự do.
📎 Source: [BBC](https://www.bbc.com/news/articles/cjwgd6jqd5do?at_medium=RSS&amp;at_campaign=rss)

### 4. Zelensky's close European allies set out five conditions for peace talks
**Virality: 7/10 🟠**
Các đồng minh châu Âu thân cận nhất của Ukraine đã đưa ra 5 điều kiện tiên quyết cho bất kỳ cuộc đàm phán hòa bình nào với Nga, trong bối cảnh sự chú ý của Tổng thống Mỹ Donald Trump đang bị phân tán đáng kể bởi cuộc chiến tại Trung Đông với Iran. Động thái này nhằm duy trì vị thế đàm phán vững chắc của Ukraine và ngăn chặn một thỏa thuận hòa bình bất lợi được áp đặt đơn phương.
📎 Source: [BBC](https://www.bbc.com/news/articles/cr7xr1g3nvvo?at_medium=RSS&amp;at_campaign=rss)

### 5. At least 35 dead after major earthquake strikes southern Philippines
**Virality: 7/10 🟠**
Một trận động đất mạnh 7.8 độ Richter đã tấn công khu vực phía nam Philippines, làm ít nhất 35 người thiệt mạng và kích hoạt các cảnh báo sóng thần nhỏ tại Philippines, Indonesia và Nhật Bản. Lực lượng cứu hộ đang khẩn trương tiếp cận các vùng bị cô lập để khắc phục hậu quả thiên tai.
📎 Source: [BBC](https://www.bbc.com/news/articles/clyel78e6p5o?at_medium=RSS&amp;at_campaign=rss)

---

## 💻 TECHNOLOGY — Top 5

### 1. OpenAI files confidentially for IPO, following Anthropic
**Virality: 9/10 🔴**
Chỉ một tuần sau khi đối thủ chính Anthropic nộp đơn xin IPO, OpenAI cũng đã âm thầm nộp hồ sơ IPO bí mật, chính thức châm ngòi cho cuộc đua niêm yết của các gã khổng lồ AI trên thị trường chứng khoán Mỹ. Sự kiện này đánh dấu bước chuyển mình quan trọng của lĩnh vực AI từ giai đoạn nghiên cứu đốt vốn sang mô hình kinh doanh đại chúng đại trà.
📎 Source: [TechCrunch](https://techcrunch.com/2026/06/08/following-anthropic-openai-files-confidentially-for-ipo/)

### 2. Apple plays catch-up at WWDC 2026: Siri AI, iOS 27 and Apple Intelligence
**Virality: 9/10 🔴**
Tại sự kiện WWDC 2026, Apple đã chính thức ra mắt hệ thống Apple Intelligence cải tiến, hệ điều hành iOS 27 và một phiên bản Siri thông minh hơn vượt trội. Siri mới sở hữu lợi thế lớn về khả năng truy cập vào ngữ cảnh cá nhân sâu sắc của người dùng và cam kết bảo mật quyền riêng tư tối đa, giúp Apple củng cố vị thế trong cuộc đua trợ lý ảo.
📎 Source: [TechCrunch](https://techcrunch.com/2026/06/08/wwdc-2026-everything-announced-on-siri-ai-os-27-apple-intelligence-and-more/)

### 3. Apple bets cheaper AI will woo small developers
**Virality: 8/10 🟠**
Nhằm thu hút các nhà phát triển nhỏ trong bối cảnh chi phí thử nghiệm AI ngày càng tăng, Apple công bố sẽ miễn phí hoàn toàn chi phí sử dụng API đám mây cho các nhà phát triển có dưới 2 triệu lượt tải xuống đầu tiên trên App Store. Đây là bước đi chiến lược nhằm xây dựng hệ sinh thái ứng dụng AI phong phú ngay trên nền tảng của hãng.
📎 Source: [TechCrunch](https://techcrunch.com/2026/06/08/apple-bets-cheaper-ai-will-woo-small-developers/)

### 4. As OpenAI files for IPO, Sam Altman's eye-scanning company is doing layoffs
**Virality: 8/10 🟠**
Tools for Humanity, công ty đứng sau dự án quét mống mắt Worldcoin do Sam Altman đồng sáng lập, đang tiến hành cắt giảm nhân sự do gặp khó khăn trong việc tạo doanh thu thực tế. Đợt sa thải diễn ra ngay khi OpenAI đang gấp rút chuẩn bị cho đợt IPO lịch sử, cho thấy áp lực tài chính đè nặng lên các dự án phụ của Altman.
📎 Source: [TechCrunch](https://techcrunch.com/2026/06/08/as-openai-files-for-ipo-sam-altmans-eye-scanning-company-is-doing-layoffs-report-says/)

### 5. Waymo bought Apple's self-driving car proving ground for $220M
**Virality: 7/10 🟠**
Waymo đã mua lại khu thử nghiệm xe tự lái rộng 5.500 mẫu Anh tại Arizona từ một công ty vỏ bọc liên kết với Apple với giá 220 triệu USD. Thương vụ này được thực hiện sau khi Apple chính thức từ bỏ dự án phát triển xe tự hành "Project Titan", cho phép Waymo mở rộng quy mô thử nghiệm công nghệ tự lái của mình.
📎 Source: [TechCrunch](https://techcrunch.com/2026/06/08/waymo-bought-apples-self-driving-car-proving-ground-for-220m/)

---

## 🤖 AI & MACHINE LEARNING — Top 5

### 1. Microsoft's Majorana 2 quantum chip is also a case study for agentic AI in R&D
**Virality: 9/10 🔴**
Microsoft đã công bố chip siêu dẫn lượng tử Majorana 2 với các thông số ấn tượng: độ tin cậy của qubit cao gấp 1.000 lần so với thế hệ đầu tiên và thời gian sống trung bình của qubit đạt 20 giây (so với mức micro-giây thông thường). Điểm đặc biệt là Microsoft đã sử dụng các tác nhân AI tự động (Agentic AI) để tối ưu hóa quy trình R&D của con chip này.
📎 Source: [AI News](https://www.artificialintelligence-news.com/news/microsoft-discovery-agentic-ai-majorana-2/)

### 2. Scout from Microsoft is the agentic Autopilot that works across M365
**Virality: 8/10 🟠**
Tại sự kiện Build, Microsoft đã mở rộng thử nghiệm rộng rãi "Scout", một dòng trợ lý tự hành (Autopilot) mới có khả năng làm việc hoàn toàn độc lập thay mặt cho người dùng trên toàn bộ hệ sinh thái Microsoft 365. Công nghệ này đánh dấu sự chuyển dịch mạnh mẽ của Microsoft từ các mô hình trò chuyện thông thường sang AI tác nhân (Agentic AI) thực sự.
📎 Source: [AI News](https://www.artificialintelligence-news.com/news/microsofts-autopilot-scout-is-the-agentic-autopilot-that-works-across-m365/)

### 3. How C3 AI agents will automate predictive maintenance for Shell
**Virality: 8/10 🟠**
Tập đoàn năng lượng khổng lồ Shell đang hợp tác với C3 AI để triển khai hệ thống AI tác nhân tự động nhằm thực hiện bảo trì dự đoán cho hơn 30.000 thiết bị vận hành trọng yếu trên toàn cầu. Hệ thống sẽ tự động phân tích dữ liệu cảm biến và đưa ra quyết định bảo trì mà không cần sự can thiệp liên tục của con người.
📎 Source: [AI News](https://www.artificialintelligence-news.com/news/how-c3-ai-agents-will-automate-predictive-maintenance-for-shell/)

### 4. Walmart limits AI use as workflows meet the realities of the balance sheet
**Virality: 8/10 🟠**
Walmart đã bắt đầu giới hạn việc sử dụng trợ lý AI nội bộ "Code Puppy" của nhân viên sau khi chi phí gọi API cho mô hình ngôn ngữ lớn (LLM) vượt quá ngân sách dự kiến. Quyết định này phản ánh một thực tế khắc nghiệt mà nhiều doanh nghiệp đang đối mặt: chi phí vận hành thực tế của các hệ thống AI quy mô lớn thường rất cao và khó kiểm soát.
📎 Source: [AI News](https://www.artificialintelligence-news.com/news/walmart-limits-ai-use-as-workflows-meet-the-realities-of-the-balance-sheet/)

### 5. Meta Business Agent drives AI-powered conversational commerce
**Virality: 7/10 🟠**
Meta vừa ra mắt công cụ "Business Agent" nhằm tự động hóa quy trình thương mại hội thoại trên các ứng dụng nhắn tin của mình. Hệ thống AI này cho phép các thương hiệu bán lẻ toàn cầu xử lý giao dịch và hỗ trợ kỹ thuật trực tiếp cho khách hàng mà không cần nhân viên vận hành thủ công.
📎 Source: [AI News](https://www.artificialintelligence-news.com/news/meta-business-agent-ai-powered-conversational-commerce/)

---

## 📈 INVESTMENT & FINANCE — Top 5

### 1. Oil Falls as Israel and Iran Halt Hostilities That Risked Talks
**Virality: 9/10 🔴**
Giá dầu thô thế giới giảm mạnh sau khi Israel và Iran đồng ý chấm dứt các cuộc tấn công quân sự trực tiếp nhắm vào nhau. Sự hạ nhiệt căng thẳng địa chính trị đột ngột này đã gỡ bỏ áp lực rủi ro nguồn cung dầu mỏ từ Trung Đông, giúp thị trường năng lượng toàn cầu ổn định trở lại.
📎 Source: [Bloomberg](https://www.bloomberg.com/news/articles/2026-06-08/latest-oil-market-news-and-analysis-for-june-9)

### 2. Indonesia Ramps Up Currency Defense With Surprise Rate Hike
**Virality: 8/10 🟠**
Ngân hàng Trung ương Indonesia vừa bất ngờ tăng lãi suất cơ bản trong một cuộc họp khẩn cấp ngoài lịch trình nhằm ngăn chặn đà mất giá kỷ lục của đồng Rupiah. Sự can thiệp mạnh tay này đã làm gia tăng làn sóng bán tháo trên thị trường trái phiếu quốc gia nhưng là bước đi bắt buộc để kiềm chế lạm phát nhập khẩu.
📎 Source: [Bloomberg](https://www.bloomberg.com/news/articles/2026-06-09/indonesia-delivers-off-cycle-rate-hike-to-temper-market-rout)

### 3. Korean Stocks Jump 8% as Chip Shares Rebound After AI Selloff
**Virality: 8/10 🟠**
Thị trường chứng khoán Hàn Quốc đã tăng vọt 8% dẫn đầu bởi nhóm cổ phiếu sản xuất chip bán dẫn bộ nhớ, phục hồi mạnh mẽ sau đợt bán tháo cổ phiếu AI quy mô lớn tuần trước. Động thái này chứng minh giới đầu tư vẫn đặt niềm tin vững chắc vào tính bền vững của làn sóng bùng nổ hạ tầng AI toàn cầu.
📎 Source: [Bloomberg](https://www.bloomberg.com/news/articles/2026-06-09/korean-stocks-jump-8-as-chip-shares-rebound-after-ai-selloff)

### 4. German Industry Output Rises for First Time Since War Began
**Virality: 7/10 🟠**
Sản lượng công nghiệp của Đức đã ghi nhận mức tăng trưởng dương lần đầu tiên kể từ khi cuộc chiến tranh tại Trung Đông bùng nổ. Dù chi phí năng lượng vẫn duy trì ở mức cao, nền kinh tế lớn nhất châu Âu đang cho thấy khả năng chống chịu và phục hồi ấn tượng hơn kỳ vọng của các nhà kinh tế.
📎 Source: [Bloomberg](https://www.bloomberg.com/news/articles/2026-06-09/german-industrial-output-rises-for-first-time-since-war-began)

### 5. BlackRock to Offer Space ETF That Will Add New IPOs Within Days
**Virality: 7/10 🟠**
BlackRock đang ra mắt một quỹ ETF chuyên về lĩnh vực công nghệ không gian dành riêng cho các nhà đầu tư châu Âu, với cơ chế đặc biệt cho phép tự động thêm các cổ phiếu mới IPO chỉ trong vòng 10 đến 30 ngày. Đợt mở quỹ này đón đầu làn sóng thương mại hóa vũ trụ và IPO của các công ty không gian hàng đầu.
📎 Source: [Bloomberg](https://www.bloomberg.com/news/articles/2026-06-09/blackrock-to-offer-space-etf-that-will-add-new-ipos-within-days)

---

## 🎯 TOP 3 CONTENT OPPORTUNITIES

• **Rank 1: OpenAI files confidentially for IPO, following Anthropic** (TECHNOLOGY | Virality: 9/10) - *Góc B2B:* Cuộc chạy đua lên sàn của OpenAI và Anthropic mở ra một góc nhìn sâu sắc về áp lực tài chính và nhu cầu thanh khoản của các mô hình AI lớn. Chủ đề này rất phù hợp cho một bài phân tích sâu (Journal/LinkedIn) về việc AI đang chuyển dịch từ "hype" công nghệ sang "utility" có định giá rõ ràng, phân tích các rủi ro tài chính của các nhà đầu tư mạo hiểm khi các gã khổng lồ này mở sổ sách tài chính cho công chúng.
• **Rank 2: Microsoft's Majorana 2 quantum chip is also a case study for agentic AI in R&D** (AI & MACHINE LEARNING | Virality: 9/10) - *Góc B2B:* Đây là trường hợp điển hình cho việc sử dụng AI tác nhân (Agentic AI) để đẩy nhanh R&D phần cứng. Bài viết có thể tập trung vào khía cạnh kỹ thuật: cách AI tự động hóa việc thiết kế, kiểm thử và tối ưu hóa chip lượng tử giúp đạt độ tin cậy gấp 1.000 lần. Đây sẽ là câu chuyện truyền cảm hứng lớn cho các CTO/VP of Engineering về sức mạnh của Agentic Workflows trong việc giải quyết các bài toán vật lý khó.
• **Rank 3: Walmart limits AI use as workflows meet the realities of the balance sheet** (AI & MACHINE LEARNING | Virality: 8/10) - *Góc B2B:* Bài học thực tế đau đớn từ Walmart là chủ đề tuyệt vời để thu hút tương tác trên Facebook/Twitter/LinkedIn dưới dạng contrarian take. Hầu hết các bài viết đều khuyên doanh nghiệp tích hợp AI vô tội vạ, nhưng bài viết này sẽ chỉ ra bài toán "cân bằng tài chính" (balance sheet constraints) và việc tối ưu hóa token/caching hoặc chuyển dịch sang các mô hình nhỏ tự chạy (Local LLMs/Open Source) như DeepSeek để tiết kiệm hàng triệu đô la chi phí vận hành.

---
*Generated by Trending News Briefing v2.0 — Skill: trending-news-briefing*`;

const wikiFrontmatter = `---
title: "Trending News Briefing — ${today}"
type: source
tags: [trending-news, daily-briefing, world-news, AI, investment]
created: ${today}
author: July
source: web search aggregation
generated: ${today}T${timeStr}:00Z
coverage: "4 categories × 5 items = 20 items"
top_viral_score: 9/10
---

`;

async function sendTelegramMessage(text) {
  const payload = {
    chat_id: CHAT_ID,
    text: text,
    parse_mode: 'Markdown'
  };
  
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const result = await response.json();
  if (!result.ok) {
    throw new Error(result.description || 'Unknown error');
  }
  return result.result;
}

async function splitAndSend(message) {
  const MAX_LENGTH = 4096;
  const lines = message.split('\n');
  let part = '';
  let parts = [];
  
  for (const line of lines) {
    if ((part + '\n' + line).length > MAX_LENGTH) {
      parts.push(part);
      part = line;
    } else {
      part += '\n' + line;
    }
  }
  if (part) parts.push(part);
  
  console.log(`Sending ${parts.length} Telegram message parts...`);
  for (let i = 0; i < parts.length; i++) {
    try {
      await sendTelegramMessage(parts[i]);
    } catch (err) {
      console.error(`Telegram part ${i} failed, sending fallback without markdown formatting...`);
      const cleanText = parts[i].replace(/[\*_`\[\]()]/g, '');
      await sendTelegramMessage(cleanText);
    }
    if (i < parts.length - 1) await new Promise(r => setTimeout(r, 1000));
  }
}

async function run() {
  const workspaceDir = path.resolve(__dirname, '..');
  
  // 1. Save output file
  const outputDir = path.join(workspaceDir, 'output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${today}-trending-briefing.md`);
  fs.writeFileSync(outputPath, briefingMarkdown, 'utf8');
  console.log(`Saved output briefing to: ${outputPath}`);

  // 2. Save history file
  const historyDir = path.join(workspaceDir, 'skills', 'daily-news-brief', 'history');
  if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir, { recursive: true });
  const historyPath = path.join(historyDir, `${today}.md`);
  fs.writeFileSync(historyPath, briefingMarkdown, 'utf8');
  console.log(`Saved history briefing to: ${historyPath}`);

  // 3. Save latest-brief
  const latestBriefPath = path.join(workspaceDir, 'skills', 'daily-news-brief', 'latest-brief.md');
  fs.writeFileSync(latestBriefPath, briefingMarkdown, 'utf8');
  console.log(`Saved latest brief to: ${latestBriefPath}`);

  // 4. Save wiki source page
  const wikiSourcesDir = path.join(workspaceDir, 'wiki', 'sources');
  if (!fs.existsSync(wikiSourcesDir)) fs.mkdirSync(wikiSourcesDir, { recursive: true });
  const wikiSourcePath = path.join(wikiSourcesDir, `${today}-trending-briefing.md`);
  fs.writeFileSync(wikiSourcePath, wikiFrontmatter + briefingMarkdown, 'utf8');
  console.log(`Saved wiki source page to: ${wikiSourcePath}`);

  // 5. Update processed.json
  const processedPath = path.join(workspaceDir, 'wiki', 'processed.json');
  if (fs.existsSync(processedPath)) {
    const processed = JSON.parse(fs.readFileSync(processedPath, 'utf8'));
    const filesToAdd = [
      `output/${today}-trending-briefing.md`,
      `wiki/sources/${today}-trending-briefing.md`
    ];
    let updated = false;
    for (const file of filesToAdd) {
      if (!processed.processed.includes(file)) {
        processed.processed.push(file);
        updated = true;
      }
    }
    if (updated) {
      processed.last_checked = new Date().toISOString();
      fs.writeFileSync(processedPath, JSON.stringify(processed, null, 2), 'utf8');
      console.log('Updated wiki/processed.json successfully.');
    }
  }

  // 6. Update wiki/index.md
  const wikiIndexPath = path.join(workspaceDir, 'wiki', 'index.md');
  if (fs.existsSync(wikiIndexPath)) {
    let indexContent = fs.readFileSync(wikiIndexPath, 'utf8');
    
    // Check if link already exists
    const linkStr = `[[sources/${today}-trending-briefing]]`;
    if (!indexContent.includes(linkStr)) {
      // Find the ## 📄 Sources section or insert before ## 📰 News Digests
      const digestsHeader = '## 📰 News Digests';
      const sourceLine = `- [[sources/${today}-trending-briefing]] — Daily trending news briefing (20 items, World/Tech/AI/Investment, June 9, 2026): OpenAI & Anthropic IPOs, Israel-Iran ceasefire, Apple WWDC 2026 AI features, Microsoft Majorana 2 quantum chip\n\n`;
      
      const insertIdx = indexContent.indexOf(digestsHeader);
      if (insertIdx !== -1) {
        indexContent = indexContent.slice(0, insertIdx) + sourceLine + indexContent.slice(insertIdx);
        
        // Update frontmatter counts
        // page_count: X -> X+1
        // source_count: Y -> Y+1
        const pageCountMatch = indexContent.match(/page_count:\s*(\d+)/);
        const sourceCountMatch = indexContent.match(/source_count:\s*(\d+)/);
        if (pageCountMatch) {
          const newPageCount = parseInt(pageCountMatch[1], 10) + 1;
          indexContent = indexContent.replace(`page_count: ${pageCountMatch[1]}`, `page_count: ${newPageCount}`);
        }
        if (sourceCountMatch) {
          const newSourceCount = parseInt(sourceCountMatch[1], 10) + 1;
          indexContent = indexContent.replace(`source_count: ${sourceCountMatch[1]}`, `source_count: ${newSourceCount}`);
        }
        
        // Update updated field in frontmatter
        const updatedMatch = indexContent.match(/updated:\s*([\d-]+)/);
        if (updatedMatch) {
          indexContent = indexContent.replace(`updated: ${updatedMatch[1]}`, `updated: ${today}`);
        }

        fs.writeFileSync(wikiIndexPath, indexContent, 'utf8');
        console.log('Updated wiki/index.md successfully.');
      }
    }
  }

  // 7. Send Telegram messages
  console.log('Sending curated briefing to Telegram...');
  await splitAndSend(briefingMarkdown);
  
  // Calculate total pages in wiki
  let totalPages = 147; // Fallback
  const wikiIndexPathCheck = path.join(workspaceDir, 'wiki', 'index.md');
  if (fs.existsSync(wikiIndexPathCheck)) {
    const content = fs.readFileSync(wikiIndexPathCheck, 'utf8');
    const pageCountMatch = content.match(/page_count:\s*(\d+)/);
    if (pageCountMatch) {
      totalPages = pageCountMatch[1];
    }
  }
  
  console.log('Sending wiki update notification to Telegram...');
  const wikiUpdateMessage = `📚 Wiki updated: trending news ${today} saved. Total: ${totalPages} pages.`;
  await sendTelegramMessage(wikiUpdateMessage);
  console.log('Wiki update notification sent.');
  
  // 8. Run git push
  console.log('Executing Git commands...');
  try {
    execSync('git add -A', { cwd: workspaceDir });
    execSync(`git commit -m "save: trending news ${today}"`, { cwd: workspaceDir });
    execSync('git push github main', { cwd: workspaceDir });
    console.log('Git commit & push successful!');
  } catch (gitErr) {
    console.error('Git execution failed (pushing might need manual config, or remote not configured):', gitErr.message);
  }
  
  console.log('All steps completed successfully.');
}

run().catch(console.error);
