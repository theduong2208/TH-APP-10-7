import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/weather';

import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Navigator chính của ứng dụng với animation mượt
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          // Animation chuyển màn hình native mượt
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
