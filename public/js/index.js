/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { login } from './login.js';
import { displayMap } from './mapbox.js';

try {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
} catch (error) {
  console.log(error);
}

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
