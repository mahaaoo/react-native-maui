
import { createNavigationContainerRef } from '@react-navigation/native';
import { StackActions  } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export const navigate = (name: string, params?: object | undefined) => {
  console.log('navigate to', name);
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function push(name: string, params?: object | undefined) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
}