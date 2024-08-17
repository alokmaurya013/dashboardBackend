
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); 
const Classroom=require('../models/Classroom');
const Timetable=require('../models/Timetable');

router.get('/teachers', auth(['Principal']), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' }).select('-password'); 
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/students', auth(['Principal','Teacher']), async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' }).select('-password'); 
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  router.get('/studentofclass', auth(['Student', 'Teacher']), async (req, res) => {
    try {
      const loggedInUser = await User.findById(req.user.id);
      if (loggedInUser.role === 'Student') {
        const classroom = await Classroom.findOne({ students: loggedInUser._id }).populate('students', '-password');
        if (!classroom) {
          return res.status(404).json({ error: 'Classroom not found for the student' });
        }
        res.json(classroom.students);
      } else if (loggedInUser.role === 'Teacher') {
        const classroom = await Classroom.findOne({ teacher: loggedInUser._id }).populate('students', '-password');
        if (!classroom) {
          return res.status(404).json({ error: 'No classrooms found for the teacher' });
        }  
        res.json(classroom.students);
      } else {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }  
});

router.get('/viewTimetable', auth(['Principal']), async (req, res) => {
  try {
    const classrooms = await Classroom.find().populate({
      path: 'students',  
      select: '-password'
    });

    if (!classrooms || classrooms.length === 0) {
      return res.status(404).json({ error: 'No classrooms found' });
    }
    const classroomTimetables = [];
    for (const classroom of classrooms) {
      const timetableEntries = await Timetable.find({ classroom: classroom._id });
      classroomTimetables.push({
        classroom: classroom.name,
        timetable: timetableEntries  
      });
    }
    res.json(classroomTimetables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/classTimetable', auth(['Teacher','Student']), async (req, res) => {
  try {
    const userId = req.user.id;
    const classroom = await Classroom.findOne({ students: userId });
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found for the user' });
    }

    const classroomId =classroom._id;
    const timetableEntries = await Timetable.find({ classroom: classroomId });
  
    const timetable = {};
    const hours = ['10', '11', '12', '13', '14', '15'];
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    days.forEach(day => {
      timetable[day] = {};
      hours.forEach(hour => {
        timetable[day][hour] = '-'; 
      });
    });

    timetableEntries.forEach(entry => {
      const day = entry.day;
      const hour = entry.startTime;
      
      if (timetable[day] && timetable[day][hour]!==undefined) {
        timetable[day][hour] = entry.subject;
      }
    });
    
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
