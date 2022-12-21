import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import auth from './auth'
import product from './product'
import theme from './theme'

const customPersistTheme = {
    key: 'theme',
    storage
}

const appReducer = combineReducers({
    auth,
    product,
    theme: persistReducer(
        customPersistTheme,
        theme
    )
})
const rootReducer = (state, action) => {
    if (action.type === 'logout/auth/fulfilled') {
        state = {}
        localStorage.clear()
    }

    return appReducer(state, action)
}

export default rootReducer
