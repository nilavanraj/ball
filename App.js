/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Button, DeviceEventEmitter} from 'react-native';
import {
  Canvas,
  Circle,
  useValue,
  useTouchHandler,
} from '@shopify/react-native-skia';
import {PointInside, VectorPoint} from './src/helper/Index';
import Box from './src/components/Box';
import Lottie from 'lottie-react-native';

const App = () => {
  const cx = useValue(100);
  const cy = useValue(400);
  const copacity = useValue(1);
  const animationRef = useRef(null);
  const hitBlockAnimation = useRef(null);
  const [constraints, setconstraints] = useState(1);

  const touchHandler = useTouchHandler({
    onActive: ({x, y}) => {
      cx.current = x;
    },
  });

  const hitGain = useCallback(() => {
    copacity.current = 0;
    hitBlockAnimation.current.setNativeProps({
      opacity: 1,
      top: cy.current - 100,
      left: cx.current - 100,
      zIndex: 1,
    });

    animationRef.current.play(490, 600);
  }, []);
  const hitLost = useCallback(() => {
    setconstraints(constraints + 1);
    console.log('hitLost');
  }, [constraints]);

  const pointGain = useCallback(() => {
    setconstraints(constraints + 1);
    console.log('pointGain');
  }, [constraints]);
  console.log('constraints', constraints);
  return (
    <View style={{flex: 1, backgroundColor: '#12141c'}}>
      <View
        ref={hitBlockAnimation}
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          opacity: 0,
          zIndex: 0,
          // backgroundColor:"black"
        }}>
        <Lottie
          loop={false}
          ref={animationRef}
          source={require('./src/utility/animations/bubble-blast.json')}
        />
      </View>

      <Canvas style={{flex: 1}} onTouch={touchHandler}>
        {[...Array(constraints)].map((val, index) => (
          <Box
            x={index%2?150:0}
            y={150}
            pointerX={cx}
            pointerY={cy}
            HEIGHT={50}
            WIDTH={50}
            sr={3}
            sf={2}
            delay={0} 
            isPoints={Math.floor(Math.random() * 3) === 2}
            pointGain={pointGain}
            hitLost={hitLost}
            hitGain={hitGain}
          />
        ))}

        <Circle
          opacity={copacity}
          cx={cx}
          cy={cy}
          r={20}
          height={10}
          color={'#01db99'}
        />
      </Canvas>
    </View>
  );
};

export default App;
