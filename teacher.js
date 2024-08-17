const express = require('express');
const Classroom = require('../models/Classroom');
const Timetable=require('../models/Timetable')
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/createtimetable', auth(['Teacher']), async (req, res) => {
  const { classname, subject,day,startTime, endTime } = req.body;
  try {
    const classn = await Classroom.findOne({name:classname});
    if (!classn) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    if (!classn.days.includes(day)) {
      return res.status(400).json({ message: `Classroom does not operate on ${day}` });
    }
    if (startTime< classn.startTime || endTime> classn.endTime){ 
      return res.status(400).json({ message:"Time must be in given duration" });
    }
    const overlappingPeriod = await Timetable.findOne({
      classroom: classn._id,
      day,
     $or: [
    { startTime: { $gte: startTime, $lt: endTime } },
    { endTime: { $gt: startTime, $lte: endTime } },
  ],
    });
    if (overlappingPeriod) {
      return res.status(400).json({ message: 'This period overlaps with another period' });
    }

    const timetable = new Timetable({ classroom: classn._id, subject,day, startTime, endTime });
    await timetable.save();

    res.status(201).json({ message: 'Timetable created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
