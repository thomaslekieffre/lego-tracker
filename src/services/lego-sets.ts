import { RebrickableSet } from '@/types/rebrickable';
import {
  addLegoSet as addLegoSetAction,
  getUserLegoSets as getUserLegoSetsAction,
} from '@/app/collection/actions';

export const addLegoSet = async (rebrickableSet: RebrickableSet): Promise<void> => {
  return addLegoSetAction(rebrickableSet);
};

export const getUserLegoSets = async (): Promise<any[]> => {
  return getUserLegoSetsAction();
};
