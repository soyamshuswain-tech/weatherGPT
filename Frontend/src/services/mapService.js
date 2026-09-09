import { mapData } from '../data/mockMapData';

export const getMapData = async (lat, lng) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mapData);
    }, 300);
  });
};
