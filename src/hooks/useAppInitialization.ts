import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser, setUserToken } from '../state/slices/appSlice';
import serviceFactory from '../services/serviceFactory';

export const useAppInitialization = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Initialize service factory
        serviceFactory.create();
        console.log('Service factory initialized');
        
        // Load user data from AsyncStorage
        const userDataString = await AsyncStorage.getItem('USER_DATA');
        const userToken = await AsyncStorage.getItem('USER_TOKEN');

        console.log('Storage data - User data exists:', !!userDataString);
        console.log('Storage data - Token exists:', !!userToken);

        if (userDataString && userToken) {
          try {
            const userData = JSON.parse(userDataString);
            console.log('Parsed user data:', userData);
            
            // Dispatch user data to Redux state
            dispatch(setUser(userData));
            dispatch(setUserToken(userToken));
            console.log('App initialized with user data from storage');
          } catch (parseError) {
            console.error('Error parsing user data from storage:', parseError);
            // Clear invalid data
            await AsyncStorage.removeItem('USER_DATA');
            await AsyncStorage.removeItem('USER_TOKEN');
            console.log('Cleared invalid user data from storage');
          }
        } else {
          console.log('No user data found in storage');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, [dispatch]);
};
