"use client"

import type React from "react"
import { GeistSans } from "geist/font/sans"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { UserMenu } from "@/components/user-menu"
import { VisitorTracker } from "@/components/visitor-tracker"
import { LogIn } from "lucide-react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

function HeaderContent() {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  
  // Hide header/footer on dashboard and login pages
  const hideNavigation = pathname?.startsWith('/dashboard') || pathname === '/login';

  if (hideNavigation) return null;

  return (
    <header className="border-b sticky top-0 z-40 bg-white backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between py-4 px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">SAFISAANA</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center gap-3">
        {authLoading ? (
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
        ) : user ? (
          <UserMenu />
        ) : (
          <>
            <div className="hidden sm:block text-sm text-muted-foreground">
              <span className="font-medium text-primary">New here?</span> Join thousands of creators!
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/pricing">Get Started</Link>
            </Button>
          </>
        )}
      </div>
      </div>
    </header>
  );
}

function FooterContent() {
  const pathname = usePathname();
  const hideNavigation = pathname?.startsWith('/dashboard') || pathname === '/login';
  
  if (hideNavigation) return null;
  return <SiteFooter />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <title>SAFISAANA - Digital Products Marketplace</title>
        <meta name="description" content="Sell digital products including plugins, e-books, and courses that help users improve their skills and productivity." />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${inter.variable} antialiased flex flex-col min-h-screen`}>
        <AuthProvider>
          <VisitorTracker />
          <div className="flex-1 flex flex-col">
            <HeaderContent />
            <main className="flex-1">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              }>
                {children}
              </Suspense>
            </main>
          </div>
          <FooterContent />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
