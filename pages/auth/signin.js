import React, { useEffect } from "react";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";

function login({ providers }) {
  const {data:session} = useSession();
  const router = useRouter();

  useEffect(()=>{
    if(session){
      router.push("/");
    }
  },[session])
  if(session) return <Loader />
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img src="spotify.png" alt="" className="w-52 mb-5" />
      {Object.values(providers).map((providers) => (
        <div>
          <button className="bg-green-400 text-white p-5 rounded-full" type="" onClick={()=>signIn(providers.id,{callbackUrl:"/"})}>Login With {providers.name}</button>
        </div>
      ))}
    </div>
  );
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
