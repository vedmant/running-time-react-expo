import React, { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useAuthStore } from '@/stores/auth'
import { useNavigation } from '@react-navigation/native'

export default function () {
  const navigation = useNavigation()

  useEffect(() => {
    (async () => {
      if (! (await useAuthStore.getState().checkLogin())) {
        navigation.navigate('Auth')
      }
    })()
  })

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator animating size="large" />
    </View>
  )
}
