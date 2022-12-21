import { Box, Button, Center, List, LoadingOverlay, Menu, Modal, Text, ThemeIcon, useMantineTheme } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { createRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { TableData } from '../components/TableData'
import { deleteProductActionCreator, getProductByIdActionCreator, getProductsActionCreator, postProductActionCreator, putProductActionCreator } from '../redux/action/creator/product'
import { AddProductModal } from '../components/modal/AddProductModal'
import { EditProductModal } from '../components/modal/EditProductModal'
import { useModals } from '@mantine/modals'
import { DialogBox } from '../components/DialogBox'
import moment from 'moment/moment'
import { BiChevronRight } from 'react-icons/bi'

const Product = () => {
    const columns = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id',
            id: 'ID',
            Footer: 'ID'
        },
        {
            Header: 'Name',
            accessor: 'name',
            id: 'Name',
            Footer: 'Name'
        },
        {
            Header: 'Price',
            accessor: 'price',
            id: 'Price',
            Footer: 'Price'
        },
        {
            Header: 'Action',
            id: 'Action',
            Cell: (props) => {
                const [showEditModal, setShowEditModal] = useState(false)
                const editProductModalRef = createRef()
                const deleteDialogRef = createRef()
                const modals = useModals()
                const openDeleteModal = (id, productName) => {
                    const modalId = modals.openConfirmModal({
                        itemRef: deleteDialogRef,
                        title: 'Delete Product',
                        centered: true,
                        children: (
                            <Text size='sm'>
                                Are you sure you want to delete <strong><b><i>{productName.toLocaleUpperCase()}</i></b></strong>? This
                                action is destructive and data will lost forever.
                            </Text>
                        ),
                        hideCloseButton: true,
                        closeOnClickOutside: false,
                        labels: { confirm: 'Delete', cancel: 'No don\'t delete it' },
                        confirmProps: { color: 'red' },
                        onCancel: () => modals.closeModal(modalId),
                        onConfirm: () => dispatch(deleteProductActionCreator(id))
                    })
                }

                const onViewSingleProduct = useCallback(() => {
                    dispatch(getProductByIdActionCreator(props?.row?.original?.id))

                    setOpened(true)
                }, [dispatch])

                return (
                    <Center>
                        <Menu placement='center' shadow='lg' size='xl' withArrow control={
                            <Button radius='lg' variant='light' color='blue' fullWidth style={{ marginTop: 14 }}>
                                Action
                            </Button>
                        }>
                            <Menu.Label>Choose an action</Menu.Label>

                            <Menu.Item onClick={onViewSingleProduct} color='dark'>View</Menu.Item>,
                            <Menu.Item onClick={() => setShowEditModal(true)} color='indigo'>Edit</Menu.Item>
                            <Menu.Item onClick={() => openDeleteModal(props?.row?.original?.id, props?.row?.original?.name)} color='red'>Delete</Menu.Item>
                        </Menu>
                        {showEditModal && (
                            <EditProductModal
                                ref={editProductModalRef}
                                isOpen={showEditModal}
                                setIsOpen={setShowEditModal}
                                product={props?.row?.original}
                                dispatchUpdateProductAction={(values) => dispatch(putProductActionCreator(values))}
                            />
                        )}
                    </Center>
                )
            },
            Footer: 'Action'
        },
        {
            Header: 'Created at',
            accessor: 'created_at',
            id: 'Created at',
            Footer: 'Created at'
        },
        {
            Header: 'Last Update',
            accessor: 'updated_at',
            id: 'Last Update',
            Footer: 'Last Update'
        }
    ], [])
    const [data, setData] = useState([])
    const dispatch = useDispatch()
    const { getProduct, getProductById, postProduct, putProduct, deleteProduct } = useSelector(state => ({
        getProduct: state.product.get,
        getProductById: state.product.getById,
        postProduct: state.product.post,
        putProduct: state.product.put,
        deleteProduct: state.product.delete
    }), shallowEqualRedux)
    const getProductResponse = getProduct?.response
    const isPostProductFulfilled = postProduct?.isFulfilled
    const isPutProductFulfilled = putProduct?.isFulfilled
    const isDeleteProductFulfilled = deleteProduct?.isFulfilled
    const theme = useMantineTheme()
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const addProductModalRef = createRef()
    const userDialogRef = createRef()
    const mounted = useRef()
    const zoneName = moment().locale('id')
    const tableData = useMemo(() => data, [data])
    const [opened, setOpened] = useState(false)

    useEffect(() => {
        if (!mounted.current) {
            dispatch(getProductsActionCreator())
            mounted.current = true
        } else {
            if (isPostProductFulfilled || isPutProductFulfilled || isDeleteProductFulfilled) {
                dispatch(getProductsActionCreator())
                setShowDialog(true)
            }
        }
    }, [
        isPostProductFulfilled,
        isPutProductFulfilled,
        isDeleteProductFulfilled
    ])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        } else {
            if (getProductResponse) {
                setData(getProductResponse.map(value => ({
                    ...value,
                    created_at: moment(value.created_at).locale(zoneName).format('LLLL'),
                    updated_at: moment(value.updated_at).locale(zoneName).format('LLLL')
                })))
            }
        }
    }, [getProductResponse])

    return (
        <Box>
            <LoadingOverlay visible={deleteProduct?.isPending || getProduct?.isPending} />
            <Button
                variant='gradient'
                gradient={{ from: 'teal', to: 'gray', deg: 65 }}
                color={theme.colorScheme === 'dark' ? 'indigo' : 'dark'}
                size='xl'
                mb='xl'
                uppercase
                compact
                onClick={() => setShowAddModal(true)}>
                Create New Product
            </Button>
            <TableData columns={columns} data={tableData} />
            {showDialog && (
                <DialogBox
                    ref={userDialogRef}
                    isDialogOpen={showDialog}
                    onDialogClose={() => setShowDialog(false)}
                    status={
                        getProduct?.statusCode ||
                        postProduct?.statusCode ||
                        putProduct?.statusCode ||
                        deleteProduct?.statusCode
                    }
                    message={(
                        getProduct?.errorMessage ||
                        postProduct?.statusCode ||
                        putProduct?.statusCode ||
                        deleteProduct?.errorMessage
                    ) || 'Action success'}
                />
            )}
            {showAddModal && (
                <AddProductModal
                    ref={addProductModalRef}
                    isOpen={showAddModal}
                    setIsOpen={setShowAddModal}
                    dispatchPostProductAction={(values) => dispatch(postProductActionCreator(values))}
                />
            )}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                closeOnEscape={false}
                closeOnClickOutside={false}
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
                centered
                size='auto'
                title='Product Details'
            >
                <List
                    spacing="xs"
                    size="sm"
                    center
                    icon={
                        <ThemeIcon color="dark" size={24} radius="xl">
                            <BiChevronRight size={16} />
                        </ThemeIcon>
                    }
                >
                    <List.Item>
                        {getProductById?.response?.name}
                    </List.Item>
                    <List.Item>
                        {getProductById?.response?.price}
                    </List.Item>
                    <List.Item>
                        {moment(getProductById?.response?.created_at).locale(zoneName).format('LLLL')}
                    </List.Item>
                    <List.Item>
                        {moment(getProductById?.response?.updated_at).locale(zoneName).format('LLLL')}
                    </List.Item>
                </List>
            </Modal>
        </Box>
    )
}

export const ProductPage = memo(Product, shallowEqual)
