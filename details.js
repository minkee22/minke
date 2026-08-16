// ============================================================
// 프로젝트 상세 페이지 설정 — 여기만 수정하면 됩니다.
//
// [노트형] trashion : 스프링 노트 위에 사진 한 장씩
// [앨범형] model    : 앨범 속지 안에 사진 3~4장씩 + (a)(b)(c)(d) 포즈 설명
// ============================================================

const SEC_SKETCH1 = "DESIGN 1 — IDEA SKETCH";
const SEC_SKETCH2 = "DESIGN 2 — IDEA SKETCH";
const SEC_CLO1   = "CLO 3D / DESIGN 1 — DIGITAL GARMENT SIMULATION";
const SEC_CLO2   = "CLO 3D / DESIGN 2 — DIGITAL GARMENT SIMULATION";
const SEC_SHOOT1 = "DESIGN 1 — REALISTIC PHOTO SHOOT";
const SEC_SHOOT2 = "DESIGN 2 — REALISTIC PHOTO SHOOT";

// ── 앨범형 레이아웃 템플릿 ──────────────────────────────
// 좌표는 속지 안전영역 기준 %. w만 지정하면 높이는 사진 비율대로 자동.
// 페이지마다 다른 템플릿이 순서대로 적용됩니다.
// 좌하단은 포즈 설명(legend) 자리 — 어떤 슬롯도 x<48 & y>76 구역을 침범하지 않도록 배치됨
const ALBUM_LAYOUTS = [
  [ {x:1,  y:0,  w:38}, {x:53, y:14, w:34}, {x:20, y:46, w:27}, {x:56, y:52, w:30} ],
  [ {x:5,  y:2,  w:42}, {x:55, y:26, w:35}, {x:10, y:46, w:32}, {x:56, y:63, w:29} ],
  [ {x:32, y:0,  w:40}, {x:2,  y:30, w:28}, {x:50, y:50, w:35}, {x:6,  y:52, w:25} ],
  [ {x:2,  y:4,  w:32}, {x:40, y:0,  w:36}, {x:6,  y:44, w:34}, {x:54, y:45, w:31} ],
  [ {x:18, y:0,  w:43}, {x:1,  y:44, w:27}, {x:55, y:55, w:32}, {x:70, y:20, w:24} ],
  [ {x:7,  y:6,  w:35}, {x:50, y:3,  w:33}, {x:52, y:45, w:36}, {x:3,  y:46, w:25} ],
];

// ── 모델 사진 + 포즈 설명 ───────────────────────────────
const MODEL_PHOTOS = [
  { img: "memo7/p00.jpg", pose: "direct gaze" },
  { img: "memo7/p01.jpg", pose: "clean profile" },
  { img: "memo7/p02.jpg", pose: "three-quarter turn" },
  { img: "memo7/p03.jpg", pose: "full-length stance" },
  { img: "memo7/p04.jpg", pose: "soft smile" },
  { img: "memo7/p05.jpg", pose: "front body line" },
  { img: "memo7/p06.jpg", pose: "quarter body turn" },
  { img: "memo7/p07.jpg", pose: "walking profile" },
  { img: "memo7/p08.jpg", pose: "relaxed standing" },
  { img: "memo7/p09.jpg", pose: "symmetrical stance" },
  { img: "memo7/p10.jpg", pose: "back view" },
  { img: "memo7/p11.jpg", pose: "over-the-shoulder" },
  { img: "memo7/p12.jpg", pose: "reclining pose" },
  { img: "memo7/p13.jpg", pose: "playful expression" },
  { img: "memo7/p14.jpg", pose: "downward tilt" },
  { img: "memo7/p15.jpg", pose: "resting on arms" },
  { img: "memo7/p16.jpg", pose: "hands framing face" },
  { img: "memo7/p17.jpg", pose: "hand to lips" },
  { img: "memo7/p18.jpg", pose: "fingers to cheeks" },
  { img: "memo7/p19.jpg", pose: "arm behind head" },
  { img: "memo7/p20.jpg", pose: "beauty close-up" },
];

