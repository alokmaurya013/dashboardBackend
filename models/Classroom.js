const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: {
     type: String, 
     required: true 
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
      type:String,
      required:true
    },
    days:{
      type:[String],
      required:true
    },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     required: true 
    },
  students: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
}],
});
module.exports = mongoose.model('Classroom', classroomSchema);
