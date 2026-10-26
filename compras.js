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

  const SS_H = SS + 'b_rgb:efefef,bo_300px_solid_rgb:efefef,c_pad,w_2600/b_rgb:efefef,c_pad,dpr_1,w_850,h_1530,f_auto,q_auto,fl_progressive/products/';
  const SF = id => `https://images.selfridges.com/is/image/selfridges/${id}_M?$PLP_ALL$`;
  const UQ = 'https://image.uniqlo.com/UQ/ST3/';

  // Tier 2: what rounds out the wardrobe once tier 1 is covered
  const TIER2 = [
    { t: 'Oxford rosada', sw: ['#f2c9cf'],
      why: 'La camisa más ivy después de la blanca y la azul. Con el blazer navy y pantalón gris es Nate de pies a cabeza.',
      ref: 'Polo Ralph Lauren · Custom Fit Oxford Shirt, Pink', det: 'Oxford 100 % algodón, cuello abotonado, corte entre clásico y slim. 155 € en Boozt.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/oxford-cubdppcs_26113325/211629170',
      alt: 'Viene también en blanco, azul y rayas azul y blanco.',
      f: [['Puesta', [BZ('raf710792041_cpink_v10001002wc7_10', '82946dcb81ed503de4243477cf9cc931')]],
          ['La prenda', [BZ('raf710792041_cpink_v10001002wc7', 'e00836ad6e29b06c8fa7d1fc2169c183')]],
          ['Detalle', [BZ('raf710792041_cpink_v10001002wc7_90', '6d4d740f058592410e8bcffdddc979f5')]]],
      pins: [['Oxford rosada con blazer navy', pin('pink oxford shirt navy blazer grey trousers')]] },
    { t: 'Suéter de cable crema', sw: ['#efe6d2'],
      why: 'El suéter de Nate Archibald. Para las noches frescas de Medellín, o sobre los hombros en tierra caliente.',
      ref: 'Polo Ralph Lauren · Cable-Knit Cotton Sweater, Andover Cream', det: '100 % algodón, cuello redondo. 154 € en Boozt (antes 220 €).',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/cotton-cable-lsl-swt_26087688/222369147',
      f: [['Puesto', [BZ('raf710775885_candovercream_v105753434ty_10', 'bf18fe9e893a82698c89a4d4b8a48274')]],
          ['La prenda', [BZ('raf710775885_candovercream_v105753434ty', '283d202d2cf79b47478a0e579f5cd9e3')]],
          ['Puesto', [BZ('raf710775885_candovercream_v105753434ty_11', 'f95da8f51edff81be2854ff67fcc048c')]]],
      pins: [['Suéter de cable con oxford', pin('cream cable knit sweater oxford shirt chinos preppy')], ['Nate Archibald', pin('Nate Archibald sweater')]] },
    { t: 'Blazer de lino para tierra caliente', sw: ['#cdb990'],
      why: 'Para Santa Fe, la costa y los viajes. Es el look de Dickie Greenleaf en El talento de Mr. Ripley.',
      ref: 'Suitsupply · Sand Tailored Fit Havana Suit Jacket', det: '60 % lino y 40 % algodón de Di Sondrio (Italia). Ref. C3768. 549 USD.',
      url: 'https://suitsupply.com/en-us/men/jackets/sand-tailored-fit-havana-suit-jacket/C3768.html',
      f: [['Puesta', [SS_M + 'Jackets/default/Winter/C3768_101.jpg']],
          ['La prenda', [SS_H + 'Jackets/default/Winter/C3768_1.jpg']],
          ['Puesta', [SS_M + 'Jackets/default/Winter/C3768_103.jpg']],
          ['Tela', [SS_M + 'Jackets/default/C3768_23.jpg']]],
      pins: [['Blazer de lino arena', pin('sand linen blazer white shirt summer men')], ['Dickie Greenleaf', pin('Dickie Greenleaf style')]] },
    { t: 'Pantalón de lino', sw: ['#c8b48e', '#2a3550', '#f1eee6'],
      why: 'Para el calor y los viajes de playa. Tu P09 no es de lino; este sí.',
      ref: 'Polo Ralph Lauren · Linen Trousers, slim tapered', det: '100 % lino. Classic Khaki, Newport Navy, New Olive o Ceramic White. 275 € en Boozt.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/linen-ltfsltprpstr_33017438/231747382',
      f: [['Puesto', [BZ('raf710940611_cclassickhaki_v10004482wqo_10', 'ecf4aae272ec6f11edbacfc48b93558e')]],
          ['La prenda', [BZ('raf710940611_cclassickhaki_v10004482wqo', '7e4337b03a0421235558ed7b01437bba')]],
          ['Puesto', [BZ('raf710940611_cclassickhaki_v10004482wqo_11', 'a87898bab3793cf5a7855291264444d0')]]],
      pins: [['Pantalón de lino con camisa', pin('linen trousers men white shirt loafers riviera')]] },
    { t: 'Camisa rugby', sw: ['#8c3b2c', '#efe6d2'],
      why: 'Lo más preppy de fin de semana: con chinos y mocasines, o sobre una oxford.',
      ref: 'Polo Ralph Lauren · The Iconic Rugby Shirt', det: '100 % algodón, a rayas, cuello de polo. 148 € en Boozt (antes 185 €). Hay unos diez colores.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/yd-ultw-rustic-ut-j-lsl-knt_18267207',
      f: [['Puesta', [BZ('raf710717116_cpalerussettroph_v105782546vg_10', '4a4600beb12bc96f1bf008fb8bbf1563')]],
          ['La prenda', [BZ('raf710717116_cpalerussettroph_v105782546vg', '31108edc1a442269c8017905aa100b8f')]],
          ['Puesta', [BZ('raf710717116_cpalerussettroph_v105782546vg_11', '235654cf4362b7ad44d15e8fb14a422d')]]],
      pins: [['Rugby con chinos', pin('rugby shirt chinos loafers preppy men')]] },
    { t: 'Suéter de cable navy en lana y cachemira', sw: ['#1f2a44'],
      why: 'Para viajes a clima frío, aviones y oficinas con aire. Va encima de cualquier oxford.',
      ref: 'Polo Ralph Lauren · Cable-Knit Wool-Cashmere Sweater, Hunter Navy', det: '90 % lana y 10 % cachemira. 204 € en Boozt (antes 255 €).',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/2-15-wool-cash-rws-lsl-plo_33143579',
      f: [['Puesto', [BZ('raf710974165_chunternavy_v10623102wnp_10', '8c3d2c9b96d962f8ae8645439e45f94f')]],
          ['La prenda', [BZ('raf710974165_chunternavy_v10623102wnp', '7bd7ba2f4f87af0b2215a3292db7bcbb')]],
          ['Puesto', [BZ('raf710974165_chunternavy_v10623102wnp_11', '12d174de71fa17a06ff80106e46d3588')]]],
      pins: [['Cable navy con oxford', pin('navy cable knit sweater oxford shirt grey trousers')]] },
    { t: 'Mocasín de gamuza', sw: ['#b88b5a'],
      why: 'Para los días secos con chinos y lino. Gamuza: no para lluvia.',
      ref: 'Christian Louboutin · The Harold I Flat, gamuza Saharienne', det: 'Mocasín plano de gamuza café claro. 990 USD en Selfridges.',
      url: 'https://www.selfridges.com/US/en/product/christian-louboutin-the-harold-i-flat-suede-loafers_R04643387/#colour=SAHARIENNE',
      alt: 'Belgian Shoes Mr. Casual en gamuza (navy, café o verde), en su tienda de Nueva York.',
      f: [['La prenda', [SF('R04643387_SAHARIENNE')]]],
      pins: [['Mocasín de gamuza con lino', pin('suede loafers linen trousers men summer')], ['Belgian Shoes en gamuza', pin('belgian shoes suede loafers men')]] },
    { t: 'Maletín de viaje de lona', sw: ['#2c4a8c', '#efe6d2'],
      why: 'Para tus viajes de la agencia: de mano, liviano y bien ivy.',
      ref: 'Polo Ralph Lauren · Embroidered Canvas Duffel', det: 'Lona 100 % algodón con ribetes de cuero encerado. Heritage Royal/Cream. 177 € en Boozt (antes 295 €).',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/canvas-duffle-dfl-med_32888992',
      f: [['La prenda', [BZ('raf405974610_cheritageroyalcr_v10000883qwi', '09072d0b934f6739c4093d44ef0deb7b')]],
          ['Detalle', [BZ('raf405974610_cheritageroyalcr_v10000883qwi_1', '8bff2b7210ccad4fe385869314b3d618')]],
          ['Detalle', [BZ('raf405974610_cheritageroyalcr_v10000883qwi_90', 'efb5f49dd7a5447a5e18848fc503f8f8')]]],
      pins: [['Duffel de viaje', pin('canvas leather duffle bag men travel preppy')]] },
  ];

  // Tier 3: the cravings, big and small
  const TIER3 = [
    { t: 'Esmoquin azul marino', sw: ['#1a2238'],
      why: 'Para bodas de noche y galas. El navy se ve más moderno que el negro: puro Chuck Bass.',
      ref: 'Suitsupply · Navy Three-Piece Tailored Fit Havana Tuxedo', det: 'Lana S110 de Vitale Barberis Canonico, solapa de pico en satín, con chaleco. Ref. C9353-S3. 657 £.',
      url: 'https://suitsupply.com/en-gi/men/suits/navy-three-piece-tailored-fit-havana-tuxedo/C9353-S3.html',
      f: [['Puesto', [SS_M + 'Mix_Match/default/Summer/C9353-S3_101.jpg']],
          ['Puesto', [SS_M + 'Mix_Match/default/Summer/C9353-S3_102.jpg']],
          ['El look', [SS_H + 'Mix_Match/default/Summer/C9353-S3_1.jpg']]],
      pins: [['Esmoquin navy', pin('midnight navy tuxedo men black tie')], ['Chuck Bass', pin('Chuck Bass tuxedo')]] },
    { t: 'Reloj Cartier Tank', sw: ['#c9c9c9', '#111111'],
      why: 'El reloj de vestir clásico: lo usaron JFK y Agnelli. Delgado, se pierde bajo el puño.',
      ref: 'Cartier · Tank Must, modelo grande', det: 'Caja de acero de 33,7 × 25,5 mm, correa de cuero negro. Unos 3.450 a 3.900 USD según la tienda.',
      url: 'https://wempe.com/en-us/watches/cartier/tank-de-cartier/tank-must-large-model-wsta0072',
      f: [['La pieza', ['https://www.borsheims.com/mm5/graphics/00000001/62/1CRTR0461A_670x670.jpg', 'https://www.borsheims.com/mm5/graphics/00000001/62/1CRTR0461A.jpg']],
          ['Detalle', ['https://www.borsheims.com/mm5/graphics/00000001/62/1CRTR0461E.jpg']]],
      pins: [['Cartier Tank con traje', pin('cartier tank men suit wrist')]] },
    { t: 'Gafas Persol 714 plegables', sw: ['#5a3b22'],
      why: 'Las de Steve McQueen. Se doblan y caben en el bolsillo del saco: ideales para viajar.',
      ref: 'Persol · 714, Havana', det: 'Montura plegable de acetato con la flecha de Persol. Unas 208 £ en Superdrug (marketplace).',
      url: 'https://www.superdrug.com/fashion/menswear/mens-accessories/persol-714-brown-men-sunglasses/p/mp-00486545',
      f: [['La pieza', ['https://media.superdrug.com//medias/prd-front-mp-00486545-600x600?context=bWFzdGVyfHByZC1pbWFnZXN8MTc5NTR8aW1hZ2UvanBlZ3xhREEzTDJnNVpDOHhOREExTmpnM01URTVPRGMxTUM5d2NtUXRabkp2Ym5RdGJYQXRNREEwT0RZMU5EVmZOakF3ZURZd01BfGM2MmQyOTM4OGE4NDI0NzdiZjU5YzM4NGQ1ODMxN2E0MDhkNGQ3M2M5NDBhZGMwYTQ4MWIxN2Y0NGY2OGI4ZDE']],
          ['De lado', ['https://media.superdrug.com//medias/prd-side-mp-00486545-600x600?context=bWFzdGVyfHByZC1pbWFnZXN8MTQ4NjB8aW1hZ2UvanBlZ3xhR0V5TDJobU5TOHhOREExTmpnM01EQTRORFl6T0M5d2NtUXRjMmxrWlMxdGNDMHdNRFE0TmpVME5WODJNREI0TmpBd3wxNGZhYmYxYmY5MzcxY2VjZWVkNzExMzFmNTg5YzlhNTI3NGViMWRmZDEwOWY0ODQwYzZiZmVkZGJkNGNhODIx']]],
      pins: [['Persol 714 puestas', pin('persol 714 steve mcqueen men')]] },
    { t: 'Mocasín Louboutin de noche', sw: ['#111111'],
      why: 'El antojo Chuck Bass: con el esmoquin o con jean oscuro y blazer de noche.',
      ref: 'Christian Louboutin · Dandelion Spikes Flat, veau velours negro', det: 'Mocasín de gamuza con tachas en la punta. 1.490 USD en Selfridges. El Dandelion liso en cuero Havane cuesta 990 USD.',
      url: 'https://www.selfridges.com/US/en/product/christian-louboutin-dandelion-spikes-flat-veau-velour-loafers_11-10145-3150438CM53/#colour=BLACK%20BLACK',
      alt: 'Más sobrio: Dandelion en cuero Havane, 990 USD.',
      f: [['La pieza', [SF('11-10145-3150438CM53_BLACKBLACK')]],
          ['Dandelion Havane', [SF('R04152236_HAVANE')]]],
      pins: [['Louboutin Dandelion puestos', pin('louboutin dandelion spikes men outfit')]] },
    { t: 'Maletín de cuero para fin de semana', sw: ['#9a5b2e'],
      why: 'La versión para toda la vida del de lona: envejece bonito con cada viaje.',
      ref: 'Polo Ralph Lauren · Heritage Leather Duffel, British Tan', det: '100 % cuero de vaca, 58 × 31 × 28 cm. 995 € en Boozt.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/leather-heri-dfl-lk-dfl-lrg_32888987/230351755',
      f: [],
      pins: [['Duffel de cuero café', pin('tan leather weekender duffle bag men')]] },
    { t: 'Chaqueta corta Uniqlo × JW Anderson', sw: ['#1f2a44'],
      why: 'Tu colaboración favorita. Es lo más parecido a una Harrington en la colección de ahora: para fin de semana.',
      ref: 'Uniqlo × JW Anderson · Short Blouson, Navy', det: 'Corte holgado y corto, botones con el logo de JW Anderson. 89,90 USD. Ojo: es mezcla con poliéster.',
      url: 'https://www.uniqlo.com/us/en/products/E486821-000/00?colorDisplayCode=69',
      f: [['La prenda', [UQ + 'us/imagesgoods/486821/item/usgoods_69_486821_3x4.jpg']],
          ['Puesta', [UQ + 'us/imagesgoods/486821/sub/usgoods_486821_sub3_3x4.jpg']],
          ['Puesta', [UQ + 'WesternCommon/imagesgoods/486821/sub/goods_486821_sub11_3x4.jpg']]],
      pins: [['Harrington con oxford', pin('navy harrington jacket oxford shirt chinos')]] },
    { t: 'Perfume CH Men Privé', sw: ['#3a2a1c'],
      why: 'De tu lista de marcas: Carolina Herrera. El frasco es una petaca de cuero; huele a cítrico, lavanda y cuero.',
      ref: 'Carolina Herrera · CH Men Privé, eau de toilette', det: 'Toronja, miel y lavanda; cardamomo; haba tonka, benjuí y oud. En la tienda de El Tesoro.',
      url: 'https://bespokeunit.com/articles/fragrance/carolina-herrera-ch-men-prive/',
      f: [['El frasco', ['https://bespokeunit.com/wp-content/uploads/2020/07/Carolina-Herrera-CH-Men-Priv%C3%A9-Packaging-Detail.jpg']]],
      pins: [] },
    { t: 'Bufanda Burberry de cachemira', sw: ['#c9a86f', '#7c1d2c'],
      why: 'Para viajes a clima frío. Combina con la gabardina del Tier 1.',
      ref: 'Burberry · Check Cashmere Scarf, Archive Beige', det: '100 % cachemira con el cuadro clásico. En el duty free de El Dorado o de viaje.',
      url: 'https://www.gentlemansgazette.com/burberry-scarf-is-it-worth-it/',
      f: [],
      pins: [['Bufanda Burberry con abrigo', pin('burberry check scarf men camel coat')]] },
    { t: 'Camisa de puño francés y mancuernas', sw: ['#ffffff', '#c9c9c9'],
      why: 'Las de Harvey. Para las reuniones grandes y los matrimonios.',
      ref: 'Camisa blanca de puño doble y mancuernas de plata', det: 'Carlos Nieto hace la camisa a la medida en El Tesoro; Suitsupply y Ralph Lauren tienen mancuernas sencillas.',
      url: pin('french cuff shirt silver cufflinks navy suit'),
      f: [],
      pins: [['Harvey Specter, puños', pin('Harvey Specter cufflinks')]] },
    { t: 'Sombrero Panamá', sw: ['#e8dcc0'],
      why: 'Para tierra caliente, la costa y los viajes. Es lo que lleva Dickie Greenleaf en Italia.',
      ref: 'Panamá de Montecristi (Ecuador)', det: 'Paja toquilla tejida a mano, cinta negra o azul. Busca uno "fino" de Montecristi.',
      url: pin('montecristi panama hat men linen suit'),
      f: [],
      pins: [['Panamá con lino', pin('panama hat linen suit men riviera')]] },
    { t: 'Smoking jacket de terciopelo', sw: ['#3b1a24'],
      why: 'El antojo más Chuck Bass: saco de terciopelo vinotinto o verde para cenas y fiestas.',
      ref: 'Saco de terciopelo con solapa de seda', det: 'Suitsupply y Ralph Lauren sacan uno cada temporada de fin de año.',
      url: pin('velvet smoking jacket men burgundy'),
      f: [],
      pins: [['Chuck Bass de terciopelo', pin('Chuck Bass velvet blazer')]] },
    { t: 'Medias de color', sw: ['#7c1d2c', '#25503e', '#ffb819'],
      why: 'El detalle barato que se nota: vinotinto, verde botella o mostaza con el gris y el navy.',
      ref: 'Medias de algodón o hilo de Escocia', det: 'Ralph Lauren, Massimo Dutti o Carlos Nieto. Que lleguen a media pierna.',
      url: pin('colorful dress socks men grey suit loafers'),
      f: [],
      pins: [['Medias de color con traje', pin('burgundy socks grey suit brown shoes')]] },
  ];

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const card = (b, i) => `
    <article class="buy">
      ${b.f.length ? `<div class="buy-strip">${b.f.map(([cap, src]) => `<figure><img loading="lazy" referrerpolicy="no-referrer" alt="${esc(b.t + ', ' + cap.toLowerCase())}" data-src="${esc(JSON.stringify(src))}"><figcaption>${esc(cap)}</figcaption></figure>`).join('')}
        <p class="buy-nofoto" hidden>Las fotos no cargaron aquí. <a href="${esc(b.url)}" target="_blank" rel="noopener">Míralas en la tienda ↗</a></p></div>` : ''}
      <div class="buy-body">
        <div class="buy-head"><span class="buy-n">${String(i + 1).padStart(2, '0')}</span>${b.sw.map(c => `<i style="background:${c}"></i>`).join('')}</div>
        <h3>${esc(b.t)}</h3>
        <p class="buy-why">${esc(b.why)}</p>
        <p class="buy-ref"><b>${esc(b.ref)}</b> ${esc(b.det)} <a href="${esc(b.url)}" target="_blank" rel="noopener">${/pinterest/.test(b.url) ? 'Ver ejemplos' : /gentlemansgazette|bespokeunit/.test(b.url) ? 'Leer más' : 'Ver en la tienda'} ↗</a></p>
        ${b.alt ? `<p class="buy-alt"><b>Otra opción:</b> ${esc(b.alt)}</p>` : ''}
        ${b.pins.length ? `<p class="buy-pins">Más ejemplos: ${b.pins.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ↗</a>`).join(' · ')}</p>` : ''}
      </div>
    </article>`;

  const TIERS = [
    ['tier1', 'Tier 1 · Lo que falta', 'Lo primero, en orden de prioridad: con esto tu clóset queda completo.', BUYS],
    ['tier2', 'Tier 2 · Lo siguiente', 'Para redondear: más color, tierra caliente y viajes.', TIER2],
    ['tier3', 'Tier 3 · Antojos', 'Todo lo que se me ocurre, de lo grande a lo pequeño. Para anotarse.', TIER3],
  ];

  const sec = document.createElement('section');
  sec.id = 'compras';
  sec.innerHTML = `<div class="wrap">
    <div class="sec-head">
      <div class="label">De la investigación de estilo</div>
      <h2>Qué comprar</h2>
      <p>Tres niveles: lo que te falta, lo siguiente y los antojos. Cada uno con el modelo exacto y fotos de la tienda, la prenda sola y puesta. Desliza las fotos y toca una para verla grande. Precios revisados el 26 de octubre de 2026.</p>
    </div>
    <nav class="tiers">${TIERS.map(([k, n]) => `<a href="#${k}">${n}</a>`).join('')}</nav>
    ${TIERS.map(([k, n, d, list]) => `<div class="tier" id="${k}"><h3 class="tier-h">${n}</h3><p class="tier-d">${d}</p><div class="buys">${list.map(card).join('')}</div></div>`).join('')}
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
