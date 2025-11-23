const express = require("express");
const Joi = require("joi");
const Listing = require("../../models/roomrental/Listing");
const crypto = require("crypto");

const router = express.Router();

/**
 * Optional encryption helper for bank details.
 * NOTE: This is a demonstration only. For production, use a
 * proper secrets manager or encryption service and rotate keys.
 */
function encrypt(text, key) {
  if (!key) return text;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key, "utf8").slice(0,32), iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  const tag = cipher.getAuthTag().toString("base64");
  return `${iv.toString("base64")}:${tag}:${encrypted}`;
}

const listingSchema = Joi.object({
  host: Joi.object({
    fullName: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    phone: Joi.string().allow("", null)
  }).required(),
  property: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().allow("", null),
    nightlyPrice: Joi.number().positive().required()
  }).required(),
  fees: Joi.object({
    listingFeeAccepted: Joi.boolean().valid(true).required(),
    commissionPercent: Joi.number().valid(7.5).required()
  }).required(),
  payout: Joi.object({
    method: Joi.string().valid("LM-Ltda", "Host-managed").required(),
    bank: Joi.alternatives().conditional("method", {
      is: "LM-Ltda",
      then: Joi.object({
        bankName: Joi.string().trim().required(),
        accountHolder: Joi.string().trim().required(),
        ibanOrAccount: Joi.string().trim().required()
      }).required(),
      otherwise: Joi.any().forbidden()
    })
  }).required(),
  createdAt: Joi.date().optional(),
  meta: Joi.object().optional()
});

router.post("/", async (req, res, next) => {
  try {
    const payload = req.body;

    const { error, value } = listingSchema.validate(payload, { abortEarly: false });
    if (error) {
      error.status = 400;
      error.details = error.details.map(d => d.message);
      throw error;
    }

    // Optionally encrypt bank details using ENCRYPTION_KEY
    const encryptionKey = process.env.ENCRYPTION_KEY || "";
    if (value.payout.method === "LM-Ltda" && value.payout.bank) {
      const bank = { ...value.payout.bank };
      if (encryptionKey) {
        bank.bankName = encrypt(bank.bankName, encryptionKey);
        bank.accountHolder = encrypt(bank.accountHolder, encryptionKey);
        bank.ibanOrAccount = encrypt(bank.ibanOrAccount, encryptionKey);
      }
      value.payout.bank = bank;
    } else {
      value.payout.bank = null;
    }

    const listing = new Listing(value);
    await listing.save();

    // Do not return raw bank details in response
    const result = listing.toObject();
    if (result.payout && result.payout.bank) {
      result.payout.bank = { stored: true };
    }

    res.status(201).json({ success: true, listing: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;