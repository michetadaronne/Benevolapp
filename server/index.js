import app from "./app.js";
import { connectToDb } from "./db/mongo.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`Benevolapp API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

start();
