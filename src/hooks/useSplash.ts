import { useEffect } from 'react'
import { Platform } from 'react-native'
import { Splash } from 'src/NativeModules'

export default function useSplash() {
  useEffect(() => {
    let st: any
    if (Platform.OS === 'android') {
      st = setTimeout(() => {
        Splash.hide()
      }, 100)
    }
    return () => {
      st && clearTimeout(st)
    }
  }, [])
}
