import { Button, FormControl, Grid, TextField, Select, MenuItem } from '@mui/material';
import { withIronSessionSsr } from 'iron-session/next';
import { useState } from 'react';

import dbConnect from '../lib/dbConnect';
import { sessionOptions } from '../lib/session';
import { User } from '../types/User';

export default function Admin() {
  // Users will never see this unless they're logged in.
  const [englishName, setEnglishName] = useState('');
  const [japaneseName, setJapaneseName] = useState('');
  const [servingTime, setServingTime] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      englishName,
      japaneseName,
      servingTime,
    };

    try {
      const response = await fetch('/api/addMenuItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      console.log(response, 'successfully added menu item');
    } catch (error) {
      console.error('An unexpected error happened:', error);
    }
  };

  return (
    <>
      <h1>Secure page</h1>
      <FormControl>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              <TextField id="outlined-multiline-flexible"
                label="Japanese Name"
                multiline maxRows={4}
                value={englishName}
                onChange={e => setEnglishName(e.target.value)} />
              <TextField id="outlined-multiline-flexible"
                label="English Name"
                multiline maxRows={4}
                value={japaneseName}
                onChange={e => setJapaneseName(e.target.value)} />
              <FormControl fullWidth>
                <Select
                  labelId="serving-time-label"
                  id="serving-time"
                  value={servingTime}
                  label="Serving Time"
                  onChange={e => setServingTime(e.target.value)}
                >
                  <MenuItem value="lunch">Lunch</MenuItem>
                  <MenuItem value="dinner">Dinner</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={6}>
                <Button type="submit" variant="contained">Add Item</Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </FormControl>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  await dbConnect();
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
