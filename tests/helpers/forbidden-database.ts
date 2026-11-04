/** Unit/HTTP tests must fail explicitly if a real database call escapes mocks. */
export function forbiddenDatabase() {
  const rejectAccess = () => {
    throw new Error("Unexpected database access in an isolated route test");
  };
  return {
    db: new Proxy({}, { get: rejectAccess }),
    pool: new Proxy({}, { get: rejectAccess }),
  };
}
