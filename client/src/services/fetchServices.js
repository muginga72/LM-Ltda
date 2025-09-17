// client/src/services/fetchServices.js

export const fetchServices = async () => {
  const response = await fetch("http://localhost:5000/api");
  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }
  const data = await response.json();
  return data.services;
};