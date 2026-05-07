const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let db;

// Initialize SQLite Database
async function initDB() {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Create tables for our app natively in SQL
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS other_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      data_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert or upgrade default Master Admin
  await db.run(`
    INSERT OR IGNORE INTO users (name, email, type, password) 
    VALUES ('Admin', 'admin@cholojai.com', 'Master Admin', 'admin123')
  `);
  
  // Upgrade existing Admin to Master Admin
  await db.run(`
    UPDATE users SET type = 'Master Admin' WHERE email = 'admin@cholojai.com' AND type = 'Admin'
  `);

  // Insert a default Traveler for easy testing
  await db.run(`
    INSERT OR IGNORE INTO users (name, email, type, password) 
    VALUES ('Demo Traveler', 'user@cholojai.com', 'Traveler', 'user123')
  `);

  console.log('✅ Connected to Real SQLite Database (database.sqlite)');
}
initDB().catch(console.error);


// ==========================================
// SQL API Endpoints
// ==========================================

// Save Endpoint 
app.post('/api/save', async (req, res) => {
  try {
    const { model, data } = req.body;

    if (!model || !data) {
      return res.status(400).json({ success: false, message: 'Model and data are required' });
    }

    let insertedId;

    if (model === 'users') {
      const { name, email, type, password } = data;
      const result = await db.run(
        'INSERT INTO users (name, email, type, password) VALUES (?, ?, ?, ?)',
        [name, email, type, password]
      );
      insertedId = result.lastID;
    } else {
      // Dynamic fallback schema for any non-user models
      const dataStr = JSON.stringify(data);
      const result = await db.run(
        'INSERT INTO other_data (model, data_json) VALUES (?, ?)',
        [model, dataStr]
      );
      insertedId = result.lastID;
    }

    const savedEntry = { id: insertedId, ...data };
    console.log(`Saved new entry to SQL ${model}:`, savedEntry);

    res.json({ success: true, message: 'Saved successfully!', data: savedEntry });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ success: false, message: 'This email is already registered!' });
    }
    console.error('Database Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Update Endpoint
app.post('/api/update', async (req, res) => {
  try {
    const { model, id, data } = req.body;
    if (!model || !id || !data) return res.status(400).json({ success: false, message: 'Missing fields' });

    if (model === 'users') {
      return res.status(400).json({ success: false, message: 'Cannot update users via this endpoint' });
    }

    const dataStr = JSON.stringify(data);
    const result = await db.run('UPDATE other_data SET data_json = ? WHERE id = ? AND model = ?', [dataStr, id, model]);
    
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Record not found or no changes made' });
    }

    console.log(`Updated entry in SQL ${model} (ID: ${id})`);
    res.json({ success: true, message: 'Updated successfully!' });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Delete Endpoint
app.post('/api/delete', async (req, res) => {
  try {
    const { model, id } = req.body;
    if (!model || !id) return res.status(400).json({ success: false, message: 'Missing fields' });

    if (model === 'users') {
      return res.status(400).json({ success: false, message: 'Cannot delete users via this endpoint' });
    }

    await db.run('DELETE FROM other_data WHERE id = ? AND model = ?', [id, model]);
    
    console.log(`Deleted entry from SQL ${model} (ID: ${id})`);
    res.json({ success: true, message: 'Deleted successfully!' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Oops! Incorrect password. Please try again.' });
    }

    // Don't send password back to client
    const { password: _, ...userData } = user;

    res.json({ success: true, message: 'Login successful!', data: userData });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Verify Password Endpoint
app.post('/api/verify-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false });

    const user = await db.get('SELECT password FROM users WHERE email = ?', [email]);
    if (user && user.password === password) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Change Password Endpoint
app.post('/api/change-password', async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) return res.status(400).json({ success: false, message: 'Missing fields' });

    const user = await db.get('SELECT password FROM users WHERE email = ?', [email]);
    if (user && user.password === oldPassword) {
      await db.run('UPDATE users SET password = ? WHERE email = ?', [newPassword, email]);
      res.json({ success: true, message: 'Password updated successfully!' });
    } else {
      res.json({ success: false, message: 'Invalid old password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Fetch Endpoint
app.get('/api/data/:model', async (req, res) => {
  try {
    const model = req.params.model;
    const { email, phone } = req.query;
    let records = [];

    if (model === 'users') {
      records = await db.all('SELECT * FROM users');
    } else {
      const items = await db.all('SELECT * FROM other_data WHERE model = ? ORDER BY id DESC', [model]);
      records = items.map(item => ({ id: item.id, ...JSON.parse(item.data_json), created_at: item.created_at }));
      
      // Filter by email or phone if provided
      if (email || phone) {
        records = records.filter(r => 
          (email && r.email === email) || 
          (phone && r.mobile === phone) || 
          (phone && r.phone === phone)
        );
      }
    }

    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SQL Backend is currently running on http://localhost:${PORT}`);
  console.log(`📁 Your website is now being served live! `);
  console.log(`======================================================\n`);
});
