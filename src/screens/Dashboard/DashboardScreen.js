import React, { useState } from 'react'
import { Dimensions, RefreshControl, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import Panel from '@/components/Panel'
import EntryForm from '@/screens/Entries/EntryForm'
import { useGeneralStore } from '@/stores/general'
import { useColorScheme } from 'nativewind'
import colors from 'tailwindcss/colors'

export default function () {
  const [loading, setLoading] = useState(false)
  const [booted, setBooted] = useState(false)
  const dashboard = useGeneralStore(s => s.dashboard)
  const loadDashboard = useGeneralStore(s => s.loadDashboard)
  const isDark = useColorScheme().colorScheme === 'dark'

  const dispatchLoadDashboard = async () => {
    setLoading(true)
    await loadDashboard()
    setLoading(false)
  }

  if (!booted) {
    dispatchLoadDashboard()
    setBooted(true)
  }

  const onRefresh = () => {
    dispatchLoadDashboard()
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{padding: 10}}
        className="gap-y-2 bg-gray-100 dark:bg-gray-800"
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={loading} tintColor={isDark ? colors.gray[200] : colors.gray[700]} />
        }>
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
