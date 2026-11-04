# KYUNGEUN MIN 포트폴리오: 에이전트 작업 규칙

민경은 패션 디자인 포트폴리오입니다. 이 파일은 이 저장소에서 일하는 모든 에이전트의 공통 규칙입니다.
`CLAUDE.md` 는 이 파일을 불러오기만 하므로 규칙은 여기에만 적습니다.

## 프로젝트 개요

- 라이브: https://minkee22.github.io/minke/ (GitHub Pages, `main` 브랜치)
- 빌드 단계가 없는 정적 HTML, CSS, JS 입니다. 패키지 설치도 필요 없습니다.
- `main` 에 push 하면 바로 공개됩니다. 브랜치에서 작업하고, `main` 반영은 사용자 확인 후에 합니다.
- 예전 myportfolio 사이트 두 곳을 이 사이트로 합쳤습니다. 앞으로는 이 사이트 하나만 운영합니다.

## 페이지 구조

| 메뉴 | 파일 | 내용 |
|---|---|---|
| SELECTED | `index.html` | AI IN PRACTICE, 컬렉션과 아트웍 미리보기, SIAN STUDIO, 연락처 |
| ARTWORK | `artwork.html` | 카테고리 8개. `artwork.html#outer` 처럼 해시로 섹션을 엽니다 |
| COLLECTIONS | `collections.html` | 프로젝트 5개. `collections.html#vbyk` 처럼 해시로 섹션을 엽니다 |
| ABOUT | `about.html` | 자기소개, 연락처 |

| 파일 | 역할 |
|---|---|
| `assets/data/archive-data.js` | ARTWORK, COLLECTIONS 의 제목, 설명, 이미지 목록 |
| `assets/js/archive.js`, `assets/css/archive.css` | ARTWORK, COLLECTIONS, ABOUT 렌더링과 스타일 |
| `assets/css/site.css` | 공용 타이포, 헤더, 푸터, 종이 효과, 홈 화면 |
| `assets/js/viewer.js` | 공용 이미지 뷰어(`PageViewer.open`), 홈 가로 갤러리 |
| `assets/slides/` | AI 사례 슬라이드 |
| `assets/archive/` | ARTWORK, COLLECTIONS 이미지 |
| `assets/images/` | 옷핀, 공유 미리보기 이미지 |
| `tools/check-site.js` | 링크, 이미지 목록, 금지 문장부호 점검 |
| `_retired/` | 지금 쓰지 않는 이전 자료. 공개되지 않습니다 |

페이지 HTML 은 공개 주소가 바뀌지 않도록 루트에 둡니다.

`case-study.html` 은 옛 주소를 홈으로 보내는 리다이렉트입니다.

사람이 따르는 작업 순서는 [CONTRIBUTING.md](CONTRIBUTING.md) 에 있습니다.

## 로컬 실행

```sh
python3 -m http.server 4173
```

저장소 루트에서 실행한 뒤 http://127.0.0.1:4173/ 로 확인합니다. 새로고침으로 반영되며 핫 리로드는 없습니다.

## 디자인 규칙

1. **클립 테마를 유지합니다.** 아이보리 종이 시트와 시트를 잇는 옷핀(`assets/images/safety-pin.webp`)이 이 사이트의 정체성입니다.
2. **종이만 기울이고 내용은 수평으로 둡니다.** 기울기는 카드 자체가 아니라 `::before`, `::after` 종이 레이어에 줍니다.
   이미지나 글자를 함께 돌리면 서로 어긋나 삐뚤어 보입니다.
3. **가로 갤러리는 같은 시트 구조를 씁니다.** FIG 라벨, 이미지, 제목, 설명, 세부 정보 순서이고 글자는 시트 안에 둡니다.
4. **메뉴 위치가 움직이면 안 됩니다.**
   - 현재 메뉴 표시는 밑줄과 색으로만 합니다. `font-weight` 를 바꾸면 글자 폭이 달라져 메뉴가 밀립니다.
   - ARTWORK, COLLECTIONS 상단 제목 영역은 섹션이 바뀌어도 그대로 둡니다. 섹션 제목과 설명은 탭 아래 `.section-head` 에 넣습니다.
