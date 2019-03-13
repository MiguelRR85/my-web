const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'The work name is required']
  },
  content: {
    type: String,
    required: 'The work content is required'
  },
  image: String,
  imagePath: String
 
}, { 
  timestamps: true,
});

const Work = mongoose.model('Work', workSchema);
module.exports = Work;