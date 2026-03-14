const { v4: uuidv4 } = require('uuid');

const CATEGORIES = ['Food', 'Gear', 'Cloth', 'Medicine'];
const RARITIES = ['Normal', 'Rare', 'Ultra Rare', 'Zombie'];

// Base pricing by rarity
const BASE_PRICES = {
  'Normal': { min: 50, max: 200 },
  'Rare': { min: 300, max: 800 },
  'Ultra Rare': { min: 1000, max: 5000 },
  'Zombie': { min: 7000, max: 15000 },
};

const ITEM_NAMES = {
  'Food': ['Canned Brains', 'Irradiated Spam', 'Mutant Rat Skewer', 'Fungus Bread', 'Stale Rations', 'Pus-filled Berries', 'Purified Water', 'Zombie Jerky'],
  'Gear': ['Rusty Machete', 'Radium Flashlight', 'Spiked Baseball Bat', 'Makeshift Riot Shield', 'Tape & Nails', 'Biohazard Mask', 'Solar Charger', 'Wrench'],
  'Cloth': ['Torn Leather Jacket', 'Hazmat Suit', 'Blood-stained Bandana', 'Kevlar Vest', 'Reinforced Combat Boots', 'Ghillie Suit', 'Ragged T-shirt', 'Winter Coat'],
  'Medicine': ['Used Medkit', 'Suspicious Syringe', 'Antibiotics', 'Radium Pills', 'Bandages', 'Stinky Salve', 'Adrenaline Shot', 'Painkillers']
};

const CATEGORY_IMAGES = {
  'Food': 'https://images.unsplash.com/photo-1595856419794-fb5f8dc05d6a?auto=format&fit=crop&w=500&q=80',
  'Gear': 'https://images.unsplash.com/photo-1533250266398-fe9d22fa45ac?auto=format&fit=crop&w=500&q=80',
  'Cloth': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80',
  'Medicine': 'https://images.unsplash.com/photo-1584308666744-24d5e4b6c31f?auto=format&fit=crop&w=500&q=80'
};

function generateItems(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const names = ITEM_NAMES[category];
    const name = names[Math.floor(Math.random() * names.length)];
    
    // Rarity distribution: Normal (60%), Rare (25%), Ultra Rare (10%), Zombie (5%)
    const rand = Math.random();
    let rarity = 'Normal';
    if (rand > 0.95) rarity = 'Zombie';
    else if (rand > 0.85) rarity = 'Ultra Rare';
    else if (rand > 0.60) rarity = 'Rare';

    const priceRange = BASE_PRICES[rarity];
    const basePrice = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
    
    // Items left for a set (surprise factor)
    const itemsLeft = Math.floor(Math.random() * 15) + 1;

    items.push({
      id: uuidv4(),
      name: `${Math.random() > 0.5 ? 'Fungus-covered' : 'Radium-laced'} ${name}`,
      category,
      rarity,
      basePrice,
      itemsLeft,
      imageUrl: CATEGORY_IMAGES[category]
    });
  }

  // Inject the required Omnitrix
  items.push({
    id: 'omnitrix-special-001',
    name: 'The Omnitrix (Glitch Variant)',
    category: 'Gear',
    rarity: 'Ultra Rare', // Or Zombie, based on lore preference
    basePrice: 50000,
    itemsLeft: 1,
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80'
  });

  // Inject LPG Cylinder
  items.push({
    id: 'lpg-special-002',
    name: 'Heavy Duty LPG Cylinder',
    category: 'Gear',
    rarity: 'Rare',
    basePrice: 20000,
    itemsLeft: 2,
    imageUrl: 'https://images.unsplash.com/photo-1596707431320-beab0ba2e313?auto=format&fit=crop&w=500&q=80'
  });

  // Inject Captive Zombie
  items.push({
    id: 'zombie-special-003',
    name: 'Living Captive Zombie',
    category: 'Medicine', // Bio-asset
    rarity: 'Zombie',
    basePrice: 100000,
    itemsLeft: 1,
    imageUrl: 'https://images.unsplash.com/photo-1606822350853-241b1d798bfd?auto=format&fit=crop&w=500&q=80'
  });

  return items;
}

// Global State
const db = {
  marketplaceItems: generateItems(100),
  activeAuctions: [],
  user: {
    balance: 5000,
    inventory: [] // Array of { id, name, category, rarity, basePrice, quantity }
  }
};

// Helper: refresh active auctions with random rare+ items
function refreshAuctions() {
  const rareItems = db.marketplaceItems.filter(item => 
    item.rarity === 'Rare' || item.rarity === 'Ultra Rare' || item.rarity === 'Zombie'
  );
  
  // Pick 3-5 random items
  const count = Math.floor(Math.random() * 3) + 3;
  const shuffled = [...rareItems].sort(() => 0.5 - Math.random());
  db.activeAuctions = shuffled.slice(0, count);
}

// Initial auction population
refreshAuctions();

module.exports = {
  db,
  refreshAuctions,
  CATEGORIES,
  RARITIES,
  BASE_PRICES
};
