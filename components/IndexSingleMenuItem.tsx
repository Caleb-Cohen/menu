import { Box, Typography } from '@mui/material';

import { MenuItemType } from '../types/MenuItemTypes';

type IndexSingleMenuItemProps = {
  menuItem: MenuItemType;
  language: string;
};

const IndexSingleMenuItem: React.FC<IndexSingleMenuItemProps> = ({ menuItem, language }) => {
  const menuItemName = language === 'Japanese' ? menuItem.jaName : menuItem.enName;
  const isDescriptionEmpty = menuItem.jaDescription === '' && menuItem.enDescription === '';
  const menuItemDescription = language === 'Japanese' ? menuItem.jaDescription : menuItem.enDescription;
  return (
    <Box>
      <Typography>* {menuItemName}</Typography>
      {isDescriptionEmpty ? null : <Typography>{menuItemDescription}</Typography>}
    </Box>
  );
};

export default IndexSingleMenuItem;
