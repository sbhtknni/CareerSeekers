import React from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import { useState } from 'react'

function Home() {
    const [count, setCount] = useState(0)
  return (
      <>
          <div className='font-bold text-green-400'>Home</div>
      </> 
  )
}
export default Home