export default function handler(req, res) {
  const menu = [
    { id: 1, name: 'Pizza' },
    { id: 2, name: 'Burger' },
  ];
  res.status(200).json(menu);
}
