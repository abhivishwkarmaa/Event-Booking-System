export function success(data, meta) {
  const body = { success: true, data };
  if (meta !== undefined) body.meta = meta;
  return body;
}

export function fail(message, code, details) {
  const body = { success: false, error: { message, code } };
  if (details !== undefined) body.error.details = details;
  return body;
}
