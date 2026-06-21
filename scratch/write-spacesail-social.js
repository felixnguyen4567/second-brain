const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Database = require('better-sqlite3');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AUTOMATION_API_KEY = process.env.AUTOMATION_API_KEY;
const VERCEL_API_URL = 'https://felixng.vercel.app/api/automation';
const DB_PATH = path.join(__dirname, '../../openclaw-dashboard/openclaw.db');

const TOPIC = "Spacesail and the Direct-to-Cell Revolution: Can AI Live Without Terrestrial Internet?";
const TYPE = "AI_NEWS";
const PILLAR = "Website Article (long-form)";
const SLUG = "spacesail-direct-to-cell-satellite-ai";
const COVER_IMAGE_URL = "https://image.pollinations.ai/p/futuristic_low_earth_orbit_satellite_beaming_laser_signals_to_a_modern_smartphone_in_a_remote_mountainous_landscape,_glowing_ai_constellation_lines_in_the_sky,_cinematic_lighting,_cyberpunk_astral_palette,_3d_render,_octane_style?width=1200&height=630&nologo=true&seed=99281";

const ARTICLE_CONTENT = `Sự kiện ngày 20/06/2026 vừa qua, khi công ty công nghệ vệ tinh Spacesail của Trung Quốc thực hiện thành công cuộc gọi thoại trực tiếp từ vệ tinh LEO (Quỹ đạo Trái Đất tầm thấp) đến điện thoại thông minh thương mại thông thường, không chỉ đơn thuần là một tin tức viễn thông. Đây là một bước ngoặt kiến trúc quan trọng cho toàn bộ nền công nghiệp phần mềm và trí tuệ nhân tạo.

Điểm mấu chốt của cột mốc này nằm ở cụm từ "standard, unmodified commercial smartphone" (điện thoại thông minh thương mại thông thường không sửa đổi phần cứng). Trước đây, liên lạc vệ tinh yêu cầu những thiết bị cồng kềnh, sở hữu ăng-ten tùy chỉnh lớn và chip xử lý tín hiệu chuyên dụng đắt đỏ. Spacesail đã chứng minh rằng các chùm vệ tinh tầm thấp thế hệ mới của họ có thể giao tiếp trực tiếp với các dải tần sóng di động tiêu chuẩn (LTE/5G) của các thiết bị mà hàng tỷ người đang đút túi hàng ngày.

Khác với các hệ thống gọi vệ tinh truyền thống của Trung Quốc hoạt động trên quỹ đạo địa tĩnh (GEO) cách Trái Đất tới 36.000 km (như hệ thống Tiantong-1), Spacesail vận hành trên quỹ đạo thấp chỉ cách mặt đất khoảng 500-1000 km. Khoảng cách gần hơn hàng chục lần giúp giảm thiểu độ trễ tín hiệu xuống mức tối đa (dưới 30ms) và tăng cường độ mạnh của sóng truyền dẫn, đạt chất lượng âm thanh ổn định tương đương với mạng 5G mặt đất. Với chùm chòm sao dự kiến đạt 324 vệ tinh vào cuối năm 2026 và hướng tới hơn 15.000 vệ tinh trong tương lai, một hạ tầng mạng toàn cầu không góc chết đang dần thành hình.

## Nút Thắt Cổ Chai Của AI Đám Mây Và Lời Giải Mang Tên "Không Gian"

Hiện tại, hầu hết các mô hình AI tiên tiến nhất—từ GPT-4o, Claude 3.5 Sonnet cho tới các mô hình lập luận như o3-pro—đều là những "gã khổng lồ" ngốn năng lượng, chạy trên hàng vạn GPU bên trong các siêu trung tâm dữ liệu đặt tại các lục địa lớn. Để sử dụng chúng, thiết bị của người dùng phải liên tục duy trì kết nối mạng mặt đất tốc độ cao và ổn định.

Điều này tạo ra một điểm yếu chí mạng (single point of failure) cho các giải pháp AI B2B và B2C. Trong các tình huống cứu hộ thiên tai khi các cột thu phát sóng mặt đất bị phá hủy, khi di chuyển trên đại dương, thám hiểm sa mạc, hoặc hoạt động trong các vùng tranh chấp quân sự nơi hạ tầng viễn thông bị phá sóng, các hệ thống AI hiện đại nhất đều trở thành những cục gạch vô dụng.

Sự trỗi dậy của kết nối Direct-to-Cell LEO như Spacesail mang đến một lời giải hoàn hảo. Bằng cách bắc một chiếc cầu nối trực tiếp từ thiết bị cầm tay lên quỹ đạo không gian, LEO đóng vai trò như một đường truyền dự phòng (backhaul) vĩnh cửu. AI không còn bị giới hạn bởi phạm vi của các sợi cáp quang biển hay cột phát sóng viễn thông đô thị. Dòng dữ liệu của các tác nhân AI có thể chảy thông suốt từ đỉnh Everest hay giữa Thái Bình Dương về các trung tâm xử lý dữ liệu đám mây.

## Khi Edge AI Gặp LEO Vệ Tinh: Kiến Trúc Lai "Hybrid AI" Tối Ưu Hóa Chi Phí

Tuy nhiên, băng thông của kết nối vệ tinh Direct-to-Cell, dù đã được cải thiện, vẫn là một tài nguyên cực kỳ đắt đỏ và giới hạn so với cáp quang mặt đất. Việc gửi hàng megabyte dữ liệu prompt hoặc mã nguồn thô lên vệ tinh cho mỗi lượt chat là một giải pháp phi thực tế về cả chi phí lẫn hiệu năng.

Đây là lúc kiến trúc lai **Hybrid AI** (kết hợp AI tại biên và AI đám mây) lên ngôi. Với sự phát triển của các bộ xử lý NPU mạnh mẽ tích hợp sẵn trên chip di động (như Apple Silicon, Snapdragon Elite), các thiết bị di động ngày nay có thể tự chạy các mô hình ngôn ngữ nhỏ (SLM - Small Language Models) như Llama 3 8B, Phi-3, hay Gemini Nano một cách mượt mà và hoàn toàn offline.

Theo kiến trúc này, 90% các truy vấn thông thường, xử lý dữ liệu cục bộ và suy luận đơn giản sẽ được thực hiện ngay trên NPU của thiết bị mà không tốn một byte băng thông nào. Chỉ khi gặp các bài toán lập luận phức tạp đòi hỏi khả năng tư duy cao của mô hình biên giới, hoặc khi cần cập nhật dữ liệu thời gian thực từ mạng internet toàn cầu, thiết bị mới kích hoạt đường truyền vệ tinh LEO.

Để tối ưu hóa luồng dữ liệu này, các nhà phát triển sẽ sử dụng các kỹ thuật nén ngữ cảnh nâng cao như công cụ **Headroom** (giúp cắt giảm 60-95% dung lượng token) để đóng gói dữ liệu đầu vào thành một "hộp cơm Bento" siêu nhỏ gọn trước khi gửi lên quỹ đạo. Sự kết hợp này mang lại khả năng vận hành bền bỉ, tiết kiệm chi phí nhưng vẫn đảm bảo sức mạnh trí tuệ tối đa cho người dùng cuối.

## Điện Toán AI Trên Quỹ Đạo (Orbital AI Compute) - Tương Lai Của Trí Tuệ Nhân Tạo Không Gian

Bước đi tiếp theo của cuộc cách mạng này không chỉ dừng lại ở việc dùng vệ tinh làm bộ định tuyến dữ liệu (router). Các kỹ sư phần cứng và vũ trụ đang hiện thực hóa ý tưởng đưa các cụm chip xử lý AI (NPU/TPU chuyên dụng chịu được bức xạ không gian) lên trực tiếp các vệ tinh LEO để thực hiện suy luận ngay trên quỹ đạo (Orbital Edge Compute).

Hãy tưởng tượng một chùm vệ tinh quan sát Trái Đất chụp hàng terabyte ảnh độ phân giải cao mỗi giây. Thay vì truyền toàn bộ đống ảnh thô khổng lồ đó về mặt đất để phân tích—một quá trình tốn hàng giờ đồng hồ và nghẽn băng thông—các mô hình thị giác máy tính chạy trực tiếp trên vệ tinh sẽ quét ảnh thời gian thực. AI trên không gian có thể tự động phát hiện đám cháy rừng đang nhen nhóm, các vụ tràn dầu trên biển hoặc hoạt động di chuyển tàu thuyền bất thường, và chỉ gửi về mặt đất một vài kilobyte văn bản cảnh báo tọa độ.

Điều này làm thay đổi hoàn toàn cuộc chơi. AI không chỉ hoạt động "nhờ" vệ tinh, mà bản thân chùm vệ tinh đã trở thành một siêu não bộ AI phân tán, bao bọc lấy Trái Đất, cung cấp dịch vụ phân tích biên từ không gian với tốc độ ánh sáng.

## Thách Thức Và Cách Lập Trình Viên Đón Đầu Xu Hướng

Mặc dù viễn cảnh rất tươi sáng, việc phát triển ứng dụng AI tận dụng kết nối vệ tinh đòi hỏi một tư duy lập trình hoàn toàn khác. Lập trình viên phải học cách sống chung với độ trễ biến động, băng thông hẹp và tỷ lệ mất gói tin (packet loss) cao của sóng vô tuyến không gian.

Để chuẩn bị cho kỷ nguyên này, các kỹ sư phần mềm cần tập trung vào các kỹ năng cốt lõi:
- **Thiết kế Context Engineering siêu tinh gọn**: Sử dụng các tiêu chuẩn mở như Model Context Protocol (MCP) để tách biệt rõ ràng phần logic xử lý của AI và phần dữ liệu hệ thống cục bộ. Chỉ truyền các chỉ thị (instructions) cốt lõi qua sóng vệ tinh.
- **Chiến lược Caching chủ động**: Tích hợp các cơ sở dữ liệu vector siêu nhẹ locally trên thiết bị để lưu trữ bối cảnh lịch sử trò chuyện, tránh việc phải gửi lại toàn bộ hội thoại lên đám mây vệ tinh.
- **Xây dựng cơ chế Fallback mượt mà**: Đảm bảo ứng dụng có thể tự động hạ cấp năng lượng xử lý (graceful degradation) sang mô hình offline cục bộ khi mất kết nối vệ tinh, và tự động đồng bộ lại khi kết nối được tái lập.

Spacesail và Direct-to-Cell đã mở ra một kỷ nguyên mới. Mạng lưới Internet mặt đất không còn là điều kiện tiên quyết để AI hoạt động. Các nhà phát triển xây dựng ứng dụng với tư duy "Space-ready" sẽ là những người nắm giữ lợi thế cạnh tranh lớn nhất trong những năm tới.`;

