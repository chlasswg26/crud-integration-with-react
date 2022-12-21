import { Button, Input, InputWrapper, Modal, useMantineTheme, LoadingOverlay } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { forwardRef, Fragment, memo } from 'react'
import { ErrorMessage, withFormik } from 'formik'
import { useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'

const forwardedRef = forwardRef
const CustomEditProductModalWithFormikProps = ({
    values,
    handleChange,
    handleSubmit
}) => {
    const { put } = useSelector(state => state.product, shallowEqualRedux)

    return (
        <Fragment>
            <LoadingOverlay visible={put?.isPending} />
            <form onSubmit={handleSubmit}>
                <InputWrapper
                    id='product-name-id'
                    required
                    label='Name'
                    description='Please enter product name'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='name' />}>
                    <Input
                        variant='filled'
                        id='input-product-name'
                        placeholder='Product name'
                        value={values.name}
                        onChange={handleChange('name')}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <InputWrapper
                    id='product-price-id'
                    required
                    label='Price'
                    description='Please enter product price'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='price' />}>
                    <Input
                        variant='filled'
                        id='input-product-price'
                        placeholder='Product price'
                        value={values.price}
                        onChange={handleChange('price')}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <Button
                    type='submit'
                    mt='xl'
                    fullWidth
                    disabled={put?.isPending}
                    color='indigo'>
                    Submit
                </Button>
            </form>
        </Fragment>
    )
}
const CustomEditProductModalWithFormik = withFormik({
    enableReinitialize: true,
    displayName: 'EditProductModalForm',
    mapPropsToValues: (props) => ({
        name: props?.product?.name,
        price: props?.product?.price
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
        const data = {}

        data.name = values?.name
        data.price = values?.price
        data.product_id = props?.product?.id

        props.callback(data)
        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: false
})(CustomEditProductModalWithFormikProps)
const CustomEditProductModal = forwardedRef(({
    isOpen,
    setIsOpen,
    product,
    dispatchUpdateProductAction
}, ref) => {
    const theme = useMantineTheme()

    return (
        <Modal
            itemRef={ref}
            opened={isOpen}
            transition='skew-up'
            onClose={() => setIsOpen(false)}
            title='Edit Product'
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.95}
            size='xl'
            closeOnClickOutside={false}>
            <CustomEditProductModalWithFormik
                callback={(values) => dispatchUpdateProductAction(values)}
                product={product}
            />
        </Modal>
    )
})

export const EditProductModal = memo(CustomEditProductModal, shallowEqual)
