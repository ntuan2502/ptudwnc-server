const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classSchema = new Schema({
  className: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  listStudents: {
    type: Array,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  joinId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});


const Class = mongoose.model('Class', classSchema);

module.exports = Class;