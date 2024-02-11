/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  // 1) Get checout session from API
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) Create checkout form + charh credit card
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
