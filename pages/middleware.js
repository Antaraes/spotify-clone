import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
export async function middleware(req){
    //Token will exist if user is logged in
    const token = await getToken({req, secret:process.env.JWT_SECRET});
    const {pathanme} = req.nextUrl
    //Allow the requests if true 
    //1)the token exists
    if(pathanme.include("/api/auth") || token){
        return NextResponse.next()
    }
    //redirect  them to login if they don't have token
    if(!token && pathanme !== "/login"){
        return NextResponse.redirect("/login")
    }
}