import React from 'react'
import { Text, View } from 'react-native'

export default function ({ header, children, ...props }) {
  return (
    <View className="border-gray-300 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-800" {...props}>
      {header && (
        <View className="px-3 py-2 border-b border-gray-300 dark:border-gray-800">
          <Text className="font-medium dark:text-white">{header}</Text>
        </View>
      )}
      <View className="p-3">{children}</View>
    </View>
  )
}

