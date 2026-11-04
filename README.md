# KYUNGEUN MIN Portfolio

민경은 패션 디자인 포트폴리오입니다. 아이보리 종이 시트를 옷핀으로 이어 붙인 구성이 특징입니다.

라이브: https://minkee22.github.io/minke/

## 페이지

| 메뉴 | 파일 | 내용 |
|---|---|---|
| SELECTED | `index.html` | AI 활용 사례, 컬렉션과 아트웍 미리보기, SIAN STUDIO, 연락처 |
| ARTWORK | `artwork.html` | 스타일과 도식화 8개 카테고리. `artwork.html#outer` 처럼 바로 열 수 있습니다 |
| COLLECTIONS | `collections.html` | 캡슐, 협업 프로젝트 5개. `collections.html#vbyk` 처럼 바로 열 수 있습니다 |
| ABOUT | `about.html` | 자기소개, 연락처 |

## 로컬 실행

빌드와 패키지 설치가 필요 없습니다. 저장소 루트에서 실행합니다.

```sh
python3 -m http.server 4173
```

http://127.0.0.1:4173/ 을 열면 됩니다.

## 폴더 구조

| 경로 | 역할 |
|---|---|
| `*.html` | 페이지. 공개 주소가 바뀌지 않도록 루트에 둡니다 |
| `assets/css/` | `site.css` 공용 스타일과 홈, `archive.css` 아트웍, 컬렉션, 소개 |
| `assets/js/` | `viewer.js` 이미지 뷰어와 홈 갤러리, `archive.js` 아트웍, 컬렉션 렌더링 |
| `assets/data/archive-data.js` | ARTWORK, COLLECTIONS 의 제목, 설명, 이미지 목록 |
| `assets/archive/` | 섹션별 이미지, 썸네일(`t/`), 표지(`covers/`) |
| `assets/slides/` | AI 사례 슬라이드. `-1200` 은 홈 화면용 가벼운 본 |
| `assets/images/` | 옷핀, 공유 미리보기 이미지 |
| `assets/fonts/pretendard/` | Pretendard Variable (SIL OFL) |
| `tools/check-site.js` | 링크, 이미지 목록, 금지 문장부호 점검 |
| `_retired/` | 지금 쓰지 않는 이전 자료. 공개되지 않습니다 |

## 공개

GitHub Pages 가 `main` 브랜치 루트를 공개합니다. `main` 에 합치면 바로 반영됩니다.

## 함께 작업하기

- 사람: [CONTRIBUTING.md](CONTRIBUTING.md)
- 에이전트: [AGENTS.md](AGENTS.md). 디자인 규칙과 그 이유, 이미지 규격, 남은 일을 모아 두었습니다.
