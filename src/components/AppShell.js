import { Fragment, memo, useState, useEffect, useCallback } from 'react'
import { AppShell as MantineAppShell, Text, Header, MediaQuery, Burger, Navbar, ScrollArea, Group, Box, Image, ThemeIcon, SegmentedControl, Center, Divider, Breadcrumbs, Anchor, Button } from '@mantine/core'
import { BiMoon, BiSun } from 'react-icons/bi'
import { useDocumentTitle } from '@mantine/hooks'
import AppLogo from '../assets/images/logo.png'
import { useSelector, useDispatch } from 'react-redux'
import { lightTheme, darkTheme } from '../redux/reducer/theme'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { logoutActionCreator } from '../redux/action/creator/auth'
import { FaSuitcase } from 'react-icons/fa'

const { REACT_APP_NAME } = process.env
const segmentedControlData = [
    {
        value: 'dark',
        label: (
            <Center>
                <ThemeIcon variant='gradient' gradient={{ from: 'cyan', to: 'grape' }} radius='lg'>
                    <BiMoon size='20' color='#131a3d' />
                </ThemeIcon>
                <Text ml={5}>Dark</Text>
            </Center>
        )
    },
    {
        value: 'light',
        label: (
            <Center>
                <ThemeIcon variant='gradient' gradient={{ from: 'orange', to: 'yellow' }} radius='lg'>
                    <BiSun size='20' color='#ffffff' />
                </ThemeIcon>
                <Text ml={5}>Light</Text>
            </Center>
        )
    }
]

const CustomAppShell = () => {
    const [opened, setOpened] = useState(false)
    const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()
    const toggleTheme = (value) => value === 'dark' ? dispatch(darkTheme()) : dispatch(lightTheme())
    const { pathname } = useLocation()
    const [breadcrumbItems, setBreadcrumbItems] = useState([])
    const [documentTitle, setDocumentTitle] = useState('App')
    const onSignOut = useCallback(() => {
        dispatch(logoutActionCreator())
    }, [dispatch])

    useDocumentTitle(`${REACT_APP_NAME} - ${documentTitle}`)

    useEffect(() => {
        if (pathname !== '/') {
            setBreadcrumbItems([
                { title: REACT_APP_NAME, href: '/' },
                { title: 'DASHBOARD', href: '/' },
                { title: pathname.replace('/', '').toUpperCase(), href: pathname }
            ])
            setDocumentTitle(pathname.replace('/', '').toUpperCase())
        } else {
            setBreadcrumbItems([
                { title: REACT_APP_NAME, href: '/' },
                { title: 'DASHBOARD', href: '/' }
            ])
            setDocumentTitle('DASHBOARD')
        }
    }, [pathname])

    return (
        <Fragment>
            <MantineAppShell
                navbarOffsetBreakpoint={!opened ? 'xl' : 'sm'}
                fixed
                navbar={
                    <Navbar
                        padding='md'
                        hiddenBreakpoint='xl'
                        hidden={!opened}
                        fixed
                        width={{ sm: 200, lg: 300 }}>
                        <Navbar.Section
                            grow
                            component={ScrollArea}
                            ml={-10}
                            mr={-10}
                            mt='sm'
                            sx={{ paddingLeft: 10, paddingRight: 10 }}>
                            <Group grow direction='column' spacing={0}>
                                <Box
                                    component={Link}
                                    to='/product'
                                    sx={(theme) => ({
                                        display: 'block',
                                        color: theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[7],
                                        textAlign: 'center',
                                        padding: theme.spacing.xs,
                                        borderRadius: theme.radius.md,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            backgroundColor:
                                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
                                        }
                                    })}>
                                    <Group spacing='sm'>
                                        <ThemeIcon variant='gradient' gradient={{ from: 'lime', to: 'gray' }}>
                                            <FaSuitcase size='17' />
                                        </ThemeIcon>
                                        <Text weight={500}>
                                            Product
                                        </Text>
                                    </Group>
                                </Box>
                            </Group>
                        </Navbar.Section>

                        <Navbar.Section>
                            <Divider mb='md' />

                            <Button
                                radius='md'
                                size='md'
                                uppercase
                                style={{ display: 'flex', minWidth: '100%', justifyContent: 'center' }}
                                sx={(theme) => ({
                                    display: 'flex',
                                    backgroundColor: theme.colorScheme === 'dark' ? '#6741D9' : '#fa5252',
                                    '&:hover': {
                                        backgroundColor:
                                            theme.colorScheme === 'dark' ? '#5F3DC4' : '#DC143C'
                                    }
                                })}
                                onClick={onSignOut}>
                                Logout
                            </Button>
                        </Navbar.Section>
                    </Navbar>
                }
                header={
                    <Header height={70} padding='md' style={{
                        justifyContent: 'space-between',
                        display: 'flex'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <MediaQuery largerThan='xl' styles={{ display: 'none' }}>
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size='sm'
                                    mr='xl'
                                />
                            </MediaQuery>

                            <Group spacing={5} align='center'>
                                <Image
                                    fit='contain'
                                    height={40}
                                    src={AppLogo}
                                />
                            </Group>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
                                <SegmentedControl
                                    data={segmentedControlData}
                                    size='sm'
                                    defaultValue={theme.mode}
                                    transitionDuration={500}
                                    transitionTimingFunction='linear'
                                    radius='lg'
                                    mr='xs'
                                    onChange={(value) => toggleTheme(value)}
                                />
                            </MediaQuery>
                        </div>
                    </Header>
                }>
                <Breadcrumbs mb='xl'>
                    {breadcrumbItems.map((item, index) => (
                        <Anchor
                            key={index}
                            component={Link}
                            to={item.href}
                            style={{
                                textDecoration: 'none'
                            }}>
                            {item.title}
                        </Anchor>
                    ))}
                </Breadcrumbs>
                <Outlet />
            </MantineAppShell>
        </Fragment>
    )
}

export const AppShell = memo(CustomAppShell)
