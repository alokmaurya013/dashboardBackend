const express=require('express');
const User=require('../models/User');
const router=express.Router();
const auth=require('../middleware/auth');

router.put('/editDetail/:id', auth(['Teacher', 'Principal']), async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      const student = await User.findByIdAndUpdate(
        id,
        { name, email },
        { new: true, runValidators: true }
      );
  
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
     console.log('updated');
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
router.delete('/delete/:id', auth(['Teacher', 'Principal']), async (req, res) => {
    const { id } = req.params;
  
    try {
      const student = await User.findByIdAndDelete(id);
  
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  module.exports=router;