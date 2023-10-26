import { Grid, Paper, TextField, MenuItem, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { mutate } from 'swr';

import { MenuItemType } from '../types/MenuItemTypes';

interface Error {
  enName?: string;
  jaName?: string;
  sTime?: string;
}

interface SingleMenuItemProps {
  menuItem: MenuItemType;
  provided: DraggableProvided;
  innerRef: (element: HTMLElement | null) => void;
}

const SingleMenuItem = ({ menuItem, provided, innerRef }: SingleMenuItemProps) => {
  const router = useRouter();
  const [error, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    pos: menuItem.pos,
    _id: menuItem._id,
    enName: menuItem.enName,
    jaName: menuItem.jaName,
    sTime: menuItem.sTime,
  });

  const servingTime = [
    {
      value: 'lunch',
      label: 'lunch',
    },
    {
      value: 'dinner',
      label: 'dinner',
    },
  ];

  const putData = async(form: MenuItemType) => {
    const _id = form._id;

    try {
      const res = await fetch(`/api/menuitems/${_id}`, {
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

      mutate(`/api/menu/${_id}`, data, false);
      router.push('/admin');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteData = async(form: MenuItemType) => {
    const _id = form._id;

    try {
      const res = await fetch(`/api/menuitems/${_id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(res.status.toString());
      }

      mutate(`/api/menu/${_id}`, false);
      router.push('/admin');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const formValidate = () => {
    const err: Error = {};
    if (!form.enName) {
      err.enName = 'English name is required';
    }
    if (!form.jaName) {
      err.jaName = 'Japanese name is required';
    }
    if (!form.sTime) {
      err.sTime = 'Serving time is required';
    }
    return err;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = formValidate();
    console.log(errs);

    if (Object.keys(errs).length === 0) {
      putData(form);
    } else {
      setErrors({ errs });
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{ width: '400px', padding: '20px' }}
      square={false}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={innerRef}
    >
      <Typography>Item is in Position {menuItem.pos} for {menuItem.sTime}</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6} margin={1}>
            <Typography margin={1}> Japanese Name: </Typography>
            <TextField
              required
              id="outlined-required"
              name="enName"
              label="Required"
              defaultValue={menuItem.enName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} margin={1}>
            <Typography margin={1}> English Name: </Typography>
            <TextField
              required
              id="outlined-required"
              name='jaName'
              label="Required"
              defaultValue={menuItem.jaName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} margin={1}>
            <Typography margin={1}> Serving Time: </Typography>
            <TextField
              required
              id="outlined-required"
              name='sTime'
              select
              label="Required"
              defaultValue={menuItem.sTime}
              onChange={handleChange}
            >
              {servingTime.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))};
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button type="submit" variant="contained">Submit</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="secondary" onClick={() => deleteData(form)}>
                Delete
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SingleMenuItem;
