import 'twin.macro'
import React from 'react'
import useDataStore from '@/store/dataStore'
import IconUser from '../icons/User'
import Header from '../header/Header'

const submitQuery = (e: React.FormEvent) => {
    e.preventDefault()
    axios.post("https://login")
}

const Profile = () => {
    const username = useDataStore((state) => state.username)
    return (
        <div tw="flex h-full w-full flex-col gap-2 sm:gap-4">
            <Header />
            <div tw="flex h-full flex-col gap-4 bg-blue-100 p-4">
                <div tw="flex flex-row items-center gap-4 bg-green-200">
                    <IconUser tw="w-12 rounded-full bg-gray-100 p-2" />
                    <h2>Hello {username}!</h2>
                </div>
                <div tw="h-full w-full bg-orange-200">lmao</div>
                <form
                    tw="flex w-full flex-row bg-red-200"
                    onSubmit={submitQuery}
                >
                    <label tw="w-full">
                        <input
                            tw="w-full p-2"
                            name="prompt-input"
                            placeholder="enter prompt"
                        />
                    </label>
                    <button tw="w-auto px-4 py-2 text-center"> submit </button>
                </form>
            </div>
        </div>
    )
}

export default Profile
