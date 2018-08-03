export const withoutFalsies = (obj: Object) => {
  const res = {};

  Object.keys(obj)
    // @ts-ignore
    .filter(key => !!obj[key])
    // @ts-ignore
    .forEach(key => (res[key] = obj[key]));

  return res;
};
