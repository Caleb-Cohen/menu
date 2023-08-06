import type { IronSessionOptions } from 'iron-session';

import type { User } from '../types/User';

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    user?: User;
  }
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'sessionId',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
