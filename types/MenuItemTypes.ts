export type MenuItemType = {
  _id: string;
  enName: string;
  jaName: string;
  sTime: 'lunch' | 'dinner';
  pos: number;
};

export interface AdminProps {
  menuItems: MenuItemType[];
}
