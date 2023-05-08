export function sanitizeTableName(tableName) {
  return tableName.replace(/[^a-zA-Z0-9_]/g, "");
}

export const checkSpecialCharacter = (str) => {
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return format.test(str);
};
