import { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '../../../lib/dbConnect';
import MenuItem from '../../../models/MenuItem';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
          return res.status(400).json({ success: false, message: 'No menu item found' });
        }
        res.status(200).json({ success: true, data: menuItem });
      } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
      }
      break;

    case 'PUT':
      try {
        const menuItem = await MenuItem.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!menuItem) {
          return res.status(400).json({ success: false, message: 'No menu item found' });
        }
        res.status(200).json({ success: true, data: menuItem });
      } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
      }
      break;

    case 'DELETE':
      try {
        const deletedMenuItem = await MenuItem.deleteOne({ _id: id });
        if (!deletedMenuItem) {
          return res.status(400).json({ success: false, message: 'No menu item found' });
        }
        res.status(200).json({ success: true, data: {}});
      } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'No method found' });
      break;
  }
}

