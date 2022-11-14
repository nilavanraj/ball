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
} from 'react-native';

import {
  Canvas,
  Circle,
  useValue,
  useTouchHandler,
} from '@shopify/react-native-skia';
import Box from '../components/Box';
import Lottie from 'lottie-react-native';
import {Theme} from '../utility/StaticData';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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

const Slider1 = () => {
  const cx = useValue(100);
  const cy = useValue(windowHeight * 0.45);
  const copacity = useValue(1);
  const animationRef = useRef(null);
  const hitBlockAnimation = useRef(null);
  const delay = useRef(0);
  const gameOver = useRef(false);
  const add = useRef(0);
  const addPoints = useRef(0);
  const [state, setState] = useState({
    constraints: 1,
    points: 0,
  });
  useEffect(() => {
    DeviceEventEmitter.addListener('pointGain', () => {
      pointGain();
    });
    const sub = setInterval(() => {
      if (gameOver.current) {
        clearInterval(sub);
      }
      gameDifficultGen();
    }, 500);
  }, []);
  const touchHandler = useTouchHandler({
    onActive: ({x, y}) => {
      cx.current = x;
    },
  });

  const hitGain = useCallback(() => {
    copacity.current = 0;
    gameOver.current = true;
    hitBlockAnimation.current.setNativeProps({
      opacity: 1,
      top: cy.current - 100,
      left: cx.current - 100,
      zIndex: 1,
    });

    animationRef.current.play(490, 600);
  }, []);
  const hitLost = useCallback(() => {
    // gameDifficultGen();

    console.log('hitLost');
  }, [state]);

  const pointGain = useCallback(() => {
    // gameDifficultGen(true);
    addPoints.current = 1;
    console.log('pointGain');
  }, [state]);

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
    setState(preState => ({
      ...preState,
      constraints: preState.constraints + add.current,
      points: preState.points + addPoints.current,
    }));
    addPoints.current = 0;
    // setconstraints(constraints + add.current);
    // points && setpoints(points + 1);
    console.log('gameDifficultGen');
  }, [state]);

  console.log('constraints', state);
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
        {[...Array(state.constraints)].map((val, index) => {
          if (index >= state.constraints - add.current) {
            delay.current += 1;
          }
          return (
            <Box
              x={index % 2 ? windowWidth : 0}
              y={-60}
              pointerX={cx}
              pointerY={cy}
              HEIGHT={50}
              WIDTH={50}
              sr={3}
              sf={2}
              gameOver={gameOver}
              delay={delay.current == 1 ? 0 : delay.current * 300}
              isPoints={Math.floor(Math.random() * 3) === 2}
              // pointGain={pointGain}
              hitLost={hitLost}
              hitGain={hitGain}
            />
          );
        })}

        <Circle
          opacity={copacity}
          cx={cx}
          cy={cy}
          r={20}
          height={10}
          color={Theme.primaryColor}
        />
      </Canvas>
      <Text style={style.points}>{state.points}</Text>
    </View>
  );
};

export default Slider1;
