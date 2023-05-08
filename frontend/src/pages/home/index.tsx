import React from 'react'
import { useSearchParams } from 'next/navigation'

const Home = () => {
    const searchParams = useSearchParams()
    const search = searchParams.get('access_token')

    console.log(search)
    return (
        <div>
            <p> home page</p>
            <p>{search}</p>
        </div>
    )
}

export default Home
