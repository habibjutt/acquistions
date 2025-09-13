import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Wow! Server is running on http://localhost:${PORT}`);
});
