import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function DeliveryTermsPage() {

  return (
    <>
      <div className="d-lg-none border-bottom bg-white">
            <div className="container">
                      <nav style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                <Link href="/about" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Бидний тухай</Link>
                <Link href="/terms" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Үйлчилгээний нөхцөл</Link>
                <Link href="/terms/delivery" className="btn btn-sm fs-13 fw-semibold fc-main py-2 text-start">Хүргэлтийн нөхцөл</Link>
                <Link href="/terms/payment" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Төлбөрийн нөхцөл</Link>
              </nav>
            </div>
          </div>
      
          <section className="py-5">
            <div className="container">
              <div className="row g-5 align-items-start">
      
                
                <div className="col-lg-3 d-none d-lg-block">
                  <div className="sticky-top" style={{top:"88px"}}>
                    <nav className="d-flex flex-column">
                      <Link href="/about" className="side-nav-item">Бидний тухай</Link>
                      <Link href="/terms" className="side-nav-item">Үйлчилгээний нөхцөл</Link>
                      <Link href="/terms/delivery" className="side-nav-item active">Хүргэлтийн нөхцөл</Link>
                      <Link href="/terms/payment" className="side-nav-item">Төлбөрийн нөхцөл</Link>
                    </nav>
                  </div>
                </div>
      
                <div className="col-lg-9">
                  <h1 className="fw-bold fs-4 mb-5">Хүргэлтийн нөхцөл</h1>
                  <div className="d-flex flex-column gap-5">
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">1. Хүргэлтийн бүс нутаг</h2>
                      <p className="fc-secondary lh-lg mb-2">Бид одоогоор Улаанбаатар хот болон дараах аймгуудад хүргэлт хийдэг:</p>
                      <div className="row g-2 mb-0">
                        <div className="col-6 col-sm-4">
                          <div className="bg-light rounded-3 px-3 py-2 fs-14 fc-secondary">Улаанбаатар</div>
                        </div>
                        <div className="col-6 col-sm-4">
                          <div className="bg-light rounded-3 px-3 py-2 fs-14 fc-secondary">Дархан-Уул</div>
                        </div>
                        <div className="col-6 col-sm-4">
                          <div className="bg-light rounded-3 px-3 py-2 fs-14 fc-secondary">Орхон</div>
                        </div>
                        <div className="col-6 col-sm-4">
                          <div className="bg-light rounded-3 px-3 py-2 fs-14 fc-secondary">Сэлэнгэ</div>
                        </div>
                        <div className="col-6 col-sm-4">
                          <div className="bg-light rounded-3 px-3 py-2 fs-14 fc-secondary">Төв аймаг</div>
                        </div>
                        <div className="col-6 col-sm-4">
                          <div className="bg-light rounded-3 px-3 py-2 fs-14 fc-secondary">Бусад аймаг <span className="fs-12">(хуваарьт)</span></div>
                        </div>
                      </div>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">2. Хүргэлтийн хугацаа</h2>
                      <div className="d-flex flex-column gap-3 mb-0">
                        <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                          <img src={assetUrl('images/icons/locationWhite.svg')} alt="" className="w-32 h-32 bg-main rounded-3 p-1 flex-shrink-0" />
                          <div>
                            <strong className="d-block fs-14 mb-1">Улаанбаатар хот</strong>
                            <p className="fc-secondary fs-13 mb-0">Захиалгаас хойш <strong className="fc-dark">1–2 ажлын өдөр</strong>. Өдрийн 14:00 цагаас өмнө захиалсан бол ихэвчлэн тухайн өдөр хүргэнэ.</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                          <img src={assetUrl('images/icons/locationWhite.svg')} alt="" className="w-32 h-32 bg-main rounded-3 p-1 flex-shrink-0" />
                          <div>
                            <strong className="d-block fs-14 mb-1">Орон нутаг (аймгийн төв)</strong>
                            <p className="fc-secondary fs-13 mb-0">Захиалгаас хойш <strong className="fc-dark">3–7 ажлын өдөр</strong>. Шуудангийн тээврээр хүргэнэ.</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                          <img src={assetUrl('images/icons/locationWhite.svg')} alt="" className="w-32 h-32 bg-main rounded-3 p-1 flex-shrink-0" />
                          <div>
                            <strong className="d-block fs-14 mb-1">Баг, сум</strong>
                            <p className="fc-secondary fs-13 mb-0">Захиалгаас хойш <strong className="fc-dark">7–14 ажлын өдөр</strong>. Тухайн орон нутгийн тээврийн байдлаас хамаарна.</p>
                          </div>
                        </div>
                      </div>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">3. Хүргэлтийн үнэ</h2>
                      <div className="table-responsive mb-0">
                        <table className="table table-bordered rounded-3 overflow-hidden fs-14">
                          <thead className="bg-light">
                            <tr>
                              <th className="fw-semibold py-3">Захиалгын дүн</th>
                              <th className="fw-semibold py-3">УБ хот</th>
                              <th className="fw-semibold py-3">Орон нутаг</th>
                            </tr>
                          </thead>
                          <tbody className="fc-secondary">
                            <tr>
                              <td className="py-3">0 – 79,999₮</td>
                              <td className="py-3">5,000₮</td>
                              <td className="py-3">8,000₮</td>
                            </tr>
                            <tr>
                              <td className="py-3">80,000₮ – 199,999₮</td>
                              <td className="py-3 fc-main fw-semibold">Үнэгүй</td>
                              <td className="py-3">8,000₮</td>
                            </tr>
                            <tr>
                              <td className="py-3">200,000₮ ба дээш</td>
                              <td className="py-3 fc-main fw-semibold">Үнэгүй</td>
                              <td className="py-3 fc-main fw-semibold">Үнэгүй</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">4. Хүргэлтийн явцыг хянах</h2>
                      <p className="fc-secondary lh-lg mb-2">Захиалга илгээгдсэний дараа бид SMS -ээр мэдэгдэл илгээнэ. Та <Link href="/account/orders" className="fc-main text-decoration-none">Миний захиалгууд</Link> хэсгээс захиалгынхаа явцыг хянах боломжтой.</p>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">5. Холбоо барих</h2>
                      <div className="bg-light rounded-3 p-3">
                        <p className="mb-1 fs-14"><strong>И-мэйл:</strong> <a href="mailto:info@estel.mn" className="fc-main text-decoration-none">info@estel.mn</a></p>
                        <p className="mb-0 fs-14"><strong>Утас:</strong> <Link href="tel:+97699112233" className="fc-main text-decoration-none">+976 8620 7202</Link></p>
                      </div>
                    </div>
      
                  </div>
                </div>
              </div>
            </div>
          </section>
    </>
  );
}
