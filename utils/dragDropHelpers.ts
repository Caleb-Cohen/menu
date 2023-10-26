import { NeighbourPositions } from '@/types/HelperTypes';
import { MenuItemType } from '@/types/MenuItemTypes';

export const findNeighbourPositions = (
  sourceIndex: number,
  destinationIndex: number,
  menuItems: MenuItemType[],
  differentColumn: boolean,
): NeighbourPositions => {
  let destinationPosBefore = 0;
  let destinationPosAfter = 0;

  if (differentColumn) {
    destinationPosBefore = menuItems[destinationIndex - 1]?.pos;
    destinationPosAfter = menuItems[destinationIndex]?.pos;
    return { before: destinationPosBefore, after: destinationPosAfter };
  }

  if (sourceIndex < destinationIndex) {
    destinationPosBefore = menuItems[destinationIndex].pos;
    destinationPosAfter = menuItems[destinationIndex + 1]?.pos;
  } else {
    destinationPosBefore = menuItems[destinationIndex - 1]?.pos;
    destinationPosAfter = menuItems[destinationIndex].pos;
  }

  return { before: destinationPosBefore, after: destinationPosAfter };
};

export const calculateAveragePosition = (
  destinationPosBefore: number | undefined,
  destinationPosAfter: number | undefined,
  menuItems: MenuItemType[],
): number => {
  if (menuItems.length === 0) {
    return 100;
  }
  if (!destinationPosBefore) {
    return menuItems[0].pos / 2;
  }
  if (!destinationPosAfter) {
    return menuItems[menuItems.length - 1].pos + 100;
  }
  return (destinationPosBefore + destinationPosAfter) / 2;
};

