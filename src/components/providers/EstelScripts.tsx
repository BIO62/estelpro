'use client';

import { useEffect } from 'react';

export default function EstelScripts() {
  useEffect(() => {
    document.querySelectorAll('.selectButton').forEach((sb) => {
      const button = sb.querySelector('button');
      button?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.selectButton.show').forEach((el) => {
          if (el !== sb) el.classList.remove('show');
        });
        sb.classList.toggle('show');
      });
    });

    const closeSelect = () => {
      document.querySelectorAll('.selectButton.show').forEach((el) => el.classList.remove('show'));
    };

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.selectButton')) closeSelect();
    });

    document.querySelectorAll('.navigationButton').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.navigationLevelOne.active, .navigationLevelTwo.active').forEach((el) => {
          el.classList.remove('active');
        });
        const levelOne = btn.nextElementSibling;
        if (levelOne?.classList.contains('navigationLevelOne')) {
          levelOne.classList.add('active');
        }
      });
    });

    document.querySelectorAll('.singleNav[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const levelOne = btn.closest('.navigationLevelOne');
        if (!levelOne) return;
        const levelTwo = levelOne.nextElementSibling;
        if (levelTwo?.classList.contains('navigationLevelTwo')) {
          const cat = (btn as HTMLElement).dataset.cat;
          levelTwo.querySelectorAll('[data-subcat]').forEach((el) => {
            el.classList.add('d-none');
            el.classList.remove('d-flex');
          });
          const panel = levelTwo.querySelector(`[data-subcat="${cat}"]`);
          if (panel) {
            panel.classList.remove('d-none');
            panel.classList.add('d-flex');
          }
          levelTwo.classList.add('active');
        }
      });
    });

    document.querySelectorAll('.btn-back').forEach((btn) => {
      btn.addEventListener('click', () => {
        const label = btn.querySelector('span')?.textContent?.trim();
        if (label === 'ҮНДСЭН ЦЭС РҮҮ БУЦАХ') {
          document
            .querySelectorAll('.navigationLevelOne.active, .navigationLevelTwo.active')
            .forEach((el) => el.classList.remove('active'));
        }
        if (label === 'АНГИЛЛЫН ЦЭС РҮҮ БУЦАХ') {
          btn.closest('.navigationLevelTwo')?.classList.remove('active');
        }
      });
    });

    document.querySelectorAll('.navigationLevelOne').forEach((panel) => {
      const navItems = panel.querySelectorAll('.singleNav');
      navItems.forEach((item) => {
        item.addEventListener('mouseenter', () => {
          navItems.forEach((other) => {
            if (other !== item) other.classList.add('darkenImage');
          });
        });
        item.addEventListener('mouseleave', () => {
          navItems.forEach((other) => other.classList.remove('darkenImage'));
        });
      });
    });

    document.querySelectorAll('.heartWishBtn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const img = btn.querySelector('img');
        if (!img) return;
        if (btn.classList.contains('active')) {
          btn.classList.remove('active');
          img.setAttribute('src', img.getAttribute('src')!.replace('heartSolidRed.svg', 'heart.svg'));
          img.style.filter = 'brightness(0) invert(1)';
        } else {
          btn.classList.add('active');
          img.setAttribute('src', img.getAttribute('src')!.replace('heart.svg', 'heartSolidRed.svg'));
          img.style.filter = '';
        }
      });
    });
  }, []);

  return null;
}
