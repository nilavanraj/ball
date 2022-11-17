export const initialState = {isVibrate: 0};
export function reducer(state, action) {
  switch (action.type) {
    case 'vibrate_on':
      return {isVibrate: true};
    case 'vibrate_off':
      return {isVibrate: false};
    default:
      throw new Error();
  }
}
