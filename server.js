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
        const { accountId } = req.query;
        let apiUrl = "https://testnet.mirrornode.hedera.com/api/v1/transactions";

        if (accountId) {
            apiUrl += `?account.id=${accountId}`;
        }

        console.log(`🔄 Fetching transactions from: ${apiUrl}`);
        const response = await axios.get(apiUrl);

        res.json({ transactions: response.data.transactions || [] });
    } catch (error) {
        console.error("❌ Error fetching transactions:", error.message);
        res.status(500).json({ error: "Error fetching transactions" });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
