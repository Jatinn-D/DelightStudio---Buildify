/* ============================================================
   Product photography — one matching photo per product.

   Every product points at a photo that shows the same kind of garment as its
   name (a saree for a saree, jeans for jeans, …). The card hover and the
   gallery's extra views are close-up crops of that SAME photo, so all three
   views always show one garment.

   Photos are free stock from Unsplash (Unsplash License — free for commercial
   use, no attribution required) and are served straight from Unsplash's image
   CDN, resized per screen by lib/imageLoader.ts. They are placeholders until the
   client sends real product photos: to swap one, replace its `photo` id below
   (or point the product at a file in /public/images).

   `color` is set where the original generated colour didn't match the photo,
   so the "Colour:" line and the description agree with what the shopper sees.
   This file lives apart from the generated lib/catalog.data.ts, so
   re-running scripts/gen_catalog.py keeps these choices.
   ============================================================ */

export type ProductPhoto = { photo: string; color?: string };

const CDN = "https://images.unsplash.com/";

/** Portrait product shot, cropped to the 4:5 card shape and kept on the face. */
export function shot(photo: string): string {
  return `${CDN}${photo}?fit=crop&ar=4:5&crop=faces,center`;
}

/** A zoomed crop of the same photo — used for hover and gallery close-ups. */
export function closeUp(photo: string, zoom: number, y: number): string {
  return `${CDN}${photo}?fit=crop&ar=4:5&crop=focalpoint&fp-x=0.5&fp-y=${y}&fp-z=${zoom}`;
}

/** Wide banner crop (category hero sliders). */
export function banner(photo: string): string {
  return `${CDN}${photo}?fit=crop&ar=16:7&crop=faces,center`;
}

/** Square-ish tile crop for the "Shop by Category" bento. */
export function tile(photo: string): string {
  return `${CDN}${photo}?fit=crop&ar=4:5&crop=faces,center`;
}

