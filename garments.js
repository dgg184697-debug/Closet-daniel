// How each garment looks on the cartoon avatar: flat colours and simple patterns,
// picked by hand from the photos (the photos' warm light skews sampled colours).
// Daniel, from his photo: warm light-medium skin, dark brown wavy, medium-long hair combed back,
// light stubble beard and moustache, big smile, no glasses.
export const SKIN_DEFAULT = { skin: '#e2ab86', hair: '#2f1f15', brows: '#23160e', eyes: '#2e1d13', beard: '#2e1f15', glasses: false,
  hairStyle: 'wavyBack', smile: true, thickBrows: true };

export const STYLE = {
  // shirts: base colour, optional stripes, collar type
  C01: { base: '#b4cdea', stripe: '#3f68a8', collar: 'bd', pocket: true },
  C02: { base: '#e8eff8', collar: 'bd', pocket: true, weave: true },
  C03: { base: '#f3f4f6', stripe: '#7c8ca4', stripeW: 0.5, collar: 'point', pocket: true },
  C04: { base: '#5b7fc0', collar: 'point', knit: true },
  C05: { base: '#c3e6d2', collar: 'bd', pocket: true, weave: true },
  C06: { base: '#f0e7d3', stripe: '#8b8f96', collar: 'bd', pocket: true },
  C07: { base: '#bcd0ec', collar: 'spread' },
  C08: { base: '#f4cbd1', collar: 'spread' },
  // layers: kind decides neckline, sleeves and front details
  S01: { base: '#b88a57', kind: 'polo', buttons: '#e9dfcf', pockets: true },
  S02: { base: '#9b9ea4', kind: 'crew', fleece: true },
  S03: { base: '#d9c8aa', kind: 'halfzip', logo: '#5b4a33' },
  S04: { base: '#c7c9cc', kind: 'crew' },
  S05: { base: '#a4a6aa', kind: 'polo', buttons: '#2b2b2b', pockets: true, heather: true },
  S06: { base: '#283553', kind: 'crew', fleece: true, tape: '#c8102e' },
  S07: { base: '#232a3e', kind: 'crew', patch: true },
  S08: { base: '#4a4c51', kind: 'vest' },
  S09: { base: '#2f3a5c', kind: 'cardigan', buttons: '#e8e2d4', pockets: true, bear: true },
  S10: { base: '#273150', kind: 'zip', emboss: true },
  S11: { base: '#c28b52', kind: 'crew', rib: true },
  S12: { base: '#d0cec9', kind: 'crew', waffle: true },
  S13: { base: '#907b69', kind: 'crew' },
  // ties and pocket square
  K01: { base: '#263a78', dot: '#d9b24c', dotShape: 'racket' },
  K02: { base: '#5a3328', dot: '#f2efe6', dotShape: 'flower' },
  K03: { base: '#ecd24a', dot: '#1f2a4a' },
  // trousers
  P01: { base: '#7d8085' }, P02: { base: '#6f7277', heather: true }, P03: { base: '#67768d' },
  P04: { base: '#3f5588' }, P05: { base: '#1e2439' }, P06: { base: '#4c3b30', adjusters: true },
  P07: { base: '#20283b' }, P08: { base: '#46484d', sheen: true }, P09: { base: '#bbae9b' },
  // belts
  A01: { base: '#5b3927', buckle: 'rect' }, A02: { base: '#6c7889', buckle: 'oval', woven: true },
  A03: { base: '#161616', buckle: 'horseshoe' }, A03b: { base: '#3c2a20', buckle: 'horseshoe' },
  A04: { base: '#171717', buckle: 'rect' },
  // shoes
  Z01: { base: '#dccfb7', kind: 'loafer', trim: '#6b4a33' },
  Z02: { base: '#141414', kind: 'oxford' },
  Z03: { base: '#5b1f23', kind: 'oxford' },
  Z04: { base: '#8d7c6b', kind: 'chelsea', elastic: '#4a3626' },
  Z05: { base: '#6f87a9', kind: 'loafer', trim: '#1f2a4a' },
  Z06: { base: '#1f2638', kind: 'chelsea', elastic: '#141824' },
  Z07: { base: '#f4f4f1', kind: 'sneaker' },
};
