const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  title: String,
  content: {
    type: String,
    required: 'The work content is required'
  },
  img: String,
  imgPath: String
 
}, { 
  timestamps: true,
});

const Work = mongoose.model('Work', workSchema);
module.exports = Work;