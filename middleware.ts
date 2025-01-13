import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {

    try {
        const cookie = await cookies()
        const token = cookie.get("token");
        console.log(token);

        if(!token){
            return NextResponse.json({message : "user unauthenticated"}, {status : 400});
        }

        const response = NextResponse.json({message : "user is authenticated"},{status : 200});

        return response;

    } catch (error :any) {
        console.log(error);
        return NextResponse.json({error : error.message}, {status : 500})
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/v1/auth/logout',
}