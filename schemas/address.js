var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var addressSchema = new Schema({
    line1: String,
    line2: String,
    line3: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
});

module.exports = addressSchema;