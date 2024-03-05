import { StatusBar } from 'expo-status-bar'
import React from 'react'
import AppNavigator from './src/navigation/AppNavigator'
import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  )
}
