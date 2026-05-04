const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'contactuser',
  password: 'Password123',
  database: 'contactsdb'
});

// DB connection check
db.connect((err) => {
    if (err) {
        console.log("DB Connection Error:", err);
    } else {
        console.log("Database Connected");
    }
});

// Create table
db.query(`
CREATE TABLE IF NOT EXISTS contacts(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20)
)`);

// GET all contacts
app.get('/contacts', (req, res) => {
    db.query("SELECT * FROM contacts", (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});

// INSERT contact
app.post('/contacts', (req, res) => {
    const { name, phone } = req.body;

    db.query(
        "INSERT INTO contacts(name,phone) VALUES (?,?)",
        [name, phone],
        (err, result) => {
            if (err) return res.send(err);

            res.send("Inserted Successfully");
        }
    );
});

// UPDATE contact
app.put('/contacts/:id', (req, res) => {
    const { name, phone } = req.body;
    const id = req.params.id;

    db.query(
        "UPDATE contacts SET name=?, phone=? WHERE id=?",
        [name, phone, id],
        (err, result) => {
            if (err) return res.send(err);

            res.send("Updated Successfully");
        }
    );
});

// DELETE contact
app.delete('/contacts/:id', (req, res) => {
    db.query(
        "DELETE FROM contacts WHERE id=?",
        [req.params.id],
        (err, result) => {
            if (err) return res.send(err);

            res.send("Deleted Successfully");
        }
    );
})
// This allows connections from any IP, not just local
app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});
[ec2-user@ip-172-31-40-66 backend]$ vim server.js
[ec2-user@ip-172-31-40-66 backend]$ cat server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Best Practice: Use a Pool instead of a single connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'contactuser',
  password: 'Password123',
  database: 'contactsdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET all contacts
app.get('/contacts', (req, res) => {
    db.query("SELECT * FROM contacts", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(result);
    });
});

// INSERT contact
app.post('/contacts', (req, res) => {
    const { name, phone } = req.body;
    if (!name || !phone) {
        return res.status(400).json({ error: "Name and Phone are required" });
    }

    db.query(
        "INSERT INTO contacts(name,phone) VALUES (?,?)",
        [name, phone],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Insert failed" });
            }
            res.status(201).send("Inserted Successfully");
        }
    );
});

// DELETE contact
app.delete('/contacts/:id', (req, res) => {
    db.query(
        "DELETE FROM contacts WHERE id=?",
        [req.params.id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Delete failed" });
            }
            res.send("Deleted Successfully");
        }
    );
});

// Start Server
app.listen(3000, '0.0.0.0', () => {
  console.log('Backend is listening on all interfaces at port 3000');
});
