import { Button, FormControl, Grid, TextField, Select, MenuItem as MUIMenuItem, Box } from '@mui/material';
import { withIronSessionSsr } from 'iron-session/next';
import { Document } from 'mongoose';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { mutate } from 'swr';

import { MenuItemType, AdminProps, MenuItemFormData } from '@/types/MenuItemTypes';

import NoSsr from '../components/NoSsr';
import SingleMenuItem from '../components/SingleMenuItem';
import dbConnect from '../lib/dbConnect';
import { sessionOptions } from '../lib/session';
import MenuItem from '../models/MenuItem';
import { User } from '../types/User';
import convertIdToString from '../utils/convertIdToString';
import { calculateAveragePosition, findNeighbourPositions } from '../utils/dragDropHelpers';

export default function Admin({ menuItems }: AdminProps) {
  const router = useRouter();
  // Users will never see this unless they're logged in.
  const [englishName, setEnglishName] = useState('');
  const [japaneseName, setJapaneseName] = useState('');
  const [servingTime, setServingTime] = useState('');

  const lunchMenuItems = menuItems.filter((item: MenuItemType) => item.sTime === 'lunch')
    .sort((a: MenuItemType, b: MenuItemType) => a.pos - b.pos);
  const dinnerMenuItems = menuItems.filter((item: MenuItemType) => item.sTime === 'dinner')
    .sort((a: MenuItemType, b: MenuItemType) => a.pos - b.pos);

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
      router.push('/admin');
    } catch (error) {
      console.error('An unexpected error happened:', error);
    }
  };

  const putData = async(form: MenuItemFormData) => {
    const id = form._id;

    try {
      const res = await fetch(`/api/menuitems/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(res.status.toString());
      }

      const { data } = await res.json();

      mutate(`/api/menu/${id}`, data, false);
      router.push('/admin');
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
    destination.index === source.index
    ) {
      return;
    }

    const { before, after } = findNeighbourPositions(
      source.index,
      destination.index,
      lunchMenuItems,
    );

    const averagePos = calculateAveragePosition(before, after, lunchMenuItems);
    // update db with new position
    const indexToUpdate = source.index;
    const menuItemToUpdate = lunchMenuItems[indexToUpdate];
    const formData = {
      ...menuItemToUpdate,
      pos: averagePos,
    };
    putData(formData);
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
      <NoSsr>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={2}>
            <Droppable droppableId="lunch">
              {providedDroppable => (
                <Grid item xs={6} ref={providedDroppable.innerRef} {...providedDroppable.droppableProps}>
                  {lunchMenuItems.map((item, index) => (
                    <Box mb={2} key={item._id}>
                      <Draggable draggableId={item._id} index={index}>
                        {providedDraggable => (
                          <SingleMenuItem
                            key={item._id}
                            menuItem={item}
                            innerRef={providedDraggable.innerRef}
                            provided={providedDraggable}
                          >
                            {providedDroppable.placeholder}
                          </SingleMenuItem>
                        )}
                      </Draggable>
                    </Box>
                  ))}
                </Grid>
              )}
            </Droppable>
          </Grid>
          {/* <Grid item xs={6}>
          {dinnerMenuItems.map(item => (
            <Box mb={2} key={item._id}>
              <SingleMenuItem key={item._id} menuItem={item} />
            </Box>
          ))}
          </Grid> */}
        </DragDropContext>
      </NoSsr>
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
