async function test() {
  const url = 'http://localhost:3000/api/blocked-slots';
  let res = await fetch(url);
  console.log('GET:', await res.json());

  res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "2026-06-25": ["10:00 AM"] })
  });
  console.log('POST:', await res.json());

  res = await fetch(url);
  console.log('GET 2:', await res.json());
}
test().catch(console.error);
