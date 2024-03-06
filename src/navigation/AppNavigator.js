import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import AuthScreen from '@/screens/Auth/AuthScreen'
import MainTabNavigator from './MainTabNavigator'
import AuthLoadingScreen from '@/screens/Auth/AuthLoadingScreen'
import { useAuthStore } from '@/stores/auth'
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind'
import merge from 'lodash/merge'
import colors from 'tailwindcss/colors'

const Stack = createStackNavigator()

const LightTheme = merge({}, DefaultTheme)
LightTheme.colors.card = colors.indigo[600]

export default function ApplicationNavigator () {
  const user = useAuthStore(s => s.me)
  const { colorScheme } = useColorScheme()

  return (
    <NavigationContainer theme={{ ...(colorScheme === 'dark' ? DarkTheme : LightTheme) }}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={user ? 'Main' : 'AuthLoadingScreen'}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

