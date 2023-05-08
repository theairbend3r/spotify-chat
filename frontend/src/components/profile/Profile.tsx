import 'twin.macro'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useDataStore from '@/store/dataStore'
import IconUser from '../icons/User'
import Header from '../header/Header'
import TextBubble from '../chat/TextBubble'

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
            { id: crypto.randomUUID(), textType: 'prompt', text: prompt },
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
            {
                id: crypto.randomUUID(),
                textType: 'promptResponse',
                text: promptResponse,
            },
        ])
        return setPromptResponse('')
    }, [promptResponse])

    console.log(chatHistory)

    return (
        <div tw="flex h-full w-full flex-col gap-2 sm:gap-4 p-2">
            <Header />
            <div tw="flex h-full flex-col gap-4 p-4">
                <div tw="flex flex-row items-center gap-4 rounded-lg bg-gray-100 mx-4 p-6">
                    <IconUser tw="w-12 rounded-full bg-gray-100 p-2" />
                    <h2>Hello {username}!</h2>
                </div>
                <ul tw="flex h-2/3 w-full flex-col gap-4 overflow-scroll p-4">
                    {chatHistory.map((item) => (
                        <TextBubble
                            key={item.id}
                            textType={item.textType}
                            text={item.text}
                        />
                    ))}
                </ul>
                <form tw="flex w-full flex-row gap-4" onSubmit={submitPrompt}>
                    <label tw="w-full">
                        <input
                            tw="w-full rounded-lg p-2"
                            name="prompt-input"
                            placeholder="enter prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </label>
                    <button tw="w-auto rounded-lg bg-blue-500 px-4 py-2 text-center text-gray-100">
                        submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile
