import { AsyncStorage } from 'react-native'
import devTools from 'remote-redux-devtools'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import reducer from '../reducers'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, reducer)

export default function configureStore(onCompletion) {
  const enhancer = compose(
    applyMiddleware(thunk),
    devTools({
      name: 'RunningTime',
      realtime: true,
      hostname: 'localhost',
      port: 8000,
      suppressConnectErrors: false,
    })
  )

  let store = createStore(persistedReducer, enhancer)
  let persistor = persistStore(store, null, onCompletion)

  return store
}
