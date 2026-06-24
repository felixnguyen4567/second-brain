const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../openclaw-dashboard/openclaw.db');

try {
  const db = new Database(DB_PATH);
  const posts = db.prepare('SELECT * FROM social_posts ORDER BY id DESC LIMIT 5').all();
  console.log('Recent 5 posts:');
  posts.forEach(p => {
    console.log(`ID: ${p.id}`);
    console.log(`Content length: ${p.content ? p.content.length : 0}`);
    console.log(`Content FB: ${p.content_fb ? p.content_fb.substring(0, 100) : 'NULL'}`);
    console.log(`Content IG: ${p.content_ig ? p.content_ig.substring(0, 100) : 'NULL'}`);
    console.log(`Content X: ${p.content_x ? p.content_x.substring(0, 100) : 'NULL'}`);
    console.log(`Content LI: ${p.content_li ? p.content_li.substring(0, 100) : 'NULL'}`);
    console.log(`Content Threads: ${p.content_threads ? p.content_threads.substring(0, 100) : 'NULL'}`);
    console.log(`Status FB: ${p.platform_fb_status}, IG: ${p.platform_ig_status}, X: ${p.platform_x_status}, LI: ${p.platform_li_status}`);
    console.log('---');
  });
  db.close();
} catch (err) {
  console.error('Error reading database:', err.message);
}
