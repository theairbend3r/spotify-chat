import 'twin.macro'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useDataStore from '@/store/dataStore'
import IconUser from '../icons/User'
import Header from '../header/Header'
import TextBubble from '../chat/TextBubble'

const Profile = () => {
    const username = useDataStore((state) => state.username)
    const [chatHistory, setChatHistory] = useState<any>([
        {
            id: crypto.randomUUID(),
            textType: 'promptResponse',
            text: "Hi! I'm a chatbot (ooOooOo) and I'm low key excited to help you today. Lesgooo!",
        },
    ])
    const [prompt, setPrompt] = useState<string>('')

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

        setChatHistory((chatHistory: []) => [
            ...chatHistory,
            { id: crypto.randomUUID(), textType: 'prompt', text: prompt },
        ])

        try {
            const response = await axios.post(
                'http://localhost:8000/api/prompt',
                data
            )
            setChatHistory((chatHistory: []) => [
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
            <div tw="flex h-screen flex-col gap-8 overflow-y-auto bg-blue-100 p-2">
                <div tw="flex flex-row items-center gap-4 rounded-lg bg-gray-100 p-6">
                    <IconUser tw="w-12 rounded-full bg-gray-100 p-2" />
                    <h2>Hello {username}!</h2>
                </div>
                <div tw="flex-1 h-full grow overflow-y-auto">
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

//
// <div tw="flex h-screen w-full flex-col items-stretch gap-2 bg-red-100 p-2 sm:gap-4">
//     <Header />
//     <div tw="flex flex-1 min-h-full w-full flex-col items-stretch gap-4 bg-blue-100 p-4">
//         <div tw="mx-4 flex flex-row items-center gap-4 rounded-lg bg-gray-100 p-6">
//             <IconUser tw="w-12 rounded-full bg-gray-100 p-2" />
//             <h2>Hello {username}!</h2>
//         </div>
//         <ul tw="flex flex-1 w-full flex-col gap-4 overflow-scroll bg-green-100 p-4">
//             {chatHistory.map((item) => (
//                 <TextBubble
//                     key={item.id}
//                     textType={item.textType}
//                     text={item.text}
//                 />
//             ))}
//         </ul>
//         <form tw="flex w-full flex-row gap-4" onSubmit={submitPrompt}>
//             <label tw="w-full">
//                 <input
//                     tw="w-full rounded-lg p-2"
//                     name="prompt-input"
//                     placeholder="enter prompt"
//                     value={prompt}
//                     onChange={(e) => setPrompt(e.target.value)}
//                 />
//             </label>
//             <button tw="w-auto rounded-lg bg-blue-500 px-4 py-2 text-center text-gray-100">
//                 submit
//             </button>
//         </form>
//     </div>
// </div>
