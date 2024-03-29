import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Alert, FlatList, RefreshControl, Text, View, ActivityIndicator } from 'react-native'
import Panel from '@/components/Panel'
import SmallButton from '@/components/SmallButton'
import { Pencil, Plus, Trash } from 'phosphor-react-native'
import { useEntriesStore } from '@/stores/entries'
import { useNavigation } from '@react-navigation/native'
import Button from '@/components/Button'
import colors from 'tailwindcss/colors'
import { useColorScheme } from 'nativewind'

export default function () {
  const navigation = useNavigation()
  const entries = useEntriesStore(s => s.entries)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const isDark = useColorScheme().colorScheme === 'dark'

  async function loadEntries () {
    setLoading(true)
    await useEntriesStore.getState().loadEntries()
    setLoading(false)
  }

  async function loadMore () {
    if (!loadingMore && entries.current_page < entries.last_page) {
      setLoadingMore(true)
      await useEntriesStore.getState().loadMoreEntries({ page: entries.current_page + 1 })
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [])

  async function onDeleteItem (item) {
    Alert.alert('Delete', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          await useEntriesStore.getState().deleteEntry(item.id)
          loadEntries()
        },
      },
    ])
  }

  function renderItem (item) {
    return (
      <Panel className="mb-2">
        <View className="flex flex-row">
          <View className="flex-1">
            <Text className="dark:text-white">
              Date: {dayjs(item.date).format('MM/DD/YY')}
            </Text>
            <Text className="dark:text-white">Distance: {Math.round(item.distance * 100) / 100} km</Text>
            <Text className="dark:text-white">Time: {item.time}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text className="dark:text-white">
              Avg. Speed: {Math.round(item.speed * 10) / 10}
            </Text>
            <Text className="dark:text-white">
              Avg. Pace: {Math.round(item.pace * 10) / 10}
            </Text>
          </View>
          <View className="flex items-start flex-col gap-2">
            <SmallButton
              onPress={() => navigation.navigate('EditEntry', { item })}
            >
              <Pencil size={14} color={'white'} />
            </SmallButton>
            <SmallButton onPress={() => onDeleteItem(item)} type="danger">
              <Trash size={14} color={'white'} />
            </SmallButton>
          </View>
        </View>
      </Panel>
    )
  }

  function renderFooter () {
    if (!loadingMore) {
      return null
    }

    return (
      <View>
        <ActivityIndicator animating size="large" color={isDark ? colors.gray[200] : colors.gray[700]} />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-800">
      <FlatList
        className="flex-1"
        data={entries.data}
        contentContainerStyle={{padding: 10}}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={item => item.id + ''}
        refreshControl={
          <RefreshControl onRefresh={loadEntries} refreshing={loading} tintColor={isDark ? colors.gray[200] : colors.gray[700]} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          loading ? null : (
            <View className="justify-center flex-1 flex-row">
              <Text className="dark:text-white">The list is empty</Text>
            </View>
          )
        }
      />
      <Button
        className="shadow-lg absolute bottom-0 right-0 m-4"
        icon={<Plus className="ml-1" size={24} color={'white'} weight={'bold'} />}
        onPress={() => navigation.navigate('AddEntry')}
      />
    </View>
  )
}
