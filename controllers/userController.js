const { objectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// Aggregate to get the overall number of users
const totalUsers = async () => {
    const numberofUsers = await User.aggregate().count('userCount');
    return numberofUsers;
}

module.exports = {

// Get all users
async getUsers(req, res) {
    try {
        const users = await User.find();
        console.log('getUsers() for all users');
        const UserObj = {
            users,
            totalUsers: await totalUsers(),
        };
        res.json(UserObj);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
},

// Get single user by id
async getSingleUser(req, res) {
    try {
        const user = await User.findOne
        ({ _id: req.params.userId })
        .select('__v');
    if (!user) {
        return res.status(404).json
        ({ message: 'No user with that id' })
    }
    res.json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
},

// Post new user
async createUser (req, res) {
    try {
const user = await User.create(req.body);
res.json(user);
    } catch (err) {
res.status(500).json(err);
    }
},

// Update user by id
async updateUser(req, res) {
    try {
      const { userId } = req.params; 
      const { username, email } = req.body; 
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { username, email }, 
        { new: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
  
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

// Delete user by id
async deleteUser (req, res) {
  try {
const user = await User.findOneAndRemove({
    _id: req.params.userId
});
if (!user) {
    return res.status(404).json ({
        message: 'No user exists'
    });
}
const thoughts = await Thought.deleteMany({ username: user._id });
if (!thoughts) {
return res.status(404).json({
    message: 'User deleted, but no thoughts found',
});
}
res.json({ message: 'User successfully deleted'});
  } catch (err) {
console.log(err);
res.status(500).json(err);
  } 
},

// Post add new friend to user
async addFriend(req, res) {
    try {
      const { userId } = req.params;
      const { friendId } = req.body; 
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
  
      if (!user || !friend) {
        return res.status(404).json({
          message: 'User or friend not found',
        });
      }
  
      user.friends.push(friendId);
      await user.save();
      res.json({
        message: 'Friend added successfully',
        user,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

// Delete friend from user
async deleteFriend(req, res) {
    try {
        const { userId } = req.params;
        const { friendId } = req.body; 
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
    
        if (!user || !friend) {
          return res.status(404).json({
            message: 'User or friend not found',
          });
        }
        user.friends.pull(friendId);
        await user.save();
        res.json({
          message: 'Friend removed successfully',
          user,
        });
} catch (err) {
    res.status(500).json(err);
}}
}