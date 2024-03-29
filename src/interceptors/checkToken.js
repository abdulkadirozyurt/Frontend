const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error('Error decoding token:', error);
    return {};
  }
};

export const checkToken = (token) => {
  if(!token){
    return;
  }
  const expiration = decodeToken(token).exp * 1000;
  const now = Date.now();
  return now > expiration
}
