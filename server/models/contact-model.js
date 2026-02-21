const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  address: { type: String, required: true }, // Isme Area ka naam rahega
  mapLink: { type: String, required: true }, // 🟢 Naya Field
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "Pending" }, 
  acceptedBy: { type: String, default: null },
});

const Contact = model("Contact", contactSchema);
module.exports = Contact;