const SOCIAL_COPIES = {
  x: `Spacesail vừa thực hiện cuộc gọi vệ tinh trực tiếp qua smartphone thương mại thông thường.

Nhưng đây không chỉ là câu chuyện viễn thông. Đây là lời giải cho bài toán: Làm sao chạy AI khi mất sạch internet mặt đất? 🧵

1/6 Cột mốc viễn thông:
Ngày 20/06/2026, Spacesail (Trung Quốc) gọi thoại thành công từ vệ tinh LEO trực tiếp tới điện thoại thông thường không qua sửa đổi phần cứng.
↳ Độ trễ cực thấp (dưới 30ms), âm thanh mượt như sóng 5G đô thị.
↳ Tránh hoàn toàn việc sử dụng thiết bị thu phát vệ tinh cồng kềnh.

2/6 Điểm yếu chí mạng của AI hiện đại:
Hầu hết các LLMs như GPT-4o hay Claude đều chạy trên đám mây.
↳ Khi thiên tai làm sập trạm phát sóng mặt đất, hoặc khi di chuyển trên biển, AI lập tức biến thành một "cục gạch" vô dụng.
↳ Sự phụ thuộc này giới hạn khả năng ứng dụng AI trong thực địa nhạy cảm.

3/6 LEO Satellite như một backhaul vĩnh cửu:
Bằng cách bắc cầu thẳng lên quỹ đạo, các chùm vệ tinh LEO cung cấp đường truyền internet toàn cầu không góc chết.
↳ AI agents giờ đây có thể duy trì luồng dữ liệu từ bất cứ nơi nào trên Trái Đất.

4/6 Kết hợp Local AI + LEO (Kiến trúc Hybrid):
Băng thông vệ tinh rất đắt và giới hạn.
↳ Thiết bị di động sẽ chạy SLMs (Llama 8B, Gemini Nano) trên NPU offline cho 90% tác vụ thông thường.
↳ Chỉ truyền các truy vấn phức tạp hoặc yêu cầu tìm kiếm lên vệ tinh.

5/6 Tối ưu hóa dữ liệu không gian:
Lập trình viên cần áp dụng các kỹ thuật nén bối cảnh (như Headroom giúp nén 60-95% token) để đóng gói dữ liệu siêu nhỏ trước khi gửi lên không gian.
↳ Đồng thời dùng Model Context Protocol (MCP) để tách biệt logic LLM với dữ liệu thiết bị locally.

6/6 Tương lai gần: Orbital Edge Compute.
Hạ tầng AI sẽ được đưa lên trực tiếp các vệ tinh LEO. AI chạy ngay trên quỹ đạo, phân tích ảnh vệ tinh và chỉ bắn về mặt đất kết quả cảnh báo dạng kilobyte.
↳ Internet mặt đất không còn là điều kiện bắt buộc để AI hoạt động!

Anh em nghĩ sao về tương lai của AI chạy qua vệ tinh? Thảo luận bên dưới nhé! 👇`,

  fb: `🚀 THE GEOPOLITICAL AI KYC ERA HAS BEGUN: Anthropic restores Fable 5 with mandatory identity verification!

After a six-day shutdown directed by the U.S. government due to national security concerns, Anthropic has restored its frontier Fable 5 model. But it comes with a major catch: tighter safety classifiers, continuous enterprise compliance screening, and mandatory identity verification (KYC) for API access in certain jurisdictions. 

For B2B systems builders, this marks a massive inflection point. AI models are no longer simple software tools—they are dual-use national assets subject to geopolitical leverage.

---

🚀 KỶ NGUYÊN KYC AI ĐỊA CHÍNH TRỊ BẮT ĐẦU: Anthropic khôi phục Fable 5 kèm xác minh danh tính bắt buộc!

Sau 6 ngày ngưng hoạt động theo lệnh của chính phủ Mỹ do lo ngại về an ninh quốc gia, Anthropic đã chính thức mở lại mô hình Fable 5. Tuy nhiên, sự trở lại này đi kèm các rào cản nghiêm ngặt: thắt chặt bộ lọc an toàn thời gian thực, quét tuân thủ liên tục đối với doanh nghiệp và bắt buộc xác minh KYC (hộ chiếu/ID) để truy cập API tại một số quốc gia.

Đối với các nhà xây dựng hệ thống B2B, đây là hồi chuông cảnh tỉnh lớn. AI biên giới không còn là công cụ phần mềm thông thường—chúng là tài sản lưỡng dụng chịu kiểm soát địa chính trị trực tiếp.

#AI #Safety #Anthropic #Fable5 #Geopolitics #VietnamTech`,

  li: `Geostationary satellites are no longer the bottleneck. The direct-to-cell Low Earth Orbit (LEO) satellite network is officially here, and it is about to redefine the runtime environment for autonomous AI.

On June 20, 2026, Spacesail successfully completed direct-to-satellite voice calls using standard, unmodified commercial smartphones over its new LEO test satellite (DTC 01). No custom antennas. No special hardware modifications. Just standard LTE/5G protocols talking directly to space.

Why should AI engineers care?
Currently, state-of-the-art LLMs and multi-agent workflows suffer from a physical vulnerability: they are bound to terrestrial networking infrastructure. In disaster recovery, remote field operations, maritime shipping, or aviation, losing cellular tower access means losing AI intelligence. 

By utilizing LEO networks as a permanent backhaul, we are entering the era of "Un-interruptible AI." However, space link bandwidth is a premium resource. 

To adapt, our software architectures must shift toward a Hybrid AI model:
↳ Edge Pre-processing: Run small models (Llama 8B, Phi-3) locally on mobile NPUs for 90% of user interactions.
↳ Context Compression: Utilize advanced token-reduction tools (like Headroom, which compresses context by 60-95%) to pack state representations before transmission.
↳ Model Context Protocol (MCP): decouple the reasoning engine (running in the cloud/orbit) from local device tools and sensors, minimizing raw data exchange.

The next frontier is Orbital Edge Compute—deploying space-grade NPUs to run computer vision and reasoning directly on LEO hardware, sending down only processed, low-bandwidth text alerts.

Sovereignty and resiliency are moving from the data center to the celestial orbit. Are your applications prepared to run "space-ready"?

#SoftwareArchitecture #LEO #DirectToCell #EdgeAI #SystemsDesign #CTO`,

  ig: `📸 Dùng AI ở nơi không có sóng điện thoại? 🌍🛰️

Cột mốc mới nhất từ Spacesail (Trung Quốc) thực hiện cuộc gọi vệ tinh trực tiếp tới điện thoại thông minh thông thường mở ra tương lai: AI hoạt động không cần Internet mặt đất.

Khi hạ tầng không gian kết hợp với Edge AI, chúng ta sẽ có những ứng dụng thông minh hoạt động độc lập bất kể địa lý, bất chấp thiên tai hay mất sóng.

Xem ngay phân tích kiến trúc lai giúp tối ưu hóa chi phí khi chạy AI qua vệ tinh! 👉

.
.
.
#Spacesail #DirectToCell #LEOSatellite #EdgeAI #HybridAI #TechNews #FelixAIDaily #SpaceReady

=== CAROUSEL OUTLINE ===
Slide 1 — Hook:
"AI KHÔNG CẦN INTERNET MẶT ĐẤT? 🛰️🌍"
Subtitle: Spacesail thử nghiệm thành công gọi vệ tinh qua điện thoại thương mại. Bước đệm đưa AI lên vũ trụ.

Slide 2 — The Milestone:
"Cuộc gọi trực tiếp qua smartphone"
↳ Spacesail DTC 01 LEO thực hiện kết nối trực tiếp đến điện thoại thông thường.
↳ Không cần ăng-ten ngoài, không cần chip chuyên dụng.
↳ Độ trễ cực thấp (<30ms), âm thanh chuẩn 5G.

Slide 3 — The AI Bottleneck:
"Điểm yếu chí mạng của Cloud AI"
↳ Các mô hình AI mạnh nhất đều chạy trên đám mây lục địa.
↳ Mất sóng di động mặt đất = AI ngừng hoạt động hoàn toàn.
↳ Rủi ro lớn cho cứu hộ, hàng hải, và nông nghiệp công nghệ cao.

Slide 4 — The Architecture:
"Kiến trúc lai Hybrid AI"
↳ Chạy mô hình ngôn ngữ nhỏ (Llama, Gemini Nano) offline trên NPU điện thoại cho 90% tác vụ.
↳ Chỉ gửi truy vấn lập luận phức tạp hoặc tìm kiếm thời gian thực lên vệ tinh LEO.

Slide 5 — Bandwidth Control:
"Nén dữ liệu không gian"
↳ Sử dụng kỹ thuật nén bối cảnh (như Headroom nén 60-95% token) để tiết kiệm băng thông vệ tinh đắt đỏ.
↳ Sử dụng MCP để đồng bộ tác vụ cục bộ.

Slide 6 — In Orbit Inference:
"Điện toán AI trên quỹ đạo"
↳ Đưa NPU chuyên dụng lên vệ tinh để xử lý dữ liệu trực tiếp trong không gian.
↳ Vệ tinh phân tích ảnh thị giác máy tính và chỉ bắn dữ liệu văn bản nhỏ gọn về mặt đất.

Slide 7 — CTA:
"Sẵn sàng cho tương lai 'Space-ready'! 🔑"
Bạn nghĩ AI qua vệ tinh sẽ thay đổi ngành công nghiệp nào nhiều nhất?
Follow @felixng.dev để đón đầu các xu hướng kiến trúc công nghệ mới nhất!

=== REEL IDEA ===
[VISUAL: A person hiking in a remote mountain range, looking at their phone. Text overlay: "No signal, but AI still works?"]
Imagine being in the middle of a desert, completely offline. No cell towers. No Wi-Fi. 
[VISUAL: Cut to a satellite orbiting the earth, sending a signal beam downward]
But your AI is still fully responsive. How?
Chinese satellite firm Spacesail just achieved a milestone: direct voice calls from a LEO satellite to standard, unmodified smartphones.
[VISUAL: Graphic showing local NPU chip processing data, then sending a tiny packet up to a satellite]
By combining Local Edge AI (running on your phone's NPU) with this space-based Direct-to-Cell network, we get "Un-interruptible AI."
[VISUAL: Futuristic abstract code screen showing token compression ratios]
Developers can now build space-ready apps that compress data by 95% using context compressors like Headroom, routing deep queries through orbit.
[SOUND: Ambient space synth music fading out]
Are you ready to design apps for the sky? Tell us in the comments!`,

  tt: `[0-2s HOOK — Nói thẳng vào camera, tay cầm điện thoại thông thường và chỉ tay lên trời]
"Bạn có tin sắp tới chúng ta sẽ dùng AI trực tiếp từ vũ trụ mà không cần sóng điện thoại mặt đất?"

[2-5s CONTEXT]
"Ngày 20/06 vừa qua, Spacesail đã thử nghiệm thành công cuộc gọi trực tiếp từ vệ tinh tầm thấp đến điện thoại di động thông thường, mượt mà như sóng 5G."

[5-15s KEY POINT 1]
[VISUAL CUE: Hiệu ứng vệ tinh LEO bay quanh Trái Đất cách 500km]
"Trước đây, mất sóng di động là các ứng dụng AI như ChatGPT hay Claude chịu chết vì chúng chạy hoàn toàn trên đám mây mặt đất. Nhưng vệ tinh LEO Direct-to-Cell sẽ là đường truyền dự phòng vĩnh viễn ở mọi ngóc ngách địa cầu."

[15-25s KEY POINT 2]
[VISUAL CUE: Sơ đồ điện thoại tự xử lý AI offline, chỉ đẩy dữ liệu nén 95% lên vệ tinh]
"Tuy nhiên, băng thông vệ tinh rất đắt. Giải pháp là kiến trúc Hybrid AI: Tự chạy mô hình nhỏ offline trên NPU điện thoại, và chỉ gửi dữ liệu đã nén siêu gọn lên không gian khi cần xử lý cực khó."

[25-35s KEY POINT 3]
[VISUAL CUE: Chip AI sáng lên trên mô hình vệ tinh]
"Tương lai xa hơn, các vệ tinh sẽ tự tích hợp chip AI để xử lý dữ liệu ngay trên quỹ đạo rồi bắn thông tin tóm tắt siêu nhỏ về mặt đất. AI không chỉ chạy nhờ vệ tinh, vũ trụ chính là đám mây AI tiếp theo!"

[35-40s CTA]
[VISUAL CUE: Nút Follow và Like nhấp nháy]
"Anh em nghĩ sao về cuộc cách mạng AI không gian này? Để lại bình luận và follow kênh để không bỏ lỡ xu hướng công nghệ nhé!"`,

  threads: `Spacesail vừa gọi thoại thành công từ vệ tinh Direct-to-Cell thẳng tới smartphone thương mại thông thường. 🛰️📱

Đây là mảnh ghép cuối cùng mở ra kỷ nguyên: AI không cần internet mặt đất.

Làm thế nào để ứng dụng AI hoạt động trên không gian? Phân tích nhanh cho anh em ở bình luận nhé 👇

---

Tại sao mất kết nối trạm phát sóng mặt đất lại là chí mạng với AI?
Hầu hết LLMs chạy trên các data center đám mây khổng lồ. Mất kết nối mạng đồng nghĩa AI biến thành gạch.

Chùm vệ tinh tầm thấp LEO (như Spacesail đang xây dựng) đóng vai trò là một đường truyền dự phòng vĩnh cửu từ mọi địa hình.

---

Băng thông vệ tinh cực kỳ đắt đỏ. Giải pháp sống còn là kiến trúc Hybrid AI:
1. Thiết bị chạy mô hình nhỏ (Llama 8B, Gemini Nano) offline bằng NPU nội bộ cho 90% tác vụ thông thường.
2. Sử dụng công cụ nén ngữ cảnh như Headroom (giảm 60-95% token) để đóng gói dữ liệu thật nhỏ gọn trước khi bắn lên vệ tinh khi cần lập luận khó.

---

Xuuyên suốt xu hướng tiếp theo: Orbital Edge Compute.
Tích hợp chip AI trực tiếp lên vệ tinh LEO. Vệ tinh chụp ảnh Trái Đất, AI tự động quét tìm cháy rừng, tràn dầu và chỉ gửi tọa độ cảnh báo dạng văn bản cực nhẹ về mặt đất.

Bản thân chòm vệ tinh sẽ trở thành một siêu não bộ AI phân tán bao bọc Trái Đất.

Anh em nghĩ sao về xu hướng AI vệ tinh này? Comment bên dưới nhé! 👇`
};

async function main() {
  console.log('♟️ Starting Spacesail Content Generation & Injection...');

  // 1. Submit draft to Website CMS API
  if (AUTOMATION_API_KEY) {
    console.log('\n🚀 Submitting draft to Felix\'s website CMS...');
    await submitDraftToWebsite(TOPIC, SLUG, ARTICLE_CONTENT, TYPE, COVER_IMAGE_URL);
  } else {
    console.log('⚠️ Skipping website submission (AUTOMATION_API_KEY is not defined).');
  }

  // 2. SQLite Dashboard Post Injection
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
