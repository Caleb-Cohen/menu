import { Button, FormControl, Grid, TextField, Select, MenuItem as MUIMenuItem, Box } from '@mui/material';
import { withIronSessionSsr } from 'iron-session/next';
import { Document } from 'mongoose';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { mutate } from 'swr';

import { MenuItemType, AdminProps } from '@/types/MenuItemTypes';

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
  const [japaneseName, setJapaneseName] = useState('');
  const [japaneseDescription, setJapaneseDescription] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [englishDescription, setEnglishDescription] = useState('');
  const [servingTime, setServingTime] = useState('');

  const lunchMenuItems = menuItems.filter((item: MenuItemType) => item.sTime === 'lunch')
    .sort((a: MenuItemType, b: MenuItemType) => a.pos - b.pos);
  const dinnerMenuItems = menuItems.filter((item: MenuItemType) => item.sTime === 'dinner')
    .sort((a: MenuItemType, b: MenuItemType) => a.pos - b.pos);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      japaneseName,
      japaneseDescription,
      englishName,
      englishDescription,
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

  const putData = async(form: MenuItemType) => {
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

  const onDragEnd = (result: DropResult) => {
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

    const destinationMenuItems = destination.droppableId === 'lunch' ? lunchMenuItems : dinnerMenuItems;

    const differentColumn = destination.droppableId !== source.droppableId;
    const { before, after } = findNeighbourPositions(
      source.index,
      destination.index,
      destinationMenuItems,
      differentColumn,
    );

    const averagePos = calculateAveragePosition(before, after, destinationMenuItems);

    const menuItemToUpdate = menuItems.find((item: MenuItemType) => item._id === draggableId);

    if (!menuItemToUpdate) {
      console.error('Unexpected error: menuItemToUpdate is undefined');
      return;
    }

    console.log('menuItemToUpdate', menuItemToUpdate);
    const formData = {
      ...menuItemToUpdate,
      pos: averagePos,
      sTime: destination.droppableId as 'lunch' | 'dinner',
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
                name="japaneseName"
                label="Japanese Name"
                multiline maxRows={4}
                value={japaneseName}
                onChange={e => setJapaneseName(e.target.value)} />
              <TextField id="outlined-multiline-flexible"
                name='japaneseDescription'
                label="Japanese Description"
                multiline maxRows={4}
                value={japaneseDescription}
                onChange={e => setJapaneseDescription(e.target.value)} />
              <TextField id="outlined-multiline-flexible"
                name="englishName"
                label="English Name"
                multiline maxRows={4}
                value={englishName}
                onChange={e => setEnglishName(e.target.value)} />
              <TextField id="outlined-multiline-flexible"
                name='englishDescription'
                label="English Description"
                multiline maxRows={4}
                value={englishDescription}
                onChange={e => setEnglishDescription(e.target.value)} />
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
          <Grid container direction="row" spacing={2}>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <Droppable droppableId="dinner">
                {providedDroppable => (
                  <Grid item xs={6} ref={providedDroppable.innerRef} {...providedDroppable.droppableProps}>
                    {dinnerMenuItems.map((item, index) => (
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
          </Grid>
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

    const menuItemsQuery: (Document & MenuItemType)[] = await MenuItem.find({});
    const menuItems = menuItemsQuery.map((item: Document<MenuItemType>) => {
      const itemToObject = item.toObject();
      return convertIdToString(itemToObject);
    }) as MenuItemType[];
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
