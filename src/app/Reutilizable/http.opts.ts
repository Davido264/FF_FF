export function generateOptions(token: string) {
  return {
    headers: new Headers({ 'Authorization': `Bearer ${token}` }),
  };
}
