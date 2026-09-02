import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import { HelpMobileNav, HelpSideNav } from '@/components/layout/HelpSideNav';

export default function PaymentTermsPage() {

  return (
    <>
      <div className="d-lg-none border-bottom bg-white">
            <div className="container">
              <HelpMobileNav />
            </div>
          </div>
      
          <section className="py-5">
            <div className="container">
              <div className="row g-5 align-items-start">
      
                
                <div className="col-lg-3 d-none d-lg-block">
                  <div className="sticky-top" style={{top:"88px"}}>
                    <HelpSideNav />
                  </div>
                </div>
      
                <div className="col-lg-9">
                  <h1 className="fw-bold fs-4 mb-5">Төлбөрийн нөхцөл</h1>
                  <div className="d-flex flex-column gap-5">
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">1. Төлбөрийн аргууд</h2>
                      <p className="fc-secondary lh-lg mb-3">Бид дараах төлбөрийн аргуудыг дэмждэг:</p>
                      <div className="row g-3 mb-0">
                        <div className="col-sm-4">
                          <div className="border rounded-3 p-3 d-flex align-items-center gap-3 h-100">
                            <img src={assetUrl('images/demo/qpay.png')} alt="QPay" className="flex-shrink-0" style={{width:"40px",height:"40px",objectFit:"contain"}} />
                            <div>
                              <strong className="d-block fs-14">QPay</strong>
                              <span className="fc-secondary fs-13">Монголын банкны QR төлбөр</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="border rounded-3 p-3 d-flex align-items-center gap-3 h-100">
                            <img src={assetUrl('images/storePay.png')} alt="StorePay" className="flex-shrink-0" style={{width:"40px",height:"40px",objectFit:"contain"}} />
                            <div>
                              <strong className="d-block fs-14">StorePay</strong>
                              <span className="fc-secondary fs-13">Дараа төлөх нөхцөлт төлбөр</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="border rounded-3 p-3 d-flex align-items-center gap-3 h-100">
                            <img src={assetUrl('images/pocketZero.png')} alt="Pocket" className="flex-shrink-0" style={{width:"40px",height:"40px",objectFit:"contain"}} />
                            <div>
                              <strong className="d-block fs-14">Pocket</strong>
                              <span className="fc-secondary fs-13">Pocket апп-н төлбөр</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">2. Төлбөр баталгаажуулалт</h2>
                      <p className="fc-secondary lh-lg mb-2">Онлайн төлбөр амжилттай болсны SMS-ээр баталгаажуулалт хүлээн авна. Захиалга <strong className="fc-dark">төлбөр баталгаажсаны дараа</strong> л боловсруулагдана.</p>
                      <p className="fc-secondary lh-lg mb-0">Төлбөр амжилтгүй болсон тохиолдолд захиалга цуцлагдахгүй бөгөөд та 24 цагийн дотор дахин оролдох боломжтой.</p>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">3. StorePay — Дараа төлөх нөхцөл</h2>
                      <p className="fc-secondary lh-lg mb-2">StorePay-ийн тусламжтайгаар та одоо захиалж, дараа төлөх боломжтой. Дараах нөхцөлүүд хамаарна:</p>
                      <ul className="fc-secondary lh-lg ps-4 mb-0">
                        <li className="mb-2">Зээлийн хязгаар: 500,000₮ хүртэл</li>
                        <li className="mb-2">Хүү: 0% (хугацаандаа төлсөн тохиолдолд)</li>
                        <li className="mb-2">Эргэн төлөх хугацаа: 30 хоног</li>
                        <li className="mb-0">StorePay аппликейшнд бүртгэлтэй байх шаардлагатай</li>
                      </ul>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">4. Буцаалт төлбөр</h2>
                      <p className="fc-secondary lh-lg mb-2">Буцаалт хүлээн авсны дараа төлбөрийг <strong className="fc-dark">3–5 ажлын өдрийн дотор</strong> анхны төлбөрийн аргаар буцаана:</p>
                      <ul className="fc-secondary lh-lg ps-4 mb-0">
                        <li className="mb-2">QPay — шилжүүлгийн данс руу буцаана</li>
                        <li className="mb-0">Бэлэн мөнгө — дэлгүүрт ирж авах боломжтой</li>
                      </ul>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">5. Аюулгүй байдал</h2>
                      <p className="fc-secondary lh-lg mb-0">Таны төлбөрийн мэдээлэл SSL шифрлэлтээр хамгаалагдсан бөгөөд бид банкны мэдээллийг хадгалдаггүй. Бүх гүйлгээ нь Монгол банкны стандартын дагуу боловсруулагдана.</p>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">6. Холбоо барих</h2>
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
