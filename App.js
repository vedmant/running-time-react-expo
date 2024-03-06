import { StatusBar } from 'expo-status-bar'
import React from 'react'
import AppNavigator from '@/navigation/AppNavigator'
import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function App () {
  return (
    <SafeAreaProvider className="flex-1 dark:bg-gray-900">
      <AppNavigator />
      <StatusBar style="light" />
    </SafeAreaProvider>
  )
}
