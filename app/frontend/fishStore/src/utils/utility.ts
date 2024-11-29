import {jwtDecode} from 'jwt-decode';

export const getUserNickFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.sub || null;
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
};

export const getImageUrl = (imageName: string) => {
    return imageName
      ? `http://localhost:8080/images/${imageName}`
      : `http://localhost:8080/images/default.jpg`;
  };