// import NextAuth from "next-auth"
// import SpotifyProvider from "next-auth/providers/spotify"
// import spotifyApi, { LOGIN_URL } from "@/lib/spotify"
// async function refershAccessToken(token){
//     try{
//         spotifyApi.setAccessToken(token.accessToken);
//         spotifyApi.setRefreshToken(token.refershToken)
//         const {body:refershedToken} = await spotifyApi.refreshAccessToken();
//         console.log(refershedToken);
//         return{
//           ...token,
//           accessToken:refershedToken.access_token,
//           accessTokenExpires:Date.now + refershedToken.expires_in * 1000,
//           refershToken:refershedToken.refresh_token ?? token.refershToken
//         }
//     }catch (error){
//         console.error(error)
//         return{
//             ...token,
//             error:"refershTokenerror"
//         }
//     }
// }
// export const authOptions = {
//   // Configure one or more authentication providers
//   providers: [
//     SpotifyProvider({
//       clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
//       authorization: LOGIN_URL,
//     }),

//     // ...add more providers here
//   ],
//   secret:process.env.JWT_SECRET,
//   pages:{
//     signIn:'/login'
//   },
//   callbacks:{
//     async jwt({token,account,user}){
//         //initial sign in 
//         if (account && user){
//             return{
//                 ...token,
//                 accessToken: account.access_token,
//                 refershToken: account.refersh_token,
//                 username: account.providerAccountId,
//                 accessTokenExpires: account.expires_at * 1000,

//             }
//         }
//         //if token is not expired , return 
//         if(Date.now() < token.accessTokenExpires){
//             console.log("Exiting access token");
//             return token;
//         }
//         //access token expired 
//         console.log("ACCESS TOKEN has expired, ")
//         return await refershAccessToken(token)
//     },
//     async session({session,token}){
//       session.user.accessToken = token.accessToken;
//       session.user.refershToken = token.refershToken;
//       session.user.username = token.username;
//       return session;
//     }
//   }
// }

// export default NextAuth(authOptions)

//______________________________________________________________
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

async function refreshAccessToken(token) {
  try {
    const url =
      "https://accounts.spotify.com/api/token?" +
      new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: "https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,user-read-email,streaming,user-read-private,user-library-read,user-library-modify,user-read-playback-state,user-modify-playback-state,user-read-recently-played,user-follow-read",
    }),
    // ...add more providers here
  ],
  pages:{
    signIn:'/auth/signin'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },
}

export default NextAuth(authOptions)