export type MenuItemType = {
  _id: string;
  jaName: string;
  jaDescription: string;
  enName: string;
  enDescription: string;
  sTime: 'lunch' | 'dinner';
  pos: number;
};

export interface AdminProps {
  menuItems: MenuItemType[];
}
