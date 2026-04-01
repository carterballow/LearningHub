const mongoose = require("mongoose")

async function connectDB(uri) {
  if (!uri) throw new Error("Missing MONGODB_URI")

  await mongoose.connect(uri, {
    dbName: "qwerhacks", 
  })

  console.log("Mongo connected:", mongoose.connection.name)
}

module.exports = { connectDB }
