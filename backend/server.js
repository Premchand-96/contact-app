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
});

app.listen(3000, () => console.log("Running on port 3000"));