// ── 스트립형(가로 흐름) 사진 목록 ─────────────────────
// 모든 사진은 CLO3D_SIZE/coverflow 설정으로 크기·위치가 자동 계산된다.
// 순서 = 화면에 흐르는 순서. 아래 번호는 화면에 표시되는 번호와 같다.
const CLO3D_PHOTOS = [
  { img: "memo2/c00.jpg" },
  { img: "memo2/c01.jpg" },
  { img: "memo2/c02.jpg" },
  { img: "memo2/c03.jpg" },
  { img: "memo2/c04.jpg" },
  { img: "memo2/c05.jpg" },
  { img: "memo2/c22.jpg" },
  { img: "memo2/c23.jpg" },
  { img: "memo2/c08.jpg" },
  { img: "memo2/c09.jpg" },
  { img: "memo2/c10.jpg" },
  { img: "memo2/c11.jpg" },
  { img: "memo2/c12.jpg" },
  { img: "memo2/c13.jpg" },
  { img: "memo2/c14.jpg" },
  { img: "memo2/c06.jpg" },
  { img: "memo2/c07.jpg" },
  { img: "memo2/c15.jpg" },
  { img: "memo2/c16.jpg" },
  { img: "memo2/c17.jpg" },
  { img: "memo2/c18.jpg" },
  { img: "memo2/c19.jpg" },
  { img: "memo2/c20.jpg" },
  { img: "memo2/c21.jpg" },
];

// ── 봉투형(memo4) ────────────────────────────────────
// 봉투 하나를 누르면 날개가 열리고 카드가 올라온다. 여러 개를 동시에 열어둘 수 있다.
// photos: 그 봉투가 가질 수 있는 사진들. 열 때마다 이 중 하나가 무작위로 나온다.
const ENVELOPES = [
  { labels: ["PUFFER FOR DUVETICA", "HOODED DOWN", "CREAM VOLUME"],
    photos: ["memo4/e1/p0.png", "memo4/e1/p1.png", "memo4/e1/p2.png"] },
  { labels: ["LAYERED DOWN", "SOFT SHELL", "WOMEN'S WEAR"],
    photos: ["memo4/e2/p0.png", "memo4/e2/p1.png", "memo4/e2/p2.png"] },
  { labels: ["QUILTED SET", "PADDED FORM", "TONAL PINK"],
    photos: ["memo4/e3/p0.png", "memo4/e3/p1.png"] },
  { labels: ["2024 F/W DUVETICA", "DOWN CAPE", "CAPE VOLUME"],
    photos: ["memo4/e4/p0.png", "memo4/e4/p1.png", "memo4/e4/p2.png"] },
];

// ── 케이스 스터디형(memo4cs) — Behance식 세로 스크롤 ──────────
// 스타일 하나 = 섹션 하나. rows 의 종류:
//   { type: "hero",   img }                  : 검정 풀폭 대형 렌더
//   { type: "grid",   imgs: [...] }          : 렌더 멀티뷰 줄 (검정 유지)
//   { type: "process", imgs: [...], note }   : 밝은 배경 작업화면 스트립
const CASESTUDY = [
  { no: "01", name: "GREY ANORAK", code: "ZT10946",
    blurb: "Half-zip anorak — hood volume revised twice in CLO before the final pass.",
    rows: [
      { type: "hero", img: "memo4cs/s1-hero.jpg" },
      { type: "grid", imgs: ["memo4cs/s1-v1.jpg", "memo4cs/s1-v2.jpg", "memo4cs/s1-v3.jpg", "memo4cs/s1-v4.jpg"] },
      { type: "process", imgs: ["memo4cs/s1-p1.jpg", "memo4cs/s1-p2.jpg", "memo4cs/s1-p3.jpg", "memo4cs/s1-p4.jpg"],
        note: "DEVELOPMENT IN CLO — BASE, FIT BLOCK, HOOD REVISE, FINAL" },
    ] },
  { no: "02", name: "BLACK ATHLEISURE", code: "LG10146 / LG10246",
    blurb: "Compression leggings and crop set — seam lines and pocket zips resolved digitally.",
    rows: [
      { type: "hero", img: "memo4cs/s2-hero.jpg" },
      { type: "grid", imgs: ["memo4cs/s2-v1.jpg", "memo4cs/s2-v2.jpg", "memo4cs/s2-v3.jpg", "memo4cs/s2-v4.jpg"] },
      { type: "grid", imgs: ["memo4cs/s2-d1.jpg", "memo4cs/s2-d2.jpg"] },
      { type: "process", imgs: ["memo4cs/s2-p1.jpg", "memo4cs/s2-p2.jpg", "memo4cs/s2-p3.jpg"],
        note: "DEVELOPMENT IN CLO — AVATAR FIT AND COLOR BLOCKING" },
    ] },
  { no: "03", name: "QUILTED COAT", code: "PP",
    blurb: "Long quilted down coat — diamond quilting pressure tested on the avatar.",
    rows: [
      { type: "hero", img: "memo4cs/s3-hero.jpg" },
      { type: "grid", imgs: ["memo4cs/s3-v1.jpg", "memo4cs/s3-v2.jpg", "memo4cs/s3-v3.jpg", "memo4cs/s3-v4.jpg"] },
      { type: "process", imgs: ["memo4cs/s3-p1.jpg", "memo4cs/s3-p2.jpg"],
        note: "DEVELOPMENT IN CLO — SILHOUETTE STUDIES" },
    ] },
  { no: "04", name: "PATTERN TO GARMENT", code: "VDSS / VDWJ",
    blurb: "From flat CAD pattern to simulated garment — windbreakers and punched shorts.",
    rows: [
      { type: "process", imgs: ["memo4cs/s4-a1.jpg", "memo4cs/s4-a2.jpg", "memo4cs/s4-b1.jpg", "memo4cs/s4-c1.jpg", "memo4cs/s4-d1.jpg"],
        note: "EACH LOOK CARRIES ITS OWN .PACX PATTERN FILE" },
    ] },
];

