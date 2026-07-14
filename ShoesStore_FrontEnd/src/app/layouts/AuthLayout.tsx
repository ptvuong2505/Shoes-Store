import { Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import logo from "@/shared/assets/logo.webp";

const AuthLayout = () => (
  <main className="min-h-dvh bg-background lg:grid lg:grid-cols-[minmax(340px,0.85fr)_minmax(520px,1.15fr)]">
    <aside className="relative hidden overflow-hidden bg-[#211814] lg:flex lg:min-h-dvh lg:flex-col lg:justify-between lg:p-10 xl:p-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(238,91,43,0.34),transparent_32%),radial-gradient(circle_at_82%_82%,rgba(255,255,255,0.10),transparent_30%)]" />
      <Link
        to="/"
        className="relative flex w-fit items-center gap-3 text-white"
      >
        <img
          src={logo}
          alt="Shoes Store"
          className="size-11 rounded-xl object-cover"
        />
        <span className="text-lg font-bold tracking-tight">Shoes Store</span>
      </Link>

      <div className="relative max-w-md pb-10">
        <div className="mb-6 grid size-12 place-items-center rounded-2xl border border-white/15 bg-white/10 text-[#ff8a62]">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </div>
        <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white xl:text-5xl">
          Your next pair starts here.
        </h2>
        <p className="mt-5 max-w-[38ch] text-base leading-7 text-white/65">
          Sign in to save favorites, follow orders and move through checkout
          faster.
        </p>
      </div>

      <p className="relative text-xs text-white/45">Secure account access</p>
    </aside>

    <section className="flex min-h-dvh flex-col px-5 py-6 sm:px-8 lg:px-12 xl:px-20">
      <div className="flex items-center justify-between lg:justify-end">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground lg:hidden"
        >
          <ArrowLeft className="size-4" />
          Store
        </Link>
        <Link to="/" className="flex items-center gap-2 lg:hidden">
          <img
            src={logo}
            alt="Shoes Store"
            className="size-9 rounded-lg object-cover"
          />
        </Link>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 items-center py-10">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
      <footer className="flex flex-wrap justify-center gap-x-5 gap-y-2 pb-2 text-xs text-muted-foreground">
        <a href="#privacy" className="hover:text-foreground">
          Privacy
        </a>
        <a href="#terms" className="hover:text-foreground">
          Terms
        </a>
        <span>© {new Date().getFullYear()} Shoes Store</span>
      </footer>
    </section>
  </main>
);

export default AuthLayout;
