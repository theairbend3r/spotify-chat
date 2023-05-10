import 'twin.macro'
import React from 'react'

const Login = () => {
    return (
        <div tw="mx-auto flex h-screen w-2/3 flex-col items-center justify-center gap-6 md:gap-10 lg:gap-12 xl:gap-14">
            <h1 tw="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                spotify-chat
            </h1>
            {/* <a href="http://localhost:8000/api/login"> */}
            <a href="https://spotify-chat.onrender.com/api/login">
                <button tw="rounded rounded-lg border border-gray-900 p-2 hover:(bg-green-600 text-gray-100)">
                    login with spotify
                </button>
            </a>
        </div>
    )
}

export default Login
