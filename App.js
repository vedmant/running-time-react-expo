import { StatusBar } from 'expo-status-bar'
import React from 'react'
import AppNavigator from './src/navigation/AppNavigator'
import 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function App() {
  return (
    <SafeAreaView className="flex-1 justify-center" style={{
      flex: 1,
    }}>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}
