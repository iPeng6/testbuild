import React from 'react'
import { SafeAreaView, Text, View, Button, StatusBar, StyleSheet } from 'react-native'
import useStopwatch from 'src/hooks/useStopwatch'
import useSplash from 'src/hooks/useSplash'
import { useStore } from 'src/store'

const App = () => {
  const { time, start, status, Status } = useStopwatch({
    initTime: 10,
    onChange: () => {},
    onStop: () => {},
  })

  useSplash()

  const { state, dispatch, Types } = useStore()

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

      {state.todosM.todos.map(({ id, todo }) => {
        return (
          <View key={id} style={s.todo}>
            <Text>{id}</Text>
            <Text>{todo}</Text>
            <Button
              title="Del"
              onPress={() => {
                dispatch({ type: Types.todosM.DEL_BY_ID, payload: { id } })
              }}
            />
          </View>
        )
      })}

      <Button
        title="Add"
        onPress={() => {
          dispatch({ type: Types.todosM.ADD_TODO, payload: { todo: 'dodo' + Math.random() } })
        }}
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  todo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})

export default App
