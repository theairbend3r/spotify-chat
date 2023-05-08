import 'twin.macro'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import useDataStore from '@/store/dataStore'
import Login from '@/components/login/Login'
import Profile from '@/components/profile/Profile'

export default function Home() {
    // get username from url query
    const { query } = useRouter()
    const username = query['user_name']

    // login user using the username
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    // save username in global store
    const storeUsername = useDataStore((state) => state.storeUsername)

    useEffect(() => {
        username && (setIsLoggedIn(true), storeUsername(username))
    }, [username, storeUsername])

    return (
        <>
            <Head>
                <title>spotify-chat</title>
                <meta
                    name="description"
                    content="Analyse your spotify music."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main tw="flex h-screen w-full flex-col items-center bg-gray-200 text-gray-900">
                {isLoggedIn ? <Profile /> : <Login />}
            </main>
        </>
    )
}
