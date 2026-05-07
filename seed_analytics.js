const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function seedAnalytics() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  const destinations = ['Sajek Valley', 'Bandarban', 'Sundarbans', 'Saint Martin', 'Coxs Bazar', 'Sylhet'];
  const statuses = ['Completed', 'Going On', 'On Process', 'Pending'];
  const payments = ['Paid', 'Partial', 'Unpaid'];

  console.log("Seeding historical bookings...");

  for (let i = 0; i < 45; i++) {
    // Generate a random date within the last 14 days
    const daysAgo = Math.floor(Math.random() * 14);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    // SQLite datetime format: YYYY-MM-DD HH:MM:SS
    const sqliteDate = date.toISOString().replace('T', ' ').split('.')[0];

    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    const stat = statuses[Math.floor(Math.random() * statuses.length)];
    const pay = payments[Math.floor(Math.random() * payments.length)];

    const dataObj = {
      name: `Mock User ${i}`,
      email: `user${i}@example.com`,
      mobile: `+88017000000${i.toString().padStart(2, '0')}`,
      destination: dest,
      date: date.toISOString().split('T')[0], // Travel date
      persons: Math.floor(Math.random() * 5) + 1,
      status: stat,
      payment: pay
    };

    const dataStr = JSON.stringify(dataObj);
    
    // Insert with explicit created_at
    await db.run(
      'INSERT INTO other_data (model, data_json, created_at) VALUES (?, ?, ?)',
      ['bookings', dataStr, sqliteDate]
    );
  }

  console.log("Seeded 45 mock bookings.");
}

seedAnalytics().catch(console.error);
