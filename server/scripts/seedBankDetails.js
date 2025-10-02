// server/script/seedBankDetails.js
const mongoose = require("mongoose");
const BankDetails = require("./models/BankDetails");

// mongoose.connect("mongodb://localhost:27017/lmltda");

const seed = async () => {
  await BankDetails.deleteMany(); // optional: clear old
  await BankDetails.create({
    bankName: "BFA",
    accountName: "Maria Miguel",
    accountNumber: "342295560 30 001",
    swiftCode: "AO06 0006 0000 42295560301 25",
    supportEmail: "lmj.muginga@gmail.com",
  });
  console.log("Bank details seeded");
  mongoose.disconnect();
};

seed();