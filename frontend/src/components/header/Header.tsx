import 'twin.macro'
import React from 'react'

const Header = () => {
    return (
        <header tw="flex flex-row justify-between p-4 sm:p-6 md:p-8">
            <p tw="font-semibold text-lg sm:text-xl">melotea</p>
            <nav tw="flex flex-row text-base sm:text-lg">
                <ul tw="flex flex-row gap-2 sm:gap-4 md:gap-6">
                    <li>logout</li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
