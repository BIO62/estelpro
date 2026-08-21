import PromoBar from './PromoBar';
import Header from './Header';
import Footer from './Footer';
import MainMenuOffcanvas from './MainMenuOffcanvas';
import CartOffcanvas from './CartOffcanvas';
import LoginOffcanvas from './LoginOffcanvas';
import BootstrapClient from '@/components/providers/BootstrapClient';
import EstelScripts from '@/components/providers/EstelScripts';

import CartProvider from '@/components/providers/CartProvider';
import QuickViewProvider from '@/components/providers/QuickViewProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
    <QuickViewProvider>
      <PromoBar />
      <Header />
      <main className="">{children}</main>
      <Footer />
      <MainMenuOffcanvas />
      <CartOffcanvas />
      <LoginOffcanvas />
      <BootstrapClient />
      <EstelScripts />
    </QuickViewProvider>
    </CartProvider>
  );
}
