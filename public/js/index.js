/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { updateData } from './updateSettings.js';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');

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

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    e.preventDefault();
    updateData(name, email);
  });
}
