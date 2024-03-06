import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import DashboardScreen from '@/screens/Dashboard/DashboardScreen'
import AddEntryScreen from '@/screens/Entries/AddEntryScreen'
import EditEntryScreen from '@/screens/Entries/EditEntryScreen'
import EntriesScreen from '@/screens/Entries/EntriesScreen'
import ProfileScreen from '@/screens/Profile/ProfileScreen'
import { SquaresFour, ListDashes, User } from 'phosphor-react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useColorScheme } from 'nativewind'
import colors from 'tailwindcss/colors'

const tabsLight = {
  tabBarActiveTintColor: colors.white,
  tabBarInactiveTintColor: colors.indigo[200],
  tabBarActiveBackgroundColor: colors.indigo[500],
  tabBarInactiveBackgroundColor: colors.indigo[600],
  headerTintColor: colors.white,
  headerStyle: { backgroundColor: colors.indigo[600] },
}

const tabsDark = {
  tabBarActiveTintColor: colors.indigo[600],
  tabBarInactiveTintColor: colors.white,
  tabBarActiveBackgroundColor: colors.gray[800],
  tabBarInactiveBackgroundColor: colors.gray[900],
  headerTintColor: colors.white,
  headerStyle: { backgroundColor: colors.gray[900] },
}

const Stack = createStackNavigator()

function EntriesStack () {
  const { colorScheme } = useColorScheme()

  return (<Stack.Navigator screenOptions={{ headerShown: true, ...(colorScheme === 'dark' ? tabsDark : tabsLight)  }}>
    <Stack.Screen name="ListEntries" component={EntriesScreen} options={{ title: 'Runs' }} />
    <Stack.Screen name="EditEntry" component={EditEntryScreen} options={{ title: 'Edit Run' }} />
    <Stack.Screen name="AddEntry" component={AddEntryScreen} options={{ title: 'Add Run' }} />
  </Stack.Navigator>)
}

const Tab = createBottomTabNavigator()

export default function () {
  const { colorScheme } = useColorScheme()
  const tabBarStyles = { tabBarStyle: { height: 83 }, tabBarItemStyle: { paddingBottom: 7, paddingTop: 5 }}

  return (
    <Tab.Navigator screenOptions={{...tabBarStyles, ...(colorScheme === 'dark' ? tabsDark : tabsLight) }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ color }) => (
          <SquaresFour name="home" color={color} size={26} />
        ),
      }} />
      <Tab.Screen name="Runs" component={EntriesStack} options={{
        headerShown: false,
        tabBarLabel: 'Runs',
        tabBarIcon: ({ color }) => (
          <ListDashes name="home" color={color} size={26} />
        ),
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color }) => (
          <User name="home" color={color} size={26} />
        ),
      }} />
    </Tab.Navigator>
  )
}
