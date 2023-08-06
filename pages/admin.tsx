import { withIronSessionSsr } from 'iron-session/next';

import { sessionOptions } from '@/lib/session';
import { User } from '@/types/User';

export default function Admin() {
  // Users will never see this unless they're logged in.
  return <h1>Secure page</h1>;
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (user === undefined) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: { isLoggedIn: false } as User,
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
},
sessionOptions);
