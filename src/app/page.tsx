'use client';

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import { ArrowRight, DollarSign, LineChart, Shield, Cpu, Rocket, Users, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Logo />
          <span className="ml-3 text-2xl font-bold font-headline">Relanto</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Solutions
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Industries
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About Us
          </Link>
          <Button asChild>
            <Link href="/login">
              Login <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
        <div className="ml-auto md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <nav className="grid gap-6 text-lg font-medium mt-8">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                            <Logo />
                            <span className="sr-only">Relanto</span>
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors" prefetch={false}>
                            Solutions
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
                            Industries
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
                            About Us
                        </Link>
                         <Button asChild className="mt-4">
                            <Link href="/login">
                                Login <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    AI-Ingrained Business Consulting for Strategic Outcomes
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Relanto helps you achieve tangible results by infusing AI into your core business processes, driving growth, efficiency, and innovation.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">
                      Explore Platform
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="#">
                      Schedule a Demo
                    </Link>
                  </Button>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400.png"
                data-ai-hint="AI business transformation"
                width="600"
                height="400"
                alt="AI in Business"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* Outcomes Section */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Strategic Outcomes</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Drive Real Business Impact</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We focus on delivering measurable results across your most critical business functions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3 mt-12">
              <div className="grid gap-1 p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow">
                <Rocket className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold font-headline">Revenue Growth</h3>
                <p className="text-sm text-muted-foreground">Unlock new revenue streams and optimize pricing with AI-driven market insights.</p>
              </div>
              <div className="grid gap-1 p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold font-headline">Customer Experience</h3>
                <p className="text-sm text-muted-foreground">Enhance customer satisfaction and loyalty through personalized interactions.</p>
              </div>
              <div className="grid gap-1 p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow">
                <LineChart className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold font-headline">Operational Efficiency</h3>
                <p className="text-sm text-muted-foreground">Automate processes and optimize resource allocation to reduce costs.</p>
              </div>
              <div className="grid gap-1 p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow">
                <Cpu className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold font-headline">Accelerated Innovation</h3>
                <p className="text-sm text-muted-foreground">Leverage AI to speed up product development and foster a culture of innovation.</p>
              </div>
              <div className="grid gap-1 p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow">
                <Shield className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold font-headline">Risk Management</h3>
                <p className="text-sm text-muted-foreground">Proactively identify and mitigate financial and operational risks with predictive analytics.</p>
              </div>
              <div className="grid gap-1 p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow">
                <DollarSign className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold font-headline">Cost Optimization</h3>
                <p className="text-sm text-muted-foreground">Pinpoint inefficiencies and find opportunities for cost savings across the enterprise.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Relanto. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
