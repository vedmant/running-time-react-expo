import React, { useState } from 'react'
import { Dimensions, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import Panel from '@/components/Panel'
import EntryForm from '@/screens/Entries/EntryForm'
import { useGeneralStore } from '@/stores/general'
import { useColorScheme } from 'nativewind'
import colors from 'tailwindcss/colors'
import Button from '@/components/Button'
import { useBackgroundPermissions, useForegroundPermissions } from 'expo-location'
import { useLocationData, useLocationTracking } from '@/services/location'
import { Play, Stop } from 'phosphor-react-native'
import MapPath from '@/components/MapPath'
import dayjs from 'dayjs'
import { useEntriesStore } from '@/stores/entries'
import Toast from 'react-native-root-toast'

function useAskPermissions () {
  const [foregroundPermission, askForegroundPermission] = useForegroundPermissions()
  const [backgroundPermission, askBackgroundPermission] = useBackgroundPermissions()

  return async () => {
    await askForegroundPermission()
    await askBackgroundPermission()
  }
}

function formatDuration (seconds) {
  const date = new Date(0)
  date.setSeconds(seconds)
  return date.toISOString().substring(11, 19)
}


export default function () {
  const [loading, setLoading] = useState(false)
  const [booted, setBooted] = useState(false)
  const dashboard = useGeneralStore(s => s.dashboard)
  const loadDashboard = useGeneralStore(s => s.loadDashboard)
  const isDark = useColorScheme().colorScheme === 'dark'
  const askPermissions = useAskPermissions()
  const { locations, summary, speed } = useLocationData()
  const tracking = useLocationTracking()
  const [start, setStart] = useState(dayjs())


  const dispatchLoadDashboard = async () => {
    setLoading(true)
    await loadDashboard()
    setLoading(false)
  }

  if (! booted) {
    dispatchLoadDashboard()
    setBooted(true)
  }

  const onRefresh = () => {
    dispatchLoadDashboard()
  }

  const trackRun = async () => {
    await askPermissions()
    await tracking.clearTracking()
    await tracking.startTracking()
    setStart(dayjs())
  }

  const stopRun = async () => {
    const form = {
      date: dayjs().format('MM/DD/YYYY'),
      distance: summary.distance / 1000,
      time: formatDuration(dayjs().diff(start, 'second')),
    }

    await tracking.clearTracking()

    if (summary.distance > 100) {
      await useEntriesStore.getState().storeEntry(form)
      Toast.show('Your run was saved')
    } else {
      Toast.show('Run minimum 10 meters to save the record')
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{ padding: 10 }}
        className="gap-y-2 bg-gray-100 dark:bg-gray-800"
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={loading} tintColor={isDark ? colors.gray[200] : colors.gray[700]} />
        }>

        <View className="pb-2 pt-2 items-center">
          {tracking.isTracking
            ? <>
              <Text className="dark:text-white">
                Time: {formatDuration(dayjs().diff(start, 'second'))}{'\n'}
                Distance: {Math.round(summary.distance)} m{'\n'}
                Speed: {speed} km/h{'\n'}
                Elevation: {Math.round(summary.elevation)} m{'\n'}
                Descend: {Math.round(summary.descend)} m
              </Text>
              <Button label="Stop" icon={<Stop weight="fill" />} className="mt-2" onPress={stopRun} />
            </>
            : <Button label="Start"
                      className="rounded-full bg-fuchsia-700 w-24 py21 shadow-lg shadow-gray-700 py-1"
                      pressableStyle={{ flexDirection: 'column' }}
                      textStyle={{ fontWeight: 'bold' }}
                      icon={<Play size={40} weight="fill" className="mb-1" />}
                      onPress={trackRun}
            />
          }
        </View>

        <MapPath locations={locations} className="h-64" />

        {/*{locations.slice(-5).map((item) => (*/}
        {/*  <View className="flex flex-row gap-2" key={item.timestamp}>*/}
        {/*    <Text className="dark:text-white">{JSON.stringify(item.coords)}</Text>*/}
        {/*  </View>*/}
        {/*))}*/}

        <Panel header="This week">
          <Text className="dark:text-white">
            <Text>Records: </Text>
            <Text className="font-bold">{dashboard.weekly_count}</Text>
          </Text>
          <Text className="dark:text-white">
            <Text>Average speed: </Text>
            <Text className="font-bold">
              {Math.round((dashboard.weekly_avg_speed || 0) * 10) / 10} km/h
            </Text>
          </Text>
          <Text className="dark:text-white">
            <Text>Average pace: </Text>
            <Text className="font-bold">
              {Math.round((dashboard.weekly_avg_pace || 0) * 10) / 10} min/km
            </Text>
          </Text>
        </Panel>
        <Panel header="Best results">
          <Text className="dark:text-white">
            <Text>Best speed: </Text>
            <Text className="font-bold">
              {Math.round(dashboard.max_speed * 10) / 10} km/h
            </Text>
          </Text>
          <Text className="dark:text-white">
            <Text>Longest distance: </Text>
            <Text className="font-bold">{dashboard.max_distance || 0} km</Text>
          </Text>
          <Text className="dark:text-white">
            <Text>Longest run: </Text>
            <Text className="font-bold">{dashboard.max_time || 0}</Text>
          </Text>
        </Panel>
        {dashboard?.week_chart?.length ? (
          <Panel header="My Performance" bodyStyle={{ padding: 0 }} className="overflow-hidden">
            <LineChart
              data={{
                labels: dashboard.week_chart.map(i => i[0]),
                datasets: [
                  {
                    color: (opacity = 1) => `rgba(220, 57, 18, ${opacity})`,
                    data: dashboard.week_chart.map(i => i[1]),
                  },
                  {
                    color: (opacity = 1) => `rgba(51, 102, 204, ${opacity})`,
                    data: dashboard.week_chart.map(i => i[2]),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 25} // from react-native
              height={220}
              yAxisLabel={''}
              yAxisSuffix={' km'}
              paddingLeft={0}
              chartConfig={{
                backgroundColor: isDark ? colors.gray[700] : '#fff',
                backgroundGradientFrom: isDark ? colors.gray[700] : '#fff',
                backgroundGradientTo: isDark ? colors.gray[700] : '#fff',
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ width: 150 }}>
                <View style={styles.legendRow}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: 'rgb(220, 57, 18)' },
                    ]}
                  />
                  <Text className="dark:text-white"> - Speed</Text>
                </View>
                <View style={[styles.legendRow, { paddingBottom: 15 }]}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: 'rgb(51, 102, 204)' },
                    ]}
                  />
                  <Text className="dark:text-white"> - Distance</Text>
                </View>
              </View>
            </View>
          </Panel>
        ) : null}
        <Panel header="Add new Time Record">
          <EntryForm />
        </Panel>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  legendRow: {
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 15,
    height: 15,
    borderRadius: 15,
  },
})
