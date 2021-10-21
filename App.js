import React, {useState} from 'react';
import {Pressable, View, Text} from 'react-native';
import {RandomBox} from './RandomBox';
import {Meter} from './Meter';
import {TimingCirclue} from './TimingCircule';

const App = () => {
  const [content, setContent] = useState('RandomBox');

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          position: 'absolute',
          top: 80,
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
        }}>
        <Pressable onPress={() => setContent('RandomBox')}>
          <Text>RandomBox</Text>
        </Pressable>
        <Pressable onPress={() => setContent('Meter')}>
          <Text>Meter</Text>
        </Pressable>
        <Pressable onPress={() => setContent('TimingCircule')}>
          <Text>TimingCircule</Text>
        </Pressable>
      </View>
      {content === 'RandomBox' && <RandomBox />}
      {content === 'Meter' && <Meter />}
      {content === 'TimingCircule' && <TimingCirclue />}
    </View>
  );
};

export default App;
