require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/transactions", async (req, res) => {
    try {
        const response = await axios.get("https://testnet.mirrornode.hedera.com/api/v1/transactions");
        console.log("Fetched transactions:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Error fetching transactions" });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
