const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3001;
const mongoUri = "mongodb+srv://AdministratorVLAB:Admin%40VBLMP%40VLAB@cluster0.wbwigbp.mongodb.net/DB?retryWrites=true&w=majority&appName=Cluster0"; 
console.log(mongoUri)
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');
    } catch (e) {
        console.error('Connection to MongoDB failed', e);
    }
}

connectDB();

app.use(express.static(path.join(__dirname, '..')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const collection = client.db("DB").collection("DB");
    const user = await collection.findOne({ email });

    if (user) {
        return res.status(409).json({ message: "User Already Exists!" });
    }

    // Hash the password before saving it to the database
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            return res.status(500).json({ message: "Error Hashing Password" });
        }
        await collection.insertOne({ username, email, password: hash });
        res.status(201).json({ message: "User Registered Successfully" });
    });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const collection = client.db("DB").collection("DB");
    const user = await collection.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Logged in successfully", username: user.username });
});

// Serve your HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
