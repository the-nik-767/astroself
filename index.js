/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import serviceFactory from './src/services/serviceFactory';
// removed recoil global state
import { store } from './src/state/store';
import messaging from '@react-native-firebase/messaging';

serviceFactory.create();

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // Handle background message here
  return Promise.resolve();
});

const RootComponent = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RootComponent);
