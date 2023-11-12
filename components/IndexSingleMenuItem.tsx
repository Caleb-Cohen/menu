import { Box, Typography, Fade } from '@mui/material';

import { MenuItemType } from '../types/MenuItemTypes';

type IndexSingleMenuItemProps = {
  menuItem: MenuItemType;
  language: string;
  delay: number;
};

const IndexSingleMenuItem: React.FC<IndexSingleMenuItemProps> = ({ menuItem, language, delay }) => {
  const menuItemName = language === 'Japanese' ? menuItem.jaName : menuItem.enName;
  const isDescriptionEmpty = menuItem.jaDescription === '' && menuItem.enDescription === '';
  const menuItemDescription = language === 'Japanese' ? menuItem.jaDescription : menuItem.enDescription;
  return (
    <Fade in={true} timeout={3000} style= {{ transitionDelay: `${delay}ms` }} key={language}>
      <Box>
        <Typography>* {menuItemName}</Typography>
        {isDescriptionEmpty ? null : <Typography>{menuItemDescription}</Typography>}
      </Box>
    </Fade>
  );
};

export default IndexSingleMenuItem;
