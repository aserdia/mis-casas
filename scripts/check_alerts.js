const https = require('https');

const TOKEN   = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const HOUSES = ['Isla de Ons','Castellon','Castroviejo','Maudes','Real de Pinto','Villajoyosa'];

const EVENTS = [
  {id:1,  name:'Daniel Hernandez',          house:0,room:'Hab. 1',type:'entrada',date:'2026-03-15'},
  {id:2,  name:'Daniel Hernandez',          house:0,room:'Hab. 1',type:'salida', date:'2026-07-15'},
  {id:3,  name:'Nicolas Miguel Miguel',     house:0,room:'Hab. 2',type:'entrada',date:'2025-08-25'},
  {id:4,  name:'Nicolas Miguel Miguel',     house:0,room:'Hab. 2',type:'salida', date:'2026-08-24'},
  {id:5,  name:'Melih Aksoy',               house:0,room:'Hab. 3',type:'entrada',date:'2025-09-03'},
  {id:6,  name:'Melih Aksoy',               house:0,room:'Hab. 3',type:'salida', date:'2026-03-31'},
  {id:7,  name:'Chiara',                    house:0,room:'Hab. 3',type:'entrada',date:'2026-04-01'},
  {id:8,  name:'Chiara',                    house:0,room:'Hab. 3',type:'salida', date:'2026-06-30'},
  {id:9,  name:'Habitual',                  house:0,room:'Hab. 3',type:'entrada',date:'2026-07-01'},
  {id:10, name:'Habitual',                  house:0,room:'Hab. 3',type:'salida', date:'2026-10-30'},
  {id:11, name:'Sébastien',                 house:0,room:'Hab. 4',type:'entrada',date:'2026-01-03'},
  {id:12, name:'Sébastien',                 house:0,room:'Hab. 4',type:'salida', date:'2026-12-30'},
  {id:13, name:'Lucas Estevez Martinez',    house:0,room:'Hab. 5',type:'entrada',date:'2025-10-10'},
  {id:14, name:'Lucas Estevez Martinez',    house:0,room:'Hab. 5',type:'salida', date:'2026-07-31'},
  {id:15, name:'Sergio Martinez Rivera',    house:0,room:'Hab. 5',type:'entrada',date:'2026-08-01'},
  {id:16, name:'Sergio Martinez Rivera',    house:0,room:'Hab. 5',type:'salida', date:'2027-06-30'},
  {id:17, name:'Abdelwaheb Benchikh',       house:0,room:'Hab. 6',type:'entrada',date:'2025-09-10'},
  {id:18, name:'Abdelwaheb Benchikh',       house:0,room:'Hab. 6',type:'salida', date:'2026-03-10'},
  {id:19, name:'Nicole',                    house:0,room:'Hab. 6',type:'entrada',date:'2026-03-14'},
  {id:20, name:'Nicole',                    house:0,room:'Hab. 6',type:'salida', date:'2026-05-28'},
  {id:21, name:'Daniel Sánchez Rosas',      house:1,room:'Hab. 1',type:'entrada',date:'2026-06-24'},
  {id:22, name:'Daniel Sánchez Rosas',      house:1,room:'Hab. 1',type:'salida', date:'2027-03-24'},
  {id:23, name:'Andrea Sielli',             house:1,room:'Hab. 2',type:'entrada',date:'2025-10-03'},
  {id:24, name:'Andrea Sielli',             house:1,room:'Hab. 2',type:'salida', date:'2026-06-07'},
  {id:25, name:'Habitual',                  house:1,room:'Hab. 2',type:'entrada',date:'2026-06-08'},
  {id:26, name:'Habitual',                  house:1,room:'Hab. 2',type:'salida', date:'2027-01-07'},
  {id:27, name:'Harold',                    house:1,room:'Hab. 3',type:'entrada',date:'2025-06-17'},
  {id:28, name:'Harold',                    house:1,room:'Hab. 3',type:'salida', date:'2026-12-30'},
  {id:29, name:'Eva Calzadilla',            house:1,room:'Hab. 4',type:'entrada',date:'2025-10-01'},
  {id:30, name:'Eva Calzadilla',            house:1,room:'Hab. 4',type:'salida', date:'2026-09-01'},
  {id:31, name:'Beatriz Gomes',             house:1,room:'Hab. 4',type:'entrada',date:'2026-09-04'},
  {id:32, name:'Beatriz Gomes',             house:1,room:'Hab. 4',type:'salida', date:'2026-12-04'},
  {id:33, name:'Patricia Yang',             house:2,room:'Hab. 1',type:'entrada',date:'2025-11-11'},
  {id:34, name:'Patricia Yang',             house:2,room:'Hab. 1',type:'salida', date:'2026-03-28'},
  {id:35, name:'Melih Aksoy',               house:2,room:'Hab. 1',type:'entrada',date:'2026-04-01'},
  {id:36, name:'Melih Aksoy',               house:2,room:'Hab. 1',type:'salida', date:'2026-07-01'},
  {id:37, name:'Luis Solís Questiaux',      house:2,room:'Hab. 2',type:'entrada',date:'2026-01-01'},
  {id:38, name:'Luis Solís Questiaux',      house:2,room:'Hab. 2',type:'salida', date:'2026-05-31'},
  {id:39, name:'Edardo Novallet',           house:2,room:'Hab. 3',type:'entrada',date:'2025-11-12'},
  {id:40, name:'Edardo Novallet',           house:2,room:'Hab. 3',type:'salida', date:'2026-03-31'},
  {id:41, name:'Sarah Rensing',             house:2,room:'Hab. 3',type:'entrada',date:'2026-04-08'},
  {id:42, name:'Sarah Rensing',             house:2,room:'Hab. 3',type:'salida', date:'2026-06-15'},
  {id:43, name:'Beatriz Oliva Galvan',      house:2,room:'Hab. 4',type:'entrada',date:'2025-11-11'},
  {id:44, name:'Beatriz Oliva Galvan',      house:2,room:'Hab. 4',type:'salida', date:'2026-08-15'},
  {id:45, name:'Eneko Garcia',              house:2,room:'Hab. 5',type:'entrada',date:'2025-11-29'},
  {id:46, name:'Eneko Garcia',              house:2,room:'Hab. 5',type:'salida', date:'2026-09-30'},
  {id:47, name:'Paula Sanchez Bogaz',       house:2,room:'Hab. 6',type:'entrada',date:'2025-11-05'},
  {id:48, name:'Paula Sanchez Bogaz',       house:2,room:'Hab. 6',type:'salida', date:'2026-08-31'},
  {id:49, name:'Porical',                   house:2,room:'Hab. 6',type:'entrada',date:'2026-09-05'},
  {id:50, name:'Porical',                   house:2,room:'Hab. 6',type:'salida', date:'2026-12-31'},
  {id:51, name:'Aline Ribeiro',             house:3,room:'Hab. 1',type:'entrada',date:'2025-10-08'},
  {id:52, name:'Aline Ribeiro',             house:3,room:'Hab. 1',type:'salida', date:'2026-01-03'},
  {id:53, name:'Friedrich Albrecht Dang',   house:3,room:'Hab. 1',type:'entrada',date:'2026-02-01'},
  {id:54, name:'Friedrich Albrecht Dang',   house:3,room:'Hab. 1',type:'salida', date:'2026-04-14'},
  {id:55, name:'Iker',                      house:3,room:'Hab. 1',type:'entrada',date:'2026-04-24'},
  {id:56, name:'Iker',                      house:3,room:'Hab. 1',type:'salida', date:'2026-09-30'},
  {id:57, name:'Lea Racinet',               house:3,room:'Hab. 2',type:'entrada',date:'2025-08-15'},
  {id:58, name:'Lea Racinet',               house:3,room:'Hab. 2',type:'salida', date:'2026-06-30'},
  {id:59, name:'Eleftheria Tsago',          house:3,room:'Hab. 3',type:'entrada',date:'2025-08-16'},
  {id:60, name:'Eleftheria Tsago',          house:3,room:'Hab. 3',type:'salida', date:'2026-01-03'},
  {id:61, name:'Martin Theophane Lambotte', house:3,room:'Hab. 3',type:'entrada',date:'2026-02-14'},
  {id:62, name:'Martin Theophane Lambotte', house:3,room:'Hab. 3',type:'salida', date:'2026-06-19'},
  {id:63, name:'Francisco Stemann',         house:3,room:'Hab. 4',type:'entrada',date:'2025-10-09'},
  {id:64, name:'Francisco Stemann',         house:3,room:'Hab. 4',type:'salida', date:'2026-03-31'},
  {id:65, name:'Alessandro',                house:3,room:'Hab. 4',type:'entrada',date:'2026-04-08'},
  {id:66, name:'Alessandro',                house:3,room:'Hab. 4',type:'salida', date:'2026-09-30'},
  {id:67, name:'Matyas Zboril',             house:3,room:'Hab. 5',type:'entrada',date:'2026-01-05'},
  {id:68, name:'Matyas Zboril',             house:3,room:'Hab. 5',type:'salida', date:'2026-06-30'},
  {id:69, name:'Linus Czech',               house:3,room:'Hab. 6',type:'entrada',date:'2025-08-12'},
  {id:70, name:'Linus Czech',               house:3,room:'Hab. 6',type:'salida', date:'2026-01-02'},
  {id:71, name:'Sklaera Ntumba Kanana',     house:3,room:'Hab. 6',type:'entrada',date:'2026-02-01'},
  {id:72, name:'Sklaera Ntumba Kanana',     house:3,room:'Hab. 6',type:'salida', date:'2026-06-30'},
  {id:73, name:'Camilo Pinedo',             house:4,room:'Hab. 1',type:'entrada',date:'2025-11-06'},
  {id:74, name:'Camilo Pinedo',             house:4,room:'Hab. 1',type:'salida', date:'2026-09-30'},
  {id:75, name:'José Rodrigo Monteros',     house:4,room:'Hab. 2',type:'entrada',date:'2026-03-01'},
  {id:76, name:'José Rodrigo Monteros',     house:4,room:'Hab. 2',type:'salida', date:'2026-06-30'},
  {id:77, name:'Carlos Dubon',              house:4,room:'Hab. 3',type:'entrada',date:'2025-07-28'},
  {id:78, name:'Carlos Dubon',              house:4,room:'Hab. 3',type:'salida', date:'2026-01-11'},
  {id:79, name:'Lale',                      house:4,room:'Hab. 3',type:'entrada',date:'2026-02-01'},
  {id:80, name:'Lale',                      house:4,room:'Hab. 3',type:'salida', date:'2026-06-30'},
  {id:81, name:'Elia Mosna',                house:4,room:'Hab. 4',type:'entrada',date:'2025-12-01'},
  {id:82, name:'Elia Mosna',                house:4,room:'Hab. 4',type:'salida', date:'2026-08-31'},
  {id:83, name:'Gabriel Milla',             house:4,room:'Hab. 5',type:'entrada',date:'2025-11-01'},
  {id:84, name:'Gabriel Milla',             house:4,room:'Hab. 5',type:'salida', date:'2026-07-28'},
  {id:85, name:'Weronika',                  house:4,room:'Hab. 6',type:'entrada',date:'2025-08-29'},
  {id:86, name:'Weronika',                  house:4,room:'Hab. 6',type:'salida', date:'2026-03-06'},
  {id:87, name:'Benjamin',                  house:4,room:'Hab. 6',type:'entrada',date:'2026-04-02'},
  {id:88, name:'Benjamin',                  house:4,room:'Hab. 6',type:'salida', date:'2026-07-03'},
  {id:89, name:'ACE ABE',                   house:5,room:'Hab. 1',type:'entrada',date:'2025-11-28'},
  {id:90, name:'ACE ABE',                   house:5,room:'Hab. 1',type:'salida', date:'2026-12-31'},
  {id:91, name:'David Cabrera Rodriguez',   house:5,room:'Hab. 2',type:'entrada',date:'2025-10-01'},
  {id:92, name:'David Cabrera Rodriguez',   house:5,room:'Hab. 2',type:'salida', date:'2026-06-30'},
  {id:93, name:'Habitual',                  house:5,room:'Hab. 2',type:'entrada',date:'2026-07-01'},
  {id:94, name:'Habitual',                  house:5,room:'Hab. 2',type:'salida', date:'2027-06-30'},
  {id:95, name:'Víctor Madrona López',      house:5,room:'Hab. 3',type:'entrada',date:'2025-10-23'},
  {id:96, name:'Víctor Madrona López',      house:5,room:'Hab. 3',type:'salida', date:'2026-09-30'},
  {id:97, name:'Carmen Riaza Jiménez',      house:5,room:'Hab. 4',type:'entrada',date:'2025-10-26'},
  {id:98, name:'Carmen Riaza Jiménez',      house:5,room:'Hab. 4',type:'salida', date:'2026-06-30'},
  {id:99, name:'Erika',                     house:5,room:'Hab. 4',type:'entrada',date:'2026-07-01'},
  {id:100,name:'Erika',                     house:5,room:'Hab. 4',type:'salida', date:'2027-05-01'},
];

