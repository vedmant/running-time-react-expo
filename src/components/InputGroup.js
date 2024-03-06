import React, { cloneElement, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { useColorScheme } from 'nativewind'

export default function ({ label, icon, error, className, ...props }) {
  const [focused, setFocused] = useState(false)
  const border = error ? 'border-red-600' : (focused ?  'border-indigo-600' : 'border-gray-300 dark:border-gray-800')
  const { colorScheme } = useColorScheme()

  return (
    <View className={`mb-4 ${className}`}>
      {label && (<Text className="mb-2 dark:text-white">{label}</Text>)}
      <View className={`border px-3 flex flex-row items-center justify-start rounded-lg bg-white dark:bg-gray-800 ${border}`}>
        {icon && cloneElement(icon, { weight: 'bold', size: 18, color: (colorScheme === 'dark' ? '#fff' : '#000'), style: { marginRight: 5 } })}
        <TextInput className="w-full leading-none py-2.5 dark:text-white" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} {...props} />
      </View>
      {error && <Text className="text-red-600 text-sm mt-1">{error}</Text>}
    </View>
  )
}