export const PRODUCT_PHOTOS: Record<string, ProductPhoto> = {
  /* ---------- Sarees ---------- */
  "kalamkari-saree": { photo: "photo-1610189338344-f3ce0d0f6d06", color: "Brown" },
  "satin-saree": { photo: "photo-1678705730064-a7ecbab4b3fb" },
  "fancy-saree": { photo: "photo-1610030468706-9a6dbad49b0a", color: "Rust" },
  "fancy-saree-2": { photo: "photo-1679006831648-7c9ea12e5807", color: "Mint" },
  "soft-tissue-cotton-saree": { photo: "photo-1730144615465-adedba32ae37" },
  "tissue-saree": { photo: "photo-1609748341932-f0206c09412b" },
  "mirror-saree": { photo: "photo-1610030469245-ab65c4583802" },
  "kalamkari-saree-2": { photo: "photo-1742287724816-4a8a1cc7ad5c" },
  "fancy-saree-3": { photo: "photo-1739429945610-95901c2baf18" },
  "tissue-saree-2": { photo: "photo-1786300111465-1010320e2bea", color: "Ivory" },
  "fancy-saree-4": { photo: "photo-1671741730777-3cb7459a34b3" },
  "plain-khadi-saree": { photo: "photo-1609748513078-9ff6232781c5" },
  "khadi-saree": { photo: "photo-1705164456205-69d775ce1482" },
  "maheshwari-cotton-saree": { photo: "photo-1654764745340-5a650058b945" },
  "flower-saree": { photo: "photo-1617627143750-d86bc21e42bb" },
  "putta-saree": { photo: "photo-1610030469839-f909584b43f1" },
  "leaf-saree": { photo: "photo-1610189338175-0782dfdb0c04" },
  "khadi-putta-saree": { photo: "photo-1610189013429-a703f4b245cf" },
  "star-khadi-saree": { photo: "photo-1726076584498-2064363f8b5a" },
  "strips-saree": { photo: "photo-1790867519581-16dd8c72b4c9" },
  "rainbow-khadi-saree": { photo: "photo-1723922694741-d4faf396bab1" },
  "kesari-digital-saree": { photo: "photo-1727430228383-aa1fb59db8bf", color: "Saffron" },
  "kesari-digital-saree-2": { photo: "photo-1610313416458-8e435d6f7ed2", color: "Coral" },
  "shilp-kala-saree": { photo: "photo-1610030469069-cb6620bea733" },
  "verna-saree": { photo: "photo-1792659804098-151fa815826a" },
  "comet-plus-saree": { photo: "photo-1615573678157-69c7fce87d54" },
  "digital-print-saree": { photo: "photo-1609748340878-c690e3e4706b" },
  "tissue-silk-saree": { photo: "photo-1771654804991-652efe658f98" },
  "silk-cotton-saree": { photo: "photo-1614881064213-180b1c28f743" },
  "soft-silk-saree": { photo: "photo-1609748341642-ae4c6562bf3d", color: "Mustard" },
  "poly-silk-saree": { photo: "photo-1769275061202-cf3ef67d7279", color: "Multicolour" },
  "pochampally-saree": { photo: "photo-1610030469825-fe474466db75", color: "Grey" },
  "chiffon-saree": { photo: "photo-1791138690817-90873bcf4e80" },
  "poonam-saree": { photo: "photo-1609748340756-aeb8223d6c64" },
  "tussar-silk-saree": { photo: "photo-1771654805161-442c6aab7b55" },
  "poly-silk-blend-saree": { photo: "photo-1727016167230-7a79c930dcac" },
  "pink-lotus-saree": { photo: "photo-1775486101687-1950422dbca7" },
  "linen-cotton-saree": { photo: "photo-1612273882937-44c5313400e5", color: "Olive" },
  "multi-kashmir-saree": { photo: "photo-1619516388835-2b60acc4049e", color: "Red" },
  "tissue-border-saree": { photo: "photo-1775486101623-3eb0f11d1e37" },
  "sequin-full-saree": { photo: "photo-1778882482268-048b110b2d13", color: "Teal" },
  "crush-embroidery-saree": { photo: "photo-1761125135351-268e72e39158" },
  "organza-white-saree": { photo: "photo-1742676971890-0c84ce098fac" },
  "saree-online": { photo: "photo-1641699862936-be9f49b1c38d", color: "Purple" },
  "kala-handwork-saree": { photo: "photo-1761125135253-d7a7510a236f" },
  "georgette-self-saree": { photo: "photo-1618489335755-e3aa2b16cd7a", color: "Rust" },
  "moti-work-saree": { photo: "photo-1729101143846-abdb47b40704" },
  "black-sequin-saree": { photo: "photo-1710967357857-e2e567494c28" },
  "slim-jarkan-border-saree": { photo: "photo-1769500801406-d5abac0429c3" },
  "ajrakh-print-saree": { photo: "photo-1752847048197-1f99b1ea1936", color: "Black" },
  "linen-plain-saree": { photo: "photo-1769165404742-2f46bd9c9e8d", color: "Olive" },
  "linen-grosia-saree": { photo: "photo-1609748340041-f5d61e061ebc" },
  "cotton-saree": { photo: "photo-1770838447142-fe777b6869d6", color: "Green" },
  "kala-malmal-saree": { photo: "photo-1610189026297-df356264479c", color: "Purple" },
  "jute-kathawork-saree": { photo: "photo-1732850195161-79e6d6b921e8", color: "Red" },
  "satin-jarkan-saree": { photo: "photo-1756483509177-bbabd67a3234", color: "Emerald" },
  "gopi-saree": { photo: "photo-1681717075175-19feb7a6f664" },
  "tasar-silk-saree": { photo: "photo-1654764745335-638bacd58765" },
  "cutwork-embroidery-saree": { photo: "photo-1791975136255-1af7267828bb" },
  "white-embroidery-saree": { photo: "photo-1787753650893-1324e0f6ac91" },
  "multithread-saree": { photo: "photo-1733737201354-91847ffbb736", color: "Wine" },
  "rainbow-saree": { photo: "photo-1692992193981-d3d92fabd9cb", color: "Multicolour" },
  "gold-apply-saree": { photo: "photo-1732850195110-eeea3f216a65", color: "Red" },
  "kubara-pattu": { photo: "photo-1729101143873-d80050bae219" },
  "garlic-weaving-saree": { photo: "photo-1732709470611-670308da8c5e" },
  "deepam-silk-stone-aari-saree": { photo: "photo-1756483496916-5ebab85028df" },
  "fancy-saree-5": { photo: "photo-1680711552692-76a8bd810398" },
  "sandhya-digital-saree": { photo: "photo-1742287721821-ddf522b3f37b", color: "Multicolour" },
  "new-tara-saree": { photo: "photo-1732381915285-953ce9832512" },
  "mul-mul-saree": { photo: "photo-1771507057886-defc3e54aa8c", color: "Rust" },
  "oscar-crush-saree": { photo: "photo-1775486101691-709191f1228e" },
  "rust-orange-saree": { photo: "photo-1614940685083-c5409b57da6e" },
  "pallaku-saree": { photo: "photo-1752469113412-cb988552e387", color: "Multicolour" },
  "pallaku-koravai-saree": { photo: "photo-1710972198977-9cf145f8b03f" },
  "fancy-cotton-saree": { photo: "photo-1770838447151-05a876cdee3d", color: "Emerald" },
  "pipinb-saree": { photo: "photo-1609748341859-b75967ead013", color: "Mustard" },
  "mayil-saree": { photo: "photo-1762708592720-92912d5825e2" },
  "mexico-saree": { photo: "photo-1732381917604-bc8f046965ee" },
  "garlic-print-saree": { photo: "photo-1769275061088-85697a30ee50", color: "Multicolour" },
  "fancy-meena-saree": { photo: "photo-1607647735186-f3c200aa175a", color: "Sand" },
  "kodi-putta-saree": { photo: "photo-1610030469668-8e9f641aaf27" },
  "all-self-saree": { photo: "photo-1786300114351-c0c73bb6fe85" },
  "handloom-peding-saree": { photo: "photo-1771654104661-ab6f3581b5af" },
  "blackberry-saree": { photo: "photo-1729101146143-2cc6d7c815be" },
  "black-beauty-saree": { photo: "photo-1729101146089-b4e982f883ef" },
  "rashmi-saree": { photo: "photo-1677002419193-9a74069587af", color: "Red" },
  "sindhoor-saree": { photo: "photo-1787484615740-de8a716202fd", color: "Red" },
  "new-kerala-saree": { photo: "photo-1670955108982-921a94cbe35f", color: "Ivory" },
  "kerala-plain-saree": { photo: "photo-1670955093492-75c0ea93a601", color: "Ivory" },
  "kerala-checked-saree": { photo: "photo-1774437777875-119f3eddb725", color: "Ivory" },
  "fancy-saree-6": { photo: "photo-1776005395798-9fc7c1c50e95", color: "Indigo" },
  "fancy-cotton-saree-2": { photo: "photo-1708182564325-fb1d3a3864d3", color: "Emerald" },

  /* ---------- Western ---------- */
  "designer-top": { photo: "photo-1764337593519-c51a77b4fc3d", color: "Multicolour" },
  "classic-white-top": { photo: "photo-1785273751508-ec5ab6b61270" },
  "classic-white-top-2": { photo: "photo-1627159713691-ca8da0da24a7" },
  "essential-top-iii": { photo: "photo-1771201408101-43c5883d2344", color: "Purple" },
  "essential-top-ii": { photo: "photo-1704775983224-43dae05da876" },
  "essential-top-i": { photo: "photo-1600075113742-7548019e70ff", color: "Red" },
  "essential-top": { photo: "photo-1649140336105-a4452db77649", color: "Green" },
  "white-shorts": { photo: "photo-1789110853613-4ace8d4041e3" },
  "grey-inner-top": { photo: "photo-1779400203501-f10cac71f44e" },
  "woolen-2-top": { photo: "photo-1580331451062-99ff652288d7", color: "Green" },
  "woolen-1-top": { photo: "photo-1617012803658-a9a7cfb35f4f", color: "Rust" },
  "ruffle-top": { photo: "photo-1789110854285-8e8a56b05fc9", color: "White" },
  "shirt-top": { photo: "photo-1609794560024-2880166ee97b" },
  "crop-top-2": { photo: "photo-1673925205809-601b5a22eb61", color: "White" },
  "crop-top-1": { photo: "photo-1789110521285-0ad90c7fe2e9", color: "Sand" },
  "two-piece-top-set": { photo: "photo-1763818104121-7d63caa456f1", color: "Multicolour" },
  "stone-work-top": { photo: "photo-1790863243125-eb5b002eda98", color: "White" },
  "puff-shirt": { photo: "photo-1785392052522-7ef8187ff3d0" },
  "embroidery-top": { photo: "photo-1756483510802-0acac24ab4e8" },
  "embroidery-shirt": { photo: "photo-1790475191234-a03652e4c975", color: "Black" },
  "peplum-top": { photo: "photo-1791014719368-3b7e295cb0aa" },
  "puff-sleeve-top": { photo: "photo-1597688778022-5fa2c392b629", color: "White" },
  "sleeveless-top": { photo: "photo-1789110853603-11504d948dde", color: "Black" },
  "kaftan-top": { photo: "photo-1753192108606-b4a2bc9e5661", color: "Blue" },
  "tunic-top": { photo: "photo-1790601118775-41de130c5f95", color: "Red" },
  "lays-top": { photo: "photo-1779153996913-fc2565ed7e14", color: "White" },
  "henley-top": { photo: "photo-1787706370375-6ffc12311688", color: "Grey" },
  "short-kurti-2": { photo: "photo-1768289222318-fd35f29a8403", color: "Indigo" },
  "short-kurti": { photo: "photo-1768033976288-9300f5d6f296" },
  "women-s-trousers": { photo: "photo-1789110519554-bdca2e4549e5", color: "Black" },
  "blue-long-dress": { photo: "photo-1596703343725-7ca01bda9a45" },
  "printed-white-dress": { photo: "photo-1629200468267-b926a7675ce2" },
  "brown-long-dress": { photo: "photo-1704775990154-b87562565d4c" },
  "violet-embroidery-dress": { photo: "photo-1789110519410-a56a80130016" },
  "white-green-dress": { photo: "photo-1597983073750-16f5ded1321f", color: "Green" },
  "maxi-dress": { photo: "photo-1789110854664-85d0c8cb6573", color: "Multicolour" },
  "embroidery-pink-dress": { photo: "photo-1773394170852-367da194ae24" },
  "green-floral-pant": { photo: "photo-1789110854083-ae8c8ad4086f" },
  "white-long-dress": { photo: "photo-1617019114583-affb34d1b3cd" },
  "green-long-dress": { photo: "photo-1685703203919-0c2cfc893c60" },
  "white-dress": { photo: "photo-1583346292527-522309cc9be3" },
  "white-long-gown": { photo: "photo-1601571103926-ed7860bb5e2c" },
  "blue-midi-dress": { photo: "photo-1762342693452-c407e877cafd" },
  "olive-green-long-dress": { photo: "photo-1785927926283-f0a6093a52b6" },
  "mustard-long-dress": { photo: "flagged/photo-1576572093163-83b5ad089423" },
  "classic-shirt": { photo: "photo-1732708885287-882e2d3bd1d8", color: "Pink" },

  /* ---------- Kurti ---------- */
  "fancy-embroidered-kurti": { photo: "photo-1759840278276-fe8d58873dc3", color: "Red" },
  "signature-straight-kurti": { photo: "photo-1769063382706-8156b3b33eac", color: "Multicolour" },
  "fancy-georgette-kurti": { photo: "photo-1763559046515-1b98e82bc6d4" },
  "avelen-cotton-kurti": { photo: "photo-1766994063823-ed214f883548", color: "Indigo" },
  "ruffle-a-line-kurti": { photo: "photo-1754391851702-e5275cf80e34", color: "Ivory" },
  "avaasa-vatican-printed-kurti": { photo: "photo-1741847639057-b51a25d42892" },
  "satin-straight-kurti": { photo: "photo-1760287363699-a08d553fb8a9", color: "Purple" },
  "avaasa-everyday-kurti": { photo: "photo-1762777777819-4d9aa5529368" },
  "avaasha-straight-kurti": { photo: "photo-1760287364219-160c234ded00", color: "Indigo" },

  /* ---------- Innerwear (product-style shots) ---------- */
  "gloria-plain-camisole": { photo: "photo-1614245756970-791579ec966b", color: "White" },
  "love-one-printed-camisole-3-pc": { photo: "photo-1584061516874-ed56f46d8e13", color: "Black" },
  "sports-bra": { photo: "photo-1606902965551-dce093cda6e7", color: "Pink" },
  "liya-everyday-bra": { photo: "photo-1587631550085-2d4bed859ea9", color: "White" },
  "rekha-slip-white": { photo: "photo-1791343332157-f067f51e02c0" },
  "rekha-slip-skin": { photo: "photo-1780301662392-6fea210dcd87" },
  "rekha-slip-black": { photo: "photo-1547587091-d639c1c338b3" },

  /* ---------- Pants & jeans ---------- */
  "kurta-pants": { photo: "photo-1789110854331-6d3cabfef781" },
  "baggy-jeans": { photo: "photo-1761637461022-ac8617bc8993", color: "Blue" },
  "dark-indigo-jeans": { photo: "photo-1607016246338-789653d9cc55" },
  "ivory-jeans": { photo: "photo-1620147411482-6025c0a115f9" },
  "denim-blue-jeans-ii": { photo: "photo-1584370848010-d7fe6bc767ec" },
  "denim-blue-jeans": { photo: "photo-1475178626620-a4d074967452" },
  "black-jeans-ii": { photo: "photo-1673839869872-d8715706f9de" },
  "black-jeans": { photo: "photo-1780566758212-d401fdeffbfe" },
  "white-straight-jeans-ii": { photo: "photo-1787706370376-803d5d7b7365" },
  "white-straight-jeans": { photo: "photo-1790200427008-937ac329d9cb" },
  "blue-baggy-jeans-ii": { photo: "photo-1763192603278-e96c8522533a" },
  "blue-baggy-jeans": { photo: "photo-1608370946545-7d93571b5593" },
  "jeans-ash-brown-ii": { photo: "photo-1789110520148-bb52ba37759b" },
  "jeans-ash-brown": { photo: "photo-1789110853738-8dcafd403aa4" },
  "cotton-casual-pants": { photo: "photo-1789110520410-4fce7246f844" },
  "palazzo-pants": { photo: "photo-1789110853687-71692f0e86be" },

  /* ---------- Anarkali ---------- */
  "fancy-flared-anarkali": { photo: "photo-1668371679302-a8ec781e876e", color: "Red" },
  "ivory-georgette-anarkali": { photo: "photo-1756483510900-ec43edbafb45" },
  "regal-embroidered-anarkali": { photo: "photo-1756483509162-b92ea967a884" },
  "avelen-anarkali-set": { photo: "photo-1767955694884-d4bf352c23c2" },
  "ivory-embroidered-anarkali": { photo: "photo-1610047592780-aa246f5635c2" },
  "fancy-chiffon-anarkali-ii": { photo: "photo-1732511405785-73ad31e59096" },
  "festive-flared-anarkali-ii": { photo: "photo-1756483502814-fd570db8d4c7", color: "Green" },
  "festive-flared-anarkali": { photo: "photo-1571908599538-7e1e6e92b064", color: "Gold" },
  "fancy-chiffon-anarkali": { photo: "photo-1610202305255-746aa5b971c4" },
  "ink-cotton-anarkali": { photo: "photo-1756483510820-4b9302a27556", color: "Indigo" },

  /* ---------- Ethnic sets ---------- */
  "handloom-ethnic-suit": { photo: "photo-1790499401365-24d8268efe7f", color: "Pink" },
  "serene-ethnic-kurta-set": { photo: "photo-1768478701607-db8c96dbb87f", color: "Multicolour" },
  "ivory-ethnic-suit": { photo: "photo-1752653425039-cf1ff22d61bc" },
  "heritage-ethnic-suit": { photo: "photo-1759840279499-f9de9764b2cf" },

  /* ---------- Piece sets ---------- */
  "ivory-3-piece-suit-set": { photo: "photo-1745313452052-0e4e341f326c" },
  "radiant-3-piece-suit-set": { photo: "photo-1776436817748-f8e10a7e75b0", color: "Pink" },
  "festive-3-piece-set": { photo: "photo-1765529374855-7353c3c47fc6" },
  "floral-3-piece-set": { photo: "photo-1765529375039-13dabeab0684", color: "Blue" },
  "avaasa-2-piece-co-ord-ii": { photo: "photo-1764845181515-de3b72a9be84" },
  "ivory-2-piece-set": { photo: "photo-1774005906344-57048d3f5856" },
  "avaasa-2-piece-co-ord": { photo: "photo-1763637896840-9f3cb4529d01" },
  "ivory-single-piece-kurta": { photo: "photo-1667665970124-2273c6ef3489" },
  "sunny-single-piece-kurta": { photo: "photo-1760287363878-1a09af715b80", color: "Mustard" },
  "heritage-single-piece-kurta": { photo: "photo-1743229995546-2922b49e7d1e" },
};

