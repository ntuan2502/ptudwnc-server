const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const invitationSchema = new Schema({
  courseId: {
    type: String,
  },
  inviteCode: {
    type: String,
  },
  type : {
    type: Number,
    default : 1   // 0 instructor, 1 student
  },
  userId: {
    type: String,
  }
}, {
  timestamps: true
});


const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;