import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { sessionOptions } from '@/lib/session';

import { User } from '../../types/User';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { password } = req.body;

  if (password === process.env.PASSWORD) {
    try {
      const user = { isLoggedIn: true } as User;
      req.session.user = user;
      await req.session.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  } else {
    res.status(401).json({ message: 'Incorrect password' });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