function diffDays(a, b) {
  return Math.round((a - b) / 86400000);
}

function checkAlerts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const alerts = [];

  EVENTS.forEach(ev => {
    const evDate = new Date(ev.date + 'T00:00:00');
    evDate.setHours(0, 0, 0, 0);
    const diff = diffDays(evDate, today);
    const h = HOUSES[ev.house];
    const dateStr = evDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

    if (ev.type === 'salida' && diff === 60)
      alerts.push(`📅 *${ev.name}* se va en 2 meses — ${dateStr}\n   📍 ${h} · ${ev.room}`);
    if (ev.type === 'salida' && diff === 30)
      alerts.push(`📅 *${ev.name}* se va en 1 mes — ${dateStr}\n   📍 ${h} · ${ev.room}`);
    if (ev.type === 'entrada' && diff === 14)
      alerts.push(`🔑 *${ev.name}* entra en 2 semanas — ${dateStr}\n   📍 ${h} · ${ev.room}`);
    if (ev.type === 'entrada' && diff === 7)
      alerts.push(`🔑 *${ev.name}* entra en 1 semana — ${dateStr}\n   📍 ${h} · ${ev.room}`);
    if (ev.type === 'salida' && diff === 1)
      alerts.push(`🚨 *${ev.name}* sale MAÑANA\n   📍 ${h} · ${ev.room}`);
    if (ev.type === 'entrada' && diff === 1)
      alerts.push(`🔑 *${ev.name}* entra MAÑANA\n   📍 ${h} · ${ev.room}`);
    if (ev.type === 'salida' && diff === 0)
      alerts.push(`🚨 *${ev.name}* sale HOY\n   📍 ${h} · ${ev.room}`);
    if (ev.type === 'entrada' && diff === 0)
      alerts.push(`🔑 *${ev.name}* entra HOY\n   📍 ${h} · ${ev.room}`);
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
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
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
  const alerts = checkAlerts();
  if (alerts.length === 0) {
    console.log('Sin alertas hoy.');
    return;
  }
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const msg = `🏠 *Mis Casas — ${today}*\n\n${alerts.join('\n\n')}`;
  try {
    await sendTelegram(msg);
    console.log(`Enviadas ${alerts.length} alertas.`);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

main();
