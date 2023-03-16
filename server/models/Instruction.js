const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const instructionSchema = new Schema({
  step: {
    type: Number,
    required: true,
  },
  direction: {
    type: String,
    required: true,
  },
});

module.exports = instructionSchema;
