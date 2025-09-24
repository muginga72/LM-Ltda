import axios from 'axios';

const API_URL = '/api/users/';

const signup = async (name, email, password, role) => {
  const res = await axios.post(API_URL + 'signup', { name, email, password, role });
  return res.data;
};

const login = async (email, password) => {
  const res = await axios.post(API_URL + 'login', { email, password });
  return res.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = { signup, login, logout };

export default authService;