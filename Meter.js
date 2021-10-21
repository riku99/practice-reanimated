import React, {useEffect} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Svg, {Circle, G, LinearGradient, Defs, Stop} from 'react-native-svg';

const clamp = (x, min, max) => {
  'worklet';
  if (x < min) return min;
  if (x > max) return max;
  return x;
};

const COLOR = 'orange';
const HANDLE_WIDTH = 20;

export const Slider = ({sliderWidth, progress}) => {
  const animatedHandleStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: progress.value - HANDLE_WIDTH / 2}],
    };
  });

  const panGestureHandler = useAnimatedGestureHandler({
    // startProgressアニメーションの開始値が保存される
    onStart: (_, ctx) => {
      ctx.startProgress = progress.value;
    },
    // On pan, new progress is the starting progress plus change in position
    onActive: (event, ctx) => {
      progress.value = ctx.startProgress + event.translationX;
    },
    // On pan-end, snap back to 0 or sliderWidth if out of bounds.
    onEnd: () => {
      if (progress.value > sliderWidth.value) {
        progress.value = withSpring(sliderWidth.value);
      } else if (progress.value < 0) {
        progress.value = withSpring(0);
      }
    },
  });

  return (
    <View
      onLayout={e => {
        sliderWidth.value = e.nativeEvent.layout.width;
      }}
      style={{
        backgroundColor: 'rgb(234,234,234)',
        justifyContent: 'flex-end',
        borderRadius: 10,
        width: '80%',
        height: 35,
      }}>
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View
          style={[
            {
              width: HANDLE_WIDTH,
              backgroundColor: COLOR,
              borderRadius: 10,
              position: 'absolute',
              bottom: -20,
              top: -20,
            },
            animatedHandleStyle,
          ]}></Animated.View>
      </PanGestureHandler>
    </View>
  );
};

// RNのTexiInputは本来アニメータブルではない
// Animated.createAnimatedComponentに渡すことでアニメータブルにすることができる
// これにより useAnimatedProps で定義したオブジェクトを渡すことが可能になる
const AnimatedInput = Animated.createAnimatedComponent(TextInput);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({
  progress,
  sliderWidth,
  radius = 100,
  strokeWidth = 6,
}) => {
  const CIRCUMFERENCE = 2 * Math.PI * radius; // 円周
  const HALF_WIDTH = radius + strokeWidth; // 半径

  const animatedProgressProps = useAnimatedProps(() => {
    const percentComplete = clamp(progress.value / sliderWidth.value, 0, 1);

    return {
      strokeDashoffset: (1 - percentComplete) * CIRCUMFERENCE, // 線の始まりの位置
    };
  });

  const animatedInputProps = useAnimatedProps(() => {
    const percentComplete = clamp(progress.value / sliderWidth.value, 0, 1);

    return {
      text: `${Math.round(100 * percentComplete)}`,
      color: interpolateColor(
        percentComplete,
        [0, 0.5, 1],
        [COLOR, COLOR, 'white'],
      ),
    };
  });

  return (
    <View>
      <View style={{width: radius * 2, height: radius * 2}}>
        <Svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`${-HALF_WIDTH} ${-HALF_WIDTH} ${2 * HALF_WIDTH} ${
            2 * HALF_WIDTH
          }`}>
          <Defs>
            {/* グラデーション定義 */}
            <LinearGradient id="gradient">
              {/* Stopはグラデーションを設定するためのもの */}
              <Stop stopColor="#ff9791" stopOpacity="1" offset="0%" />
              <Stop stopColor="#f7b57c" stopOpacity="1" offset="100%" />
            </LinearGradient>
          </Defs>
          {/* G でローテーションすることでアニメーションの開始位置を頂点からに見せる */}
          <G rotation="-90">
            <AnimatedCircle
              cx={0} // xの中心
              cy={0} // yの中心
              r={radius} // 半径
              fill="transparent" // 背景色(みたいなもん)
              strokeWidth={strokeWidth}
              strokeLinecap="round" // パスの終端の形状
              strokeDasharray={CIRCUMFERENCE} // 線の間隔
              animatedProps={animatedProgressProps}
              stroke="url(#gradient)"
            />
          </G>
        </Svg>
        <AnimatedInput
          editable={false}
          defaultValue="0"
          style={[
            StyleSheet.absoluteFill,
            {
              fontSize: radius / 2,
              fontWeight: '500',
              textAlign: 'center',
              textShadowColor: 'black',
              textShadowOffset: {width: 2, height: 2},
              textShadowRadius: 4,
            },
          ]}
          animatedProps={animatedInputProps}
        />
      </View>
    </View>
  );
};

export const Meter = () => {
  const sliderWidth = useSharedValue(0);
  const progress = useSharedValue(0);
  return (
    <>
      <CircularProgress progress={progress} sliderWidth={sliderWidth} />
      <Slider sliderWidth={sliderWidth} progress={progress} />
    </>
  );
};
