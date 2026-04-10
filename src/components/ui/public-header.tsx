import Link from "next/link";
import Image from "next/image";

export function PublicHeader() {
  return (
    <nav className="sticky top-0 z-30 border-b border-brand-green/15 bg-brand-dark-green/78 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="transition-opacity hover:opacity-85">
          <Image
            src="/brand/logo/symbol.svg"
            alt="SuperteamMaker"
            width={30}
            height={30}
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/support"
            className="rounded-full border border-brand-green/25 bg-brand-dark-green/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-off-white/62 transition-colors hover:border-brand-green hover:text-brand-off-white"
          >
            Suporte
          </Link>
          <Link
            href="/auth"
            className="text-sm font-medium text-brand-off-white/70 transition-colors hover:text-brand-off-white"
          >
            Entrar
          </Link>
        </div>
      </div>
    </nav>
  );
}
