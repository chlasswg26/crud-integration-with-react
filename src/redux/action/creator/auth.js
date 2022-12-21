import { createAsyncThunk } from '@reduxjs/toolkit'
import { loginType, logoutType } from '../type/auth'
import { authLogin, authLogout } from '../../../utils/http'

export const loginActionCreator = createAsyncThunk(loginType, async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await authLogin(data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const logoutActionCreator = createAsyncThunk(logoutType, async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await authLogout()

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})
