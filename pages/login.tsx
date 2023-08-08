import { useState } from 'react';

import dbConnect from '../lib/dbConnect';
import { FetchError } from '../lib/fetchJson';
import useUser from '../utils/useUser';

export default function Login() {
  // here we just check if user is already logged in and redirect to admin
  const { mutateUser } = useUser({
    redirectTo: '/admin',
    redirectIfFound: true,
  });

  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const body = {
      password: e.currentTarget.password.value,
    };

    const userData = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const user = await userData.json();

    try {
      await mutateUser(user);
    } catch (error) {
      if (error instanceof FetchError) {
        setErrorMsg(error.data.message);
      } else {
        console.error('An unexpected error happened:', error);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter password
        <input type='password' name='password' required />
      </label>

      <button type='submit'>Login</button>

      {errorMsg && <p>{errorMsg}</p>}
    </form>
  );
}

