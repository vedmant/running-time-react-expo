import React, { cloneElement } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'

export default function ({ label, loading, icon, style, pressableStyle, ...props }) {
  const iconProps = { weight: 'bold', size: 18, color: 'white', style: { marginRight: 6 } }

  return (
    <View className={`rounded-lg overflow-hidden bg-indigo-600`} style={style}>
      <Pressable className="flex flex-row items-center p-3 justify-center"
                 android_ripple={{ color: '#4338ca' }}
                 style={pressableStyle}
                 {...props}
      >
        {loading
          ? <ActivityIndicator {...iconProps} />
          : icon && cloneElement(icon, { ...iconProps, ...icon?.props })
        }
        <Text className="text-white">{label}</Text>
      </Pressable>
    </View>
  )
}
