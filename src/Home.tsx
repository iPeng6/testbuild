import React, { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface HomeProps {}

const Home: FC<HomeProps> = props => {
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

const s = StyleSheet.create({})

export default Home
