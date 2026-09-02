'use client';

import { useEffect, useMemo, useState } from 'react';
import { assetUrl } from '@/lib/constants';
import RelatedProducts from '@/components/ui/RelatedProducts';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import type { CatalogProduct, ProductShade } from '@/lib/products';
import { cartItemKey, defaultSelection } from '@/lib/cart';

type Props = {
  product: CatalogProduct;
  related: CatalogProduct[];
  description?: string;
  inStock?: number;
};

function shadeMeta(shade: ProductShade) {
  const name = shade.name.trim();
  const dash = name.match(/^(.*?)\s+[-–]\s+(.*)$/);
  if (dash) return { code: dash[1], label: name, sub: dash[2] };
  const space = name.match(/^(\S+)\s+(.*)$/);
  if (space) return { code: space[1], label: name, sub: space[2] };
  return { code: name, label: name, sub: '' };
}

export default function ProductDetailView({ product, related, description, inStock }: Props) {
  const isDye = Boolean(product.shades?.length);
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [shadeIdx, setShadeIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [shadeQuery, setShadeQuery] = useState('');
  const { items, addItem, removeItem } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const size = product.sizes?.[sizeIdx];
  const shade = product.shades?.[shadeIdx];
  const preview = product.shades?.[hoverIdx ?? shadeIdx];
  const previewMeta = preview ? shadeMeta(preview) : null;
  const selectedMeta = shade ? shadeMeta(shade) : null;
  const selection = { ...defaultSelection(product), size: size?.label, shade: shade?.name };
  const inCart = items.some((item) => item.key === cartItemKey(product.id, selection));
  const price = size?.price || shade?.price || product.price;
  const original = size?.originalPrice || shade?.originalPrice || product.originalPrice;
  const filteredShades = useMemo(() => {
    const q = shadeQuery.trim().toLowerCase();
    if (!q || !product.shades) return product.shades || [];
    return product.shades.filter((item) => item.name.toLowerCase().includes(q));
  }, [product.shades, shadeQuery]);

  useEffect(() => {
    document.body.classList.toggle('modal-open', listOpen);
    return () => document.body.classList.remove('modal-open');
  }, [listOpen]);

  const pickShade = (idx: number) => {
    setShadeIdx(idx);
    setHoverIdx(null);
    setListOpen(false);
    setShadeQuery('');
  };

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

              {isDye && previewMeta && selectedMeta && (
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <span className="fs-12 fc-secondary d-block mb-1">Өнгө:</span>
                      <strong className="d-block">
                        {hoverIdx == null ? selectedMeta.label : previewMeta.code}
                      </strong>
                      {(hoverIdx == null ? selectedMeta.sub : previewMeta.sub) ? (
                        <span className="fs-12 fc-secondary d-block">
                          {hoverIdx == null ? selectedMeta.sub : previewMeta.sub}
                        </span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="btn btn-light btn-sm fs-12 rounded-3 d-flex align-items-center gap-1"
                      onClick={() => setListOpen(true)}
                    >
                      <span>Жагсаалтаар харах</span>
                      <img src={assetUrl('images/icons/chevronRightSmall.svg')} alt="" className="w-16 h-16" />
                    </button>
                  </div>
                  <div id="colorGrid">
                    <div className="d-flex flex-wrap gap-2">
                      {product.shades?.map((item, idx) => (
                        <button
                          type="button"
                          key={item.id}
                          className={`colorSwatch${idx === shadeIdx ? ' active' : ''}`}
                          style={{ background: item.hex }}
                          title={item.name}
                          onMouseEnter={() => setHoverIdx(idx)}
                          onMouseLeave={() => setHoverIdx(null)}
                          onClick={() => pickShade(idx)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!isDye && product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <span className="fs-12 fc-secondary d-block mb-2">Хэмжээ:</span>
                  <div className="d-flex gap-2 flex-wrap">
                    {product.sizes.map((item, index) => (
                      <button
                        type="button"
                        key={item.label}
                        className={`btn rounded-3 sizeBtn${index === sizeIdx ? ' active' : ' btn-outline-secondary'}`}
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
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn border rounded-end-0 w-40 h-40 d-flex align-items-center justify-content-center"
                    onClick={() => setQty((value) => Math.max(1, value - 1))}
                  >
                    <img src={assetUrl('images/icons/minus.svg')} alt="" />
                  </button>
                  <input
                    type="number"
                    className="form-control text-center fw-bold rounded-0 border-0 w-56 h-40 px-0 border-top border-bottom"
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
                  className={`btn btn-main flex-grow-1 p-3 d-flex align-items-center justify-content-center gap-2${inCart ? ' is-added' : ''}`}
                  aria-pressed={inCart}
                  onClick={() => {
                    if (inCart) {
                      removeItem(cartItemKey(product.id, selection));
                      return;
                    }
                    addItem(product, selection, qty);
                  }}
                >
                  <img src={assetUrl('images/icons/cartAddWhite.svg')} alt="" />
                  <strong>{inCart ? 'Сагсанд байна' : 'Сагслах'}</strong>
                </button>
                <button
                  type="button"
                  className="btn btn-main p-3 wishlistBtn2 d-flex align-items-center justify-content-center"
                  style={{ border: '1px solid #fff' }}
                  aria-label={wished ? 'Хадгалснаас хасах' : 'Хадгалах'}
                  onClick={() => toggle(product)}
                >
                  <img
                    src={assetUrl(wished ? 'images/icons/heartSolidRed.svg' : 'images/icons/heart.svg')}
                    alt=""
                    className="w-20 h-20"
                    style={wished ? undefined : { filter: 'brightness(0) invert(1)' }}
                  />
                </button>
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
            <li className="nav-item" role="presentation">
              <button className="nav-link fw-semibold fs-14 px-4 py-3" id="usage-tab" data-bs-toggle="tab" data-bs-target="#usage-pane" type="button" role="tab">
                Хэрэглэх заавар
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link fw-semibold fs-14 px-4 py-3" id="ingr-tab" data-bs-toggle="tab" data-bs-target="#ingr-pane" type="button" role="tab">
                Орц найрлага
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
            <div className="tab-pane fade" id="usage-pane" role="tabpanel">
              <div className="row">
                <div className="col-lg-8">
                  <h5 className="fw-bold mb-4">Хэрэглэх заавар</h5>
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex gap-3">
                      <div className="w-40 h-40 bg-main fc-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">1</div>
                      <div>
                        <strong className="d-block mb-1">Холих</strong>
                        <p className="fc-secondary mb-0 fs-14">Будгийг оксиданттай тэнцүү хэмжээгээр хуванцар буюу шилэн аяганд холино. Металл хэрэгсэл хэрэглэхгүй.</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <div className="w-40 h-40 bg-main fc-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">2</div>
                      <div>
                        <strong className="d-block mb-1">Хэрэглэх</strong>
                        <p className="fc-secondary mb-0 fs-14">Угаагаагүй, хуурай үсэнд тос хэрэглэнэ. Нэг хэсгийн зузааны дагуу тараана.</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <div className="w-40 h-40 bg-main fc-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">3</div>
                      <div>
                        <strong className="d-block mb-1">Хүлээх</strong>
                        <p className="fc-secondary mb-0 fs-14">Цагаан үсэнд: 30–45 минут. Будсан үсэнд: 20–30 минут. Дулааны дор: 15–20 минут.</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <div className="w-40 h-40 bg-main fc-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">4</div>
                      <div>
                        <strong className="d-block mb-1">Угаах</strong>
                        <p className="fc-secondary mb-0 fs-14">Халуун усаар сайтар угаана. Хөөсрөлт зогссон хойно гялалзуулагч бальзамаар арчина.</p>
                      </div>
                    </div>
                  </div>
                  <div className="alert alert-warning mt-4 fs-12 rounded-3 border-0">
                    ⚠️ <strong>Анхааруулга:</strong> Харшлын шинжилгээг хэрэглэхийн 48 цагийн өмнө хийнэ үү. Нүд, хөмсөгт хэрэглэхгүй.
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="ingr-pane" role="tabpanel">
              <div className="row">
                <div className="col-lg-8">
                  <h5 className="fw-bold mb-3">Орц найрлага</h5>
                  <p className="fs-12 fc-secondary lh-lg">
                    Aqua (Water), Cetearyl Alcohol, Propylene Glycol, Decyl Glucoside, p-Phenylenediamine, Resorcinol, m-Aminophenol, Ammonium Hydroxide, Sodium Lauryl Sulfate, Parfum (Fragrance), Hydrolyzed Wheat Protein, Panthenol, Tocopheryl Acetate, Citric Acid.
                  </p>
                  <div className="mt-4">
                    <h6 className="fw-bold mb-3">Гол найрлага</h6>
                    <div className="row row-cols-sm-2 row-cols-1 g-3">
                      <div className="col">
                        <div className="d-flex gap-3 align-items-start">
                          <div className="w-40 h-40 bg-light rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 fs-20">🌾</div>
                          <div>
                            <strong className="d-block fs-14">Гидролизатласан пшеницийн уураг</strong>
                            <span className="fs-12 fc-secondary">Үсний бүтцийг бэхжүүлнэ</span>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="d-flex gap-3 align-items-start">
                          <div className="w-40 h-40 bg-light rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 fs-20">💊</div>
                          <div>
                            <strong className="d-block fs-14">Пантенол (B5 витамин)</strong>
                            <span className="fs-12 fc-secondary">Чийглэлт, эмчилгээ</span>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="d-flex gap-3 align-items-start">
                          <div className="w-40 h-40 bg-light rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 fs-20">🌿</div>
                          <div>
                            <strong className="d-block fs-14">Токоферил ацетат (E витамин)</strong>
                            <span className="fs-12 fc-secondary">Антиоксидант хамгаалалт</span>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="d-flex gap-3 align-items-start">
                          <div className="w-40 h-40 bg-light rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 fs-20">✨</div>
                          <div>
                            <strong className="d-block fs-14">Polyquaternium-22</strong>
                            <span className="fs-12 fc-secondary">Зөөлөн, гялалзалт</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts products={related} />

      {listOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setListOpen(false)} />
          <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-labelledby="colorListModalLabel">
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
              <div className="modal-content rounded-4 border-0">
                <div className="modal-header border-0 pb-2">
                  <div className="d-flex flex-column w-100 gap-2">
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="modal-title fw-bold mb-0" id="colorListModalLabel">
                        Өнгө сонгох
                      </h6>
                      <button type="button" className="btn-close" aria-label="Close" onClick={() => setListOpen(false)} />
                    </div>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-3 ps-4"
                        placeholder="Өнгийн нэр эсвэл код хайх..."
                        value={shadeQuery}
                        onChange={(event) => setShadeQuery(event.target.value)}
                        autoComplete="off"
                      />
                      <img
                        src={assetUrl('images/icons/search.svg')}
                        alt=""
                        className="position-absolute top-50 translate-middle-y ms-2"
                        style={{ left: 0, width: 14, height: 14, opacity: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-body pt-1">
                  {filteredShades.map((item) => {
                    const idx = product.shades?.findIndex((entry) => entry.id === item.id) ?? 0;
                    const meta = shadeMeta(item);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`colorListItem d-flex align-items-center gap-2 w-100 border-0 text-start px-3 py-2 rounded-3 mb-1${idx === shadeIdx ? ' is-active' : ''}`}
                        onClick={() => pickShade(idx)}
                      >
                        <span className="colorSwatch" style={{ background: item.hex, width: 24, height: 24 }} />
                        <span>
                          <strong className="d-block fs-13">{meta.label}</strong>
                          {meta.sub ? <span className="fs-12 fc-secondary">{meta.sub}</span> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
