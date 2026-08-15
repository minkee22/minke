// ============================================================
// 카드 명단 — 여기만 수정하면 됩니다. 코드는 건드릴 필요 없음.
//
// 16개 슬롯 = 왼쪽 위부터 오른쪽으로 1번 → 16번 (4×4)
//
//   1  2  3  4
//   5  6  7  8
//   9 10 11 12
//  13 14 15 16
//
// 사진을 넣으려면 원하는 슬롯의 image / title / href 를 채우세요.
//   image: 사진 파일 경로 (예: "landing photo/project-a.jpg" — site/landing photo 폴더에 넣기)
//   title: 호버 시 카드 아래 나오는 작은 캡션 (비워도 됨)
//   href : 클릭 시 이동할 주소 (상세 페이지 준비 전엔 "#" 유지)
//
// image가 null이면 빈 종이 카드 = 클릭 안 됨.
// ============================================================

const SLOTS = [
  { slot: 1,  image: "landing photo/trashion_sketch1.jpg", title: "sketch", href: "project.html?id=trashion" },
  { slot: 2,  image: "landing photo/athl_clo.png", title: "athletic journey", href: "project.html?id=clo3d" },
  { slot: 3,  image: null, href: "tt-wedding.pdf", newTab: true,
    text: ["CELEBRITY WEDDING", "GIFT PROJECT", "T&T — 2026", "", "RESEARCH — PROPOSAL", "", "VIEW DECK ↗"] },
  { slot: 4,  image: "landing photo/duvetica_work2_crop.jpg", title: "designer work", href: "project.html?id=designer" },
  { slot: 5,  image: null, href: "60th-anniversary.pdf", newTab: true,
    text: ["60TH ANNIVERSARY", "SERGIO TACCHINI", "2026", "", "CREATIVE DESIGN", "", "VIEW DECK ↗"] },
  { slot: 6,  image: null, title: "", href: "#" },
  { slot: 7,  image: "landing photo/model1.jpg", title: "model", href: "project.html?id=model" },
  { slot: 8,  image: null, title: "", href: "#" },
  { slot: 9,  image: null, title: "", href: "#" },
  // 사진 대신 글자가 인쇄된 카드. text 가 있으면 글자 카드로 그려진다.
  { slot: 10, image: null, href: "cv.pdf", newTab: true,
    text: ["CURRICULUM VITAE", "EUNBYN AN", "", "FASHION DESIGN — 3D", "PRODUCTION", "", "VIEW CV ↗"] },
  { slot: 11, image: "landing photo/duvetica_clo.png", title: "puffer project", href: "project.html?id=duvetica" },
  { slot: 12, image: null, title: "", href: "#" },
  { slot: 13, image: null, title: "", href: "#" },
  { slot: 14, image: "landing photo/patent_crop.jpg", title: "patent", href: "project.html?id=habit" },
  { slot: 15, image: null, title: "", href: "#" },
  { slot: 16, image: null, title: "", href: "#" },
];

// ============================================================
// 장식 스티커 — 클릭 안 되는 순수 장식 요소.
//   slot   : 붙일 카드 번호 (1~16)
//   img    : 이미지 경로
//   size   : 카드 폭 대비 크기 (%)
//   x, y   : 카드 기준 위치 (%) — 장식의 중심점. 0,0 = 카드 좌상단 모서리
//   rotate : 기울기 (deg, 음수면 반시계)
// ============================================================

const DECOR = [
  { slot: 16, img: "assets/ribbon.png", size: 92, x: 76, y: 84, rotate: 0 },
];

// 페이지 상단 좌측 작은 스펙시트 텍스트 (2줄)
const IDENTITY_LINE1 = "EUNBYN AN — FASHION DESIGNER";
const IDENTITY_LINE2 = "DESIGN — PRODUCTION — 3D VISUALIZATION";

// 페이지 하단 중앙 서명 + 이메일
const SIGNATURE = "EUNBYN AN";
const SIGNATURE_EMAIL = "evaan0898056@gmail.com";
