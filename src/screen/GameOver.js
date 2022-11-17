/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {reload, link, volume, mute, dot3} from '../utility/images/CommonIcon';
import {Theme, storage} from '../utility/StaticData';

const style = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'flex-end'},
  headers: {
    fontFamily: 'Olifant_Normal',
    color: 'white',
    fontSize: 50,
  },
  points: {
    fontFamily: 'Olifant_Normal',
    color: Theme.primaryColor,
    fontSize: 150,
  },
  allIcons: {
    marginTop: '20%',
    marginBottom: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconl: {
    paddingRight: '15%',
    marginTop: '5%',
  },
  iconc: {
    transform: [{rotate: '55deg'}],
  },
  iconr: {
    paddingLeft: '15%',
    marginTop: '5%',
  },
  iconb: {
    marginTop: '10%',
  },
});

function HomeScreen({navigation, route, store}) {
  const [storeState, dispatch] = store;

  const animatedStartValue = React.useRef(new Animated.Value(0.5)).current;
  const [points, setpoints] = React.useState(0);
  React.useEffect(() => {
    const temp = storage.getNumber('highest_points');
    setpoints(temp);
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedStartValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedStartValue, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: 10,
      },
    ).start();
  }, []);
  return (
    <View style={style.container}>
      <Text style={style.points}>{points || 0}</Text>
      <Animated.View
        style={{
          // Bind opacity to animated value
          opacity: animatedStartValue,
        }}>
        <Text style={style.headers}>new Best!</Text>
      </Animated.View>

      <View style={style.allIcons}>
        <View style={style.icons}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              route.params.reset({selected: true});
            }}
            style={style.iconl}>
            <SvgXml fill="white" width={50} height={50} xml={link} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              route.params.reset({selected: true});
            }}
            style={style.iconc}>
            <SvgXml fill="white" width={70} height={70} xml={reload} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (storeState.isVibrate) dispatch({type: 'vibrate_off'});
              else dispatch({type: 'vibrate_on'});
            }}
            style={style.iconr}>
            {storeState.isVibrate ? (
              <SvgXml fill="white" width={50} height={50} xml={volume} />
            ) : (
              <SvgXml fill="white" width={50} height={50} xml={mute} />
            )}
          </TouchableOpacity>
        </View>
        <View style={style.iconb}>
          <SvgXml fill="white" width={50} height={50} xml={dot3} />
        </View>
      </View>
    </View>
  );
}
export default HomeScreen;
