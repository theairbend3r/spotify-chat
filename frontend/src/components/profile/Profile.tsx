import 'twin.macro'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useDataStore from '@/store/dataStore'
import IconUser from '../icons/User'
import Header from '../header/Header'

const Profile = () => {
    const username = useDataStore((state) => state.username)
    const [chatHistory, setChatHistory] = useState<any>([])
    const [prompt, setPrompt] = useState<string>('')
    const [promptResponse, setPromptResponse] = useState<string>('')

    // fetch all data required after logging in.
    const fetchData = async () => {
        const response = await axios.get('http://localhost:8000/api/fetch_all')
        console.log(response.data.data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    // submit prompt
    const submitPrompt = async (e: React.FormEvent) => {
        e.preventDefault()
        const data = {
            prompt: prompt,
        }

        setChatHistory((chatHistory) => [
            ...chatHistory,
            { id: crypto.randomUUID(), text: prompt },
        ])

        try {
            const response = await axios.post(
                'http://localhost:8000/api/prompt',
                data
            )
            setPromptResponse(response.data.data)
        } catch (error) {
            console.log(error.response.data.detail)
        }
    }

    // add prompt response to chat history
    useEffect(() => {
        setChatHistory((chatHistory) => [
            ...chatHistory,
            { id: crypto.randomUUID(), text: promptResponse },
        ])
    }, [promptResponse])

    console.log(chatHistory)

    return (
        <div tw="flex h-full w-full flex-col gap-2 sm:gap-4">
            <Header />
            <div tw="flex h-full flex-col gap-4 bg-blue-100 p-4">
                <div tw="flex flex-row items-center gap-4 bg-green-200">
                    <IconUser tw="w-12 rounded-full bg-gray-100 p-2" />
                    <h2>Hello {username}!</h2>
                </div>
                <ul tw="h-full w-full overflow-scroll bg-orange-200">
                    {chatHistory.map((item) => (
                        <li key={item.id}> {item.text} </li>
                    ))}
                </ul>
                <form
                    tw="flex w-full flex-row bg-red-200"
                    onSubmit={submitPrompt}
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
