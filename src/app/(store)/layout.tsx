import { AnnouncementBar, Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer, MobileMenu, RouteEffects, SearchOverlay } from "@/components/layout/Overlays";
import { QuickView } from "@/components/product/QuickView";
import { Toaster } from "@/components/ui/Toaster";

export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <MobileMenu />
      <SearchOverlay />
      <QuickView />
      <Toaster />
      <RouteEffects />
    </>
  );
}
