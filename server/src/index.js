const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'zombie-auction-server' });
});

app.get('/api/lots', (_req, res) => {
  res.json([
    { id: 1, item: 'Armored School Bus', bid: 3200 },
    { id: 2, item: 'Solar-Powered Crossbow', bid: 1450 },
    { id: 3, item: 'Underground Bunker Keycard', bid: 5100 }
  ]);
});

app.listen(port, () => {
  console.log(`Zombie auction server listening on port ${port}`);
});
