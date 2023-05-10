import 'twin.macro'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useDataStore from '@/store/dataStore'
import IconUser from '../icons/User'
import Header from '../header/Header'
import TextBubble from '../chat/TextBubble'

interface ChatHistoryItemInterface {
    id: string
    textType: string
    text: string
}

interface ChatHistoryInterface extends Array<ChatHistoryItemInterface> { }

const Profile = () => {
    const username = useDataStore((state) => state.username)
    const [chatHistory, setChatHistory] = useState<ChatHistoryInterface>([
        {
            id: crypto.randomUUID(),
            textType: 'promptResponse',
            text: "Hi! I'm a chatbot (ooOooOo) and I'm low key excited to help you today. Lesgooo! Currently I can only help you find the number of playlists you have, what are they, the artists you follow, and who are they.",
        },
    ])
    const [prompt, setPrompt] = useState<string>('')

    // fetch all data required after logging in.
    const fetchData = async () => {
        // const response = await axios.get('http://localhost:8000/api/fetch_all')
        const response = await axios.get(
            'https://spotify-chat.onrender.com:80/api/fetch_all'
        )
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

        setChatHistory((chatHistory: ChatHistoryInterface) => [
            ...chatHistory,
            { id: crypto.randomUUID(), textType: 'prompt', text: prompt },
        ])

        try {
            const response = await axios.post(
                // 'http://localhost:8000/api/prompt',
                'https://spotify-chat.onrender.com:80/api/prompt',
                data
            )
            setChatHistory((chatHistory: ChatHistoryInterface) => [
                ...chatHistory,
                {
                    id: crypto.randomUUID(),
                    textType: 'promptResponse',
                    text: response.data.data,
                },
            ])
            setPrompt('')
        } catch (error: Error | any) {
            console.log(error.response.data.detail)
        }
    }

    return (
        <div tw="flex h-screen w-full flex-col items-stretch gap-2 p-2 sm:(gap-4 p-4)">
            <Header />
            <div tw="flex h-screen flex-col gap-8 overflow-y-auto p-2">
                <div tw="flex flex-row items-center gap-4 rounded-lg bg-sky-800 p-6 text-gray-100">
                    <IconUser tw="w-12 rounded-full bg-yellow-500 p-2" />
                    <h2>Hello {username}!</h2>
                </div>
                <div tw="flex-1 h-full grow overflow-y-auto p-1">
                    <ul tw="flex w-full flex-col gap-4">
                        {chatHistory.map((item) => (
                            <TextBubble
                                key={item.id}
                                textType={item.textType}
                                text={item.text}
                            />
                        ))}
                    </ul>
                </div>
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
