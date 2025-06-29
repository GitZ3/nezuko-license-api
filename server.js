const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const tokensFile = "./tokens.json";

// Get daftar token
app.get("/api/tokens", (req, res) => {
  const data = JSON.parse(fs.readFileSync(tokensFile));
  res.json(data);
});

// Add token baru
app.post("/api/tokens", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token kosong!" });

  let data = JSON.parse(fs.readFileSync(tokensFile));
  if (data.tokens.includes(token)) return res.status(400).json({ message: "Token sudah ada!" });

  data.tokens.push(token);
  fs.writeFileSync(tokensFile, JSON.stringify(data, null, 2));
  res.json({ message: "✅ Token ditambahkan!" });
});

// Delete token
app.delete("/api/tokens", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token kosong!" });

  let data = JSON.parse(fs.readFileSync(tokensFile));
  if (!data.tokens.includes(token)) return res.status(400).json({ message: "Token tidak ditemukan!" });

  data.tokens = data.tokens.filter(t => t !== token);
  fs.writeFileSync(tokensFile, JSON.stringify(data, null, 2));
  res.json({ message: "✅ Token dihapus!" });
});

// Cek Token Nezuko
app.get("/cekToken", (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Token kosong!" });

  let data = JSON.parse(fs.readFileSync(tokensFile));
  const found = data.tokens.find(t => t.token === token);
  if (!found) {
    return res.json({ message: "❌ Token tidak ditemukan.", valid: false });
  }

  if (found.status === "valid") {
    return res.json({ message: `✅ Token ${token} valid.`, valid: true });
  } else {
    return res.json({ message: `❌ Token ${token} tidak aktif.`, valid: false });
  }
});

// Cek Status Token
app.put("/api/tokenstatus", (req, res) => {
  const { token, status } = req.body;
  if (!token || !status) return res.status(400).json({ message: "Token & status wajib." });

  let data = JSON.parse(fs.readFileSync(tokensFile));
  const found = data.tokens.find(t => t.token === token);
  if (!found) return res.status(404).json({ message: "Token tidak ditemukan." });

  found.status = status;
  fs.writeFileSync(tokensFile, JSON.stringify(data, null, 2));
  res.json({ message: `✅ Status token ${token} diubah ke ${status}.` });
});

app.listen(PORT, () => {
  console.log(`✅ License API Server jalan di port ${PORT}`);
});
