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

// export const separarPorCategorias = (servicios: Servicios[]) => {
//   const newCategorias = {
//     plomeria: servicios.filter(servicio => servicio.tipo.tipo === "Plomeria"),
//     gasista: servicios.filter(servicio => servicio.tipo.tipo === "Gasista"),
//     electricista: servicios.filter(servicio => servicio.tipo.tipo === "Electricista"),
//     refrigeracion: servicios.filter(servicio => servicio.tipo.tipo === "Tecnico en Refrigeracion"),
//     cerrajero: servicios.filter(servicio => servicio.tipo.tipo === "Cerrajero"),
//     pintor: servicios.filter(servicio => servicio.tipo.tipo === "Pintor")
//   };
//   setCategorias(newCategorias);
// };