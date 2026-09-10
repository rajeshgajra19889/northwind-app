const express = require('express');
const path = require('path');

const app = express();
const publicDir = path.join(__dirname, 'dist', 'northwind-app', 'browser');

app.use(express.static(publicDir));
app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`Northwind frontend serving on port ${port}`);
});