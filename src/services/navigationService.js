import {NavigationActions} from 'react-navigation';

let _navigator;
let debounce;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

function navigateWithDebounce(routeName, params) {
  let func = () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      _navigator.dispatch(NavigationActions.navigate({
        routeName,
        params
      }));
    }, 300);   
  }
  return func();
}

function back() {
  _navigator.dispatch(
    NavigationActions.back()
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  back,
  setTopLevelNavigator,
  navigateWithDebounce
}