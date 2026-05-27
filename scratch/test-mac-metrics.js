const os = require('os');
const { execSync } = require('child_process');

function getCpuUsage() {
  return new Promise((resolve) => {
    const start = os.cpus().map(cpu => cpu.times);
    setTimeout(() => {
      const end = os.cpus().map(cpu => cpu.times);
      let totalDiff = 0;
      let idleDiff = 0;
      
      for (let i = 0; i < start.length; i++) {
        const s = start[i];
        const e = end[i];
        
        const sTotal = s.user + s.nice + s.sys + s.idle + s.irq;
        const eTotal = e.user + e.nice + e.sys + e.idle + e.irq;
        
        totalDiff += (eTotal - sTotal);
        idleDiff += (e.idle - s.idle);
      }
      
      if (totalDiff === 0) {
        console.log("totalDiff is 0");
        resolve(0);
      } else {
        const usage = ((1 - idleDiff / totalDiff) * 100).toFixed(1);
        console.log({ totalDiff, idleDiff, usage });
        resolve(usage);
      }
    }, 200);
  });
}

async function getMetrics() {
  const model = execSync('sysctl -n hw.model').toString().trim();
  const osVersion = execSync('sw_vers -productVersion').toString().trim();
  
  let chip = '';
  try {
    chip = execSync('sysctl -n machdep.cpu.brand_string').toString().trim();
  } catch {
    try {
      chip = execSync('system_profiler SPHardwareDataType | grep "Chip:" | awk -F: \'{print $2}\'').toString().trim();
    } catch {
      chip = 'Apple Silicon';
    }
  }
  
  const cores = os.cpus().length;
  const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  const usedMem = ((os.totalmem() - os.freemem()) / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  const memPercent = (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(1);
  
  let diskPercent = 0;
  try {
    const diskStr = execSync("df -h / | tail -1 | awk '{print $5}'").toString().trim();
    diskPercent = parseInt(diskStr.replace('%', ''));
  } catch {}

  const cpu = await getCpuUsage();
  
  console.log({
    model,
    osVersion,
    chip,
    cores,
    totalMem,
    freeMem,
    usedMem,
    memPercent,
    diskPercent,
    cpu
  });
}

getMetrics();
