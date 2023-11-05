import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  jaName: {
    type: String,
    required: [true, 'Please add a Japanese name'],
  },
  jaDescription: {
    type: String,
    required: false,
  },
  enName: {
    type: String,
    required: [true, 'Please add an English name'],
  },
  enDescription: {
    type: String,
    required: false,
  },
  sTime: {
    type: String, enum: ['lunch', 'dinner'],
    required: [true, 'Please add a serving time'],
  },
  pos: {
    type: Number,
    required: [true, 'Please add a position'],
  },
});

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