// ── 인스타그램형(memo14) ─────────────────────────────
// 피드 타일 = 360 영상. 타일을 누르면 모달이 열리고
// 슬라이드가 [360 영상 → 앞 랜더 → 뒤 랜더 → 기준의상 → 디테일 → 원단] 순으로 넘어간다.
const IG_ACCOUNT = { id: "HaBit_Eva", bio: "Garments designed and simulated in HaBit — my own patented program",
  link: "habit-fashion.com" };

const IG_POSTS = [
  {
    key: "case_01",
    title: "Diagonal Placket Hooded Top",
    caption: "Charcoal jersey, thin enough to see through, its button line drawn on the bias.",
    video: "memo14/video/case_01.mp4",
    poster: "memo14/video/case_01.jpg",
    slides: ["memo14/img/case_01-front.jpg", "memo14/img/case_01-back.jpg", "memo14/img/case_01-hero.jpg", "memo14/img/case_01-detail.jpg", "memo14/img/case_01-fabric.jpg"],
    hashtags: ["hoodedtop", "sheerjersey", "diagonalplacket", "setinsleeve", "bandhem", "habit"],
  },
  {
    key: "case_02",
    title: "Ivory Lace Ruffle Cardigan",
    caption: "Ivory lace, ruffled down the opening, tied twice and left to fall open.",
    video: "memo14/video/case_02.mp4",
    poster: "memo14/video/case_02.jpg",
    slides: ["memo14/img/case_02-front.jpg", "memo14/img/case_02-back.jpg", "memo14/img/case_02-hero.jpg", "memo14/img/case_02-detail.jpg", "memo14/img/case_02-fabric.jpg"],
    hashtags: ["lacecardigan", "ruffleplacket", "ribbontie", "bellcuffs", "peplumhem", "ivorylace", "habit"],
  },
  {
    key: "case_03",
    title: "Ivory Eyelet Wide-Leg Pants",
    caption: "Floral lace at the waist, eyelet scallops running the length of the leg.",
    video: "memo14/video/case_03.mp4",
    poster: "memo14/video/case_03.jpg",
    slides: ["memo14/img/case_03-front.jpg", "memo14/img/case_03-back.jpg", "memo14/img/case_03-hero.jpg", "memo14/img/case_03-detail.jpg", "memo14/img/case_03-fabric.jpg"],
    hashtags: ["eyeletembroidery", "broderieanglaise", "lacewaistband", "widelegpants", "drawstringwaist", "ivorylinen", "habit"],
  },
  {
    key: "case04",
    title: "Pointelle Wrap Mini Skirt",
    caption: "Pointelle knit folded into an asymmetric wrap, hemmed in a curled lettuce edge.",
    video: "memo14/video/case04.mp4",
    poster: "memo14/video/case04.jpg",
    slides: ["memo14/img/case04-front.jpg", "memo14/img/case04-back.jpg", "memo14/img/case04-hero.jpg", "memo14/img/case04-detail.jpg", "memo14/img/case04-fabric.jpg"],
    hashtags: ["pointelleknit", "wrapminiskirt", "asymmetrichem", "lettucehem", "cordedbow", "heathergrey", "habit"],
  },
  {
    key: "case05",
    title: "Black Velvet Blazer",
    caption: "Black velvet, nipped at the waist, closed with four antique buttons.",
    video: "memo14/video/case05.mp4",
    poster: "memo14/video/case05.jpg",
    slides: ["memo14/img/case05-front.jpg", "memo14/img/case05-back.jpg", "memo14/img/case05-hero.jpg", "memo14/img/case05-detail.jpg", "memo14/img/case05-fabric.jpg"],
    hashtags: ["velvetblazer", "blackvelvet", "notchlapel", "flappocket", "centerbackvent", "structuredshoulder", "habit"],
  },
  {
    key: "case_06",
    title: "Sheer Hooded Wrap Top",
    caption: "A placket that runs to the hip, gathering the sheer jersey into a soft wrap.",
    video: "memo14/video/case_06.mp4",
    poster: "memo14/video/case_06.jpg",
    slides: ["memo14/img/case_06-front.jpg", "memo14/img/case_06-back.jpg", "memo14/img/case_06-hero.jpg", "memo14/img/case_06-detail.jpg", "memo14/img/case_06-fabric.jpg"],
    hashtags: ["hoodedtop", "sheerjersey", "charcoalgrey", "ruchedwaist", "wraptop", "slubknit", "habit"],
  },
  {
    key: "case_08",
    title: "Star Embroidered Mini Dress",
    caption: "Gold stars scattered over ivory chiffon, edged in guipure lace and eyelet.",
    video: "memo14/video/case_08.mp4",
    poster: "memo14/video/case_08.jpg",
    slides: ["memo14/img/case_08-front.jpg", "memo14/img/case_08-back.jpg", "memo14/img/case_08-hero.jpg", "memo14/img/case_08-detail.jpg", "memo14/img/case_08-fabric.jpg"],
    hashtags: ["starembroidery", "guipurelace", "eyeletscallop", "chiffonminidress", "babydollsilhouette", "blousonsleeve", "habit"],
  },
  {
    key: "case_09",
    title: "Shearling Collar Corduroy Jacket",
    caption: "Camel corduroy under a curl of shearling, released into a peplum at the waist.",
    video: "memo14/video/case_09.mp4",
    poster: "memo14/video/case_09.jpg",
    slides: ["memo14/img/case_09-front.jpg", "memo14/img/case_09-back.jpg", "memo14/img/case_09-hero.jpg", "memo14/img/case_09-detail.jpg"],
    hashtags: ["widewalecorduroy", "shearlingcollar", "peplumjacket", "princessseams", "brassbuttons", "camelbrown", "habit"],
  },
  {
    key: "heavyouter",
    title: "Polka Dot Ruffle Puffer",
    caption: "Powder blue down cropped short, with drawstring bows and a ruffle at the hem.",
    video: "memo14/video/heavyouter.mp4",
    poster: "memo14/video/heavyouter.jpg",
    slides: ["memo14/img/heavyouter-front.jpg", "memo14/img/heavyouter-back.jpg", "memo14/img/heavyouter-hero.jpg", "memo14/img/heavyouter-detail.jpg", "memo14/img/heavyouter-detail2.jpg"],
    hashtags: ["croppedpuffer", "polkadot", "ruffledhem", "quilteddown", "drawstringbows", "powderblue", "habit"],
  },
  {
    key: "outer",
    title: "Navy Ruffle Collar Coat",
    caption: "Navy melton, double-breasted, softened at the collar and again at the hem.",
    video: "memo14/video/outer.mp4",
    poster: "memo14/video/outer.jpg",
    slides: ["memo14/img/outer-front.jpg", "memo14/img/outer-back.jpg", "memo14/img/outer-hero.jpg", "memo14/img/outer-detail.jpg"],
    hashtags: ["rufflecollar", "doublebreasted", "navywool", "meltoncoat", "tiecuffs", "rufflepeplum", "habit"],
  },
  {
    key: "sweater",
    title: "Grey Ribbed Zip Knit",
    caption: "Heather grey rib, fitted close and zipped clean to the funnel collar.",
    video: "memo14/video/sweater.mp4",
    poster: "memo14/video/sweater.jpg",
    slides: ["memo14/img/sweater-front.jpg", "memo14/img/sweater-back.jpg", "memo14/img/sweater-hero.jpg", "memo14/img/sweater-detail.jpg", "memo14/img/sweater-fabric.jpg"],
    hashtags: ["ribknit", "zipupknit", "funnelneck", "heathergrey", "twowayzip", "fittedknit", "habit"],
  },
  {
    key: "top",
    title: "Petal Cutout Waffle Tee",
    caption: "Cream waffle knit, small blue roses, and a petal cut from the side seam.",
    video: "memo14/video/top.mp4",
    poster: "memo14/video/top.jpg",
    slides: ["memo14/img/top-front.jpg", "memo14/img/top-back.jpg", "memo14/img/top-hero.jpg", "memo14/img/top-detail.jpg"],
    hashtags: ["waffleknit", "petalcutout", "ditsyfloral", "contrastoverlock", "mockneck", "blueroseprint", "habit"],
  },
];

