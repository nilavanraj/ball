import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SvgUri} from 'react-native-svg';

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
      <SvgUri
        width="100%"
        height="100%"
        uri={require("../utility/images/reload.svg")}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Slider1');
        }}>
        <Text style={style.headers}>dfgfd</Text>
      </TouchableOpacity>
    </View>
  );
}
export default HomeScreen;
