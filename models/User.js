const { Schema, model, Types } = require('mongoose');
const thoughtSchema = require('./Thoughts');

// Schema to create User model
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email address',
        },
    },
    thoughts: [{
        type: Types.ObjectId,
        ref: 'thoughts'
    }],
    friends: [{
        type: Types.ObjectId,
        ref: 'user'
    }],
});

// Virtual to get friendCount
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});


const User = model('user', userSchema);
module.exports = User;