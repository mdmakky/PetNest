const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send("Welcome");
});

const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
