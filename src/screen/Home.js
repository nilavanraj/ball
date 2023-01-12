import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import ScrollHorzontal from '../components/ScrollHorzontal';
import Lottie from 'lottie-react-native';
const DATA = [
  {
    id: 1,
    name: 'I',
  },
  {
    id: 2,
    name: 'II',
  },
  {
    id: 3,
    name: 'III',
  },
];
const navObj = ['Slider1', 'Slider2', 'Rotate1'];
const style = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  headers: {
    fontFamily: 'Olifant_Normal',
    color: 'white',
    fontSize: 100,
  },
  nameheaders: {
    fontFamily: 'Olifant_Normal',
    color: 'white',
    fontSize: 50,
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
  const [selectedId, setSelectedId] = React.useState(0);

  React.useEffect(() => {
    const sub = setInterval(() => {
      animationRef.current.play();
    }, 2000);

    return () => {
      clearImmediate(sub);
    };
  }, []);
  const renderItem = (item, index) => (
    <TouchableOpacity
      style={{
        paddingHorizontal: 10,
      }}
      onPress={() => {
        setSelectedId(index);
      }}>
      <Text
        style={[style.nameheaders, {opacity: selectedId == index ? 1 : 0.4}]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={style.container}>
      <View style={style.lottieContainer}>
        <Lottie
          loop={false}
          ref={animationRef}
          source={require('../utility/animations/load-box.json')}
        />
      </View>
      <ScrollHorzontal
        onChange={e => {
          setSelectedId(e);
        }}
        data={DATA}
        itemWidth={200}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={{
          paddingBottom: 30,
        }}
        onPress={() => {
          navigation.navigate(navObj[selectedId]);
        }}>
        <Text style={style.headers}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}
export default HomeScreen;
