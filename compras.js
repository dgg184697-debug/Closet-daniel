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
  const YNAP = (site, id, v) => `https://www.${site}.com/variants/images/${id}/${v}/w2000_q60.jpg`;
  const pin = q => 'https://co.pinterest.com/search/pins/?q=' + encodeURIComponent(q);

  // f: [caption, [sources to try in order]]
  const BUYS = [
    { t: 'Blazer azul marino, de blazer y no de traje', sw: ['#1f2a44', '#c9a24a'],
      why: 'La pieza central del ivy, de Nate y de Harvey. Se usa con pantalón de otro color: tus grises (P01 y P02), el café (P06), el piedra (P09) y el chino caqui. Con tu pantalón azul (P05) no, porque se ve como un traje que no combina.',
      ref: 'Carlos Nieto (El Tesoro) · blazer azul marino', det: 'Qué pedir: tela con textura (hopsack, sarga o franela liviana), un azul distinto al de tu P05, botones dorados o de cuerno, una fila de dos o tres botones y media forro por el clima. Bolsillos de parche si lo quieres más ivy. Precio en pesos: pregúntalo en la tienda.',
      url: pin('navy blazer gold buttons patch pockets ivy'),
      alt: 'Más ejemplos de tiendas en la sección "El blazer azul", justo debajo.',
      f: [['Así se ve un blazer', [YNAP('mrporter', '11813139151031275', 'ou')]],
          ['Botones dorados', [YNAP('mrporter', '11813139151031275', 'cu')]],
          ['Clásico de los 70', ['https://i0.wp.com/journal.styleforum.net/wp-content/uploads/2020/10/1970s-Blazer..jpg?resize=533%2C799&ssl=1']]],
      pins: [['Blazer navy con pantalón gris', pin('navy blazer grey trousers loafers ivy style')], ['Nate Archibald', pin('Nate Archibald blazer')], ['Botones dorados', pin('navy blazer brass buttons')]] },
    { t: 'Zapato con suela de goma para lluvia', sw: ['#4a3122'],
      why: 'Estamos en temporada de lluvias y para lo formal solo el oxford burdeos (Z03) aguanta el agua; tus tenis de cuero (Z07, Z16, Z18) sirven para lo casual. Suela de goma con el cuero sellado. Si prefieres quedarte en tus marcas, mira el Louboutin Chambeliboat en la sección de zapatos.',
      ref: 'Crockett & Jones · Pembroke, Dark Brown Grained Calf', det: 'Derby brogue en cuero de grano con suela de goma Storm Welt, Goodyear. Unos 870 USD.',
      url: 'https://www.careofcarl.co.uk/en/crockett-jones-pembroke-derbys-dark-brown-grained-calf',
      f: [['La prenda', ['https://www.careofcarl.co.uk/bilder/artiklar/zoom/13235111r_1.jpg?m=1672759890']],
          ['La prenda', ['https://www.careofcarl.co.uk/bilder/artiklar/zoom/13235111r_2.jpg?m=1672760032']],
          ['Suela', ['https://www.careofcarl.co.uk/bilder/artiklar/zoom/13235111r_4.jpg?m=1672760032']]],
      pins: [['Derby café con pantalón gris', pin('dark brown country derby brogue grey trousers')]] },
    { t: 'Mocasín de cuero café oscuro', sw: ['#6b4328'],
      why: 'Te falta un zapato café de cuero liso que sirva para lo formal y lo casual.',
      ref: 'Christian Louboutin · Chambelimoc, Havane', det: 'Becerro café trenzado y patinado a mano, pasador plateado. Ref. 3260281BWI3. Unos 1.760 USD.',
      url: 'https://apac.christianlouboutin.com/sg_en/chambelimoc-havane-3260281BWI3.html',
      alt: 'Belgian Shoes Mr. Casual "All Calf", unos 675 USD, solo en su tienda de Nueva York. No es para lluvia.',
      f: [['La prenda', [CL('6a63b1ec-5173-4346-a310-41d2e6cfcdd0')]],
          ['La prenda', [CL('5ac7276c-0303-47ec-a955-e88cf3333cc6')]],
          ['Detalle', [CL('19f03833-f253-4b37-8411-a58ce6063542')]]],
      pins: [['Mocasín café con chinos', pin('brown penny loafers chinos navy blazer')], ['Belgian Shoes puestos', pin('belgian shoes loafers men outfit')]] },
    { t: 'Corbatas y pañuelo básicos', sw: ['#1f2a44', '#8a1c2b', '#f4f1ea'],
      why: 'Ya tienes las estampadas (K01 y K02), el pañuelo amarillo (K03) y el corbatín del esmoquin (K04). Faltan las básicas ivy: una de rayas, una de punto y un pañuelo blanco de lino.',
      ref: 'Polo Ralph Lauren · Striped Silk Repp Tie, Navy/Red', det: 'Seda de morera. 125 USD en Ralph Lauren EE. UU. Faltan también una de punto y un pañuelo blanco de lino.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/eng-repp-stripe-bar-university_32429384/226848255',
      alt: 'Harvey usa grenadine navy lisa de 8 a 9 cm y pañuelo blanco en doblez recto.',
      f: [['Puesta', [BZ('raf712883559_cnavyred_v10418892wp1_10', 'ea021162bbbecd7b5036665025832217')]],
          ['La prenda', [BZ('raf712883559_cnavyred_v10418892wp1')]],
          ['Detalle', [BZ('raf712883559_cnavyred_v10418892wp1_90', '0f559299a3d35a7cc5914555d9e63fff')]]],
      pins: [['Corbata repp', pin('navy red repp tie oxford shirt navy blazer')], ['Pañuelo blanco recto', pin('white pocket square TV fold navy suit')]] },
    { t: 'Segundo traje, azul marino', sw: ['#1c2740'],
      why: 'No es urgente: ya tienes el gris carbón (P08). Atajo: pregunta en Carlos Nieto si tienen la chaqueta en la misma tela de tu pantalón azul (P05); si la tienen, ahí está tu traje azul.',
      ref: 'Suitsupply · Navy Perennial Tailored Fit Havana Suit', det: 'Lana tropical de Vitale Barberis Canonico, una fila. Ref. C9669-S. 548 USD (saco 399 y pantalón 149).',
      url: 'https://suitsupply.com/en-pr/navy-perennial-tailored-fit-havana-suit/C9669-S.html',
      alt: 'Más "Harvey": el cruzado de solapa de pico C6861-S1 (unos 705 USD), pero el de una fila es más versátil.',
      f: [['Puesta', [SS_M + 'Mix_Match/default/Summer/C9669-S_101.jpg']],
          ['Puesta', [SS_M + 'Mix_Match/default/Summer/C9669-S_103.jpg']],
          ['Puesta', [SS_M + 'Mix_Match/default/Summer/C9669-S_105.jpg']],
          ['La prenda', [SS + 'b_rgb:efefef,bo_500px_solid_rgb:efefef,c_pad,w_2600/b_rgb:efefef,c_pad,dpr_1,w_850,h_1176,f_auto,q_auto,fl_progressive/products/Mix_Match/default/C9669-S_25.jpg']]],
      pins: [['Guía de los trajes de Harvey', 'https://www.gentlemansgazette.com/suits-harvey-specter-hair-style/'], ['Harvey de navy', pin('Harvey Specter navy suit white shirt')]] },
    { t: 'Gabardina Burberry', sw: ['#c9a86f', '#2c3a52'],
      why: 'La Harrington (S20) ya resuelve la llovizna. La gabardina es para el aguacero, los viajes y para ir encima del traje. Es la pieza más Burberry que existe.',
      ref: 'Burberry · Short Kensington Heritage Trench', det: 'Corte clásico, honey beige o coal blue. La corta es la mejor sobre el traje. Unos 2.540 USD.',
      url: 'https://ca.burberry.com/short-kensington-heritage-trench-coat-p81172341',
      alt: 'En Colombia no hay tienda Burberry: duty free de El Dorado o un viaje.',
      f: [['Puesta', [BB('C82C0F47-F360-41EA-BFD8-8B5B276740E1')]],
          ['Puesta', [BB('81EFB7D7-3127-46A3-ADB6-6E53FBAB9B0F')]],
          ['Puesta', [BB('61C88704-58DB-4155-9C49-7E69DC429010')]],
          ['La prenda', [BB('4B8A4BD2-5F7B-4C6C-85DF-96B052C979B7').replace('ML_1', 'SL_1')]]],
      pins: [['Trench sobre traje', pin('men burberry trench coat over suit')]] },
    { t: 'Chinos caqui', tengo: 'el chino de Lululemon (P11) y el piedra de H&M (P09). Si algún día quieres otro, que sea este caqui, un tono más oscuro.', sw: ['#c8b48e'],
      why: 'El pantalón ivy por excelencia. Tu P09 es piedra; falta un chino de algodón caqui para todo el año.',
      ref: 'Polo Ralph Lauren · Stretch Slim Fit Chino, Classic Khaki', det: '97 % algodón y 3 % elastano, slim de pierna recta. 138 USD en Ralph Lauren EE. UU.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/stretch-slim-fit-cotton-chino_16740767/16740796',
      f: [['Puesta', [BZ('raf710644988_cclassickhaki_v10576901117_10', '615789e48533e1df8d02ebc49bd58a53')]],
          ['La prenda', [BZ('raf710644988_cclassickhaki_v10576901117', '3058cfb3ca0c9bf4a0cd12437b4893b2')]],
          ['Detalle', [BZ('raf710644988_cclassickhaki_v10576901117_90', 'ee79fc9dbf0fcee3375a9194bfeffc79')]]],
      pins: [['Chino caqui con blazer navy', pin('khaki chinos navy blazer oxford shirt')]] },
    { t: 'Camisa blanca de vestir lisa', tengo: 'dos blancas de vestir de Carlos Nieto, la C12 y la Platino (C13), y la de lino de cuello abierto (C11).', sw: ['#ffffff'],
      why: 'Para traje y corbata. Tus blancas son oxford, más informales.',
      ref: 'Massimo Dutti · Camisa stretch slim fit, blanca', det: 'Unos 135 USD; la tienen en El Tesoro. Pídela en popelina o twill fino.',
      url: 'https://www.massimodutti.com/co/hombre/camisas/blancas-n1357',
      alt: 'La tienda de Massimo Dutti no deja ver sus fotos desde fuera. Las fotos son de la parecida de Polo Ralph Lauren (Slim Fit Poplin, unos 130 USD).',
      f: [['Puesta · Polo RL', [BZ('raf712827064_cwhite_v10577242wcf_10', 'b710a2c7521e8dc8d9ffc3d4715bd713')]],
          ['La prenda · Polo RL', [BZ('raf712827064_cwhite_v10577242wcf', '52afd23ca7f1f28f87264ae028aeba87')]],
          ['Puesta · Polo RL', [BZ('raf712827064_cwhite_v10577242wcf_11', 'db4fd797e8ac3df70b09492cfd2cf09c')]]],
      pins: [['Camisa blanca con traje navy', pin('white dress shirt navy suit navy tie')]] },
    { t: 'Polos piqué', tengo: 'nueve polos: la Ralph Lauren azul rey (C16), seis Theory (entre ellas la blanca C17 y la azul marino C21), la menta de Massimo Dutti (C22) y la gris de Uniqlo (C19).', sw: ['#1f2a44', '#ffffff'],
      why: 'Azul marino y blanca, para tierra caliente y los días de más calor.',
      ref: 'Polo Ralph Lauren · The Iconic Custom Slim Fit Mesh Polo', det: 'Piqué de algodón con el caballito bordado. Unos 150 USD.',
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
      ref: 'Polo Ralph Lauren · Custom Fit Oxford Shirt, Pink', det: 'Oxford 100 % algodón, cuello abotonado, corte entre clásico y slim. Unos 175 USD.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/oxford-cubdppcs_26113325/211629170',
      alt: 'Viene también en blanco, azul y rayas azul y blanco.',
      f: [['Puesta', [BZ('raf710792041_cpink_v10001002wc7_10', '82946dcb81ed503de4243477cf9cc931')]],
          ['La prenda', [BZ('raf710792041_cpink_v10001002wc7', 'e00836ad6e29b06c8fa7d1fc2169c183')]],
          ['Detalle', [BZ('raf710792041_cpink_v10001002wc7_90', '6d4d740f058592410e8bcffdddc979f5')]]],
      pins: [['Oxford rosada con blazer navy', pin('pink oxford shirt navy blazer grey trousers')]] },
    { t: 'Suéter de cable crema', sw: ['#efe6d2'],
      why: 'El suéter de Nate Archibald. Para las noches frescas de Medellín, o sobre los hombros en tierra caliente.',
      ref: 'Polo Ralph Lauren · Cable-Knit Cotton Sweater, Andover Cream', det: '100 % algodón, cuello redondo. Unos 245 USD (en rebaja, unos 175).',
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
      tengo: 'tres: el azul marino y el crudo de Massimo Dutti (P10 y P12) y el beige con cordón de Theory (P13).', why: 'Para el calor y los viajes de playa.',
      ref: 'Polo Ralph Lauren · Linen Trousers, slim tapered', det: '100 % lino. Classic Khaki, Newport Navy, New Olive o Ceramic White. Unos 310 USD.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/linen-ltfsltprpstr_33017438/231747382',
      f: [['Puesto', [BZ('raf710940611_cclassickhaki_v10004482wqo_10', 'ecf4aae272ec6f11edbacfc48b93558e')]],
          ['La prenda', [BZ('raf710940611_cclassickhaki_v10004482wqo', '7e4337b03a0421235558ed7b01437bba')]],
          ['Puesto', [BZ('raf710940611_cclassickhaki_v10004482wqo_11', 'a87898bab3793cf5a7855291264444d0')]]],
      pins: [['Pantalón de lino con camisa', pin('linen trousers men white shirt loafers riviera')]] },
    { t: 'Camisa rugby', sw: ['#8c3b2c', '#efe6d2'],
      why: 'Ya tienes la de Disney (C25), pero esa es para la casa. Esta de Ralph Lauren es la que sirve para salir: con chinos y mocasines, o sobre una oxford.',
      ref: 'Polo Ralph Lauren · The Iconic Rugby Shirt', det: '100 % algodón, a rayas, cuello de polo. Unos 210 USD (en rebaja, unos 165). Hay unos diez colores.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/yd-ultw-rustic-ut-j-lsl-knt_18267207',
      f: [['Puesta', [BZ('raf710717116_cpalerussettroph_v105782546vg_10', '4a4600beb12bc96f1bf008fb8bbf1563')]],
          ['La prenda', [BZ('raf710717116_cpalerussettroph_v105782546vg', '31108edc1a442269c8017905aa100b8f')]],
          ['Puesta', [BZ('raf710717116_cpalerussettroph_v105782546vg_11', '235654cf4362b7ad44d15e8fb14a422d')]]],
      pins: [['Rugby con chinos', pin('rugby shirt chinos loafers preppy men')]] },
    { t: 'Suéter de cable navy en lana y cachemira', sw: ['#1f2a44'],
      why: 'Para viajes a clima frío, aviones y oficinas con aire. Va encima de cualquier oxford.',
      ref: 'Polo Ralph Lauren · Cable-Knit Wool-Cashmere Sweater, Hunter Navy', det: '90 % lana y 10 % cachemira. Unos 285 USD (en rebaja, unos 230).',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/2-15-wool-cash-rws-lsl-plo_33143579',
      f: [['Puesto', [BZ('raf710974165_chunternavy_v10623102wnp_10', '8c3d2c9b96d962f8ae8645439e45f94f')]],
          ['La prenda', [BZ('raf710974165_chunternavy_v10623102wnp', '7bd7ba2f4f87af0b2215a3292db7bcbb')]],
          ['Puesto', [BZ('raf710974165_chunternavy_v10623102wnp_11', '12d174de71fa17a06ff80106e46d3588')]]],
      pins: [['Cable navy con oxford', pin('navy cable knit sweater oxford shirt grey trousers')]] },
    { t: 'Mocasín de gamuza', sw: ['#b88b5a'],
      tengo: 'los mocasines Louboutin con barra, taupe y azul claro (Z08 y Z09), cumplen ese papel.', why: 'Para los días secos con chinos y lino. Gamuza: no para lluvia.',
      ref: 'Christian Louboutin · The Harold I Flat, gamuza Saharienne', det: 'Mocasín plano de gamuza café claro. 990 USD.',
      url: 'https://www.selfridges.com/US/en/product/christian-louboutin-the-harold-i-flat-suede-loafers_R04643387/#colour=SAHARIENNE',
      alt: 'Belgian Shoes Mr. Casual en gamuza (navy, café o verde), en su tienda de Nueva York.',
      f: [['La prenda', [SF('R04643387_SAHARIENNE')]]],
      pins: [['Mocasín de gamuza con lino', pin('suede loafers linen trousers men summer')], ['Belgian Shoes en gamuza', pin('belgian shoes suede loafers men')]] },
    { t: 'Maletín de viaje de lona', sw: ['#2c4a8c', '#efe6d2'],
      why: 'Para tus viajes de la agencia: de mano, liviano y bien ivy.',
      ref: 'Polo Ralph Lauren · Embroidered Canvas Duffel', det: 'Lona 100 % algodón con ribetes de cuero encerado. Heritage Royal/Cream. Unos 330 USD (en rebaja, unos 200).',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/canvas-duffle-dfl-med_32888992',
      f: [['La prenda', [BZ('raf405974610_cheritageroyalcr_v10000883qwi', '09072d0b934f6739c4093d44ef0deb7b')]],
          ['Detalle', [BZ('raf405974610_cheritageroyalcr_v10000883qwi_1', '8bff2b7210ccad4fe385869314b3d618')]],
          ['Detalle', [BZ('raf405974610_cheritageroyalcr_v10000883qwi_90', 'efb5f49dd7a5447a5e18848fc503f8f8')]]],
      pins: [['Duffel de viaje', pin('canvas leather duffle bag men travel preppy')]] },
  ];

  // Tier 3: the cravings, big and small
  const TIER3 = [
    { t: 'Esmoquin azul marino', sw: ['#1a2238'],
      why: 'Ya tienes el negro de Carlos Nieto (S14). Este sería el segundo: el navy se ve más moderno, puro Chuck Bass.',
      ref: 'Suitsupply · Navy Three-Piece Tailored Fit Havana Tuxedo', det: 'Lana S110 de Vitale Barberis Canonico, solapa de pico en satín, con chaleco. Ref. C9353-S3. Unos 880 USD.',
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
    { t: 'Mocasín Louboutin de noche', sw: ['#111111'],
      why: 'El antojo Chuck Bass: con el esmoquin o con jean oscuro y blazer de noche.',
      ref: 'Christian Louboutin · Dandelion Spikes Flat, veau velours negro', det: 'Mocasín de gamuza con tachas en la punta. 1.490 USD.',
      url: 'https://www.selfridges.com/US/en/product/christian-louboutin-dandelion-spikes-flat-veau-velour-loafers_11-10145-3150438CM53/#colour=BLACK%20BLACK',
      alt: 'Más sobrio: Dandelion en cuero Havane, 990 USD.',
      f: [['La pieza', [SF('11-10145-3150438CM53_BLACKBLACK')]],
          ['Dandelion Havane', [SF('R04152236_HAVANE')]]],
      pins: [['Louboutin Dandelion puestos', pin('louboutin dandelion spikes men outfit')]] },
    { t: 'Maletín de cuero para fin de semana', sw: ['#4a2f1e'],
      why: 'La versión para toda la vida del de lona: envejece bonito con cada viaje.',
      ref: 'Polo Ralph Lauren · Pebble Leather Duffel, Dark Brown', det: '100 % cuero de vaca granulado, grande. Unos 670 USD (en rebaja, unos 535). El Heritage en British Tan cuesta unos 1.115 USD.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/pebble-leather-duffle-dfl-lrg_32888977/230351720',
      f: [['La pieza', [BZ('raf405962459_cdarkbrown_v517372we9', 'f57c72d49954af3ae91a97531ae97479')]],
          ['De lado', [BZ('raf405962459_cdarkbrown_v517372we9_1', '5e1b8c8033d3785982380728afece468')]],
          ['Detalle', [BZ('raf405962459_cdarkbrown_v517372we9_90', 'f09f254688d3e58fd9e2527568497677')]]],
      pins: [['Duffel de cuero café', pin('brown leather weekender duffle bag men')]] },
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
      ref: 'Carolina Herrera · CH Men Privé, eau de toilette', det: 'Toronja, miel y lavanda; cardamomo; haba tonka, benjuí y oud. Unos 145 USD el de 100 ml.',
      url: 'https://bespokeunit.com/articles/fragrance/carolina-herrera-ch-men-prive/',
      f: [['El frasco', ['https://bespokeunit.com/wp-content/uploads/2020/07/Carolina-Herrera-CH-Men-Priv%C3%A9-Packaging-Detail.jpg']]],
      pins: [] },
    { t: 'Bufanda Burberry de cachemira', sw: ['#c9a86f', '#7c1d2c'],
      why: 'Para viajes a clima frío. Combina con la gabardina del Tier 1.',
      ref: 'Burberry · Check Cashmere Scarf, Archive Beige', det: '100 % cachemira con el cuadro clásico. Unos 650 USD; más barata en el duty free.',
      url: 'https://www.stadiumgoods.com/products/check-mates-cashmere-scarf-archive-beige-240051',
      f: [['La pieza', ['https://www.stadiumgoods.com/cdn/shop/files/nd8emjgxl8nr30vzrz3d6pfrxcxs.png?crop=center&height=1024&v=1788372598&width=1024', 'https://www.stadiumgoods.com/cdn/shop/files/5798m8nh3s011oy5ghor9c8twq78.png?crop=center&height=480&v=1788372598&width=480']]],
      pins: [['Bufanda Burberry con abrigo', pin('burberry check scarf men camel coat')]] },
    { t: 'Camisa de puño francés y mancuernas', sw: ['#ffffff', '#c9c9c9'],
      why: 'Las de Harvey. Para las reuniones grandes y los matrimonios.',
      ref: 'Suitsupply · Silver Round Cufflinks', det: 'Mancuernas redondas de plata, refs. M1310 y M1311. Unos 110 USD. La camisa de puño doble, a la medida con Carlos Nieto.',
      url: 'https://suitsupply.com/en-ie/men/accessories/cufflinks',
      f: [['M1310', [SS + 'b_rgb:efefef,bo_600px_solid_rgb:efefef,c_pad,g_center,w_2600/b_rgb:efefef,c_lpad,dpr_1,w_768,h_922,f_auto,q_auto,g_center,fl_progressive/products/Cufflinks/default/M1310_1.jpg']],
          ['M1311', [SS + 'b_rgb:efefef,bo_600px_solid_rgb:efefef,c_pad,g_center,w_2600/b_rgb:efefef,c_lpad,dpr_1,w_768,h_922,f_auto,q_auto,g_center,fl_progressive/products/Cufflinks/default/M1311_1.jpg']]],
      pins: [['Harvey Specter, puños', pin('Harvey Specter cufflinks')], ['Puño francés con traje navy', pin('french cuff shirt silver cufflinks navy suit')]] },
    { t: 'Sombrero Panamá', sw: ['#e8dcc0'],
      why: 'Para tierra caliente, la costa y los viajes. Es lo que lleva Dickie Greenleaf en Italia.',
      ref: 'Marchesi di Montecristi · Fino "Explorer", copa de gota', det: 'Paja toquilla tejida a mano en Montecristi (Ecuador), grado fino, se puede enrollar. Cinta regimental navy, beige y roja. Unos 610 USD.',
      url: 'https://montecristi.co.uk/products/fino-montecristi-hat-teardrop',
      f: [['La pieza', ['https://montecristi.co.uk/cdn/shop/products/Tear-drop-Panama-hat-rollable-best-quality-Marchesi-di-Montecristi_1200x1200.png?v=1780772200']],
          ['Otra vista', ['https://montecristi.co.uk/cdn/shop/products/Classic_men_and_women_Panama_hat_in_a_teardrop_crown_fedora_style_crafted_from_natural_breathable_straw.png?v=1791917897']],
          ['Otra vista', ['https://montecristi.co.uk/cdn/shop/products/Designer-Panama-hat-for-men-marchesi-di-montecristi.png?v=1780772103']]],
      pins: [['Panamá con lino', pin('panama hat linen suit men riviera')]] },
    { t: 'Smoking jacket de terciopelo', sw: ['#3b1a24'],
      why: 'El antojo más Chuck Bass: saco de terciopelo vinotinto para cenas y fiestas.',
      ref: 'Edward Sexton · Burgundy Velvet Shawl Jacket', det: 'Terciopelo de algodón italiano, solapa de chal. Del sastre de Savile Row que vistió a los Beatles. Unos 1.940 USD.',
      url: 'https://edwardsexton.co.uk/products/burgundy-velvet-shawl-jacket',
      f: [['Puesto', ['https://www.edwardsexton.co.uk/cdn/shop/files/Drop2-Look13_1783_1200x1200.jpg?v=1727335119']],
          ['Puesto', ['https://www.edwardsexton.co.uk/cdn/shop/files/Drop2-Look13_1762.jpg?v=1727335119']],
          ['Puesto', ['https://www.edwardsexton.co.uk/cdn/shop/files/Drop2-Look13_1789.jpg?v=1727335119']]],
      pins: [['Chuck Bass de terciopelo', pin('Chuck Bass velvet blazer')]] },
    { t: 'Medias de color', sw: ['#7c1d2c', '#25503e', '#ffb819'],
      why: 'El detalle barato que se nota: vinotinto, verde botella o mostaza con el gris y el navy.',
      ref: 'Polo Ralph Lauren · medias de vestir', det: 'Las de rombos (argyle) en paquete de tres, o las acanaladas que llegan a media pierna. Unos 25 a 35 USD el paquete.',
      url: 'https://www.macys.com/shop/product/polo-ralph-lauren-mens-3-pack-argyle-dress-socks?ID=1631326',
      f: [['Argyle', ['https://slimages.macysassets.com/is/image/MCY/products/0/optimized/16354710_fpx.tif?$filterlrg$&wid=600', 'https://slimages.macysassets.com/is/image/MCY/products/0/optimized/16354710_fpx.tif?$filterlrg$&wid=327']],
          ['Acanaladas', ['https://slimages.macysassets.com/is/image/MCY/products/4/optimized/516344_fpx.tif?$filterlrg$&wid=600', 'https://slimages.macysassets.com/is/image/MCY/products/4/optimized/516344_fpx.tif?$filterlrg$&wid=327']]],
      pins: [['Medias de color con traje', pin('burgundy socks grey suit brown shoes')]] },
  ];

  const MT = id => `https://www.mytheresa.com/image/1094/1238/100/0c/${id}.jpg`;
  const HM = id => `https://assets.hermes.com/is/image/hermesproduct/${id}_front_wm_101?extend=0,0,0,0&align=0,0&$product_default_bg$`;
  const DIBS = 'https://a.1stdibscdn.com/louis-vuitton-black-grained-calfskin-low-key-cabas-mm-for-sale';

  // Bags and luxury accessories, as references (the office tote first)
  const LUJO = [
    { t: 'Tote de oficina en cuero tejido', sw: ['#111111'],
      why: 'Mi recomendación para tu tote de oficina: cabe el computador y los documentos, no tiene logo y el tejido se reconoce sin gritar. Va con todo, del traje al lino.',
      ref: 'Bottega Veneta · Intreccio Leather Tote, negro', det: 'Cuero tejido a mano (intrecciato) con forro de cuero. 40 × 31 × 17 cm, asas de mano y correa larga ajustable. Unos 4.450 USD.',
      url: 'https://www.mytheresa.com/sg/en/men/bottega-veneta-intreccio-leather-tote-bag-black-p01232945',
      f: [['La pieza', [MT('P01232945')]], ['Otra vista', [MT('P01232945_b1')]], ['Detalle', [MT('P01232945_d1')]], ['Por dentro', [MT('P01232945_d2')]]],
      pins: [['Tote Bottega con traje', pin('bottega veneta intrecciato tote men suit')]] },
    { t: 'Tote Loewe Puzzle Fold', sw: ['#a8743f'],
      why: 'Más relajado que el de Bottega: el cuero es suave y se dobla plano para viajar. En café le queda bien al ivy.',
      ref: 'Loewe · Puzzle Fold Convertible Tote, mediano, Tan', det: 'Cuero liso con forro de gamuza; se lleva en la mano o al hombro. Unos 2.075 USD.',
      url: 'https://www.net-a-porter.com/en-gb/shop/product/loewe/puzzle-fold-convertible-medium-leather-tote/1647597307227383',
      f: [['La pieza', [YNAP('net-a-porter', '1647597307227383', 'in')]], ['Puesto', [YNAP('net-a-porter', '1647597307227383', 'ou')]], ['Otra vista', [YNAP('net-a-porter', '1647597307227383', 'bk')]], ['Detalle', [YNAP('net-a-porter', '1647597307227383', 'cu')]]],
      pins: [['Loewe Puzzle Fold hombre', pin('loewe puzzle fold tote men outfit')]] },
    { t: 'Louis Vuitton Low Key Cabas', sw: ['#111111'],
      why: 'La versión LV sin monograma: cuero granulado negro, muy de oficina.',
      ref: 'Louis Vuitton · Low Key Cabas MM, cuero de becerro granulado', det: '38 × 30 × 13 cm, forro de gamuza, herrajes bronce. Precio de tienda: 4.400 USD.',
      url: 'https://www.1stdibs.com/fashion/handbags-purses-bags/tote-bags/louis-vuitton-black-grained-calfskin-low-key-cabas-mm/id-v_26933022',
      f: [['La pieza', [DIBS + '-picture-2/0/v_269330221753414583078/o146485_bv_master.jpg', DIBS + '/1121189/v_269330221753802395288/26933022_datamatics.jpg']],
          ['De lado', [DIBS + '-picture-4/0/v_269330221753414587837/o146485_sv_master.jpg']],
          ['Detalle', [DIBS + '-picture-7/0/v_269330221753414593600/o146485_clasp_master.jpg']]],
      pins: [['LV tote hombre', pin('louis vuitton low key cabas men')]] },
    { t: 'Hermès para la oficina y el viaje', sw: ['#6b4328', '#d9c7a3'],
      why: 'La referencia máxima. El Garden Voyage es el tote de lona y cuero; el Cab\'H es el cabas de la casa. Casi todo Hermès hay que pedirlo en tienda.',
      ref: 'Hermès · Neo Garden Voyage 41 y Cab\'H', det: 'Neo Garden Voyage 41 en café: unos 4.095 USD. Cab\'H en natural: unos 5.780 USD.',
      url: 'https://www.hermes.cn/gr/en/category/leather-goods/bags-and-clutches/mens-bags-and-clutches/',
      f: [['Garden Voyage 41', [HM('086717CKAF')]], ['Cab\'H', [HM('084929CK28')]], ['Garden Voyage, negro', [HM('086717CKAC')]]],
      pins: [['Hermès Garden Party hombre', pin('hermes garden party men')]] },
    { t: 'El gran antojo: Cabat de Bottega', sw: ['#5a3b22'],
      why: 'El bolso más icónico de Bottega Veneta, tejido completo a mano. Para soñar.',
      ref: 'Bottega Veneta · Intrecciato Cabat, grande, café', det: 'Cuero tejido a mano por dentro y por fuera. Unos 16.550 USD.',
      url: 'https://www.mrporter.com/en-ae/mens/product/bottega-veneta/accessories/totes/intrecciato-cabat-large-leather-tote-bag/1647597337379516',
      f: [['La pieza', [YNAP('mrporter', '1647597337379516', 'in')]], ['Puesto', [YNAP('mrporter', '1647597337379516', 'ou')]], ['Detalle', [YNAP('mrporter', '1647597337379516', 'cu')]]],
      pins: [['Cabat de Bottega', pin('bottega veneta cabat men')]] },
  ];

  // Sunglasses, picked for Daniel's face (rounded, full cheeks, strong dark brows)
  const GAFAS = [
    { t: 'Gafas Jacques Marie Mage Dealan', sw: ['#6b4328', '#e08a3c'],
      why: 'La que mejor te va: forma de D con la ceja recta y acetato grueso, que le dan ángulo a tu cara. Con el lino y el Panamá es pura Riviera.',
      ref: 'Jacques Marie Mage · Dealan, color Tokyo', det: 'Acetato de 10 mm color carey con lentes naranja, bisagra y pines de plata esterlina. Edición de 450 piezas. 985 USD.',
      url: 'https://solefeed.com/shop/jacques-marie-mage/jacques-marie-mage-dealan-sunglasses-in-tokyo-edosvt',
      alt: 'También en Walnut, Obscure o Black Mirror, mismo precio.',
      f: [['La pieza', ['https://cdn.shopify.com/s/files/1/0225/2478/8810/files/370444-56854-DEALAN-SUNGLASSES-IN-TOKYO-1_22e1c7ea910e40cfbc44cdd6c4f32540.jpg?v=1792837715&width=900&format=webp&quality=68']],
          ['De lado', ['https://cdn.shopify.com/s/files/1/0225/2478/8810/files/370444-56854-DEALAN-SUNGLASSES-IN-TOKYO-2_0bf5b604e9ab42bf893212b06bc2822a.jpg?v=1792837716&width=900&format=webp&quality=68']],
          ['Detalle', ['https://cdn.shopify.com/s/files/1/0225/2478/8810/files/370444-56854-DEALAN-SUNGLASSES-IN-TOKYO-4_3264b11cdd0647f891bfb48a1a2f613b.jpg?v=1792837719&width=900&format=webp&quality=68']]],
      pins: [['Dealan puestas', pin('jacques marie mage dealan men')]] },
    { t: 'Gafas Jacques Marie Mage Kennedy', sw: ['#4a1f2a', '#c9c9c9'],
      why: 'Inspiradas en JFK, el ícono ivy. Te sirven: cuadradas y con la ceja marcada. La Hyannis, más ancha, todavía mejor para tu cara.',
      ref: 'Jacques Marie Mage · Kennedy, Bordeaux Empire', det: 'Frente de acetato vinotinto, varillas de titanio con paladio, lentes café oscuro. Edición de 200 piezas. 1.155 USD.',
      url: 'https://solefeed.com/shop/jacques-marie-mage/jacques-marie-mage-kennedy-sunglasses-in-bordeaux-empire-vpcq1i',
      alt: 'El Hyannis (por la casa de verano de los Kennedy) es más ancho y rectangular: 985 USD.',
      f: [['La pieza', ['https://cdn.shopify.com/s/files/1/0225/2478/8810/files/370535-56945-KENNEDY-SUNGLASSES-BORDEAUX-EMPIRE-1_b2324508310e4f0ebe39abf424ffb2e2.jpg?v=1792831573&width=900&format=webp&quality=68']],
          ['De lado', ['https://cdn.shopify.com/s/files/1/0225/2478/8810/files/370535-56945-KENNEDY-SUNGLASSES-BORDEAUX-EMPIRE-2_a8f9b6a373e6415d9524e8a2b3e37da6.jpg?v=1792831573&width=900&format=webp&quality=68']],
          ['Hyannis', ['https://cdn.shopify.com/s/files/1/0225/2478/8810/files/370469-56879-Jacques-Marie-Mage-Hyannis-Sunglasses-in-Tenace-1_ebc8a54a31c3470d87a021a469c8bdf7.jpg?v=1792827391&width=900&format=webp&quality=68']]],
      pins: [['JFK con gafas de sol', pin('JFK sunglasses style')]] },
    { t: 'Mykita × Rimowa MR002, cuadradas', sw: ['#8a8d91', '#111111'],
      why: 'De la colección de Mykita con Rimowa, la que más te va: cuadrada y en metal, para el día a día con traje. Livianas (25 g) y ajustables.',
      ref: 'Mykita × Rimowa · Heritage MR002 Square, Titanium & Black', det: 'Acero inoxidable con aros de aluminio anodizado, como las maletas Rimowa; lentes café. 140 mm de ancho, buena talla para ti. 790 USD.',
      url: 'https://www.rimowa.com/tw/en/accessories/eyewear/sunglasses/mr002-square-sunglasses/51900035.html',
      alt: 'También en Clay Green, plateado o negro.',
      f: [['La pieza', ['https://www.rimowa.com/on/demandware.static/-/Sites-rimowa-master-catalog-final/default/dwa648758c/images/large/51900035_1.png']],
          ['En negro', ['https://thewebster.com/cdn/shop/files/01_05d7275e-2727-403d-9895-e68c65552225.jpg?v=1786905752']],
          ['De lado', ['https://thewebster.com/cdn/shop/files/04_4326873f-dfd7-47d7-a1df-6ecdc932b2a1.jpg?v=1786905752']]],
      pins: [['Mykita Rimowa puestas', pin('mykita rimowa sunglasses men')]] },
    { t: 'Mykita × Rimowa MR006, aviador', sw: ['#111111'],
      why: 'Aviador con la línea de arriba recta, que le da estructura a una cara redondeada. Para viajes y fin de semana.',
      ref: 'Mykita × Rimowa · Heritage MR006 Aviator, Black & Black', det: 'Acero y aluminio anodizado, lentes negros polarizados. Unos 840 USD.',
      url: 'https://www.rimowa.com/tw/en/accessories/eyewear/sunglasses/mr006-aviator-sunglasses/51900053.html',
      alt: 'De esta colección no te recomiendo la MR007 redonda ni la MR001 panto: te redondean la cara. La MR003 navegador también te sirve.',
      f: [['La pieza', ['https://www.rimowa.com/on/demandware.static/-/Sites-rimowa-master-catalog-final/default/dw2a877bbf/images/large/51900053_1.png']]],
      pins: [['Aviador con traje', pin('men aviator sunglasses suit')]] },
    { t: 'Gafas Persol 714 plegables', sw: ['#5a3b22'],
      why: 'Las de Steve McQueen. Te sirven, aunque son las más suaves de la lista. Se doblan y caben en el bolsillo del saco: ideales para viajar.',
      ref: 'Persol · 714, Havana', det: 'Montura plegable de acetato con la flecha de Persol. Unos 280 USD. Pídelas en talla 54: la 52 te quedaría angosta.',
      url: 'https://www.superdrug.com/fashion/menswear/mens-accessories/persol-714-brown-men-sunglasses/p/mp-00486545',
      f: [['La pieza', ['https://media.superdrug.com//medias/prd-front-mp-00486545-600x600?context=bWFzdGVyfHByZC1pbWFnZXN8MTc5NTR8aW1hZ2UvanBlZ3xhREEzTDJnNVpDOHhOREExTmpnM01URTVPRGMxTUM5d2NtUXRabkp2Ym5RdGJYQXRNREEwT0RZMU5EVmZOakF3ZURZd01BfGM2MmQyOTM4OGE4NDI0NzdiZjU5YzM4NGQ1ODMxN2E0MDhkNGQ3M2M5NDBhZGMwYTQ4MWIxN2Y0NGY2OGI4ZDE']],
          ['De lado', ['https://media.superdrug.com//medias/prd-side-mp-00486545-600x600?context=bWFzdGVyfHByZC1pbWFnZXN8MTQ4NjB8aW1hZ2UvanBlZ3xhR0V5TDJobU5TOHhOREExTmpnM01EQTRORFl6T0M5d2NtUXRjMmxrWlMxdGNDMHdNRFE0TmpVME5WODJNREI0TmpBd3wxNGZhYmYxYmY5MzcxY2VjZWVkNzExMzFmNTg5YzlhNTI3NGViMWRmZDEwOWY0ODQwYzZiZmVkZGJkNGNhODIx']]],
      pins: [['Persol 714 puestas', pin('persol 714 steve mcqueen men')]] },
  ];

  // E. Marinella (Naples) ties, bow ties and pocket squares. Prices are EUR converted at 1.122.
  const EM = f => `https://cdn.shopify.com/s/files/1/0800/7319/5840/files/${f}&width=900`;
  const EMU = h => 'https://www.emarinella.eu/products/' + h;
  const COC = id => [`https://www.careofcarl.com/bilder/artiklar/zoom/${id}_1.jpg`, `https://www.careofcarl.com/bilder/artiklar/600x600_grey_4_5/${id}.jpg`];
  const MARINELLA = [
    { t: 'Corbata de siete pliegues', sw: ['#1c2740'],
      why: 'La joya de Marinella: un cuadro de seda doblado siete veces, sin forro, que cae pesado y hace un nudo perfecto. Con el traje azul y la camisa blanca es la corbata de las reuniones grandes.',
      ref: 'E. Marinella · 7 Fold Sartorial Silk Tie, Dark Blue', det: 'Seda, hecha a mano en Nápoles. 250 € (unos 280 USD).',
      url: EMU('dark-blue-7-fold-sartorial-silk-tie-54'),
      f: [['La pieza', [EM('CRAVATTA_7_PIEGHE_CR7P944_20020_3_00_3954040c-7c24-4e02-85aa-b8ae30ac0dd8.jpg?v=1758902291')]]],
      pins: [['Corbata de siete pliegues', pin('seven fold tie navy suit')]] },
    { t: 'Corbata napolitana de florecitas', sw: ['#1c2740', '#8a1c2b'],
      why: 'El estampado por el que se conoce a Marinella: dibujitos pequeños sobre fondo oscuro. Va con todo y es la que más vas a usar. Complementa tu K01 de raquetas, que es más divertida.',
      ref: 'E. Marinella · Sartorial Printed Silk Tie, Dark Blue, small flower', det: 'Seda estampada a mano, tres pliegues, forro de lana, 8,5 cm de ancho. 160 € (unos 180 USD).',
      url: EMU('dark-blue-classic-silk-tie-14'),
      alt: 'En Care of Carl la venden en azul marino y vinotinto por 180 € (unos 200 USD).',
      f: [['La pieza', [EM('CR7449_53105_1_00.jpg?v=1792591801')]], ['Otro dibujo', [EM('CRAVATTA_CLASSICA_CR7458_53109_5_00.jpg?v=1745829071')]],
          ['Azul marino', COC('31927410')], ['Vinotinto', COC('31928410')]],
      pins: [['Corbatas Marinella puestas', pin('e marinella tie navy blazer')]] },
    { t: 'Grenadine azul oscuro', sw: ['#1a2238'],
      why: 'La corbata de Harvey Specter: lisa, con textura de tejido abierto. Sirve con cualquier camisa y cualquier traje.',
      ref: 'E. Marinella · Sartorial Granadine Silk Tie, Dark Blue', det: 'Seda grenadine, tres pliegues. 160 € (unos 180 USD).',
      url: EMU('midnight-blue-sartorial-granadine-silk-tie'),
      alt: 'También en vinotinto o bluette, mismo precio.',
      f: [['La pieza', [EM('GRZ3502_GZL01_1_00.jpg?v=1782485661')]]],
      pins: [['Grenadine con traje', pin('navy grenadine tie suit harvey specter')]] },
    { t: 'Regimental azul con rayas rojas', sw: ['#1c2740', '#8a1c2b'],
      why: 'La de rayas, la más ivy de todas. Con blazer azul y oxford. Es la versión napolitana de la Polo del Tier 1: compra una de las dos.',
      ref: 'E. Marinella · Regimental Jacquard Silk Tie, Dark Blue / Red', det: 'Seda jacquard. 160 € (unos 180 USD).',
      url: EMU('dark-blue-sartorial-striped-silk-tie-reg141'),
      f: [['La pieza', [EM('REG141_3362_1_00.jpg?v=1792157461')]]],
      pins: [['Regimental con blazer', pin('regimental tie navy blazer oxford ivy')]] },
    { t: 'Corbata tejida', sw: ['#1c2740'],
      why: 'De punta recta y tejido de punto. Para los viernes con blazer, chinos y oxford, o con el saco de lino.',
      ref: 'E. Marinella · Silk Knitted Tie, Dark Blue', det: 'Seda tejida. 130 € (unos 145 USD).',
      url: EMU('dark-blue-silk-knitted-tie-2'),
      alt: 'También azul con puntos celestes o beige con puntos.',
      f: [['La pieza', [EM('CRAVATTA_TRICOT_TRICOT046_1001_20_00.jpg?v=1752068441')]]],
      pins: [['Corbata tejida con blazer', pin('navy knit tie blazer oxford shirt')]] },
    { t: 'Corbatín estampado para anudar', sw: ['#1c2740'],
      why: 'Para bodas de día y eventos en jardín, como la de tu foto. El de anudar se ve mejor que el ya hecho, porque queda un poco imperfecto. Muy Chuck Bass.',
      ref: 'E. Marinella · Self-Tie Printed Silk Bowtie, Dark Blue', det: 'Seda estampada, hecho a mano y ajustable. 150 € (unos 170 USD).',
      url: EMU('dark-blue-self-tie-printed-silk-bowtie'),
      f: [['La pieza', [EM('PPL351_161-2026_00.jpg?v=1785485303')]]],
      pins: [['Corbatín de día', pin('chuck bass bow tie')]] },
    { t: 'Corbatín de satín para el esmoquin', sw: ['#111111', '#1c2740'],
      why: 'El negro ya lo tienes (K04, de Marinella). El azul oscuro de satín es para el esmoquin azul del Tier 3, si lo compras.',
      ref: 'E. Marinella · Self-Tie Silk Satin Bowtie, negro o azul oscuro', det: 'Satín de seda, para anudar. 150 € cada uno (unos 170 USD). La faja de satín negro: 250 € (unos 280).',
      url: EMU('black-silk-satin-bowtie-to-self-tie-solid-color'),
      alt: 'Para una fiesta en diciembre, el vinotinto de satín, mismo precio.',
      f: [['Negro', [EM('PAPILLON_DA_ANNODARE_PPL123_00_1b4c584f-a9c8-4a78-9c8c-d62bd7ac3e53.jpg?v=1754495130')]],
          ['Azul oscuro', [EM('PAPILLON_DA_ANNODARE_PPL314_01.jpg?v=1765183136')]],
          ['Vinotinto', [EM('PAPILLON_DA_ANNODARE_PPL237_00_1c7de07e-2af4-4ae1-a67c-8c2323b8dfab.jpg?v=1753956034')]]],
      pins: [['Corbatín negro con esmoquin', pin('black satin bow tie tuxedo self tied')]] },
    { t: 'Pañuelo de seda estampado', sw: ['#1c2740', '#2c4a8c'],
      why: 'Con el blazer sin corbata, en pico y suelto. Si llevas corbata, que el pañuelo no repita su estampado. Tu amarillo (K03) es el de verano; este es para el resto del año.',
      ref: 'E. Marinella · Hand-Printed Silk Pocket Square', det: 'Seda estampada a mano con borde de otro color y dobladillo a mano. 90 € (unos 100 USD).',
      url: EMU('dark-blue-hand-printed-silk-pocket-square-41'),
      f: [['Azul oscuro', [EM('POCHETTE_PCH721_56501_2_00_33ad1429-9193-42e8-a9a3-1f6e68625510.jpg?v=1772189837')]],
          ['Azul', [EM('POCHETTE_PCH616_DH2064_4_01_d80b0cdb-2a39-4000-bc81-db7a4bb0c975.jpg?v=1778142995')]]],
      pins: [['Pañuelo en pico', pin('silk pocket square puff fold navy blazer')]] },
    { t: 'Pañuelo blanco con borde de satín', sw: ['#ffffff'],
      why: 'El de Don Draper y Harvey: doblado recto, asomando un dedo. Para traje con corbata y para el esmoquin.',
      ref: 'E. Marinella · White Ceremonial Pocket Square', det: 'Algodón fino con borde de satín, dobladillo a mano. 45 € (unos 50 USD).',
      url: 'https://www.emarinella.eu/collections/pagina-uomo-3/products/white-ceremonial-pocket-square-1',
      f: [['La pieza', [EM('POCHETTE_CERIMONIA_PCHCER_00_58125f53-897d-4c8b-9146-1b09ebdf846f.jpg?v=1753188668')]]],
      pins: [['Pañuelo blanco recto', pin('white pocket square tv fold suit')]] },
  ];

  // Navy blazer examples: what a real blazer looks like next to a suit jacket.
  const HR = h => `https://hrd-live.cdn.scayle.cloud/images/${h}.jpg?brightness=1&width=922&height=1230&quality=75&bg=ffffff`;
  const BSH = f => [`https://belgianshoes.com/wp-content/uploads/2017/10/${f}.jpg`, `https://belgianshoes.com/wp-content/uploads/2017/10/${f}-600x600.jpg`, `https://belgianshoes.com/wp-content/uploads/2017/10/${f}-500x500.jpg`];
  const BLAZER = [
    { t: 'Polo Ralph Lauren con botones dorados', sw: ['#1f2a44', '#c9a24a'],
      why: 'El ejemplo más claro de blazer: botones dorados grabados con mazos de polo, sin hombrera y de lino, fresco para Medellín. Esto es lo que buscamos.',
      ref: 'Polo Ralph Lauren · Navy Slim-Fit Unstructured Linen-Blend Blazer', det: 'Mezcla de lino, medio forro, sin estructura. 995 € en Mr Porter (unos 1.115 USD).',
      url: 'https://www.mrporter.com/en-dk/mens/product/polo-ralph-lauren/clothing/single-breasted-blazers/navy-slim-fit-unstructured-linen-blend-blazer/11813139151031275',
      f: [['Puesto', [YNAP('mrporter', '11813139151031275', 'ou')]], ['La prenda', [YNAP('mrporter', '11813139151031275', 'in')]],
          ['De frente', [YNAP('mrporter', '11813139151031275', 'fr')]], ['Botones', [YNAP('mrporter', '11813139151031275', 'cu')]]],
      pins: [['Blazer de lino navy', pin('navy linen blazer gold buttons men')]] },
    { t: 'Polo de lino con textura', sw: ['#1f2a44'],
      why: 'Tela con textura y hombro natural: se nota que no es de traje. Con chinos y mocasines es la pinta de viernes.',
      ref: 'Polo Ralph Lauren · Polo Soft Modern Fit Linen-Blend Jacket, Navy', det: '53 % lino, 37 % viscosa y 10 % lana, medio forro, dos botones. 445 € (unos 500 USD); rebajada a unos 375.',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/fancy-weave-wvn-blazer-sport-coat_33071572/232193767',
      f: [['La prenda', [BZ('raf715b19049_cnavy_v10703272wbt', '24fc251f505eb06aac4060f788e02f66')]],
          ['Puesto', [BZ('raf715b19049_cnavy_v10703272wbt_90', '98f5e608b4bec2fe6b5d0022100e335f')]],
          ['Puesto', [BZ('raf715b19049_cnavy_v10703272wbt_91', '83a43495a8a38884ef025d90467739e4')]],
          ['Detalle', [BZ('raf715b19049_cnavy_v10703272wbt_1', '5c19c103624fec641b17eee2f8adb60e')]]],
      pins: [['Blazer con chinos', pin('navy blazer khaki chinos loafers')]] },
    { t: 'Polo de gabardina', sw: ['#1f2a44'],
      why: 'La gabardina tiene una diagonal que se ve: es la tela clásica de blazer. Más estructurado, para la oficina.',
      ref: 'Polo Ralph Lauren · Polo Modern Fit Gabardine Blazer, Navy', det: '80 % lana y 20 % poliéster, forrado completo. 545 € (unos 610 USD).',
      url: 'https://www.boozt.com/eu/en/polo-ralph-lauren/wool-garbadine-mdn-p2nt_32889176/230353585',
      f: [['Puesto', [BZ('raf715928570_cnavy_v10044682wbt_10', '95aab6c31a7d65a0ccb7f27250159b4d')]],
          ['La prenda', [BZ('raf715928570_cnavy_v10044682wbt', 'e68701634fc26f4bd473e4b16de5c6fb')]],
          ['Detalle', [BZ('raf715928570_cnavy_v10044682wbt_1', '427de5c89d6107a12cea2b62e442c054')]],
          ['Puesto', [BZ('raf715928570_cnavy_v10044682wbt_11', '4f723bc7807f82666a580553f4943a08')]]],
      pins: [['Blazer navy con gris', pin('navy blazer grey flannel trousers')]] },
    { t: 'Suitsupply de tejido con textura', sw: ['#1f2a44'],
      why: 'Lana de Reda con un tejido apretado y con textura. Ojo: trae botones oscuros y por eso parece de traje. Si lo compras, cámbiale los botones por dorados o de nácar en Carlos Nieto.',
      ref: 'Suitsupply · Navy Tailored Fit Havana Blazer, ref. C25216', det: 'Lana All Season de Reda, medio canvas. 399 USD.',
      url: 'https://suitsupply.com/en-us/men/jackets/navy-tailored-fit-havana-blazer/C25216.html',
      f: [['Puesto', [SS_M + 'Jackets/default/Winter/C25216_101.jpg']], ['Puesto', [SS_M + 'Jackets/default/Winter/C25216_103.jpg']],
          ['La prenda', [SS + 'b_rgb:efefef,bo_300px_solid_rgb:efefef,c_pad,w_2600/b_rgb:efefef,c_pad,dpr_1,w_850,h_1530,f_auto,q_auto,fl_progressive/products/Jackets/default/Winter/C25216_1.jpg']],
          ['Tela', [SS_M + 'Jackets/default/C25216_23.jpg']]],
      pins: [['Cambiar botones a dorados', pin('navy blazer brass buttons replaced')]] },
    { t: 'Blazer cruzado', sw: ['#1f2a44'],
      why: 'El de Chuck Bass y Harvey: cruzado de seis botones. Más formal y con mucha presencia, para cenas y eventos.',
      ref: 'Suitsupply · Navy Tailored Fit Havana Blazer cruzado, ref. C25214', det: '95 % lana y 5 % cachemira de E. Thomas. 579 USD. En cachemira pura, el BBL10038N01: 799 USD.',
      url: 'https://suitsupply.com/en-us/men/jackets/navy-tailored-fit-havana-blazer/C25214.html',
      f: [['Puesto', [SS_M + 'Jackets/default/Winter/C25214_101.jpg']], ['Puesto', [SS_M + 'Jackets/default/Winter/C25214_103.jpg']],
          ['Cachemira', [SS_M + 'Jackets/default/Winter/BBL10038N01_101.jpg']]],
      pins: [['Chuck Bass cruzado', pin('chuck bass double breasted blazer')], ['Cruzado navy con botones dorados', pin('navy double breasted blazer gold buttons')]] },
  ];

  // Dressier shoes from his two brands, plus one with a rubber sole for the rain.
  const ZAPATOS = [
    { t: 'Oxford café patinado', sw: ['#6b4328'],
      why: 'El zapato más elegante que hay: cordones cerrados. Para los trajes y las reuniones serias. El café patinado va con el gris y con el azul.',
      ref: 'Christian Louboutin · Greggo Oxford, café', det: 'Becerro patinado, suela de cuero roja. 960 £ (unos 1.285 USD).',
      url: 'https://www.harrods.com/en-gb/p/christian-louboutin-greggo-oxford-shoes-000000000006816201',
      alt: 'También en negro (Greggo o Greghost), el de los eventos de noche.',
      f: [['La pieza', [HR('16fc3480e607778f7ed1cd085bcae79e')]], ['De lado', [HR('2c059f72f189b298149925ac9ff9e583')]], ['Detalle', [HR('44ca5a481507404196332110dad7b193')]]],
      pins: [['Oxford café con traje gris', pin('brown oxford shoes charcoal suit')]] },
    { t: 'Doble hebilla (monk)', sw: ['#111111', '#4a2f1e'],
      why: 'El zapato de Harvey Specter: elegante pero con carácter. El negro va con tu traje gris carbón; el café, con el blazer.',
      ref: 'Christian Louboutin · Chambelimonk, becerro negro', det: 'Doble hebilla, suela de cuero roja. 1.120 £ (unos 1.500 USD). El Sartok café: 1.220 £ (unos 1.630 USD).',
      url: 'https://www.harrods.com/en-gb/p/christian-louboutin-chambelimonk-calfskin-monk-shoes-000000000007707291',
      f: [['Negro', [HR('fb314715e22bf7c157d907a9a5eb70a1')]], ['De lado', [HR('bdfa3f0fbea0d6cb10a79c6c988f93c4')]],
          ['Sartok café', [HR('0c5b8bcab8fd430f0a92305c8310e716')]], ['Sartok de lado', [HR('40e20be97d7d1e51a286815f1a0325fd')]]],
      pins: [['Harvey con monk', pin('harvey specter double monk strap shoes')]] },
    { t: 'Mocasín con suela de goma', sw: ['#5a3b22'],
      why: 'El de tus marcas que aguanta el agua: suela de goma flexible, cuero café y el pasador plateado del Chambelimoc. Para lluvia ligera y el día a día; para aguacero, el Crockett & Jones del Tier 1 sigue siendo mejor.',
      ref: 'Christian Louboutin · Chambeliboat, becerro café', det: 'Suela de goma con el logo rojo grabado. Ref. 3250662BWI3. 4.750 AED (unos 1.295 USD).',
      url: 'https://www.levelshoes.com/christian-louboutin-chambeliboat-loafers-brown-calf-leather-men-loafers-ziubpo.html',
      f: [['La pieza', [`https://assets.levelshoes.com/cdn-cgi/image/width=720,height=1008,quality=85,format=webp/media/catalog/product/3/2/3250662bwi3_1.jpg?ts=20251027101225`]],
          ['De lado', [`https://assets.levelshoes.com/cdn-cgi/image/width=720,height=1008,quality=85,format=webp/media/catalog/product/3/2/3250662bwi3_5.jpg?ts=20251027101225`]],
          ['Suela', [`https://assets.levelshoes.com/cdn-cgi/image/width=720,height=1008,quality=85,format=webp/media/catalog/product/3/2/3250662bwi3_7.jpg?ts=20251027101225`]]],
      pins: [['Mocasín café con chinos', pin('brown loafers chinos rain')]] },
    { t: 'Belgian Henri, el más elegante de Belgian', sw: ['#7a4e2d', '#111111'],
      why: 'Más alargado que el Mr. Casual, con un tacón pequeño. Sirve con pantalón de vestir y blazer, no solo de fin de semana.',
      ref: 'Belgian Shoes · Henri, All Calf', det: 'Becerro en negro, café oscuro o café medio, con moño o borla. 800 USD. Solo se compra por teléfono o en su tienda de Nueva York.',
      url: 'https://belgianshoes.com/shop/all-calf-5/',
      alt: 'Henri Evening en charol negro (800 USD) para el esmoquin. El Traveler (775 USD) tiene suela más gruesa para caminar, pero tampoco es para lluvia.',
      f: [['Café', BSH('HEN_MedBrn_Blk_3005')], ['Charol, de noche', BSH('HEN_BlkPtn_Blk_2926')], ['Trenzado', BSH('HEN_MedBrnTres_Brn_3012')]],
      pins: [['Belgian Shoes con traje', pin('belgian shoes loafers suit')]] },
  ];

  // Valet stands ("galán de noche"): Ralph Lauren Home, vintage and design pieces.
  const RLH = id => `https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-${id}_lifestyle?$rl_4x5_zoom$`;
  const D1 = 'https://a.1stdibscdn.com/';
  const VALET = [
    { t: 'Ralph Lauren Brennan', sw: ['#4a2f1e', '#c9a24a'],
      why: 'El de Ralph Lauren Home: cuero y bronce macizo, delgado y alto. Para el saco, el pantalón y la corbata del día siguiente.',
      ref: 'Ralph Lauren Home · Brennan Valet', det: 'Cuero, herrajes de bronce macizo. 108 cm de alto, 37 de ancho y 13 de fondo. 2.595 USD.',
      url: 'https://www.ralphlauren.com/home-furniture-dressers/brennan-valet/505613.html',
      f: [['La pieza', [RLH('1348224')]]],
      pins: [['Valet de cuero', pin('leather valet stand dressing room')]] },
    { t: 'Ralph Lauren Colton', sw: ['#c9c9c9', '#3a2a1c'],
      why: 'En forma de caballete, de níquel pulido y cuero. Trae bandeja para el reloj y las llaves, y una cajita de viaje para las mancuernas.',
      ref: 'Ralph Lauren Home · Colton Valet', det: 'Níquel pulido, gancho y barra forrados en cuero. 99 cm de alto. 2.595 USD.',
      url: 'https://www.ralphlauren.com/home-furniture-dressers/colton-valet/161314.html',
      f: [['La pieza', [RLH('1031785')]]],
      pins: [['Galán de noche elegante', pin('valet stand suit bedroom luxury')]] },
    { t: 'Inglés antiguo de roble', sw: ['#8a6a3e'],
      why: 'El más ivy de todos: victoriano, de hacia 1850, con cajón, barra curva para el pantalón y bandeja para las monedas. Una pieza con historia.',
      ref: 'Gentleman\'s valet victoriano, roble inglés', det: '140 cm de alto. En 1stDibs, sin precio publicado: los de este tipo van de unos 625 a 3.085 USD.',
      url: 'https://www.1stdibs.com/furniture/more-furniture-collectibles/bedroom-furniture/night-stands/antique-gentlemens-valet-clothes-stand-english-victorian-oak-fine-quality/id-f_7839923/',
      f: [['La pieza', [D1 + 'archivesE/upload/1121189/f_78399231498482146417/7839923_master.jpg']],
          ['Detalle', [D1 + 'archivesE/upload/f_26453/f_78399231498332689540/3377_9_master.jpg']],
          ['Detalle', [D1 + 'archivesE/upload/f_26453/f_78399231498332715824/3377_8_master.jpg']]],
      pins: [['Valet antiguo', pin('antique english gentleman valet stand oak')]] },
    { t: 'Italiano de los sesenta', sw: ['#c49a6c', '#c9a24a'],
      why: 'De Fratelli Reguitti, en haya, con ganchos de bronce para las corbatas, bandeja y ruedas. Muy de época, tipo Mad Men.',
      ref: 'Fratelli Reguitti · valet de los años sesenta', det: 'Haya con acabado original, 110 cm de alto, se desarma para transportarlo. En 1stDibs, precio a consultar.',
      url: 'https://www.1stdibs.com/furniture/more-furniture-collectibles/racks-stands/coat-racks-stands/italian-mid-century-modern-clothes-valet-fratelli-reguitti-c1960s/id-f_28671442/',
      f: [['La pieza', [D1 + 'italian-mid-century-modern-clothes-valet-by-fratelli-reguitti-c1960s-for-sale/f_8202/f_286714421652664343592/f_28671442_1652664344758_bg_processed.jpg']],
          ['Detalle', [D1 + 'italian-mid-century-modern-clothes-valet-by-fratelli-reguitti-c1960s-for-sale-picture-4/f_8202/f_286714421652664501206/IMG_6962_2_master.JPG']]],
      pins: [['Valet de los sesenta', pin('mid century valet stand reguitti')]] },
    { t: 'La silla valet de Wegner', sw: ['#d8c3a0', '#3a2a1c'],
      why: 'El valet más famoso del mundo, de 1953: el espaldar es el gancho del saco y el asiento se levanta para guardar cosas. El rey Federico IX de Dinamarca encargó diez.',
      ref: 'Hans J. Wegner para PP Møbler · PP250 Valet Chair', det: 'Madera maciza (roble, cerezo o arce) con detalles de wengué y bisagras de bronce. Hecha a pedido. Unos 12.025 USD.',
      url: 'https://danishdesignstore.com/products/wegner-pp250-valet-chair-pp-mobler',
      f: [['La pieza', ['https://www.danishdesignstore.com/cdn/shop/files/pp250_maple_soap_wenge_bg_black_ahb-1.jpg?v=1788278593&width=1200']],
          ['En casa', ['https://www.danishdesignstore.com/cdn/shop/files/pp250_2024_carlsberg_byen_lifestyle_valet_chair_clr_arr-1.jpg?v=1788278593&width=1200']],
          ['Abierta', ['https://www.danishdesignstore.com/cdn/shop/files/pp250_maple_soap_wenge_bg_black_ahb-2.jpg?v=1788278593&width=1200']]],
      pins: [['Wegner valet chair', pin('wegner valet chair pp250')]] },
    { t: 'Hermès, solo para soñar', sw: ['#6b4328', '#e07a2e'],
      why: 'El "groom" de Hermès: nogal Canaletto, espejo giratorio y cuero taurillon. No es para comprar, es para saber hasta dónde llega esto.',
      ref: 'Les Nécessaires d\'Hermès · Groom valet stand, de Philippe Nigro', det: 'Nogal, acero y cuero, 192 cm de alto. Hecho en Francia, a pedido. 92.300 USD.',
      url: 'https://www.hermes.com/us/en/product/les-necessaires-d-hermes-groom-valet-stand-H960139Mv01/',
      f: [['La pieza', ['https://assets.hermes.com/is/image/hermesproduct/960139M%2001_front_wm_102?$product_default_bg$']],
          ['Detalle', ['https://assets.hermes.com/is/image/hermesproduct/960139M%2001_front_wm_109?$product_default_bg$']]],
      pins: [] },
  ];

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const card = (b, i, list) => { const n = list.filter(x => !x.tengo).indexOf(b); return `
    <article class="buy${b.tengo ? ' tengo' : ''}">
      ${b.f.length ? `<div class="buy-strip">${b.f.map(([cap, src]) => `<figure><img loading="lazy" referrerpolicy="no-referrer" alt="${esc(b.t + ', ' + cap.toLowerCase())}" data-src="${esc(JSON.stringify(src))}"><figcaption>${esc(cap)}</figcaption></figure>`).join('')}
        <p class="buy-nofoto" hidden>Las fotos no cargaron aquí. <a href="${esc(b.url)}" target="_blank" rel="noopener">Míralas en la tienda ↗</a></p></div>` : ''}
      <div class="buy-body">
        <div class="buy-head"><span class="buy-n">${b.tengo ? '✓ Ya lo tienes' : String(n + 1).padStart(2, '0')}</span>${b.sw.map(c => `<i style="background:${c}"></i>`).join('')}</div>
        <h3>${esc(b.t)}</h3>
        ${b.tengo ? `<p class="buy-tengo"><b>Ya lo tienes:</b> ${esc(b.tengo)}</p>` : ''}
        <p class="buy-why">${esc(b.why)}</p>
        <p class="buy-ref"><b>${esc(b.ref)}</b> ${esc(b.det)} <a href="${esc(b.url)}" target="_blank" rel="noopener">${/pinterest/.test(b.url) ? 'Ver ejemplos' : /gentlemansgazette|bespokeunit/.test(b.url) ? 'Leer más' : 'Ver en la tienda'} ↗</a></p>
        ${b.alt ? `<p class="buy-alt"><b>Otra opción:</b> ${esc(b.alt)}</p>` : ''}
        ${b.pins.length ? `<p class="buy-pins">Más ejemplos: ${b.pins.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ↗</a>`).join(' · ')}</p>` : ''}
      </div>
    </article>`; };

  const TIERS = [
    ['tier1', 'Tier 1 · Lo que falta', 'Lo primero, en orden de prioridad, revisado el 27 de octubre con todo lo nuevo. Al final, lo que ya tienes.', BUYS],
    ['blazer', 'El blazer azul', 'Cómo se ve un blazer de verdad: botones dorados o de cuerno, tela con textura y un azul distinto al del pantalón. La chaqueta de traje, en cambio, es lisa y con botones oscuros. Lleva estas fotos a Carlos Nieto.', BLAZER],
    ['zapatos', 'Zapatos de tus marcas', 'Más elegantes, de Christian Louboutin y Belgian Shoes, y uno de Louboutin con suela de goma para la lluvia.', ZAPATOS],
    ['tier2', 'Tier 2 · Lo siguiente', 'Para redondear: más color, tierra caliente y viajes.', TIER2],
    ['tier3', 'Tier 3 · Antojos', 'Todo lo que se me ocurre, de lo grande a lo pequeño. Para anotarse.', TIER3],
    ['lujo', 'Tier 3 · Bolsos', 'Bolsos de Bottega Veneta, Loewe, Louis Vuitton y Hermès, como referencia. Empieza por el tote de oficina.', LUJO],
    ['gafas', 'Tier 3 · Gafas de sol', 'Elegidas para tu cara. Por tu foto: cara redondeada, mejillas llenas, mandíbula suave con barba y cejas oscuras y marcadas. Te van las monturas con ángulos (cuadradas, rectangulares o en D), con la ceja recta y del ancho de tu cara o un poco más; en carey, havana o metal. Evita las redondas pequeñas y las angostas.', GAFAS],
    ['marinella', 'Accesorios · E. Marinella', 'Corbatas, corbatines y pañuelos de E. Marinella, la casa de Nápoles que las hace a mano desde 1914. Ya tienes de Carlos Nieto la corbata azul de raquetas (K01), la café de foulard (K02) y el pañuelo amarillo (K03): esto es lo que les falta. Empieza por la de florecitas y la grenadine.', MARINELLA],
    ['valet', 'Valet stand · el galán de noche', 'Para dejar listo el saco, el pantalón y la corbata del día siguiente, y vaciar los bolsillos en la bandeja. Ralph Lauren Home tiene dos; los vintage de 1stDibs son los más ivy. Otra idea: con estas fotos, un ebanista de Medellín te hace uno en nogal o cedro por mucho menos.', VALET],
  ];

  const sec = document.createElement('section');
  sec.id = 'compras';
  sec.innerHTML = `<div class="wrap">
    <div class="sec-head">
      <div class="label">De la investigación de estilo</div>
      <h2>Qué comprar</h2>
      <p>Tres niveles: lo que te falta, lo siguiente y los antojos. Cada uno con el modelo exacto y fotos de la tienda, la prenda sola y puesta. Desliza las fotos y toca una para verla grande. Precios en dólares, revisados el 26 de octubre de 2026; los que estaban en otra moneda los pasé con la tasa de ese día ("unos").</p>
    </div>
    <nav class="tiers">${TIERS.map(([k, n]) => `<a href="#${k}">${n}</a>`).join('')}</nav>
    ${TIERS.map(([k, n, d, list]) => `<div class="tier" id="${k}"><h3 class="tier-h">${n}</h3><p class="tier-d">${d}</p><div class="buys">${list.filter(b => !b.tengo).concat(list.filter(b => b.tengo)).map((b, i, l) => card(b, i, l)).join('')}</div></div>`).join('')}
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