5. **SELECTED 메뉴는 앵커 없이 홈 맨 위로 갑니다.** 첫 슬라이드로 자동 이동하는 동작은 사용자가 부자연스럽다고 해서 없앴습니다.
6. **AI 가 쓴 글처럼 보이는 문장부호를 쓰지 않습니다.** em dash, en dash, 가운데 점, 단독 `--` 대신 쉼표, 괄호, 슬래시로 씁니다.
   문장 속 링크에도 화살표를 붙이지 않습니다. 커밋 메시지와 문서도 같습니다.
7. **설명은 담백한 한국어로 씁니다.** 영어를 직역하지 않고 디자인 의도가 드러나게 씁니다. 상단 메뉴, 섹션 큰 제목, FIG 라벨만 영어로 둡니다.
8. **장식으로 구분하지 않습니다.** 배지, 아이콘, 무작위 변주를 늘리지 말고 글자 농도와 여백으로 구분합니다.
9. **읽기 쉬운 최소 기준을 지킵니다.** 본문과 라벨은 12px 이상(탭 숫자만 10.5px), 터치 대상은 높이 44px, 보조 글자는 `--ink-soft`.
10. **폰트는 Pretendard 입니다.** `assets/fonts/pretendard/` 에 직접 넣었고 외부 CDN 을 쓰지 않습니다.

## 콘텐츠 수정

**AI 슬라이드:** `index.html` 의 카드를 고칩니다. 슬라이드 이미지는 `assets/slides/` 의 전체본 `folio-NN-page.webp` 와 가벼운 본
`folio-NN-page-1200.webp` 를 함께 교체합니다.

**ARTWORK, COLLECTIONS:** `assets/data/archive-data.js` 를 고칩니다.

- 이미지 한 장은 `[파일명, 폭, 높이, 캡션]` 입니다. 폭과 높이는 변환한 파일 기준입니다.
- `sheets` 의 안쪽 배열 하나가 종이 시트 한 장입니다.
- 이미지를 더하면 해당 섹션의 `count` 도 고칩니다. 홈의 `25장` 같은 표기는 `index.html` 에 따로 있습니다.

이미지 변환 규격은 다음과 같습니다.

| 용도 | 경로 | 규격 |
|---|---|---|
| 뷰어 | `assets/archive/<섹션>/NNN.webp` | 폭 1400px, WebP 품질 78 |
| 목록 | `assets/archive/<섹션>/t/NNN.webp` | 폭 640px, WebP 품질 72 |
| 표지 | `assets/archive/covers/<섹션>.webp` | 1200x676, WebP 품질 78 |

CSS 나 JS 를 고치면 HTML 의 `?v=` 값을 올려 브라우저 캐시를 넘깁니다.

## 검증

- 먼저 `node tools/check-site.js` 를 돌립니다. 링크, 이미지 목록, 금지 문장부호를 검사합니다.
- 폭 360, 390, 768, 1440 에서 확인합니다. 가로 넘침이 없어야 합니다.
- 메뉴와 탭을 눌러도 위치가 그대로인지 측정합니다.
- 뷰어는 열기, 넘기기, 확대, 닫기, 폰의 뒤로 가기를 확인합니다.
- iPhone 방문이 많으므로 WebKit 도 함께 봅니다.
- Playwright 전체 페이지 캡처는 터치 미디어쿼리와 지연 로딩이 다르게 보일 수 있습니다. 판단은 뷰포트 캡처로 합니다.

## 남은 일

- **이력서:** 옛 사이트의 Dropbox 링크가 삭제된 파일입니다. 사용자가 국문, 영문 PDF 를 주면 ABOUT 에 연결합니다.
- **전화번호:** 공개 저장소에 기록이 남아 넣지 않았습니다. 사용자가 원할 때만 추가합니다.
- **슬라이드 속 가운데 점:** 슬라이드 이미지에 박혀 있어 원본 파일이 있어야 고칠 수 있습니다.
- **옛 사이트:** ruddms0626mymy, musinsamke 는 이 사이트 공개를 확인한 뒤 사용자가 닫습니다.
- **다른 사람의 자료:** 이전 템플릿의 다른 사람 파일은 지웠습니다. 다만 git 기록에는 남아 있습니다. 지우려면 기록을 다시 써야 하므로 사용자 확인이 필요합니다.
- **ARTWORK 소개 문구:** 아우터, 원피스, 블라우스/셔츠, 액세서리, 도식화 소개는 원문이 없어 이미지를 보고 쓴 초안입니다. 사용자 확인이 필요합니다.
- **SIAN STUDIO:** 작업 준비 중이라 빈 시트로 둡니다. 제목의 `(가제)` 도 확정되면 바꿉니다.
