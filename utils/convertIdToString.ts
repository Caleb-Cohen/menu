import { MenuItemType } from '@/types/MenuItemTypes';

export default function convertIdToString(menuItem: MenuItemType) {
  return {
    ...menuItem,
    _id: menuItem._id.toString(),
  };
}
