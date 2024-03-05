import React from 'react'
import { View } from 'react-native'
import Panel from '@/components/Panel'
import EntryForm from './EntryForm'
import { useNavigation } from '@react-navigation/native'

export default function () {
  const navigation = useNavigation()

  return (
    <View className="p-2">
      <Panel>
        <EntryForm onSuccess={() => navigation.goBack()} />
      </Panel>
    </View>
  )
}
