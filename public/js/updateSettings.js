/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfuly!');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
