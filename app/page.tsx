import Image from "next/image";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen p-8 pb-20 gap-16 sm:p-12 font-[family-name:var(--font-geist-sans)] bg-background text-foreground">
        <header className="mb-12 text-center">
          <Image
            className="mx-auto text-white mb-4"
            src="/svg/logo.svg"
            alt="logo"
            width={70}
            height={38}
            priority
          />
          <h1 className="text-5xl max-w-3xl mx-auto font-bold mb-4">
            Hello <span className="text-primary">People!</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Welcome to WebRe.live{" "}
          </p>
          <Link href={"/dashboard"}>
            <Button size="lg" className="mr-4">
              Button 1 <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Button 2
          </Button>
        </header>
      </div>
    </ThemeProvider>
  );
}
