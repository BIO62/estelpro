import Link from 'next/link';
import { FOOTER_LINKS, assetUrl } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-dark py-5">
      <div className="container">
        <div className="row g-lg-3 gy-5">
          <div className="col-xl-3 col-sm-4">
            <strong className="opacity-50 fc-white fw-medium mb-2 d-block">Хэрэглэгчийн тусламж</strong>
            <div className="d-flex flex-column gap-2">
              {FOOTER_LINKS.help.map((link) => (
                <Link key={link.href} href={link.href} className="d-block text-decoration-none">
                  <span className="d-block lh-sm fc-white">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="offset-xl-3 col-xl-6 col-sm-8">
            <div className="row row-cols-sm-2 row-cols-1">
              <div className="col">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex flex-column text-decoration-none py-1">
                    <strong className="opacity-50 fc-white fw-medium mb-2 d-block">Байршил</strong>
                    <span className="d-block lh-sm fc-white">{FOOTER_LINKS.contact.address}</span>
                  </div>
                  <div className="d-flex flex-column text-decoration-none py-1">
                    <strong className="opacity-50 fc-white fw-medium mb-2 d-block">Имэйл</strong>
                    <a href={`mailto:${FOOTER_LINKS.contact.email}`} className="d-block lh-sm fc-white text-decoration-none">
                      {FOOTER_LINKS.contact.email}
                    </a>
                  </div>
                  <div className="d-flex flex-column text-decoration-none py-1">
                    <strong className="opacity-50 fc-white fw-medium mb-2 d-block">Цагийн хуваарь</strong>
                    <span className="d-block lh-sm fc-white">{FOOTER_LINKS.contact.hours}</span>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex flex-column text-decoration-none py-1">
                    <strong className="opacity-50 fc-white fw-medium mb-2 d-block">Мэдээлэл авах</strong>
                    <span className="d-block lh-sm fc-white">{FOOTER_LINKS.contact.info}</span>
                  </div>
                  <div className="d-flex flex-column text-decoration-none py-1">
                    <strong className="opacity-50 fc-white fw-medium mb-2 d-block">Утасны дугаар</strong>
                    <div className="d-flex flex-wrap column-gap-2 row-gap-1">
                      {FOOTER_LINKS.contact.phones.map((phone, idx) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s+/g, '')}`}
                          className="d-block lh-sm fc-white text-decoration-none"
                        >
                          {phone}
                          {idx < FOOTER_LINKS.contact.phones.length - 1 ? ',' : ''}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="d-flex flex-column text-decoration-none py-1">
                    <strong className="opacity-50 fc-white fw-medium mb-2 d-block">Сошиал хаягууд</strong>
                    <div className="d-flex flex-wrap column-gap-2 row-gap-1">
                      <a href="https://facebook.com" className="d-block lh-sm fc-white text-decoration-none" target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={assetUrl('images/icons/facebookWhite.svg')} alt="Facebook" className="w-20 h-20" />
                      </a>
                      <a href="https://instagram.com" className="d-block lh-sm fc-white text-decoration-none" target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={assetUrl('images/icons/instagramWhite.svg')} alt="Instagram" className="w-20 h-20" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="opacity-25 border-dark-subtle my-5" />
        <div className="row row-cols-lg-2 row-cols-1 gx-4 g-3 align-items-center">
          <div className="col">
            <span className="fs-12 fc-white text-lg-start text-center d-block fw-medium">
              Copyright © 2026 ESTELPRO.mn - All Rights Reserved.
            </span>
          </div>
          <div className="col">
            <a href="#" className="btn p-2 d-flex align-items-center gap-2 justify-content-lg-end justify-content-center">
              <span className="fs-12 fc-white fw-medium">Powered by</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/nextstoreWhite.svg')} alt="NextStore" className="h-16" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
