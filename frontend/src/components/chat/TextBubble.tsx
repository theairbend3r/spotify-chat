import 'twin.macro'
import React from 'react'

const TextBubble = ({ textType, text }: { text: string; textType: string }) => {
    return (
        <>
            {textType === 'prompt' ? (
                <li tw="w-1/2 self-end rounded-lg bg-gray-100 p-4">
                    <p tw="text-sm text-gray-500">you</p>
                    <p tw="text-lg">{text}</p>
                </li>
            ) : (
                <li tw="w-1/2 self-start rounded-lg bg-gray-100 p-4">
                    <p tw="text-sm text-gray-500">AI</p>
                    <p>{text}</p>
                </li>
            )}
        </>
    )
}

export default TextBubble