const mongoose = require('mongoose');
const { User, Thought } = require('../models');
const db = require('../config/connection');

const seedUsers = [
  {
    username: 'userOne',
    email: 'userone@example.com',
  },
  {
    username: 'userTwo',
    email: 'usertwo@example.com',
  },
  {
    username: 'userThree',
    email: 'userthree@example.com',
  },
];

const seedThoughts = [
  {
    thoughtText: 'This is userOne\'s first thought!',
    username: 'userOne',
    reactions: [
      {
        reactionBody: 'Nice thought!',
        username: 'userTwo',
      },
      {
        reactionBody: 'I agree!',
        username: 'userThree',
      },
    ],
  },
  {
    thoughtText: 'This is userTwo\'s first thought!',
    username: 'userTwo',
    reactions: [
      {
        reactionBody: 'Interesting!',
        username: 'userOne',
      },
    ],
  },
  {
    thoughtText: 'This is userThree\'s first thought!',
    username: 'userThree',
    reactions: [
      {
        reactionBody: 'Good point!',
        username: 'userOne',
      },
      {
        reactionBody: 'Well said!',
        username: 'userTwo',
      },
    ],
  },
];

db.once('open', async () => {
  try {
    // Clear existing users and thoughts
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Add users
    const createdUsers = await User.collection.insertMany(seedUsers);

    // Add thoughts
    for (let i = 0; i < seedThoughts.length; i++) {
      const { _id } = await Thought.create(seedThoughts[i]);
      const user = await User.findOneAndUpdate(
        { username: seedThoughts[i].username },
        { $addToSet: { thoughts: _id } },
        { new: true }
      );
    }

    console.log('Users, thoughts, and reactions seeded!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});