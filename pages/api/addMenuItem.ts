import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

import MenuItem from '../../models/MenuItem';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { englishName, japaneseName, servingTime } = req.body;

  try {
    const maxPosition = await MenuItem.find({ sTime: servingTime }).sort({ pos: -1 }).limit(1);
    const newPosition = maxPosition[0] ? maxPosition[0].pos + 100 : 100;

    const newMenuItem = await MenuItem.create({
      enName: englishName,
      jaName: japaneseName,
      sTime: servingTime,
      pos: newPosition,
    });

    res.status(200).json({ success: true, data: newMenuItem });
    console.log(newMenuItem);
  } catch (error) {
    console.log(error);
    console.log('DB connection state:', mongoose.connection.readyState);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
