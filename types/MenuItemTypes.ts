export type MenuItemType = {
  _id: string;
  enName: string;
  jaName: string;
  sTime: 'lunch' | 'dinner';
  pos: number;
};

export type MenuItemFormData = {
  pos?: number;
  id: string;
  enName: string;
  jaName: string;
  sTime: 'lunch' | 'dinner';
};

export interface AdminProps {
  menuItems: MenuItemType[];
}
