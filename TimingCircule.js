import React, {useEffect} from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Circle, LinearGradient, Defs, Stop, G} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const TimingCirclue = () => {
  const radius = 30;
  const strokeWidth = 3;
  const HALF_WIDTH = radius + strokeWidth;
  const CIRCUMFERENCE = 2 * radius * Math.PI;
  const progressValue = useSharedValue(CIRCUMFERENCE);

  const animatedProgress = useAnimatedProps(() => {
    return {
      strokeDashoffset: progressValue.value,
    };
  });

  useEffect(() => {
    progressValue.value = withTiming(0, {
      duration: 500,
      // easing: Easing.ease,
    });
  }, [progressValue]);

  return (
    <View>
      <Svg
        width={HALF_WIDTH * 2}
        height={HALF_WIDTH * 2}
        viewBox={`${-HALF_WIDTH} ${-HALF_WIDTH} ${2 * HALF_WIDTH} ${
          2 * HALF_WIDTH
        }`}>
        <Defs>
          <LinearGradient id="gradient">
            <Stop stopColor="#ff9791" stopOpacity="1" offset="0%" />
            <Stop stopColor="#f7b57c" stopOpacity="1" offset="100%" />
          </LinearGradient>
        </Defs>
        <G rotation="-90">
          <AnimatedCircle
            cx={0}
            cy={0}
            r={radius}
            stroke={'url(#gradient)'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProgress}
          />
        </G>
      </Svg>
    </View>
  );
};
