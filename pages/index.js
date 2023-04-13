import React, { useEffect } from 'react'
import Head from 'next/head'
import Sidebar from '@/components/Sidebar'
import Center from '@/components/Center'
import SpotifyWebApi from 'spotify-web-api-node'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Loader from '@/components/Loader'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
})
 
const index = () => {
  const router = useRouter();
  const {status, data:session} = useSession({
    onUnauthenticated(){
      router.push("/auth/signin")
    }
  });
  if(status === "loading"){
    return <Loader />
  }
  // console.log(session)
  // useEffect(() => {
  //   if (spotifyApi.getAccessToken()) {
  //     console.log('ocmp')
  //   }

  // }, [spotifyApi]);
  return (
    <div className='bg-black h-screen  overflow-hidden'>
      <Head>

      </Head>
      <main className='flex'>
        <Sidebar spotifyApi={spotifyApi} />
        <Center />
      </main>
      <div>
        {/* Player  */}
      </div>
    </div>
  )
}

export default index