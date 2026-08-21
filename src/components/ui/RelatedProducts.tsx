import ProductCard from '@/components/ui/ProductCard';
import type { CatalogProduct } from '@/lib/products';

export default function RelatedProducts({ products = [] }: { products?: CatalogProduct[] }) {
  if (!products.length) return null;
  return (
    <section className="py-sm-5 py-4 bg-light">
      <div className="container">
        <h4 className="fw-bold fs-6 text-uppercase border-start ps-2 border-3 mb-4">Санал болгох бараа</h4>
        <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
          {products.map((product) => (
            <div className="col" key={product.id}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
