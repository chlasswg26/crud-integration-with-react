import { Button, Input, InputWrapper, Modal, useMantineTheme, LoadingOverlay } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { forwardRef, Fragment, memo } from 'react'
import { ErrorMessage, withFormik } from 'formik'
import { useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'

const forwardedRef = forwardRef
const CustomAddProductModalWithFormikProps = ({
    values,
    handleChange,
    handleSubmit
}) => {
    const { post } = useSelector(state => state.product, shallowEqualRedux)

    return (
        <Fragment>
            <LoadingOverlay visible={post?.isPending} />
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
                        disabled={post?.isPending}
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
                        disabled={post?.isPending}
                    />
                </InputWrapper>
                <Button
                    type='submit'
                    mt='xl'
                    fullWidth
                    disabled={post?.isPending}
                    color='indigo'>
                    Submit
                </Button>
            </form>
        </Fragment>
    )
}
const CustomAddProductModalWithFormik = withFormik({
    displayName: 'AddProductModalForm',
    mapPropsToValues: () => ({
        name: '',
        price: ''
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
        const data = {}

        data.name = values?.name
        data.price = values?.price

        props.callback(data)
        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: false
})(CustomAddProductModalWithFormikProps)
const CustomAddProductModal = forwardedRef(({
    isOpen,
    setIsOpen,
    dispatchPostProductAction
}, ref) => {
    const theme = useMantineTheme()

    return (
        <Modal
            itemRef={ref}
            opened={isOpen}
            transition='skew-up'
            onClose={() => setIsOpen(false)}
            title='Add Product'
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.95}
            size='xl'
            closeOnClickOutside={false}>
            <CustomAddProductModalWithFormik callback={(values) => dispatchPostProductAction(values)} />
        </Modal>
    )
})

export const AddProductModal = memo(CustomAddProductModal, shallowEqual)
