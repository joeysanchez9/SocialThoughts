const { Schema, Types, model } = require('mongoose');

// Reaction schema (as a subdocument)
const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    get: function (timestamp) {
      return new Date(timestamp).toISOString();
    },
  },
});

// Thought schema
const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    get: function (timestamp) {
      return new Date(timestamp).toISOString();
    },
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema], 
});


// Virtual to get reactionCount
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('thoughts', thoughtSchema);
module.exports = Thought;
