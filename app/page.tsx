
async function getData() {
  const res = await fetch('http://localhost:3000/api/menu');

  if (!res.ok) {
    throw new Error('Something went wrong');
  }

  return res.json();
}

export default async function Home() {
  const data = await getData();
  return <main>
    <h1>Menu Items</h1>
    <ul>{data.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
    </ul>
  </main>;
}

