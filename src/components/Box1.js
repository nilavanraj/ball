/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef} from 'react';
import {DeviceEventEmitter, Dimensions} from 'react-native';

import {
  RoundedRect,
  useValue,
  Group,
  useComputedValue,
  useValueEffect,
  ValueApi,
} from '@shopify/react-native-skia';
import {hasIntersection} from '../helper/Index';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const speedRotation = {
  1: 0.03,
  2: 0.05,
  3: 0.07,
};

const speedFallX = {
  0: 2,
  1: -5,
  2: 5,
  3: 3,
  4: -3,
  5: -2,
};
const speedFall = {
  1: -5,
  2: 3,
  3: 2,
};
const Box = ({
  WIDTH,
  HEIGHT,
  pointer,
  sr,
  sf,
  isPoints,
  hitLost,
  hitGain,
  pointGain,
  delay,
  x = 0,
  y = 0,
  gameOver,
  index,
  sfx,
  isfall = true,
}) => {
  const rx = useValue(x);
  const ry = useValue(y);
  const position = useValue(0.785);
  const dynamicWidth = useValue(WIDTH);
  const dynamicHeight = useValue(HEIGHT);
  const ballTouch = useRef(false);
  let hit = {};
  const clock = ValueApi.createClockValue();
  clock.addListener(() => {
    if (gameOver.current) {
      clock.stop();
    }

    if (ry.current > windowHeight || ballTouch.current) {
      if (dynamicWidth.current < 10) {
        dynamicWidth.current = 0;
        dynamicHeight.current = 0;
        !ballTouch.current && hitLost(index);
        clock.stop();
      } else {
        dynamicWidth.current -= 10;
        dynamicHeight.current -= 10;
        ry.current += 10;
        rx.current += 10;
        originX.current -= 10;
        originY.current -= 10;
      }
    }
    position.current = position.current + speedRotation[sr];
    ry.current += speedFall[sf];
    rx.current += speedFallX[sfx];
    // if (isfall) {
    //   rx.current = x + incrementX * ry.current;
    // }
    return 1;
  });

  const originX = useComputedValue(() => {
    return dynamicWidth.current / 2 + rx.current;
  }, [rx, dynamicWidth]);
  const originY = useComputedValue(() => {
    return dynamicHeight.current / 2 + ry.current;
  }, [ry, dynamicHeight]);

  useEffect(() => {
    setTimeout(() => {
      clock.start();
    }, delay);
  }, []);

  useValueEffect(position, () => {
    // const angle = (position.current * 180) / Math.PI;
    const section1 = hasIntersection(
      {x: pointer[0].current, y: pointer[1].current, r: 21},
      {x: rx.current, y: ry.current, width: WIDTH, height: HEIGHT},
    );
    if (pointer[0]?.current && pointer[1]?.current && section1 && !hit.check) {
      hit.check = true;
      if (isPoints) {
        // pointGain();
        // clock.stop();
        DeviceEventEmitter.emit('pointGain', index);
        ballTouch.current = true;
      } else {
        clock.stop();
        if (section1) {
          hitGain(index, pointer[0], pointer[1]);
        }
      }
    }
    try {
    } catch (error) {
      console.log(error);
    }
  });

  const rotationTransform = useComputedValue(() => {
    return [{rotate: position.current}];
  }, [position]);

  const rotationOrigin = useComputedValue(() => {
    return {x: originX.current, y: originY.current};
  }, [originX, originY]);

  return (
    <Group transform={rotationTransform} origin={rotationOrigin}>
      <RoundedRect
        r={5}
        x={rx}
        y={ry}
        width={dynamicWidth}
        height={dynamicHeight}
        color={isPoints ? '#01db99' : 'white'}
      />
    </Group>
  );
};
export default React.memo(Box, () => true);
