const app = require('./app');

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend server chal raha hai: http://localhost:${PORT}`);
});
