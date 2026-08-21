'use client';

import { useState } from 'react';
import { assetUrl } from '@/lib/constants';
import RelatedProducts from '@/components/ui/RelatedProducts';
import { useQuickView } from '@/components/providers/QuickViewProvider';
import type { CatalogProduct } from '@/lib/products';

type Props = {
  product: CatalogProduct;
  related: CatalogProduct[];
  description?: string;
  inStock?: number;
};

export default function ProductDetailView({ product, related, description, inStock }: Props) {
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [sizeIdx, setSizeIdx] = useState(0);
  const { addToCart } = useQuickView();
  const size = product.sizes?.[sizeIdx];
  const price = size?.price || product.price;
  const original = size?.originalPrice || product.originalPrice;

  return (
    <>
      <section className="py-sm-5 py-3">
        <div className="container">
          <div className="row g-4 g-lg-5">
            <div className="col-lg-6">
              <div className="d-flex flex-sm-row flex-column-reverse gap-3">
                <div className="d-flex flex-sm-column flex-row gap-2 flex-shrink-0">
                  {gallery.map((src, index) => (
                    <button
                      type="button"
                      key={src + index}
                      className={`thumbBtn border-0 bg-transparent p-0${index === activeImg ? ' active' : ''}`}
                      onClick={() => setActiveImg(index)}
                    >
                      <img
                        src={assetUrl(src)}
                        alt=""
                        className={`w-56 h-56 img-cover rounded-2 border${index === activeImg ? ' border-2' : ''}`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex-grow-1 position-relative">
                  <img
                    id="mainProductImg"
                    src={assetUrl(gallery[activeImg] || product.image)}
                    alt={product.name}
                    className="w-100 h-auto ratio11 img-cover rounded-3"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-3">
                <span className="fs-12 fc-secondary text-uppercase d-block mb-1">{product.brand || 'ESTEL'}</span>
                <h1 className="fw-bold fs-4 lh-sm mb-2">{product.name}</h1>
                <div className="d-flex align-items-start gap-2 mb-2">
                  <strong className="fs-3 fc-main">{price}</strong>
                  {original && (
                    <div className="d-flex flex-column align-items-start">
                      {product.discount && <span className="badge bg-danger fs-11 fw-semibold">{product.discount}</span>}
                      <span className="fs-14 text-decoration-line-through fc-secondary">{original}</span>
                    </div>
                  )}
                </div>
              </div>

              <hr className="opacity-10" />

              {product.sizes && product.sizes.length > 1 && (
                <div className="mb-4">
                  <span className="fs-12 fc-secondary d-block mb-2">Хэмжээ:</span>
                  <div className="d-flex flex-wrap gap-2">
                    {product.sizes.map((item, index) => (
                      <button
                        type="button"
                        key={item.label}
                        className={`btn btn-sm rounded-pill px-3${index === sizeIdx ? ' btn-main' : ' btn-light'}`}
                        onClick={() => setSizeIdx(index)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="fs-14 fw-semibold">Тоо:</span>
                <div className="d-flex qtyControl">
                  <button
                    type="button"
                    className="btn border rounded-end-0 w-40 h-40 d-flex align-items-center justify-content-center"
                    onClick={() => setQty((value) => Math.max(1, value - 1))}
                  >
                    <img src={assetUrl('images/icons/minus.svg')} alt="" />
                  </button>
                  <input
                    type="number"
                    className="form-control text-center fw-bold rounded-0 border-0 w-56 h-40 px-0 border-top border-bottom qtyInput"
                    value={qty}
                    min={1}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn border rounded-start-0 w-40 h-40 d-flex align-items-center justify-content-center"
                    onClick={() => setQty((value) => value + 1)}
                  >
                    <img src={assetUrl('images/icons/plus.svg')} alt="" />
                  </button>
                </div>
                {typeof inStock === 'number' && (
                  <span className="fs-12 fc-secondary">
                    Үлдэгдэл: <strong className="fc-dark">{inStock}ш</strong>
                  </span>
                )}
              </div>

              <div className="d-flex gap-2 mb-4">
                <button
                  type="button"
                  className="btn btn-main flex-grow-1 p-3 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => {
                    addToCart(product, { size: size?.label });
                  }}
                >
                  <img src={assetUrl('images/icons/cartAddWhite.svg')} alt="" />
                  <strong>Сагслах</strong>
                </button>
                <button type="button" className="btn btn-main p-3 wishlistBtn2 d-flex align-items-center justify-content-center" style={{ border: '1px solid #fff' }}>
                  <img src={assetUrl('images/icons/heart.svg')} alt="" className="w-20 h-20" style={{ filter: 'brightness(0) invert(1)' }} />
                </button>
              </div>

              <div className="d-flex flex-column gap-2 bg-light rounded-3 p-3 fs-12">
                <div className="d-flex align-items-center gap-2">
                  <img src={assetUrl('images/icons/cartAdd.svg')} alt="" className="w-16 h-16 opacity-50" />
                  <span>
                    <strong>80,000₮</strong> дээш захиалгад хүргэлт <strong className="fc-main">үнэгүй</strong>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <img src={assetUrl('images/icons/times.svg')} alt="" className="w-16 h-16 opacity-50" />
                  <span>
                    Худалдан авснаас хойш <strong>14 хоногт</strong> буцаалт хийх боломжтой
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-top">
        <div className="container">
          <ul className="nav nav-tabs border-0" id="productTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active fw-semibold fs-14 px-4 py-3" id="desc-tab" data-bs-toggle="tab" data-bs-target="#desc-pane" type="button" role="tab">
                Тайлбар
              </button>
            </li>
          </ul>
          <div className="tab-content py-4" id="productTabsContent">
            <div className="tab-pane fade show active" id="desc-pane" role="tabpanel">
              <div className="row">
                <div className="col-lg-8">
                  <h5 className="fw-bold mb-3">{product.name}</h5>
                  {description ? (
                    <div className="fc-secondary" dangerouslySetInnerHTML={{ __html: description }} />
                  ) : (
                    <p className="fc-secondary mb-0">{product.category}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts products={related} />
    </>
  );
}
