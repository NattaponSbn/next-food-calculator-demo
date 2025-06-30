import axios from 'axios';

const serverApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ใช้ URL เดียวกัน
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default serverApiClient;