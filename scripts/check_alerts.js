const https = require('https');

const TOKEN      = process.env.TELEGRAM_TOKEN;
const CHAT_ID    = process.env.TELEGRAM_CHAT_ID;
const HOMMING_TOKEN = process.env.HOMMING_TOKEN;

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { headers }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('JSON parse error: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function getAllContracts() {
  const headers = {
    'Authorization': `Bearer ${HOMMING_TOKEN}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  // Primera página para saber cuántas hay
  const first = await httpsGet(
    'https://app.homming.com/api/manager/contracts?per_page=100&page=1',
    headers
  );

  let contracts = [...first.data];
  const lastPage = first.last_page;

  // Resto de páginas si hay más
  for (let page = 2; page <= lastPage; page++) {
    const res = await httpsGet(
      `https://app.homming.com/api/manager/contracts?per_page=100&page=${page}`,
      headers
    );
    contracts = contracts.concat(res.data);
  }

  console.log(`✅ ${contracts.length} contratos cargados desde Homming.`);
  return contracts;
}

function diffDays(a, b) {
  return Math.round((a - b) / 86400000);
}

function checkAlerts(contracts) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const alerts = [];
  const seen = new Set();

  contracts.forEach(contract => {
    if (!contract.start_date && !contract.end_date) return;

    const tenantName = contract.tenants && contract.tenants.length > 0
      ? contract.tenants[0].name
      : contract.name || 'Inquilino';

    const propertyName = contract.property ? contract.property.name : 'Inmueble';
    const roomName = contract.room ? contract.room.name : '';
    const location = roomName ? `${propertyName} · ${roomName}` : propertyName;

    // --- ALERTA DE ENTRADA (start_date) ---
    if (contract.start_date) {
      const startDate = new Date(contract.start_date + 'T00:00:00');
      startDate.setHours(0, 0, 0, 0);
      const diffStart = diffDays(startDate, today);
      const dateStr = startDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
      const keyIn = `in_${contract.id}`;

      if (diffStart >= 12 && diffStart <= 16 && !seen.has(keyIn)) {
        alerts.push(`🔑 *${tenantName}* entra en ~2 semanas — ${dateStr}\n   📍 ${location} (faltan ${diffStart} días)`);
        seen.add(keyIn);
      }
      if (diffStart >= 5 && diffStart <= 9 && !seen.has(keyIn)) {
        alerts.push(`🔑 *${tenantName}* entra en ~1 semana — ${dateStr}\n   📍 ${location} (faltan ${diffStart} días)`);
        seen.add(keyIn);
      }
      if (diffStart === 1 && !seen.has(keyIn)) {
        alerts.push(`🔑 *${tenantName}* entra MAÑANA\n   📍 ${location}`);
        seen.add(keyIn);
      }
      if (diffStart === 0 && !seen.has(keyIn)) {
        alerts.push(`🔑 *${tenantName}* entra HOY\n   📍 ${location}`);
        seen.add(keyIn);
      }
    }

    // --- ALERTA DE SALIDA (end_date) ---
    if (contract.end_date) {
      const endDate = new Date(contract.end_date + 'T00:00:00');
      endDate.setHours(0, 0, 0, 0);
      const diffEnd = diffDays(endDate, today);
      const dateStr = endDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
      const keyOut = `out_${contract.id}`;

      if (diffEnd >= 55 && diffEnd <= 65 && !seen.has(keyOut)) {
        alerts.push(`📅 *${tenantName}* se va en ~2 meses — ${dateStr}\n   📍 ${location} (faltan ${diffEnd} días)`);
        seen.add(keyOut);
      }
      if (diffEnd >= 28 && diffEnd <= 35 && !seen.has(keyOut)) {
        alerts.push(`📅 *${tenantName}* se va en ~1 mes — ${dateStr}\n   📍 ${location} (faltan ${diffEnd} días)`);
        seen.add(keyOut);
      }
      if (diffEnd === 1 && !seen.has(keyOut)) {
        alerts.push(`🚨 *${tenantName}* sale MAÑANA\n   📍 ${location}`);
        seen.add(keyOut);
      }
      if (diffEnd === 0 && !seen.has(keyOut)) {
        alerts.push(`🚨 *${tenantName}* sale HOY\n   📍 ${location}`);
        seen.add(keyOut);
      }
    }
  });

  return alerts;
}

function sendTelegram(text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' });
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  try {
    const contracts = await getAllContracts();
    const alerts = checkAlerts(contracts);

    if (alerts.length === 0) {
      console.log('Sin alertas hoy.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
    const msg = `🏠 *Mis Casas — ${todayStr}*\n\n${alerts.join('\n\n')}`;

    await sendTelegram(msg);
    console.log(`✅ Enviadas ${alerts.length} alertas a Telegram.`);
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

main();
