/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, Button } from 'react-native';
import useStopwatch from './useStopwatch';

const App = () => {
  const { time, start, stop, status, Status } = useStopwatch({
    initTime: 10,
    onChange: () => {},
    onStop: () => {},
  });

  console.log('updateApp');

  return (
    <SafeAreaView>
      {status === Status.stop || status === Status.initial ? (
        <Button
          title={status === Status.initial ? '发送' : '重新发送'}
          onPress={() => {
            start();
          }}
        />
      ) : (
        <Text>{time}</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
