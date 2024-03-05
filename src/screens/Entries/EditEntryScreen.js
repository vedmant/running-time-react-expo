import React from 'react'
import { View } from 'react-native'
import Panel from '@/components/Panel'
import EntryForm from './EntryForm'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function () {
  const navigation = useNavigation()
  const route = useRoute()

  return (
    <View className="p-2">
      <Panel>
        <EntryForm
          item={route.params.item}
          onSuccess={() => navigation.goBack()}
        />
      </Panel>
    </View>
  )
}
