import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function AcademyPage() {

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `.acad-hero { position:relative; overflow:hidden; min-height:560px; display:flex; align-items:center; }
          .acad-hero-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top; }
          .acad-hero-overlay { position:absolute; inset:0; background:linear-gradient(105deg,rgba(8,18,32,.93) 0%,rgba(8,18,32,.68) 50%,rgba(8,18,32,.22) 100%); }
          .acad-hero-content { position:relative; z-index:1; }
          .acad-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(255,194,15,.12); border:1px solid rgba(255,194,15,.3); color:#FFC20F; border-radius:20px; padding:5px 14px; font-size:12px; font-weight:600; letter-spacing:.04em; }
          .acad-stat-sep { width:1px; background:rgba(0,0,0,.1); align-self:stretch; }
          .course-card { border-radius:16px; overflow:hidden; background:#fff; box-shadow:0 2px 12px rgba(0,0,0,.06); transition:transform .25s,box-shadow .25s; }
          .course-card:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(0,0,0,.13); }
          .course-card-img { height:200px; overflow:hidden; position:relative; }
          .course-card-img img { width:100%; height:100%; object-fit:cover; transition:transform .4s; display:block; }
          .course-card:hover .course-card-img img { transform:scale(1.06); }
          .level-badge { display:inline-block; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; padding:3px 10px; border-radius:20px; }
          .level-basic { background:#E8F4FF; color:#1170B7; }
          .level-mid { background:#FFF3E0; color:#C05500; }
          .level-adv { background:#F3E5F5; color:#7B1FA2; }
          .benefit-icon { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
          .session-row { border-bottom:1px solid rgba(0,0,0,.06); transition:background .15s; }
          .session-row:last-child { border-bottom:none; }
          .session-row:hover { background:#F8FBFF; }
          .acad-fi .form-control, .acad-fi .form-select { border-color:#223045; background:rgba(255,255,255,.06); color:#fff; border-radius:12px; }
          .acad-fi .form-control::placeholder { color:transparent; }
          .acad-fi .form-control:focus, .acad-fi .form-select:focus { border-color:#1170B7; background:rgba(255,255,255,.09); color:#fff; box-shadow:0 0 0 3px rgba(17,112,183,.28); }
          .acad-fi .form-floating > label { color:rgba(255,255,255,.42); }
          .acad-fi .form-floating:focus-within > label { color:rgba(255,255,255,.68); }
          .acad-fi .form-select option { background:#162032; color:#fff; }
          .acad-fi textarea.form-control { height:100px; resize:none; }` }} />
      
        
        <section className="acad-hero">
          <img src={assetUrl('images/demo/bottomDesktopImage.webp')} alt="" className="acad-hero-img" />
          <div className="acad-hero-overlay"></div>
          <div className="container py-5 acad-hero-content w-100">
            <div className="row py-3">
              <div className="col-lg-7 col-xl-6">
                <div className="acad-badge mb-4">
                  ESTEL ACADEMY
                </div>
                <h1 className="fw-bold fc-white lh-sm mb-3" style={{fontSize:"clamp(28px,4vw,54px)"}}>Дараагийн<br />түвшний<br /><span style={{color:"#FFC20F"}}>мэргэжилтэн</span></h1>
                <p className="mb-4 fs-15" style={{color:"rgba(255,255,255,.7)"}}>ESTEL-ийн мэргэжлийн сургагч багш нартай хамтран үсчний урлагийг хамтдаа хөгжүүлцгээе. Онол, практик</p>
                <div className="d-flex gap-3 flex-wrap">
                  <a href="#register" className="btn btn-main px-4 py-3 fw-semibold rounded-3">Бүртгүүлэх</a>
                  <a href="#courses" className="btn px-4 py-3 fw-semibold rounded-3" style={{background:"rgba(255,255,255,.12)",color:"#fff",border:"1.5px solid rgba(255,255,255,.25)"}}>Сургалт үзэх</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      
        
        <section className="bg-white border-bottom">
          <div className="container">
            <div className="row g-0 text-center">
              <div className="col-6 col-md-3 py-4 border-end">
                <strong className="d-block fc-main" style={{fontSize:"30px",letterSpacing:"-.02em"}}>2000+</strong>
                <span className="fs-13 fc-secondary">Үсчид</span>
              </div>
              <div className="col-6 col-md-3 py-4 border-end">
                <strong className="d-block fc-dark" style={{fontSize:"30px",letterSpacing:"-.02em"}}>12</strong>
                <span className="fs-13 fc-secondary">Сургалтын төрөл</span>
              </div>
              <div className="col-6 col-md-3 py-4 border-end">
                <strong className="d-block fc-dark" style={{fontSize:"30px",letterSpacing:"-.02em"}}>9+</strong>
                <span className="fs-13 fc-secondary">Жилийн туршлага</span>
              </div>
              <div className="col-6 col-md-3 py-4">
                <strong className="d-block fc-dark" style={{fontSize:"30px",letterSpacing:"-.02em"}}>98%</strong>
                <span className="fs-13 fc-secondary">Сэтгэл ханамж</span>
              </div>
            </div>
          </div>
        </section>
      
        
        <section className="py-5">
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6 order-lg-2">
                <div className="rounded-4 overflow-hidden" style={{height:"420px"}}>
                  <img src={assetUrl('images/demo/midDesktopImage.webp')} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
                </div>
              </div>
              <div className="col-lg-6 order-lg-1">
                <span className="fs-11 fw-bold text-uppercase fc-secondary d-block mb-2" style={{letterSpacing:".15em"}}>Бидний тухай</span>
                <h2 className="fw-bold mb-3" style={{fontSize:"clamp(22px,3vw,36px)",lineHeight:"1.2"}}>ESTEL Academy<br />гэж юу вэ?</h2>
                <p className="fc-secondary fs-14 mb-4">ESTEL Academy нь мэргэжлийн үсчид нарт зориулсан онол-практик хосолсон мэргэжлийн сургалтын төв юм. Дэлхийн зах зээлд тэргүүлэгч ESTEL брэндийн бүтээгдэхүүнийг ашиглан үсний будалт, засалт, арчилгааны орчин үеийн техникийг эзэмших боломжийг олгодог.</p>
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex align-items-start gap-3">
                    <div className="benefit-icon" style={{background:"#E8F4FF"}}>
                    </div>
                    <div>
                      <strong className="fs-14 d-block mb-1">Мэргэжлийн гэрчилгээ</strong>
                      <p className="fs-13 fc-secondary mb-0">Сургалт амжилттай дүүргэсний дараа ESTEL гэрчилгээ олгогдоно.</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-3">
                    <div className="benefit-icon" style={{background:"#F0FBF0"}}>
                    </div>
                    <div>
                      <strong className="fs-14 d-block mb-1">Уян хатан хуваарь</strong>
                      <p className="fs-13 fc-secondary mb-0">Өдрийн болон оройн сонголтоор ажлын хуваарьтаа тохирсон сургалт сонгоно уу.</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-3">
                    <div className="benefit-icon" style={{background:"#FFF5F9"}}>
                    </div>
                    <div>
                      <strong className="fs-14 d-block mb-1">Жижиг бүлэг</strong>
                      <p className="fs-13 fc-secondary mb-0">Нэг ангид хамгийн ихдээ 8 үсчид.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      
        
        <section className="py-5" style={{background:"#F2F2F2"}} id="courses">
          <div className="container">
            <div className="d-flex align-items-end justify-content-between mb-5">
              <div>
                <span className="fs-11 fw-bold text-uppercase fc-secondary d-block mb-2" style={{letterSpacing:".15em"}}>Сургалтын хөтөлбөр</span>
                <h2 className="fw-bold mb-0" style={{fontSize:"clamp(22px,3vw,34px)"}}>Сургалтын төрлүүд</h2>
              </div>
            </div>
            <div className="row g-4">
      
              <div className="col-md-6 col-lg-4">
                <div className="course-card h-100">
                  <div className="course-card-img">
                    <img src={assetUrl('images/demo/category1.avif')} alt="" />
                    <div style={{position:"absolute",top:"12px",left:"12px"}}><span className="level-badge level-basic">Анхан шат</span></div>
                  </div>
                  <div className="p-4 d-flex flex-column h-100">
                    <h5 className="fw-bold mb-2">Мэргэжлийн будалтын техник</h5>
                    <p className="fs-13 fc-secondary mb-3 flex-grow-1">De Luxe болон Sensation будаг ашиглан омбрэ, балаяж, хайлайт зэрэг орчин үеийн техникийг практикаар эзэмшинэ.</p>
                    <div className="d-flex align-items-center gap-3 mb-3 fs-12 fc-secondary">
                      <span className="d-flex align-items-center gap-1">2 өдөр · 16 цаг</span>
                      <span className="d-flex align-items-center gap-1">8 хүртэл</span>
                    </div>
                    <a href="#register" className="btn btn-main w-100 rounded-3 py-2 fs-13 fw-semibold">Бүртгүүлэх</a>
                  </div>
                </div>
              </div>
      
              <div className="col-md-6 col-lg-4">
                <div className="course-card h-100">
                  <div className="course-card-img">
                    <img src={assetUrl('images/demo/category4.avif')} alt="" />
                    <div style={{position:"absolute",top:"12px",left:"12px"}}><span className="level-badge level-mid">Дунд шат</span></div>
                  </div>
                  <div className="p-4 d-flex flex-column h-100">
                    <h5 className="fw-bold mb-2">Үсний эмчилгээ &amp; Арчилгаа</h5>
                    <p className="fs-13 fc-secondary mb-3 flex-grow-1">Curex болон Haute Couture цуврал ашиглан гэмтсэн үсийг сэргээх, тэжээлт арчилгаа хийх мэргэжлийн аргуудыг эзэмшинэ.</p>
                    <div className="d-flex align-items-center gap-3 mb-3 fs-12 fc-secondary">
                      <span className="d-flex align-items-center gap-1">1 өдөр · 8 цаг</span>
                      <span className="d-flex align-items-center gap-1">8 хүртэл</span>
                    </div>
                    <a href="#register" className="btn btn-main w-100 rounded-3 py-2 fs-13 fw-semibold">Бүртгүүлэх</a>
                  </div>
                </div>
              </div>
      
              <div className="col-md-6 col-lg-4">
                <div className="course-card h-100">
                  <div className="course-card-img">
                    <img src={assetUrl('images/demo/category3.avif')} alt="" />
                    <div style={{position:"absolute",top:"12px",left:"12px"}}><span className="level-badge level-basic">Анхан шат</span></div>
                  </div>
                  <div className="p-4 d-flex flex-column h-100">
                    <h5 className="fw-bold mb-2">Засалт &amp; Тогтоолт</h5>
                    <p className="fs-13 fc-secondary mb-3 flex-grow-1">Niagara болон Airex бүтээгдэхүүн ашиглан хэлбэр тогтоолт, волюм, орчин үеийн үсний засалтын техникийг суралцана.</p>
                    <div className="d-flex align-items-center gap-3 mb-3 fs-12 fc-secondary">
                      <span className="d-flex align-items-center gap-1">1 өдөр · 8 цаг</span>
                      <span className="d-flex align-items-center gap-1">8 хүртэл</span>
                    </div>
                    <a href="#register" className="btn btn-main w-100 rounded-3 py-2 fs-13 fw-semibold">Бүртгүүлэх</a>
                  </div>
                </div>
              </div>
      
              <div className="col-md-6 col-lg-4">
                <div className="course-card h-100">
                  <div className="course-card-img">
                    <img src={assetUrl('images/demo/slide3.webp')} alt="" />
                    <div style={{position:"absolute",top:"12px",left:"12px"}}><span className="level-badge level-mid">Дунд шат</span></div>
                  </div>
                  <div className="p-4 d-flex flex-column h-100">
                    <h5 className="fw-bold mb-2">Кератины тэгшлэлт</h5>
                    <p className="fs-13 fc-secondary mb-3 flex-grow-1">Lissage Professional ашиглан кератины тэгшлэлтийн аюулгүй арга техникийг эзэмшиж, үр дүнг удаан хадгалах аргыг суралцана.</p>
                    <div className="d-flex align-items-center gap-3 mb-3 fs-12 fc-secondary">
                      <span className="d-flex align-items-center gap-1">1.5 өдөр · 12 цаг</span>
                      <span className="d-flex align-items-center gap-1">6 хүртэл</span>
                    </div>
                    <a href="#register" className="btn btn-main w-100 rounded-3 py-2 fs-13 fw-semibold">Бүртгүүлэх</a>
                  </div>
                </div>
              </div>
      
              <div className="col-md-6 col-lg-4">
                <div className="course-card h-100">
                  <div className="course-card-img">
                    <img src={assetUrl('images/demo/category6.avif')} alt="" />
                    <div style={{position:"absolute",top:"12px",left:"12px"}}><span className="level-badge level-basic">Анхан шат</span></div>
                  </div>
                  <div className="p-4 d-flex flex-column h-100">
                    <h5 className="fw-bold mb-2">Эрэгтэй үсний засалт</h5>
                    <p className="fs-13 fc-secondary mb-3 flex-grow-1">Alpha Homme цуврал ашиглан эрэгтэй хэрэглэгчид зориулсан мэргэжлийн арчилгаа, засалтын техникийг суралцана.</p>
                    <div className="d-flex align-items-center gap-3 mb-3 fs-12 fc-secondary">
                      <span className="d-flex align-items-center gap-1">1 өдөр · 8 цаг</span>
                      <span className="d-flex align-items-center gap-1">8 хүртэл</span>
                    </div>
                    <a href="#register" className="btn btn-main w-100 rounded-3 py-2 fs-13 fw-semibold">Бүртгүүлэх</a>
                  </div>
                </div>
              </div>
      
              <div className="col-md-6 col-lg-4">
                <div className="course-card h-100">
                  <div className="course-card-img">
                    <img src={assetUrl('images/demo/category5.avif')} alt="" />
                    <div style={{position:"absolute",top:"12px",left:"12px"}}><span className="level-badge level-adv">Ахисан шат</span></div>
                  </div>
                  <div className="p-4 d-flex flex-column h-100">
                    <h5 className="fw-bold mb-2">Haute Couture мастер класс</h5>
                    <p className="fs-13 fc-secondary mb-3 flex-grow-1">Luxury үсний арчилгааны дээд зэргийн техникийг эзэмшиж мастерын түвшинд хүрнэ. Тансаг болон мэргэжлийн арчилгааны нарийн аргууд.</p>
                    <div className="d-flex align-items-center gap-3 mb-3 fs-12 fc-secondary">
                      <span className="d-flex align-items-center gap-1">3 өдөр · 24 цаг</span>
                      <span className="d-flex align-items-center gap-1">{'>'}6 хүртэл</span>
                    </div>
                    <a href="#register" className="btn btn-main w-100 rounded-3 py-2 fs-13 fw-semibold">Бүртгүүлэх</a>
                  </div>
                </div>
              </div>
      
            </div>
          </div>
        </section>
      
        
        <section className="py-5">
          <div className="container">
            <div className="mb-5">
              <span className="fs-11 fw-bold text-uppercase fc-secondary d-block mb-2" style={{letterSpacing:".15em"}}>Хуваарь</span>
              <h2 className="fw-bold mb-0" style={{fontSize:"clamp(22px,3vw,34px)"}}>Сургалтууд</h2>
            </div>
            <div className="bg-white rounded-4 overflow-hidden" style={{boxShadow:"0 2px 16px rgba(0,0,0,.06)"}}>
              <div className="d-none d-md-flex px-4 py-3 fs-11 fw-bold text-uppercase fc-secondary" style={{background:"#F8FBFF",borderBottom:"1px solid rgba(0,0,0,.06)",letterSpacing:".1em"}}>
                <span style={{flex:"0 0 40%"}}>Сургалт</span>
                <span style={{flex:"0 0 22%"}}>Огноо</span>
                <span style={{flex:"0 0 16%"}}>Хугацаа</span>
                <span style={{flex:"0 0 22%"}}>Байршил</span>
              </div>
              <div className="session-row px-4 py-4 d-flex flex-column flex-md-row align-items-md-center gap-1 gap-md-0">
                <div style={{flex:"0 0 40%"}} className="d-flex align-items-center gap-2 flex-wrap"><span className="level-badge level-basic">Анхан</span><strong className="fs-14">Будалтын техник</strong></div>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 22%"}}>2026/08/05–06</span>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 16%"}}>16 цаг</span>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 22%"}}>Улаанбаатар</span>
              </div>
              <div className="session-row px-4 py-4 d-flex flex-column flex-md-row align-items-md-center gap-1 gap-md-0">
                <div style={{flex:"0 0 40%"}} className="d-flex align-items-center gap-2 flex-wrap"><span className="level-badge level-mid">Дунд</span><strong className="fs-14">Эмчилгээ &amp; Арчилгаа</strong></div>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 22%"}}>2026/08/12</span>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 16%"}}>8 цаг</span>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 22%"}}>Улаанбаатар</span>
              </div>
              <div className="session-row px-4 py-4 d-flex flex-column flex-md-row align-items-md-center gap-1 gap-md-0">
                <div style={{flex:"0 0 40%"}} className="d-flex align-items-center gap-2 flex-wrap"><span className="level-badge level-mid">Дунд</span><strong className="fs-14">Кератины тэгшлэлт</strong></div>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 22%"}}>2026/08/19–20</span>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 16%"}}>12 цаг</span>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 22%"}}>Улаанбаатар</span>
              </div>
              <div className="session-row px-4 py-4 d-flex flex-column flex-md-row align-items-md-center gap-1 gap-md-0">
                <div style={{flex:"0 0 40%"}} className="d-flex align-items-center gap-2 flex-wrap"><span className="level-badge level-adv">Ахисан</span><strong className="fs-14">Haute Couture мастер</strong></div>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 22%"}}>2026/09/02–04</span>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 16%"}}>24 цаг</span>
                <span className="fs-13 fc-secondary" style={{flex:"0 0 22%"}}>Улаанбаатар</span>
              </div>
            </div>
          </div>
        </section>
      
        
        <section className="py-5" id="register" style={{background:"#0A1628"}}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xl-7">
                <div className="text-center mb-5">
                  <div className="acad-badge d-inline-flex mb-3">
                    Бүртгэл нээлттэй
                  </div>
                  <h2 className="fw-bold fc-white mb-3" style={{fontSize:"clamp(24px,3.5vw,40px)"}}>Академид бүртгүүлэх</h2>
                  <p className="fs-14" style={{color:"rgba(255,255,255,.58)"}}>Доорх маягтыг бөглөн илгээснээр бидний мэргэжилтэн тантай 24 цагийн дотор холбогдоно.</p>
                </div>
                <div className="acad-fi">
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="acadName" placeholder=" " />
                        <label htmlFor="acadName">Таны нэр</label>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-floating">
                        <input type="tel" className="form-control" id="acadPhone" placeholder=" " />
                        <label htmlFor="acadPhone">Утасны дугаар</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input type="email" className="form-control" id="acadEmail" placeholder=" " />
                        <label htmlFor="acadEmail">Имэйл хаяг</label>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-floating">
                        <select className="form-select" id="acadCourse">
                          <option value="" disabled selected></option>
                          <option>Мэргэжлийн будалтын техник</option>
                          <option>Үсний эмчилгээ &amp; Арчилгаа</option>
                          <option>Засалт &amp; Тогтоолт</option>
                          <option>Кератины тэгшлэлт</option>
                          <option>Эрэгтэй үсний засалт</option>
                          <option>Haute Couture мастер класс</option>
                        </select>
                        <label htmlFor="acadCourse">Сургалт сонгох</label>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-floating">
                        <select className="form-select" id="acadLevel">
                          <option value="" disabled selected></option>
                          <option>Анхан</option>
                          <option>Дунд түвшин</option>
                          <option>Мэргэжилтэн</option>
                          <option>Багш / Сургагч</option>
                        </select>
                        <label htmlFor="acadLevel">Мэргэжлийн түвшин</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea className="form-control acad-fi" id="acadMsg" placeholder=" " style={{height:"100px",resize:"none",borderColor:"#223045",background:"rgba(255,255,255,.06)",color:"#fff",borderRadius:"12px"}}></textarea>
                        <label htmlFor="acadMsg" style={{color:"rgba(255,255,255,.42)"}}>Нэмэлт мэдээлэл (заавал биш)</label>
                      </div>
                    </div>
                    <div className="col-12 pt-1">
                      <button className="btn btn-main w-100 p-3 rounded-3 fw-semibold" style={{fontSize:"15px"}}>Бүртгэлийн хүсэлт илгээх</button>
                    </div>
                    <div className="col-12 text-center">
                      <p className="fs-12 mb-0" style={{color:"rgba(255,255,255,.35)"}}>Таны мэдээлэл аюулгүй хадгалагдана. <Link href="/terms" className="text-decoration-none" style={{color:"rgba(255,255,255,.45)"}}>Үйлчилгээний нөхцөлийг уншина уу.</Link></p>
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
