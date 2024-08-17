const express = require('express');
const Classroom = require('../models/Classroom');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/classroom', auth(['Principal']), async (req, res) => {
   const { name, startTime, endTime, days,email} = req.body;
   try {
    const teacher=await User.findOne({ email });
    if (!teacher) return res.status(400).json({ error: 'Teacher not found' });
    
    const classroom = new Classroom({ name, startTime, endTime, days,teacher:teacher._id});
     await classroom.save();
     res.status(201).json({ message: 'Classroom created successfully' });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 });


// router.post('/assignTeacher', auth(['Principal']), async (req, res) => {
//   const { classroomId, teacherId } = req.body;

//   try {
//     const classroom = await Classroom.findById(classroomId);
//     classroom.teacher = teacherId;
//     await classroom.save();
//     res.status(200).json({ message: 'Teacher assigned successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post('/assignStudents', auth(['Principal']), async (req, res) => {
  const { classname, studentemail } = req.body;

  try {
    const student=await User.findOne({ email:studentemail });
    if (!student) return res.status(400).json({ error: 'student not found ,Please register the student' });

    const classroom=await Classroom.findOne({name:classname});
    if (!classroom) return res.status(400).json({ error: 'Class not found,Please create classroom' });

    classroom.students.push(student._id);
    await classroom.save();
    res.status(200).json({ message: 'Students assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
