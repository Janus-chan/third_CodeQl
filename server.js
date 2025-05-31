const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// VULNERABILITY 1: Hardcoded database credentials
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'super_secret_password_123!',  // Hardcoded secret
    database: 'testdb'
};

// VULNERABILITY 2: Hardcoded API key
const API_KEY = 'sk-1234567890abcdef-NEVER-COMMIT-THIS-KEY';

// Database connection
let db;
mysql.createConnection(dbConfig).then(connection => {
    db = connection;
    console.log('Database connected');
}).catch(err => {
    console.error('Database connection failed:', err);
});

// VULNERABILITY 3: SQL Injection
app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    
    // Vulnerable: Direct string concatenation in SQL query
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    
    try {
        const [results] = await db.execute(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// VULNERABILITY 4: Command Injection
app.post('/ping', (req, res) => {
    const host = req.body.host;
    
    // Vulnerable: Directly using user input in shell command
    exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json({ output: stdout, errors: stderr });
    });
});

// VULNERABILITY 5: Path Traversal
app.get('/file/:filename', (req, res) => {
    const filename = req.params.filename;
    
    // Vulnerable: No path validation allows directory traversal
    const filePath = path.join(__dirname, 'uploads', filename);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).json({ error: 'File not found' });
            return;
        }
        res.send(data);
    });
});

// VULNERABILITY 6: Cross-Site Scripting (XSS)
app.get('/search', (req, res) => {
    const query = req.query.q;
    
    // Vulnerable: Directly rendering user input without escaping
    const html = `
        <html>
            <body>
                <h1>Search Results</h1>
                <p>You searched for: ${query}</p>
                <div id="results">No results found</div>
            </body>
        </html>
    `;
    
    res.send(html);
});

// VULNERABILITY 7: Insecure Direct Object Reference
app.get('/profile/:userId', async (req, res) => {
    const userId = req.params.userId;
    const currentUser = req.headers['x-user-id']; // Simulated auth
    
    // Vulnerable: No authorization check before accessing user data
    const query = `SELECT * FROM profiles WHERE user_id = ?`;
    
    try {
        const [results] = await db.execute(query, [userId]);
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// VULNERABILITY 8: Weak Cryptography
app.post('/hash-password', (req, res) => {
    const password = req.body.password;
    const crypto = require('crypto');
    
    // Vulnerable: Using weak MD5 hashing
    const hash = crypto.createHash('md5').update(password).digest('hex');
    
    res.json({ hash: hash });
});

// VULNERABILITY 9: Information Disclosure
app.get('/debug', (req, res) => {
    // Vulnerable: Exposing sensitive system information
    res.json({
        environment: process.env,
        config: dbConfig,
        apiKey: API_KEY,
        nodeVersion: process.version,
        platform: process.platform
    });
});

// VULNERABILITY 10: Unvalidated Redirect
app.get('/redirect', (req, res) => {
    const url = req.query.url;
    
    // Vulnerable: No validation of redirect URL
    res.redirect(url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Key: ${API_KEY}`); // Another hardcoded secret exposure
});

module.exports = app;