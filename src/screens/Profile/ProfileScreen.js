import React from 'react'
import { StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { logout } from '../../actions/auth'
import { connect } from 'react-redux'
import Button from '../../components/Button'
import ProfileForm from './ProfileForm'
import Colors from '../../constants/Colors'

function ProfileScreen(props) {
  return (
    <KeyboardAwareScrollView style={styles.container} enableOnAndroid>
      <Button onPress={() => {
        props.dispatch(logout())
        props.navigation.navigate('Auth')
      }}>Logout</Button>
      <ProfileForm {...props} message="Successfully updated profile" button="Update" />
    </KeyboardAwareScrollView>
  )
}

ProfileScreen.navigationOptions = {
  title: 'Profile',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.pageBackground,
  },
})

export default connect(state => ({
  me: state.auth.me,
}))(ProfileScreen)
