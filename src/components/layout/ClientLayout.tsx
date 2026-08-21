import PromoBar from './PromoBar';
import Header from './Header';
import Footer from './Footer';
import MainMenuOffcanvas from './MainMenuOffcanvas';
import CartOffcanvas from './CartOffcanvas';
import LoginOffcanvas from './LoginOffcanvas';
import BootstrapClient from '@/components/providers/BootstrapClient';
import EstelScripts from '@/components/providers/EstelScripts';

import CartProvider from '@/components/providers/CartProvider';
import WishlistProvider from '@/components/providers/WishlistProvider';
import QuickViewProvider from '@/components/providers/QuickViewProvider';
import type { MenuTaxon } from '@/lib/api/sylius';

export default function ClientLayout({ children, taxons = [] }: { children: React.ReactNode; taxons?: MenuTaxon[] }) {
  return (
    <CartProvider>
    <WishlistProvider>
    <QuickViewProvider>
      <PromoBar />
      <Header />
      <main className="">{children}</main>
      <Footer />
      <MainMenuOffcanvas taxons={taxons} />
      <CartOffcanvas />
      <LoginOffcanvas />
      <BootstrapClient />
      <EstelScripts />
    </QuickViewProvider>
    </WishlistProvider>
    </CartProvider>
  );
}
