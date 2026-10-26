// "Qué comprar": the buys suggested in the research report, with the shops' own photos.
// Photos are hotlinked from each shop; a photo that does not load tries the next source and then hides.
(() => {
  const SS = 'https://cdn.suitsupply.com/image/upload/';
  const SS_P = SS + 'b_rgb:efefef,bo_300px_solid_rgb:efefef,c_pad,w_2600/b_rgb:efefef,c_pad,dpr_1,w_768,h_922,f_auto,q_auto,fl_progressive/products/';
  const SS_M = SS + 'b_rgb:efefef,c_fill,w_2600,h_3597/b_rgb:efefef,c_pad,dpr_1,w_850,h_1176,f_auto,q_auto,fl_progressive/products/';
  const SS_M2 = SS + 'b_rgb:efefef,c_fill,w_2600/b_rgb:efefef,c_fill,dpr_1,w_768,h_922,f_auto,q_auto,fl_progressive/products/';
  const BZ = (p, v) => `https://image-resizing.booztcdn.com/polo-ralph-lauren/${p}.webp?has_webp=1${v ? '&version=' + v : ''}&size=w900`;
  const BB = id => `https://assets.burberry.com/is/image/Burberryltd/${id}?$BBY_V3_ML_1$&wid=900&hei=900`;
  const CL = id => `https://bynder.christianlouboutin.com/asset/${id}/FW26_CHAMBELIMOC_FLAT_CALF_PATINE_REG_CALF_TRESSE.jpg`;
  const pin = q => 'https://co.pinterest.com/search/pins/?q=' + encodeURIComponent(q);

  // f: [caption, [sources to try in order]]
  const BUYS = [
    { t: 'Blazer azul marino', sw: ['#1f2a44'],
      why: 'La pieza central del ivy, de Nate y de Harvey. Va con tus pantalones gris (P01 y P02), café (P06) y piedra (P09), y con el chino caqui.',
      ref: 'Suitsupply · Navy Tailored Fit Havana Blazer', det: 'Lana All Season de Reda, medio forro, hombro natural. Ref. C24205. 619 SGD; en Bogotá en pesos.',
      url: 'https://suitsupply.com/en-sg/men/jackets/navy-tailored-fit-havana-blazer/C24205.html',
      alt: 'En El Tesoro: Massimo Dutti, americana en lana fría a 1.400.000 COP; Carlos Nieto te la ajusta.',
      f: [['La prenda', [SS_P + 'Jackets/default/Summer/C24205_1.jpg', SS_P + 'Jackets/default/Winter/C24205_1.jpg', SS_P + 'Jackets/default/C24205_25.jpg']],
          ['Puesta', [SS_M2 + 'Jackets/default/Summer/C24205_101.jpg', SS_M2 + 'Jackets/default/Winter/C24205_101.jpg']],
          ['Puesta', [SS_M2 + 'Jackets/default/Summer/C24205_105.jpg', SS_M2 + 'Jackets/default/Winter/C24205_105.jpg']]],
      pins: [['Blazer navy con pantalón gris', pin('navy blazer grey trousers loafers ivy style')], ['Nate Archibald', pin('Nate Archibald blazer')]] },
    { t: 'Segundo traje, azul marino', sw: ['#1c2740'],
      why: 'Ya tienes el gris carbón (P08). El siguiente es navy, en lana tropical para el clima de Medellín.',
      ref: 'Suitsupply · Navy Perennial Tailored Fit Havana Suit', det: 'Lana tropical de Vitale Barberis Canonico, una fila. Ref. C9669-S. 548 USD (saco 399 y pantalón 149).',
      url: 'https://suitsupply.com/en-pr/navy-perennial-tailored-fit-havana-suit/C9669-S.html',
      alt: 'Más "Harvey": el cruzado de solapa de pico C6861-S1 (628 €), pero el de una fila es más versátil.',
      f: [['Puesta', [SS_M + 'Mix_Match/default/Summer/C9669-S_101.jpg']],
          ['Puesta', [SS_M + 'Mix_Match/default/Summer/C9669-S_103.jpg']],
          ['Puesta', [SS_M + 'Mix_Match/default/Summer/C9669-S_105.jpg']],
          ['La prenda', [SS + 'b_rgb:efefef,bo_500px_solid_rgb:efefef,c_pad,w_2600/b_rgb:efefef,c_pad,dpr_1,w_850,h_1176,f_auto,q_auto,fl_progressive/products/Mix_Match/default/C9669-S_25.jpg']]],
      pins: [['Guía de los trajes de Harvey', 'https://www.gentlemansgazette.com/suits-harvey-specter-hair-style/'], ['Harvey de navy', pin('Harvey Specter navy suit white shirt')]] },
    { t: 'Chinos caqui', sw: ['#c8b48e'],
      why: 'El pantalón ivy por excelencia. Tu P09 es piedra; falta un chino de algodón caqui para todo el año.',
      ref: 'Polo Ralph Lauren · Stretch Slim Fit Chino, Classic Khaki', det: '97 % algodón y 3 % elastano, slim de pierna recta. 185 € en Boozt; 138 USD en Ralph Lauren EE. UU.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/stretch-slim-fit-cotton-chino_16740767/16740796',
      f: [['Puesta', [BZ('raf710644988_cclassickhaki_v10576901117_10', '615789e48533e1df8d02ebc49bd58a53')]],
          ['La prenda', [BZ('raf710644988_cclassickhaki_v10576901117', '3058cfb3ca0c9bf4a0cd12437b4893b2')]],
          ['Detalle', [BZ('raf710644988_cclassickhaki_v10576901117_90', 'ee79fc9dbf0fcee3375a9194bfeffc79')]]],
      pins: [['Chino caqui con blazer navy', pin('khaki chinos navy blazer oxford shirt')]] },
    { t: 'Camisa blanca de vestir lisa', sw: ['#ffffff'],
      why: 'Para traje y corbata. Tus blancas son oxford, más informales.',
      ref: 'Massimo Dutti · Camisa stretch slim fit, blanca', det: '430.000 COP en la tienda de Colombia (El Tesoro). Pídela en popelina o twill fino.',
      url: 'https://www.massimodutti.com/co/hombre/camisas/blancas-n1357',
      alt: 'La tienda de Massimo Dutti no deja ver sus fotos desde fuera. Las fotos son de la parecida de Polo Ralph Lauren (Slim Fit Poplin, 116 € en Boozt).',
      f: [['Puesta · Polo RL', [BZ('raf712827064_cwhite_v10577242wcf_10', 'b710a2c7521e8dc8d9ffc3d4715bd713')]],
          ['La prenda · Polo RL', [BZ('raf712827064_cwhite_v10577242wcf', '52afd23ca7f1f28f87264ae028aeba87')]],
          ['Puesta · Polo RL', [BZ('raf712827064_cwhite_v10577242wcf_11', 'db4fd797e8ac3df70b09492cfd2cf09c')]]],
      pins: [['Camisa blanca con traje navy', pin('white dress shirt navy suit navy tie')]] },
    { t: 'Mocasín de cuero café oscuro', sw: ['#6b4328'],
      why: 'Te falta un zapato café de cuero liso que sirva para lo formal y lo casual.',
      ref: 'Christian Louboutin · Chambelimoc, Havane', det: 'Becerro café trenzado y patinado a mano, pasador plateado. Ref. 3260281BWI3. 2.250 SGD.',
      url: 'https://apac.christianlouboutin.com/sg_en/chambelimoc-havane-3260281BWI3.html',
      alt: 'Belgian Shoes Mr. Casual "All Calf", unos 675 USD, solo en su tienda de Nueva York. No es para lluvia.',
      f: [['La prenda', [CL('6a63b1ec-5173-4346-a310-41d2e6cfcdd0')]],
          ['La prenda', [CL('5ac7276c-0303-47ec-a955-e88cf3333cc6')]],
          ['Detalle', [CL('19f03833-f253-4b37-8411-a58ce6063542')]]],
      pins: [['Mocasín café con chinos', pin('brown penny loafers chinos navy blazer')], ['Belgian Shoes puestos', pin('belgian shoes loafers men outfit')]] },
    { t: 'Zapato con suela de goma para lluvia', sw: ['#4a3122'],
      why: 'Lo que más vas a usar en temporada de lluvias. Tus dos marcas casi no tienen para lluvia, así que aquí vale la excepción.',
      ref: 'Crockett & Jones · Pembroke, Dark Brown Grained Calf', det: 'Derby brogue en cuero de grano con suela de goma Storm Welt, Goodyear. 650 £ en Care of Carl.',
      url: 'https://www.careofcarl.co.uk/en/crockett-jones-pembroke-derbys-dark-brown-grained-calf',
      f: [['La prenda', ['https://www.careofcarl.co.uk/bilder/artiklar/zoom/13235111r_1.jpg?m=1672759890']],
          ['La prenda', ['https://www.careofcarl.co.uk/bilder/artiklar/zoom/13235111r_2.jpg?m=1672760032']],
          ['Suela', ['https://www.careofcarl.co.uk/bilder/artiklar/zoom/13235111r_4.jpg?m=1672760032']]],
      pins: [['Derby café con pantalón gris', pin('dark brown country derby brogue grey trousers')]] },
    { t: 'Gabardina Burberry', sw: ['#c9a86f', '#2c3a52'],
      why: 'Para la lluvia de la tarde y los viajes. Es la pieza más Burberry que existe.',
      ref: 'Burberry · Short Kensington Heritage Trench', det: 'Corte clásico, honey beige o coal blue. La corta es la mejor sobre el traje. 3.490 CAD.',
      url: 'https://ca.burberry.com/short-kensington-heritage-trench-coat-p81172341',
      alt: 'En Colombia no hay tienda Burberry: duty free de El Dorado o un viaje.',
      f: [['Puesta', [BB('C82C0F47-F360-41EA-BFD8-8B5B276740E1')]],
          ['Puesta', [BB('81EFB7D7-3127-46A3-ADB6-6E53FBAB9B0F')]],
          ['Puesta', [BB('61C88704-58DB-4155-9C49-7E69DC429010')]],
          ['La prenda', [BB('4B8A4BD2-5F7B-4C6C-85DF-96B052C979B7').replace('ML_1', 'SL_1')]]],
      pins: [['Trench sobre traje', pin('men burberry trench coat over suit')]] },
    { t: 'Corbatas y pañuelo básicos', sw: ['#1f2a44', '#8a1c2b', '#f4f1ea'],
      why: 'Ya tienes las estampadas (K01 y K02) y el pañuelo amarillo (K03). Faltan las básicas ivy.',
      ref: 'Polo Ralph Lauren · Striped Silk Repp Tie, Navy/Red', det: 'Seda de morera. 101,50 € en Boozt (antes 145 €). Faltan también una de punto y un pañuelo blanco de lino.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/eng-repp-stripe-bar-university_32429384/226848255',
      alt: 'Harvey usa grenadine navy lisa de 8 a 9 cm y pañuelo blanco en doblez recto.',
      f: [['Puesta', [BZ('raf712883559_cnavyred_v10418892wp1_10', 'ea021162bbbecd7b5036665025832217')]],
          ['La prenda', [BZ('raf712883559_cnavyred_v10418892wp1')]],
          ['Detalle', [BZ('raf712883559_cnavyred_v10418892wp1_90', '0f559299a3d35a7cc5914555d9e63fff')]]],
      pins: [['Corbata repp', pin('navy red repp tie oxford shirt navy blazer')], ['Pañuelo blanco recto', pin('white pocket square TV fold navy suit')]] },
    { t: 'Polos piqué', sw: ['#1f2a44', '#ffffff'],
      why: 'Azul marino y blanca, para tierra caliente y los días de más calor.',
      ref: 'Polo Ralph Lauren · The Iconic Custom Slim Fit Mesh Polo', det: 'Piqué de algodón con el caballito bordado. 135 € en Boozt.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/custom-slim-fit-cotton-mesh-polo_17160349',
      f: [['Puesta', [BZ('raf710666998_cwhite_v10020061049_10', 'fb5e563f887566dcaf295c6218105586')]],
          ['La prenda', [BZ('raf710666998_cwhite_v10020061049', '5c627883d734734c5a7b5e2f8a178eaf')]],
          ['Puesta', [BZ('raf710666998_cwhite_v10020061049_11', 'f9869588f4ddc3bd18957535be5fa085')]]],
      pins: [['Polo navy con chinos', pin('navy polo shirt khaki chinos loafers')]] },
  ];

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const card = (b, i) => `
    <article class="buy">
      <div class="buy-strip">${b.f.map(([cap, src]) => `<figure><img loading="lazy" referrerpolicy="no-referrer" alt="${esc(b.t + ', ' + cap.toLowerCase())}" data-src="${esc(JSON.stringify(src))}"><figcaption>${esc(cap)}</figcaption></figure>`).join('')}
        <p class="buy-nofoto" hidden>Las fotos no cargaron aquí. <a href="${esc(b.url)}" target="_blank" rel="noopener">Míralas en la tienda ↗</a></p></div>
      <div class="buy-body">
        <div class="buy-head"><span class="buy-n">${String(i + 1).padStart(2, '0')}</span>${b.sw.map(c => `<i style="background:${c}"></i>`).join('')}</div>
        <h3>${esc(b.t)}</h3>
        <p class="buy-why">${esc(b.why)}</p>
        <p class="buy-ref"><b>${esc(b.ref)}</b> ${esc(b.det)} <a href="${esc(b.url)}" target="_blank" rel="noopener">Ver en la tienda ↗</a></p>
        ${b.alt ? `<p class="buy-alt"><b>Otra opción:</b> ${esc(b.alt)}</p>` : ''}
        <p class="buy-pins">Más ejemplos: ${b.pins.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ↗</a>`).join(' · ')}</p>
      </div>
    </article>`;

  const sec = document.createElement('section');
  sec.id = 'compras';
  sec.innerHTML = `<div class="wrap">
    <div class="sec-head">
      <div class="label">De la investigación de estilo</div>
      <h2>Qué comprar</h2>
      <p>Lo que te falta, en orden de prioridad, con el modelo exacto y fotos de la tienda: la prenda sola y puesta. Desliza las fotos y toca una para verla grande. Precios revisados el 26 de octubre de 2026.</p>
    </div>
    <div class="buys">${BUYS.map(card).join('')}</div>
  </div>`;
  const after = document.getElementById('analisis');
  if (!after) return;
  after.after(sec);
  const tab = document.querySelector('nav.tabs a[href="#analisis"]');
  if (tab) { const a = document.createElement('a'); a.href = '#compras'; a.textContent = 'Qué comprar'; tab.after(a); }

  // each photo walks its list of sources; when a card is left with none, say so and link the shop
  sec.querySelectorAll('img[data-src]').forEach(img => {
    const list = JSON.parse(img.dataset.src); let k = 0;
    img.onerror = () => {
      if (++k < list.length) { img.src = list[k]; return; }
      const strip = img.closest('.buy-strip'); img.closest('figure').remove();
      if (!strip.querySelector('figure')) strip.querySelector('.buy-nofoto').hidden = false;
    };
    img.onload = () => img.closest('figure').classList.add('ok');
    img.src = list[0];
  });

  // tap a photo to see it big
  const box = document.createElement('dialog');
  box.className = 'buybox';
  box.innerHTML = '<img alt=""><button type="button" aria-label="Cerrar">×</button>';
  document.body.appendChild(box);
  sec.addEventListener('click', e => {
    const img = e.target.closest('.buy-strip img'); if (!img) return;
    const big = box.querySelector('img'); big.referrerPolicy = 'no-referrer'; big.src = img.currentSrc || img.src; big.alt = img.alt;
    box.showModal();
  });
  box.addEventListener('click', () => box.close());
})();
