export function isEmpty(arr: string[]) {
  for (let el of arr) {
    if (el == "") {
      return true;
    }
  }
  return false;
}
