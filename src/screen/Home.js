import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Box from '../components/Box';
import Lottie from 'lottie-react-native';

const style = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  headers: {
    fontFamily: 'Olifant_Normal',
    color: 'white',
    fontSize: 100,
  },
  canvas: {flex: 1},
  lottieContainer: {
    width: 400,
    height: 400,

    zIndex: 1,
  },
});

function HomeScreen({navigation}) {
  const animationRef = React.useRef(null);

  React.useEffect(() => {
    animationRef.current.play();
  }, []);
  return (
    <View style={style.container}>
      <View style={style.lottieContainer}>
        <Lottie
          loop={false}
          ref={animationRef}
          source={require('../utility/animations/load-box.json')}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Slider1');
        }}>
        <Text style={style.headers}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}
export default HomeScreen;
