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
import Box from '../components/Box1';
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

  const cx1 = useValue(windowWidth);
  var radius = (windowHeight * 0.45) / 2;
  const cx = useValue(
    windowWidth * 0.5 + radius * Math.sin((Math.PI * 2 * 0) / 360),
  );
  const cy = useValue(
    windowHeight * 0.45 + radius * Math.cos((Math.PI * 2 * 0) / 360),
  );
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
    reset: 0,
  });
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
  useEffect(() => {
    if (state.points) {
      const temp = storage.getString('highest_points');
      if (Number(temp) < state.points) {
        storage.set('highest_points', JSON.stringify(state.points));
      }
    }
  }, [state.points]);

  const touchHandler = useTouchHandler({
    onStart: ({x, y}) => {
      addonPosition = x;
      console.log('start', x, y);
    },
    onActive: ({x, y}) => {
      var angle = 360 * (x / windowWidth);

      cx.current =
        windowWidth * 0.5 + radius * Math.sin((Math.PI * 2 * angle) / 360);
      cy.current =
        windowHeight * 0.45 + radius * Math.cos((Math.PI * 2 * angle) / 360);
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
      //  console.log(tempCX.current, tempCY.current);
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
        navigation.navigate('GameOver', {reset: reset, points: state.points});
      }, 500);
    },
    [state],
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
    // setconstraints(constraints + add.current);
    // points && setpoints(points + 1);
  }, [state]);

  // console.log('constraints', state);
  // console.log('addBox', addBox.size);

  const MemoBox = ({index}) => (
    <Box
      key={index}
      index={index}
      x={windowWidth / 2}
      y={windowHeight * 0.45}
      pointer={[cx, cy, cx1, cy]}
      HEIGHT={50}
      WIDTH={50}
      sr={randomIntFromInterval(1, 3)}
      sf={randomIntFromInterval(1, 3)}
      sfx={Math.floor(Math.random() * 6)}
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
        <Circle
          opacity={copacity}
          cx={windowWidth * 0.5}
          cy={windowHeight * 0.45}
          r={radius + 10}
          height={10}
          color={'rgba(28,32,46,255)'}
        />
        <Circle
          opacity={copacity}
          cx={windowWidth * 0.5}
          cy={windowHeight * 0.45}
          r={radius - 10}
          height={10}
          color={Theme.screenColor}
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
