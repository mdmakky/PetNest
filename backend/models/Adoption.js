const mongoose = require("mongoose");

const adoptionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    petImage: String,
    petName: String,
    category: String,
    quantity: String,
    description: String
});

const Adoption = mongoose.model("Adoption", adoptionSchema);

module.exports = Adoption;