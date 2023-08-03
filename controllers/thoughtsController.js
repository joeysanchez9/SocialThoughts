const { objectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// Aggregate to get the overall number of users
const totalThoughts = async () => {
    const numberofThoughts = await Thought.aggregate().count('thoughtCount');
    return numberofThoughts;
}
module.exports = {

//Get all thoughts
async getThoughts(req, res) {
    try {
        const thoughts = await Thought.find();
        console.log('get all thoughts');
        const ThoughtObj = {
            thoughts,
            totalthoughts: await totalThoughts(),
        };
        res.json(ThoughtObj);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
},

// Get single thought by id
async getSingleThought(req, res) {
    try {
        const thought = await Thought.findOne
        ({ _id: req.params.thoughtsId })
        .select('__v');
    if (!thought) {
        return res.status(404).json
        ({ message: 'No thought with that id' })
    }
    res.json({ thought });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
},

// Create new thought
async createThought (req, res) {
    try {
const thought = await Thought.create(req.body);
res.json(thought);
    } catch (err) {
res.status(500).json(err);
    }
},

// Update thought by id
async updateThought(req, res) {
    try {
      const { thoughtsId } = req.params; 
      const { thoughtText, username } = req.body; 
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtsId, 
        { thoughtText, username }, 
        { new: true } 
      );
  
      if (!updatedThought) {
        return res.status(404).json({
          message: 'Thought not found',
        });
      }
  
      res.json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

// Delete thought by id
async deleteThought (req, res) {
    try {
  const thought = await Thought.findOneAndRemove({
      _id: req.params.thoughtsId
  });
  if (!thought) {
      return res.status(404).json ({
          message: 'No thoughts exists'
      });
  }
  res.json({ message: 'Thought successfully deleted'});
  } catch (err) {
console.log(err);
res.status(500).json(err);
  } 
},

// Create reaction stored in single thoughts array

async addReaction(req, res) {
    try {
      const { thoughtsId } = req.params;
      const reactionBody = req.body; 
  
      const thought = await Thought.findById(thoughtsId);
  
      if (!thought) {
        return res.status(404).json({
          message: 'Thought not found',
        });
      }
  
      thought.reactions.push(reactionBody);
      await thought.save();
      res.json({
        message: 'Reaction added successfully',
        thought,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

// Delete reaction by reaction id
async deleteReaction(req, res) {
    try {
        const { thoughtsId } = req.params;
        const {reactionId} = req.body; 
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtsId },
            { $pull: { reactions: {reactionId: req.body.reactionId }}},
            { new: true }
        )

        if (!thought ) {
          return res.status(404).json({
            message: 'Thought or reaction not found',
          });
        }
    
        res.json({
          message: 'Reaction removed successfully',
          thought,
        });
} catch (err) {
    res.status(500).json(err);
}}
}