import { NextResponse } from "next/server";
import config from "./config";

// decentralized login middleware logic - used for users who log in with seeds
const anonymousLoginMiddleware = (req: any, next: () => NextResponse) => {
  console.log({ req });
  const { cookies } = req;

  // Check if `anonymousUser` cookie exists
  const anonymousUser = cookies.get("pk");
  console.log({ anonymousUser });

  // If `anonymousUser` exists, redirect to the dashboard
  if (anonymousUser?.value === "true") {
    return NextResponse.next();
  }

  // If `anonymousUser` doesn't exist, continue to the next middleware
  // return next();
  return NextResponse.redirect(new URL("/anonymous", req.url));
};

// Clerk middleware logic - used for centralized login
let clerkMiddleware: (arg0: (auth: any, req: any) => any) => {
    (arg0: any): any;
    new (): any;
  },
  createRouteMatcher;

if (config.auth.enabled) {
  try {
    ({ clerkMiddleware, createRouteMatcher } = require("@clerk/nextjs/server"));
  } catch (error) {
    console.warn("Clerk modules not available. Auth will be disabled.");
    config.auth.enabled = false;
  }
}

const isProtectedRoute = config.auth.enabled
  ? createRouteMatcher(["/home(.*)"])
  : () => false;

// Function to chain middlewares
const composeMiddlewares =
  (...middlewares: any[]) =>
  (req: any) => {
    let idx = 0;

    const next = () => {
      const middleware = middlewares[idx];
      idx++;
      if (middleware) {
        return middleware(req, next);
      }
      return NextResponse.next(); // Default response if all middlewares pass
    };

    return next();
  };

// Custom middleware handler
export default function middleware(req: any) {
  const middlewares = [];

  if (config.auth.enabled && config.auth.clerk) {
    // Add Clerk middleware if enabled
    middlewares.push((req: any, next: any) =>
      clerkMiddleware((auth, req) => {
        if (!auth().userId && isProtectedRoute(req)) {
          return auth().redirectToSignIn();
        } else {
          return next();
        }
      })(req),
    );
  }

  if (config.auth.enabled && config.auth.anonymous && isProtectedRoute(req)) {
    // Add anonymous login middleware if enabled
    middlewares.push(anonymousLoginMiddleware);
  }

  // Run the composed middleware chain
  return composeMiddlewares(...middlewares)(req);
}

export const middlewareConfig = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
