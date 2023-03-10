import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    get: {},
    getById: {},
    post: {},
    put: {},
    delete: {}
}

const productReducer = createReducer(initialState, (builder) => {
    builder
        .addMatcher(
            (action) => action.type.endsWith('product/pending'),
            (state, action) => {
                const type = action.type.split('/')

                state[type[0]] = {
                    isPending: true
                }
            }
        )
        .addMatcher(
            (action) => action.type.endsWith('product/rejected'),
            (state, action) => {
                const type = action.type.split('/')

                state[type[0]] = {
                    isRejected: true,
                    statusCode: action.payload?.response?.status,
                    errorMessage: action.payload?.response?.data?.data?.message || action.payload?.message
                }
            }
        )
        .addMatcher(
            (action) => action.type.endsWith('product/fulfilled'),
            (state, action) => {
                const type = action.type.split('/')
                let data = {
                    isFulfilled: true,
                    response: action.payload?.data?.data
                }

                data = action.type.startsWith('get/product') ? {
                    ...data,
                    pagination: action.payload?.data?.pagination
                } : data

                state[type[0]] = data
            }
        )
})

export default productReducer
