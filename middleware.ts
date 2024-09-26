import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Everything behind dashboard is protected
//myapp.com/dashboard/*
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
    if(isProtectedRoute(req)) auth().protect();
});


// Everything is actually public and you need to specify what you want to protected
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};