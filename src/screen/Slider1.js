/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  DeviceEventEmitter,
  Vibration,
} from 'react-native';

import {
  Canvas,
  Circle,
  useValue,
  useTouchHandler,
  RoundedRect,
} from '@shopify/react-native-skia';
import Box from '../components/Box';
import Lottie from 'lottie-react-native';
import {Theme, storage} from '../utility/StaticData';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const addBox = new Map();
const style = StyleSheet.create({
  lottieContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    opacity: 0,
    zIndex: 0,
    // backgroundColor:"black"
  },
  points: {
    position: 'absolute',
    fontFamily: 'Olifant_Normal',
    color: 'white',
    fontSize: 150,
    alignSelf: 'center',
    top: '70%',
  },
  canvas: {flex: 1},
});

const Slider1 = ({navigation, store}) => {
  const [storeState] = store;
  const cx = useValue(windowWidth * 0.1);

  const cy = useValue(windowHeight * 0.45);
  const copacity = useValue(1);
  const animationRef = useRef(null);
  const hitBlockAnimation = useRef(null);
  const delay = useRef(0);
  const gameOver = useRef(false);
  const add = useRef(0);
  const addPoints = useRef(0);
  const points = useRef(0);

  const [state, setState] = useState({
    constraints: 1,
    points: 0,
    reset: 0,
  });
  useEffect(() => {
    storage.set('points', JSON.stringify(state.points));

    if (state.points) {
      const temp = storage.getString('highest_points');
      if (!temp || Number(temp) < state.points) {
        
        storage.set('highest_points', JSON.stringify(state.points));
      }
    }
  }, [state.points]);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('pointGain', key => {
      pointGain(Number(key));
    });
    const sub = setInterval(() => {
      if (gameOver.current) {
        clearInterval(sub);
      }
      gameDifficultGen();
    }, 500);
    return () => {
      if (sub) {
        clearInterval(sub);
      }
      listener.remove();
    };
  }, [state.reset]);

  const touchHandler = useTouchHandler({
    onActive: ({x, y}) => {
      if (windowWidth * 0.1 <= x && windowWidth * 0.9 >= x) {
        cx.current = x;
      }
    },
  });
  const reset = () => {
    copacity.current = 1;
    gameOver.current = false;
    setState(preState => ({
      ...preState,
      constraints: 1,
      points: 0,
      reset: preState.reset + 1,
    }));
    hitBlockAnimation.current.setNativeProps({
      opacity: 0,
      top: 0,
      left: 0,
      zIndex: 0,
    });
  };
  const hitGain = useCallback(
    (key, tempCX, tempCY) => {
      console.log(tempCX.current, tempCY.current);

      addBox.delete(key);
      copacity.current = 0;
      gameOver.current = true;
      hitBlockAnimation.current.setNativeProps({
        opacity: 1,
        top: tempCY.current - 100,
        left: tempCX.current - 100,
        zIndex: 1,
      });

      animationRef.current.play(490, 600);
      if (storeState.isVibrate) {
        Vibration.vibrate();
      }
      setTimeout(() => {
        console.log(state.points);
        navigation.navigate('GameOver', {reset: reset, points: state.points});
      }, 500);
    },
    [state.points],
  );
  const hitLost = useCallback(
    key => {
      addBox.delete(key);
    },
    [state],
  );

  const pointGain = useCallback(
    key => {
      addBox.delete(key);
      if (storeState.isVibrate) {
        Vibration.vibrate(100);
      }
      // gameDifficultGen(true);
      addPoints.current = 1;
    },
    [state],
  );

  const gameDifficultGen = useCallback(() => {
    switch (true) {
      case state.constraints < 5:
        add.current = 1;
        break;
      case state.constraints >= 5 && state.constraints < 20:
        add.current = 2;
        break;
      case state.constraints >= 20 && state.constraints < 50:
        add.current = 2;
        break;
      default:
        add.current = 2;
      // case state.constraints >= 50 && state.constraints < 100:
      //   add.current = 3;
      //   break;
    }
    delay.current = 0;

    setState(preState => {
      for (let i = 0; i < add.current; i++) {
        addBox.set(
          preState.constraints + i,
          <MemoBox index={preState.constraints + i} />,
        );
      }

      return {
        ...preState,
        constraints: preState.constraints + add.current,
        points: preState.points + addPoints.current,
      };
    });

    addPoints.current = 0;
  }, [state]);

  const MemoBox = ({index}) => (
    <Box
      key={index}
      index={index}
      x={Math.floor(Math.random() * windowWidth)}
      y={-60}
      pointer={[cx, cy]}
      HEIGHT={50}
      WIDTH={50}
      sr={randomIntFromInterval(1, 3)}
      sf={randomIntFromInterval(1, 3)}
      gameOver={gameOver}
      delay={delay.current == 1 ? 0 : delay.current * 300}
      isPoints={Math.floor(Math.random() * 3) === 2}
      // pointGain={pointGain}
      hitLost={hitLost}
      hitGain={hitGain}
    />
  );
  return (
    <View style={{flex: 1, backgroundColor: Theme.screenColor}}>
      <View ref={hitBlockAnimation} style={style.lottieContainer}>
        <Lottie
          loop={false}
          ref={animationRef}
          source={require('../utility/animations/bubble-blast.json')}
        />
      </View>

      <Canvas style={style.canvas} onTouch={touchHandler}>
        <RoundedRect
          r={30}
          x={windowWidth * 0.1}
          y={cy.current - 15}
          width={windowWidth * 0.8}
          height={30}
          color={'rgba(28,32,46,255)'}
        />
        <Circle
          opacity={copacity}
          cx={cx}
          cy={cy}
          r={20}
          height={10}
          color={Theme.primaryColor}
        />

        {[...Array(state.constraints)].map((val, index) => {
          if (index >= state.constraints - add.current) {
            delay.current += 1;
          }
          addBox.has(index);
          return addBox.get(index);
        })}
      </Canvas>
      <Text style={style.points}>{state.points}</Text>
    </View>
  );
};

export default Slider1;
