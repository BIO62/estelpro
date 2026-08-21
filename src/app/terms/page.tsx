import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function TermsPage() {

  return (
    <>
      <div className="d-lg-none border-bottom bg-white">
            <div className="container">
                      <nav style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                <Link href="/about" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Бидний тухай</Link>
                <Link href="/terms" className="btn btn-sm fs-13 fw-semibold fc-main py-2 text-start">Үйлчилгээний нөхцөл</Link>
                <Link href="/terms/delivery" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Хүргэлтийн нөхцөл</Link>
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
                      <Link href="/terms" className="side-nav-item active">Үйлчилгээний нөхцөл</Link>
                      <Link href="/terms/delivery" className="side-nav-item">Хүргэлтийн нөхцөл</Link>
                      <Link href="/terms/payment" className="side-nav-item">Төлбөрийн нөхцөл</Link>
                    </nav>
                  </div>
                </div>
      
                <div className="col-lg-9">
                  <h1 className="fw-bold fs-4 mb-5">Үйлчилгээний нөхцөл</h1>
                  <div className="d-flex flex-column gap-5">
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">1. Ерөнхий заалт</h2>
                      <p className="fc-secondary lh-lg mb-2">ESTEL Store вэбсайтыг ашигласнаар та доорх үйлчилгээний нөхцлийг бүрэн хүлээн зөвшөөрч байна гэж үзнэ.</p>
                      <p className="fc-secondary lh-lg mb-0">Бид үйлчилгээний нөхцөлийг өөрчлөх эрхтэй бөгөөд өөрчлөлт орсон тохиолдолд вэбсайтад мэдэгдэл нийтлэнэ.</p>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">2. Бүртгэл ба нууцлал</h2>
                      <p className="fc-secondary lh-lg mb-2">Вэбсайтад бүртгүүлэхдээ та үнэн зөв, бүрэн мэдээлэл өгөх үүрэгтэй. Таны бүртгэл болон нууц үгийн аюулгүй байдлыг хангах хариуцлага өөрт тань байна.</p>
                      <ul className="fc-secondary lh-lg ps-4 mb-0">
                        <li className="mb-2">Нэг хэрэглэгч зөвхөн нэг бүртгэлтэй байна.</li>
                        <li className="mb-2">Бусдын мэдээллийг ашиглан бүртгүүлэхийг хориглоно.</li>
                        <li className="mb-0">Бүртгэлийн мэдээллээ бусдад дамжуулахгүй.</li>
                      </ul>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">3. Захиалга ба худалдан авалт</h2>
                      <p className="fc-secondary lh-lg mb-2">Захиалга хийснээр та тухайн бүтээгдэхүүний үнийг төлөх үүрэг хүлээнэ. Захиалга амжилттай болсны дараа SMS-ээр баталгаажуулалт илгээнэ.</p>
                      <p className="fc-secondary lh-lg mb-2">Дараах тохиолдолд захиалгыг цуцлах эрхийг бид өөртөө хадгална:</p>
                      <ul className="fc-secondary lh-lg ps-4 mb-0">
                        <li className="mb-2">Бараа нөөцөд байхгүй болсон тохиолдолд</li>
                        <li className="mb-2">Мэдээллийн алдаа (үнэ, тоо ширхэг) гарсан тохиолдолд.</li>
                        <li className="mb-0">Төлбөр төлөгдөөгүй 24 цаг болсон тохиолдолд.</li>
                      </ul>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">4. Буцаалт ба солилт</h2>
                      <p className="fc-secondary lh-lg mb-2">Бараа хүлээн авснаас хойш <strong>14 хоногийн дотор</strong> буцаах эсвэл солих боломжтой. Бараа анхны байдлаараа, савлагаатай, ашиглаагүй байх ёстой.</p>
                      <p className="fc-secondary lh-lg mb-2">Дараах тохиолдолд буцаалт хүлээн авахгүй:</p>
                      <ul className="fc-secondary lh-lg ps-4 mb-0">
                        <li className="mb-2">Ашигласан буюу савлагаа нь гэмтсэн бараа</li>
                        <li className="mb-2">Хугацаа дууссан бараа</li>
                        <li className="mb-0">Тусгай захиалгаар хийсэн бараа</li>
                      </ul>
                    </div>
      
                    <div>
                      <h2 className="fw-bold fs-5 mb-3">5. Хориглох зүйлс</h2>
                      <ul className="fc-secondary lh-lg ps-4 mb-0">
                        <li className="mb-2">Хуурамч захиалга өгөх, хуурамч мэдээлэл оруулах</li>
                        <li className="mb-2">Вэбсайтын програм хангамжид хөндлөнгөөс оролцох</li>
                        <li className="mb-2">Арилжааны зорилгоор дахин зарах</li>
                        <li className="mb-0">Бусад хэрэглэгчдийн мэдээлэлд хандах</li>
                      </ul>
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
