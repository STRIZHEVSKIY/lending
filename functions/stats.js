export async function onRequest({ env }) {
  const kv = env.LINK_TRACKER;
  const { keys } = await kv.list({ prefix: '' });

  let total = 0;
  const countries = {};

  for (const key of keys) {
    const value = await kv.get(key.name, 'text');
    if (key.name === 'of_total') {
      total = parseInt(value || '0', 10);
    } else if (key.name.startsWith('of_country_')) {
      const country = key.name.replace('of_country_', '');
      countries[country] = parseInt(value || '0', 10);
    }
  }

  const sortedCountries = Object.entries(countries)
    .sort(([, a], [, b]) => b - a);

  let tableRows = sortedCountries
    .map(([country, count]) => `
      <tr>
        <td><strong>${country}</strong></td>
        <td style="text-align:right; font-size:1.1em">${count.toLocaleString('ru-RU')}</td>
      </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Статистика OnlyFans</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    body { font-family: 'Inter', system-ui, sans-serif; background: #28082b; color: #f4f4f2; padding: 40px 20px; max-width: 600px; margin: 0 auto; }
    h1 { color: #e130b8; text-align: center; }
    .total { font-size: 1.6rem; text-align: center; margin: 20px 0 40px; background: rgba(225, 48, 184, 0.15); padding: 20px; border-radius: 16px; }
    table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden; }
    th, td { padding: 16px 20px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
    th { background: #421047; }
    tr:last-child td { border: none; }
    .footer { text-align: center; margin-top: 50px; color: #666; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>📊 Трекинг OnlyFans</h1>
  <div class="total">Всего переходов: <strong>${total}</strong></div>
  <h2 style="text-align:center; margin-bottom:20px;">По странам</h2>
  <table>
    <thead>
      <tr><th>Страна</th><th style="text-align:right">Переходов</th></tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
  <div class="footer">Обновляется в реальном времени • Cloudflare KV</div>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}