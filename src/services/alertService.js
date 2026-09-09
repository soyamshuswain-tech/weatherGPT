import { alertsData } from '../data/mockAlerts';

export const getAlerts = async (lat, lng) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(alertsData);
    }, 400);
  });
};
