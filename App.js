import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Theme} from './src/utility/StaticData';
import Home from './src/screen/Home';
import Slider1 from './src/screen/Slider1';
import GameOver from './src/screen/GameOver';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(45, 45, d85)',
    background: Theme.screenColor,
  },
};
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen name="GameOver" component={GameOver} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Slider1" component={Slider1} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
