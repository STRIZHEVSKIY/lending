export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  // OnlyFans
  if (path === "/go" || path === "/go/" || path === "/go/of") {
    const targetUrl = "https://onlyfans.com/hidden_ladyy";
    const country = request.cf?.country || "XX";
    const kv = env.LINK_TRACKER;

    let total = parseInt((await kv.get("of_total")) || "0", 10);
    await kv.put("of_total", (total + 1).toString());

    let countryCount = parseInt((await kv.get(`of_country_${country}`)) || "0", 10);
    await kv.put(`of_country_${country}`, (countryCount + 1).toString());

    return Response.redirect(targetUrl, 302);
  }

  // Статистика
  if (path === "/stats") {
    const kv = env.LINK_TRACKER;
    let total = parseInt((await kv.get("of_total")) || "0", 10);

    const html = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><title>Статистика</title>
<style>body{font-family:Arial;background:#28082b;color:#fff;padding:40px;text-align:center;}</style>
</head>
<body>
  <h1>📊 Статистика OnlyFans</h1>
  <h2>Всего переходов: ${total}</h2>
  <p><a href="/">← Назад</a></p>
</body>
</html>`;

    return new Response(html, { headers: {"Content-Type": "text/html"} });
  }

  return env.ASSETS.fetch(request);
}