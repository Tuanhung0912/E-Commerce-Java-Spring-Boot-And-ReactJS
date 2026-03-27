import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { FaBeer } from 'react-icons/fa'

function App() {
  return (
    <div>
      <h1 class="flex items-center justify-center h-screen bg-gray-800 text-white
                text-3xl font-bold">
        Hello world! <FaBeer />
      </h1>
    </div>
  )
}

export default App