/* Category tiles, hero banners and slides — chosen to show each category. */
export const CATEGORY_PHOTOS = {
  sarees: "photo-1610030469983-98e550d6193c",
  kurtis: "photo-1741847639057-b51a25d42892",
  anarkalis: "photo-1756483509162-b92ea967a884",
  pieceSets: "photo-1769063382750-a025d7ad6d5f",
  ethnicSets: "photo-1759840279499-f9de9764b2cf",
  pants: "photo-1715758889624-36a0bfca4b68",
  tops: "photo-1785348056988-c4d7c2248248",
  western: "photo-1789110854664-85d0c8cb6573",
  shopAll: "photo-1490481651871-ab68de25d43d",
  innerwear: "photo-1568441556126-f36ae0900180",
} as const;

export const HERO_SLIDES: Record<string, string[]> = {
  new: ["photo-1756483502816-d7d3547980ad", "photo-1763818104121-7d63caa456f1", "photo-1789110854664-85d0c8cb6573"],
  sarees: ["photo-1610189026205-27510cfc52f8", "photo-1787295779612-b3182bea0a81", "photo-1775486102075-a9db33ac6cdf"],
  ethnicwear: ["photo-1769063382750-a025d7ad6d5f", "photo-1756483509254-3cc48a5a15b2", "photo-1759840278361-f1adc75529a1"],
  kurtis: ["photo-1741847639057-b51a25d42892", "photo-1759840278381-bf7d5e332050", "photo-1766994063823-ed214f883548"],
  anarkalis: ["photo-1756483509254-3cc48a5a15b2", "photo-1756483509162-b92ea967a884", "photo-1610048616025-11a3dcc9fd0b"],
  "ethnic-sets": ["photo-1759840279499-f9de9764b2cf", "photo-1752653425039-cf1ff22d61bc", "photo-1790499401365-24d8268efe7f"],
  "piece-sets": ["photo-1769063382750-a025d7ad6d5f", "photo-1745313452052-0e4e341f326c", "photo-1765529375039-13dabeab0684"],
  western: ["photo-1789110854664-85d0c8cb6573", "photo-1785348056988-c4d7c2248248", "photo-1785273751508-ec5ab6b61270"],
  tops: ["photo-1785273751508-ec5ab6b61270", "photo-1789110854285-8e8a56b05fc9", "photo-1596703343725-7ca01bda9a45"],
  pants: ["photo-1715758889624-36a0bfca4b68", "photo-1789110853738-8dcafd403aa4", "photo-1763192603278-e96c8522533a"],
  innerwear: ["photo-1568441556126-f36ae0900180", "photo-1666358062969-b78fd368689f", "photo-1614245756970-791579ec966b"],
};
