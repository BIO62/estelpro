import { assetUrl } from '@/lib/constants';
import { HelpMobileNav, HelpSideNav } from '@/components/layout/HelpSideNav';

export default function AboutPage() {

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
      
                  
                  <div className="row g-4 align-items-center mb-5">
                    <div className="col-lg-6">
                      <span className="fs-12 text-uppercase fw-semibold fc-secondary d-block mb-2">Бидний тухай</span>
                      <h1 className="fw-bold lh-sm mb-3">Үсчдэд зориулсан <span className="fc-main">мэргэжлийн</span> академи</h1>
                      <p className="fc-secondary lh-lg mb-4">Тэнгэрийн илгээмж ХХК нь 2019 оноос хойш үсчдэд зориулан үйл ажиллагаа явуулж байна. Монголын нийт үсчдийн салбарыг хөгжүүлэхийн тулд европ стандартын технологийн сургалтыг 2019–2021 онд хөдөө орон нутаг болон хотын 1000 гаруй үсчинд зохион байгуулсан. 2022 оны 02 сарын 02-нд олон улсын стандартын жишигтэй <strong className="fc-dark">Estel Academy Mongolia</strong>-г нээн ажиллуулж эхэлсэн бөгөөд тэр цагаас хойш нийт 44 сургалт амжилттай зохион байгуулсан.</p>
                      <div className="d-flex gap-4 flex-wrap">
                        <div className="text-center">
                          <strong className="d-block fs-2 fc-main">6+</strong>
                          <span className="fs-13 fc-secondary">Жилийн туршлага</span>
                        </div>
                        <div className="text-center">
                          <strong className="d-block fs-2 fc-main">1000+</strong>
                          <span className="fs-13 fc-secondary">Сургалтад хамрагдсан</span>
                        </div>
                        <div className="text-center">
                          <strong className="d-block fs-2 fc-main">44</strong>
                          <span className="fs-13 fc-secondary">Сургалт</span>
                        </div>
                        <div className="text-center">
                          <strong className="d-block fs-2 fc-main">2024</strong>
                          <span className="fs-13 fc-secondary">Академи нээсэн он</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <img src={assetUrl('images/demo/product1.jpg')} alt="" className="w-100 h-auto ratio169 img-cover rounded-4" />
                    </div>
                  </div>
      
                  <hr style={{opacity:".08"}} />
      
                  
                  <div className="py-5">
                    <h2 className="fw-bold fs-5 mb-4">Яагаад биднийг сонгох вэ?</h2>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <div className="bg-light rounded-4 p-4 h-100">
                          <img src={assetUrl('images/icons/check.svg')} alt="" className="w-40 h-40 mb-3" />
                          <strong className="d-block mb-2">100% Оригинал</strong>
                          <p className="fs-13 fc-secondary mb-0 lh-lg">Бүх бүтээгдэхүүн нь брэндийн албан ёсны дистрибьютороос нийлүүлэгдсэн, оригинал бараа юм.</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="bg-light rounded-4 p-4 h-100">
                          <img src={assetUrl('images/icons/box.svg')} alt="" className="w-40 h-40 mb-3" />
                          <strong className="d-block mb-2">Хурдан хүргэлт</strong>
                          <p className="fs-13 fc-secondary mb-0 lh-lg">Улаанбаатар хотод 80,000₮-с дээш захиалгад үнэгүй хүргэлт. Захиалгаас хойш 1–2 хоногт хүргэнэ.</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="bg-light rounded-4 p-4 h-100">
                          <img src={assetUrl('images/icons/rewind.svg')} alt="" className="w-40 h-40 mb-3" />
                          <strong className="d-block mb-2">Буцаалт хүлээн авна</strong>
                          <p className="fs-13 fc-secondary mb-0 lh-lg">Хүлээн авснаас хойш 14 хоногийн дотор буцааж болно. Алдаатай бараанд бүрэн буцаалт хийгдэнэ.</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="bg-light rounded-4 p-4 h-100">
                          <img src={assetUrl('images/icons/earphone.svg')} alt="" className="w-40 h-40 mb-3" />
                          <strong className="d-block mb-2">Дэмжлэг, сургалт</strong>
                          <p className="fs-13 fc-secondary mb-0 lh-lg">Таны бүхий л асуултанд хариулж, үсчингүүдэд сургалт зохион байгуулдаг.</p>
                        </div>
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
