const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { db, refreshAuctions, CATEGORIES } = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- GET ENDPOINTS ---

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'zombie-auction-server' });
});

app.get('/api/user', (req, res) => {
  res.json({
    balance: db.user.balance,
    inventory: db.user.inventory
  });
});

app.get('/api/marketplace', (req, res) => {
  // Return items that are NOT in active auctions
  const activeAuctionIds = db.activeAuctions.map(a => a.id);
  const availableItems = db.marketplaceItems.filter(item => !activeAuctionIds.includes(item.id));
  res.json(availableItems);
});

app.get('/api/auctions', (req, res) => {
  res.json(db.activeAuctions);
});

app.post('/api/refresh-auctions', (req, res) => {
  refreshAuctions();
  res.json({ message: 'Auctions refreshed', auctions: db.activeAuctions });
});

// --- POST ENDPOINTS ---

app.post('/api/buy', (req, res) => {
  const { itemId, price } = req.body;
  
  if (db.user.balance < price) {
    return res.status(400).json({ error: 'Insufficient funds (Bio-Credits)' });
  }

  // Find item in marketplace
  const itemIndex = db.marketplaceItems.findIndex(i => i.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found or already sold out.' });
  }

  const item = db.marketplaceItems[itemIndex];
  
  // Deduct balance
  db.user.balance -= price;
  
  // Add to inventory
  const existingInventoryItem = db.user.inventory.find(i => i.id === itemId);
  if (existingInventoryItem) {
    existingInventoryItem.quantity += 1;
  } else {
    db.user.inventory.push({ ...item, quantity: 1 });
  }

  // Handle marketplace logic (remove from marketplace if bought from auction)
  const auctionIndex = db.activeAuctions.findIndex(a => a.id === itemId);
  if (auctionIndex !== -1) {
      db.activeAuctions.splice(auctionIndex, 1);
      db.marketplaceItems.splice(itemIndex, 1); // remove unique auction item entirely
  }

  // For common items, maybe we just don't remove them or decrease a stock counter
  // but for simplicity, let's keep common items infinitely buyable 

  res.json({ 
    message: 'Purchase successful', 
    balance: db.user.balance,
    item 
  });
});

app.post('/api/bid', (req, res) => {
  const { itemId, increaseAmount } = req.body;
  if (!increaseAmount || increaseAmount <= 0) {
    return res.status(400).json({ error: 'Invalid bid amount' });
  }

  const auctionItem = db.activeAuctions.find(a => a.id === itemId);
  if (!auctionItem) {
    return res.status(404).json({ error: 'Auction item not found' });
  }

  // Find the exact item in marketplace pool to sync price
  const itemIndex = db.marketplaceItems.findIndex(i => i.id === itemId);
  if (itemIndex !== -1) {
    db.marketplaceItems[itemIndex].basePrice += increaseAmount;
  }
  auctionItem.basePrice += increaseAmount;

  res.json({
    message: 'Bid placed successfully',
    newPrice: auctionItem.basePrice
  });
});

app.post('/api/sell', (req, res) => {
  const { category, quantity } = req.body;
  
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  
  // Base prices for selling raw materials
  const sellPrices = {
    'Food': 15,
    'Gear': 45,
    'Cloth': 20,
    'Medicine': 60
  };

  const totalPayout = sellPrices[category] * quantity;
  db.user.balance += totalPayout;

  // Since selling is raw categories, abstractly add to marketplace "pool"
  // For the sake of the mock, we just pay the user. 
  // We could dynamically generate a new common item to add to the marketplace, but that might clutter it.

  // Simulate pushing this sold good into the general rotation
  if (Math.random() > 0.5) {
      db.marketplaceItems.push({
          id: `scavenged-${Date.now()}`,
          name: `Scavenged ${category} Batch`,
          category,
          rarity: 'Normal',
          basePrice: sellPrices[category] * 2, // Marks up the price
          itemsLeft: quantity
      });
  }

  res.json({
    message: `Sold ${quantity} units of ${category} for ${totalPayout} bio-credits!`,
    payout: totalPayout,
    newBalance: db.user.balance
  });
});

app.listen(port, () => {
  console.log(`Zombie auction server listening on port ${port}`);
});
