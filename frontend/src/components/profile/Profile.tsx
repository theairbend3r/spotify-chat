import 'twin.macro'
import axios from 'axios'
import React, { useState } from 'react'
import useDataStore from '@/store/dataStore'
import IconUser from '../icons/User'
import Header from '../header/Header'

const Profile = () => {
    const username = useDataStore((state) => state.username)
    const [prompt, setPrompt] = useState<string>('')

    const submitQuery = async (e: React.FormEvent) => {
        e.preventDefault()
        const data = {
            prompt: prompt,
        }

        try {
            const response = await axios.post(
                'http://localhost:8000/api/prompt',
                data
            )
            console.log(response)
        } catch (error) {
            console.log(error.response.data.detail)
        }
    }

    console.log(prompt)

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
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </label>
                    <button tw="w-auto px-4 py-2 text-center"> submit </button>
                </form>
            </div>
        </div>
    )
}

export default Profile
