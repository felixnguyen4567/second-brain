const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../openclaw-dashboard/openclaw.db');

try {
  const db = new Database(DB_PATH);
  const posts = db.prepare('SELECT id, content, platform_fb_status, platform_ig_status, platform_x_status, platform_li_status FROM social_posts ORDER BY id DESC LIMIT 5').all();
  console.log('Recent 5 posts:');
  console.log(JSON.stringify(posts, null, 2));
  db.close();
} catch (err) {
  console.error('Error reading database:', err.message);
}
