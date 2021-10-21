import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// https://www.reactnativeschool.com/how-to-use-reanimated-2-a-beginners-guide
export const RandomBox = () => {
  // アニメーションで使うための値
  const randomNumber = useSharedValue(100);
  // valueをただ要素に渡すだけではvalueに変化があっても動かない。
  // style用のオブジェクトを生成しそれを要素に渡す
  const style = useAnimatedStyle(() => {
    return {
      width: withSpring(randomNumber.value), // withSpringで簡単にspringにできる。他にも色々ある
      height: withSpring(randomNumber.value, {stiffness: 150}),
    };
  });

  return (
    <View style={{}}>
      <TouchableOpacity
        onPress={() => {
          randomNumber.value = Math.random() * 350;
        }}>
        <Animated.View
          style={[
            style,
            {
              backgroundColor: 'orange',
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};
