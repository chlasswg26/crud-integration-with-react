import { createAsyncThunk } from '@reduxjs/toolkit'
import { getProductsType, getProductByIdType, postProductType, putProductType, deleteProductType } from '../type/product'
import { getProducts, getProductById, postProduct, putProduct, deleteProduct } from '../../../utils/http'

export const getProductsActionCreator = createAsyncThunk(getProductsType, async (filter, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await getProducts(filter)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getProductByIdActionCreator = createAsyncThunk(getProductByIdType, async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await getProductById(id)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const postProductActionCreator = createAsyncThunk(postProductType, async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await postProduct(data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const putProductActionCreator = createAsyncThunk(putProductType, async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await putProduct(data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const deleteProductActionCreator = createAsyncThunk(deleteProductType, async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await deleteProduct(id)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})
