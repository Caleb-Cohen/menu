import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  enName: {
    type: String,
    required: [true, 'Please add an English name'],
  },
  jaName: {
    type: String,
    required: [true, 'Please add a Japanese name'],
  },
  sTime: {
    type: String, enum: ['lunch', 'dinner'],
    required: [true, 'Please add a serving time'],
  },
  pos: {
    type: Number,
    required: [true, 'Please add a position'],
    unique: true,
  },
});

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
