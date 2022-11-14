import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
const style = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  headers: {
    fontFamily: 'Olifant_Normal',
    color: 'white',
    fontSize: 100,
  },
});

function HomeScreen({navigation}) {
  return (
    <View style={style.container}>
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
