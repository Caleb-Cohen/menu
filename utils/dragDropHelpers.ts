import { NeighbourPositions } from '@/types/HelperTypes';
import { MenuItemType } from '@/types/MenuItemTypes';

export const calculateAveragePosition = (
  destinationPosBefore: number | undefined,
  destinationPosAfter: number | undefined,
  lunchMenuItems: MenuItemType[],
): number => {
  if (!destinationPosBefore) {
    return lunchMenuItems[0].pos / 2;
  }
  if (!destinationPosAfter) {
    return lunchMenuItems[lunchMenuItems.length - 1].pos + 100;
  }
  return (destinationPosBefore + destinationPosAfter) / 2;
};

export const findNeighbourPositions = (
  sourceIndex: number,
  destinationIndex: number,
  lunchMenuItems: MenuItemType[],
): NeighbourPositions => {
  let destinationPosBefore = 0;
  let destinationPosAfter = 0;

  if (sourceIndex < destinationIndex) {
    destinationPosBefore = lunchMenuItems[destinationIndex].pos;
    destinationPosAfter = lunchMenuItems[destinationIndex + 1]?.pos;
  } else {
    destinationPosBefore = lunchMenuItems[destinationIndex - 1]?.pos;
    destinationPosAfter = lunchMenuItems[destinationIndex].pos;
  }

  return { before: destinationPosBefore, after: destinationPosAfter };
};

