const mongoose = require("mongoose");

let databaseConnected = false;

function buildMongoUri() {
  const defaultUri = "mongodb://127.0.0.1:27017";
  const defaultDbName = "travel_agency_db";
  const rawUri = process.env.MONGO_URI || defaultUri;
  const dbName = process.env.MONGO_DB_NAME || defaultDbName;

  try {
    const parsedUri = new URL(rawUri);
    const pathSegments = parsedUri.pathname.split("/").filter(Boolean);

    if (pathSegments.length === 0) {
      parsedUri.pathname = `/${dbName}`;
    }

    return parsedUri.toString();
  } catch (error) {
    return `${defaultUri}/${defaultDbName}`;
  }
}

async function connectDB() {
  const uri = buildMongoUri();

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    databaseConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    databaseConnected = false;
    console.warn(`MongoDB unavailable. Starting in offline demo mode. ${error.message}`);
  }

  return databaseConnected;
}

function isDatabaseConnected() {
  return databaseConnected;
}

module.exports = {
  connectDB,
  isDatabaseConnected
};
