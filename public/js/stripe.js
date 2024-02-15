/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  // 1) Get checout session from API
  try {
    const session = await axios(
      `http://localhost:3000/api/v1/booking/checkout-session/${tourId}`
    );
    console.log(session);

    location.assign(session.data.data.invoiceUrl);
    // 2) Create checkout form + charh credit card
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
