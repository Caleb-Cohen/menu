import { Box, Button, Typography } from '@mui/material';
import { Document } from 'mongoose';
import { useState } from 'react';

import IndexSingleMenuItem from '../components/IndexSingleMenuItem';
import dbConnect from '../lib/dbConnect';
import MenuItem from '../models/MenuItem';
import { MenuItemType } from '../types/MenuItemTypes';
import convertIdToString from '../utils/convertIdToString';

export default function Index({
  lunchMenuItems,
  dinnerMenuItems,
}: {
  lunchMenuItems: MenuItemType[];
  dinnerMenuItems: MenuItemType[];
}) {
  const [language, setLanguage] = useState('Japanese');
  const [meal, setMeal] = useState('dinner');

  const dateUS = new Date().toLocaleDateString('en-US');
  const dateJP = new Date().toLocaleDateString('ja-JP');

  const dateLocalized = language === 'Japanese' ? dateJP : dateUS;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
      <Box
        component="img"
        alt="Logo"
        src="/images/Takayama_Full_Logo.png"
        sx={{
          objectFit: 'contain',
        }}
      />
      <Typography> { dateLocalized } </Typography>
      <Box>
        <Button onClick={() => setLanguage('Japanese')}>日本語</Button>
        <Button onClick={() => setLanguage('English')}>English</Button>
      </Box>
      <Box> Lunch/Dinner </Box>
      <Box component="ol" className="pl-0">
        {dinnerMenuItems.map((item: MenuItemType, index) => (
          <IndexSingleMenuItem key={`${item._id}-${language}`} menuItem={item} language={language} delay={index * 500}/>
        ))}
      </Box>

    </Box>
  );
}

export const getStaticProps = async () => {
  await dbConnect();

  const menuItemsQuery: (Document & MenuItemType)[] = await MenuItem.find({});
  const menuItems = menuItemsQuery.map((item: Document<MenuItemType>) => {
    const itemToObject = item.toObject();
    return convertIdToString(itemToObject);
  }) as MenuItemType[];

  console.log(menuItems);

  const lunchMenuItems = menuItems.filter((item: MenuItemType) => item.sTime === 'lunch')
    .sort((a: MenuItemType, b: MenuItemType) => a.pos - b.pos);
  const dinnerMenuItems = menuItems.filter((item: MenuItemType) => item.sTime === 'dinner')
    .sort((a: MenuItemType, b: MenuItemType) => a.pos - b.pos);

  return {
    props: {
      lunchMenuItems,
      dinnerMenuItems,
    },
  };
};