const DETAILS = {
  trashion: {
    title: "TRASHION",
    season: "AUGUST 2023",
    spec: "TRASHION 2026 < MET GALA — PILE OF CLOTHES : THE GOTHIC RECYCLING > LOOK / ",
    // 디자인별로 묶은 순서 — 아이디어보드 → 스케치 → 3D CLO → 에디토리얼
    pages: [
      // ── DESIGN 1 ──────────────────────────────
      { img: "memo1/cover1.jpg", cover: true },
      { img: "memo1/0.jpg",  section: SEC_SKETCH1, caption: "Concept sketch for an imaginary Met Gala theme: Gothic / Sustainability." },
      { img: "memo1/1.jpg",  section: SEC_CLO1, caption: "Inspired by Pistoletto's Venus of the Rags and Boltanski's Dispersion." },
      { img: "memo1/2.jpg",  section: SEC_CLO1, caption: "A gown that moves like a flowing heap of abandoned garments." },
      { img: "memo1/3.jpg",  section: SEC_CLO1, caption: "Silhouette study — the drama of piled cloth in a gothic interior." },
      { img: "memo1/4.jpg",  section: SEC_CLO1, caption: "Cropped jacket — small clothes cluster and cling like sediment." },
      { img: "memo1/9.jpg",  section: SEC_SHOOT1, caption: "The blind producer — after Aaron Weiss's Blind Consumer in NYC." },
      { img: "memo1/10.jpg", section: SEC_SHOOT1, caption: "We consume five times more clothing than forty years ago." },
      { img: "memo1/11.jpg", section: SEC_SHOOT1, caption: "Yet the way we make clothes has barely changed." },
      { img: "memo1/12.jpg", section: SEC_SHOOT1, caption: "Black volume built from second-hand fabric." },
      { img: "memo1/13.jpg", section: SEC_SHOOT1, caption: "Detail — layers of reclaimed satin." },
      { img: "memo1/14.jpg", section: SEC_SHOOT1, caption: "Deep-V gown — party glamour with a dark undercurrent." },
      { img: "memo1/15.jpg", section: SEC_SHOOT1, caption: "Texture study — waste as ornament." },

      // ── DESIGN 2 ──────────────────────────────
      { img: "memo1/cover3.jpg", cover: true },
      { img: "memo1/00.jpg", section: SEC_SKETCH2, caption: "First sketch — a party gown born from a pile of discarded clothes." },
      { img: "memo1/5.jpg",  section: SEC_CLO2, caption: "Scattered fragments echo Boltanski's fields of dispersed clothing." },
      { img: "memo1/6.jpg",  section: SEC_CLO2, caption: "Movement test — the pile breathes as the body walks." },
      { img: "memo1/7.jpg",  section: SEC_CLO2, caption: "Fringe and fragments — beauty pulled out of waste." },
      { img: "memo1/8.jpg",  section: SEC_CLO2, caption: "The white dress beneath — a venus under the rags." },
      { img: "memo1/16.jpg", section: SEC_SHOOT2, caption: "Dot fragments — a collage of found garments." },
      { img: "memo1/17.jpg", section: SEC_SHOOT2, caption: "Like Johanna Goodman's collages — couture from afar, found objects up close." },
      { img: "memo1/18.jpg", section: SEC_SHOOT2, caption: "Rebirth — worn polo shirts resold as new spectacle." },
      { img: "memo1/19.jpg", section: SEC_SHOOT2, caption: "Bustier and shredded trims — the aesthetics of disposal." },
      { img: "memo1/20.jpg", section: SEC_SHOOT2, caption: "Close-up — sequins over reclaimed cloth." },
      { img: "memo1/21.jpg", section: SEC_SHOOT2, caption: "Met Gala — Pile of Clothes : The Gothic Recycling." },
    ],
  },

  model: {
    album: true,
    title: "MODEL",
    season: "2026",
    photos: MODEL_PHOTOS,
    layouts: ALBUM_LAYOUTS,
    // 페이지당 사진 수 (합계가 사진 수와 같아야 합니다)
    perPage: [4, 3, 3, 4, 3, 4],
  },

  clo3d: {
    strip: true,
    title: "CLO 3D WORK",
    // 모든 사진 공통 규격 — h는 화면 높이 대비(vh), ratio는 가로/세로 비율
    size: { h: 70, ratio: 0.68 },
    // 커버플로우 — 가운데 사진이 정면·가장 크고, 양옆으로 갈수록 3D로 눕는다.
    //   top        : (더 이상 쓰이지 않음) 사진은 화면 세로 중앙에 자동 정렬된다
    //   maxRotate  : 화면 끝에서 눕는 각도 (deg)
    //   minScale   : 화면 끝에서의 크기 배율
    //   depth      : 화면 끝에서 뒤로 밀리는 거리 (px)
    //   fade       : 화면 끝에서 옅어지는 정도 (0~1)
    //   hoverScale : 커서 올린 사진이 커지는 배율
    //   pauseZone  : 화면 중앙 기준 이 범위(0~1) 안의 사진에 커서를 올리면 흐름이 멈춘다
    //   visible    : (간격 계산에는 더 이상 쓰이지 않음) 간격은 overlap 과 사진 폭이 정하고,
    //                한 화면에 보이는 장수는 남는 가로폭에 따라 저절로 달라진다
    //   spread     : 중앙에서 몇 칸째에 최대 회전/깊이에 도달하는지
    //   edgeScale  : 양 끝 사진의 크기 배율. 0.909 면 가운데가 끝보다 약 1.10배 크다
    //   overlap    : 사진 폭 ÷ 칸 폭. 1.0이면 딱 붙고, 1.06이면 6%만 겹친다
    //   start      : 페이지 진입 시 가운데에 올 사진 번호 (1부터)
    //   blur / dim : 심도 — 양 끝으로 갈수록 흐려지고(px) 어두워지는(0~1) 정도
    //   mobile     : 폰(가로 760px 이하)에서만 덮어쓸 값들
    coverflow: { top: 20, visible: 7, spread: 3, overlap: 1.06, maxRotate: 25, edgeScale: 0.909, depth: 60, fade: 0.12, blur: 3, dim: 0.22, start: 3, hoverScale: 1.03, pauseZone: 0.6,
      // 폰에서는 한 화면에 7장이 들어가면 사진이 손톱만 해진다.
      // 가운데 한 장을 크게 보여주고, 양옆은 각도를 크게 눕혀 살짝만 걸치게 한다.
      // 세로 위치는 top 대신 화면 가운데로 자동 정렬된다.
      mobile: { visible: 5, overlap: 2.4, maxRotate: 58, spread: 2, edgeScale: 0.88, depth: 90 } },
    photos: CLO3D_PHOTOS,
  },

  duvetica: {
    envelope: true,
    title: "DUVETICA",
    pdf: "portfolio.pdf",
    envelopes: ENVELOPES,
  },

  designer: {
    casestudy: true,
    title: "CLO DESIGN WORK",
    sections: CASESTUDY,
  },

  habit: {
    instagram: true,
    title: "HaBit_Eva",
    account: IG_ACCOUNT,
    posts: IG_POSTS,
  },
};
