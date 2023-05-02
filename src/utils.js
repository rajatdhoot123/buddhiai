export function sanitizeTableName(tableName) {
  return tableName.replace(/[^a-zA-Z0-9_]/g, "");
}
