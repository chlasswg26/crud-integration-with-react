import axios from 'axios'
import { Duration } from '@icholy/duration'
import qs from 'qs'

const { REACT_APP_BACKEND_URL, REACT_APP_REQUEST_TIMEOUT } = process.env
const axiosInstance = axios.create()
const duration = new Duration(REACT_APP_REQUEST_TIMEOUT)

axiosInstance.defaults.baseURL = REACT_APP_BACKEND_URL
axiosInstance.defaults.timeout = duration.milliseconds()
axiosInstance.defaults.paramsSerializer = (params) =>
    qs.stringify(params, {
        arrayFormat: 'brackets'
    })

axiosInstance.interceptors.request.use(
    (config) => {
        const isFormDataInstance = config.data instanceof FormData

        if (!isFormDataInstance) config.data = qs.stringify(config.data)

        const token = localStorage.getItem('@acc_token')

        if (token !== null) config.headers.common.Authorization = `Bearer ${token}`

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
axiosInstance.interceptors.response.use(
    (response) => {
        const token = response.data?.data?.token

        if (token) localStorage.setItem('@acc_token', token)

        return response
    },
    async (error) => {
        return Promise.reject(error)
    }
)

const PRODUCT_PATH = '/product'

export const authLogin = async (userData = {}) => await axiosInstance.post('/login', userData)
export const authLogout = async () => await axiosInstance.post('/logout')

export const getProducts = async () => await axiosInstance.get(PRODUCT_PATH)
export const getProductById = async (id = null) => await axiosInstance.get(`${PRODUCT_PATH}/show?product_id=${id}`)
export const postProduct = async (productData = {}) => await axiosInstance.post(`${PRODUCT_PATH}/store`, productData)
export const putProduct = async (productData = {}) => await axiosInstance.post(`${PRODUCT_PATH}/update`, productData)
export const deleteProduct = async (id = null) => await axiosInstance.delete(`${PRODUCT_PATH}/${id}`)
