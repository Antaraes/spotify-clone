import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { shuffle } from 'lodash'
const colors = [
  "from-red-500",
  "from-blue-300",
  "from-green-600",
  "from-yellow-400",
  "from-pink-200",
  "from-indigo-700",
  "from-purple-500",
  "from-teal-400",
  "from-orange-300",
  "from-gray-800",
];
const Center = () => {
  const {data:session} = useSession()
  const name = session?.user.name.slice(0,15)
  const [color,setColor] = useState(null)

  useEffect(()=>{
    setColor(shuffle(colors).pop())
  },[])
  return ( 
    <div className='flex-grow'>
      <header className='absolute top-5 right-8'>
        <div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2'>
          <img className='rounded-full w-10 h-10' src={session?.user.image} alt="" />
          <h2 className='text-white '>{name}</h2>
          <FontAwesomeIcon icon={faChevronDown} className="text-white h-5 w-5" />
        </div>
      
      </header>
      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white padding-0`}>
        <h1>Hello</h1>
      </section>
    </div>
  )
}

export default Center