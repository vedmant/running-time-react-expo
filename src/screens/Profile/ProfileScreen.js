import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import ProfileForm from './ProfileForm'
import { useAuthStore } from '@/stores/auth'
import { SignOut } from 'phosphor-react-native'
import Button from '@/components/Button'

export default function () {
  return (
    <ScrollView className="p-2 bg-gray-100 dark:bg-gray-800">
      <Button
        label="Logout"
        className="mb-4"
        icon={<SignOut weight={'bold'} size={18} color={'white'} />}
        onPress={() => {
          useAuthStore.getState().logout()
        }}
      />
      <ProfileForm
        message="Successfully updated profile"
        button="Update"
      />
    </ScrollView>
  )
}
