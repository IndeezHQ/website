import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * Chrome shared by every public page — the landing page and the four legal
 * documents. The signed-in and admin areas deliberately do not use this
 * layout; they get their own.
 */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="bg-volt sr-only rounded-md px-4 py-2 text-sm font-medium text-black focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
