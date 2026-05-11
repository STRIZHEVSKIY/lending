export async function onRequest(context) {
  const { request, env, params } = context;
  const platform = params.platform?.toLowerCase();

  const targetUrls = {
    'of': 'https://onlyfans.com/hidden_ladyy',
  };

  const targetUrl = targetUrls[platform];
  if (!targetUrl) {
    return new Response('Not found', { status: 404 });
  }

  // === ТРЕКИНГ ===
  const country = request.cf?.country || 'XX';
  const kv = env.LINK_TRACKER;

  // счётчик по стране
  const countryKey = `of_country_${country}`;
  let count = parseInt(await kv.get(countryKey) || '0', 10);
  await kv.put(countryKey, (count + 1).toString());

  // общий счётчик
  const totalKey = `of_total`;
  let total = parseInt(await kv.get(totalKey) || '0', 10);
  await kv.put(totalKey, (total + 1).toString());

  console.log(`OnlyFans click from ${country} (total: ${total + 1})`);

  // редирект
  return Response.redirect(targetUrl, 302);
}

functions/go/[platform].js
