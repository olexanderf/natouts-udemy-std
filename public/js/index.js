/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    e.preventDefault();
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => logout());
}
