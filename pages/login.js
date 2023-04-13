import React from "react";
import { getProviders, signIn } from "next-auth/react";

function login({ providers }) {
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
