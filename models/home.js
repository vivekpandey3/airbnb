const mongoose = require("mongoose");
const Favourite = require("./favourite"); // Correct import

const homeSchema = new mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  photo: String,
  description: String,
});

// Pre-hook to delete favourites when a home is deleted
homeSchema.pre("findOneAndDelete", async function (next) {
  const homeId = this.getQuery()._id;
  await Favourite.deleteMany({ houseId: homeId }); // fixed field name
  next();
});

module.exports = mongoose.model("Home", homeSchema);
