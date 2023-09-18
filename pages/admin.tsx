import { Button, FormControl, Grid, TextField, Select, MenuItem as MUIMenuItem, Box } from '@mui/material';
import { withIronSessionSsr } from 'iron-session/next';
import { Document } from 'mongoose';
import { useState } from 'react';

import { MenuItemType, AdminProps } from '@/types/MenuItemTypes';

import SingleMenuItem from '../components/SingleMenuItem';
import dbConnect from '../lib/dbConnect';
import { sessionOptions } from '../lib/session';
import MenuItem from '../models/MenuItem';
import { User } from '../types/User';
import convertIdToString from '../utils/convertIdToString';


export default function Admin({ menuItems }: AdminProps) {
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
                  <MUIMenuItem value="lunch">Lunch</MUIMenuItem>
                  <MUIMenuItem value="dinner">Dinner</MUIMenuItem>
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
      {menuItems.map(item => (
        <Box mb={2} key={item._id}>
          <SingleMenuItem key={item._id} menuItem={item} />
        </Box>
      ))}
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (user) {
    await dbConnect();

    const menuItemsQuery = await MenuItem.find({});
    const menuItems = menuItemsQuery.map((item: Document) => convertIdToString(item)) as MenuItemType[];
    return {
      props: {
        user: req.session.user,
        menuItems,
      },
    };
  } else {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: { isLoggedIn: false } as User,
        menuItems: [],
      },
    };
  }
},
sessionOptions);
