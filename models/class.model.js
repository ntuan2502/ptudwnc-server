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
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  owner : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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