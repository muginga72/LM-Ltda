// client/src/services/fetchServices.js

export const fetchServices = async () => {
  const response = await fetch("https://lmltda-api.onrender.com");
  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }
  const data = await response.json();
  return data.services;
};