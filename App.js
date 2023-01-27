import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Theme} from './src/utility/StaticData';
import Home from './src/screen/Home';
import Slider1 from './src/screen/Slider1';
import Slider2 from './src/screen/Slider2';

import Rotate1 from './src/screen/Rotate1';
import LottieSplashScreen from "react-native-lottie-splash-screen";

import GameOver from './src/screen/GameOver';
import {initialState, reducer} from './context';

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
  React.useEffect(() => {
    LottieSplashScreen?.hide(); // here
  }, []);
  // [state, dispatch]
  const store = React.useReducer(reducer, initialState);

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home">
          {props => <Home {...props} store={store} />}
        </Stack.Screen>
        <Stack.Screen
          options={{headerShown: false, animation: 'slide_from_bottom'}}
          name="GameOver">
          {props => <GameOver {...props} store={store} />}
        </Stack.Screen>
        <Stack.Screen name="Slider1">
          {props => <Slider1 {...props} store={store} />}
        </Stack.Screen>
        <Stack.Screen name="Slider2">
          {props => <Slider2 {...props} store={store} />}
        </Stack.Screen>
        <Stack.Screen name="Rotate1">
          {props => <Rotate1 {...props} store={store} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
