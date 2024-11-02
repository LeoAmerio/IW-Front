// export const setUser = (user: User) => {
//   user.jwt = jwtDecode<UserJwtPayload>(user.token);
//   localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(user));
// };

// export const removeUser = () => {
//   localStorage.removeItem(USER_LOCAL_KEY);
// };

export const truncateDescription = (descripcion: string, maxLength: number) => {
  return descripcion.length > maxLength
    ? `${descripcion.substring(0, maxLength)}...`
    : descripcion;
};
