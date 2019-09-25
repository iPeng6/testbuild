/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect } from 'react'
import { SafeAreaView, Text, Button, StatusBar } from 'react-native'
import useStopwatch from './useStopwatch'

import { Splash } from './src/NativeModules'

const App = () => {
  const { time, start, status, Status } = useStopwatch({
    initTime: 10,
    onChange: () => {},
    onStop: () => {},
  })

  useEffect(() => {
    Splash.hide()
  }, [])

  console.log('updateApp')

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {status === Status.stop || status === Status.initial ? (
        <Button
          title={status === Status.initial ? '发送' : '重新发送'}
          onPress={() => {
            start()
          }}
        />
      ) : (
        <Text>{time}</Text>
      )}
    </SafeAreaView>
  )
}

export default App
