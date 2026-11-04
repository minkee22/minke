# KYUNGEUN MIN Portfolio

민경은 패션 디자인 포트폴리오입니다. 아이보리 종이 시트를 옷핀으로 이어 붙인 구성이 특징입니다.

라이브: https://minkee22.github.io/minke/

## 페이지

| 메뉴 | 파일 | 내용 |
|---|---|---|
| HOME | `index.html` | AI 활용 사례, 컬렉션과 아트웍 미리보기, SIAN STUDIO, 연락처 |
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
| `assets/js/` | `i18n.js` 언어 전환, `viewer.js` 이미지 뷰어와 홈 갤러리, `archive.js` 아트웍, 컬렉션 렌더링, `motion.js` 인터랙션 |
| `assets/data/i18n-data.js` | 사이트의 모든 문구. 키마다 `[한국어, 영어]` 한 쌍입니다 |
| `assets/data/archive-data.js` | ARTWORK, COLLECTIONS 의 이미지 목록 |
| `assets/archive/` | 섹션별 이미지, 썸네일(`t/`), 표지(`covers/`) |
| `assets/slides/` | AI 사례 슬라이드. `-1200` 은 홈 화면용 가벼운 본, `-en` 은 영어판 |
| `assets/images/` | 옷핀, 공유 미리보기 이미지 |
| `assets/fonts/pretendard/` | Pretendard Variable (SIL OFL) |
| `tools/check-site.js` | 링크, 이미지 목록, 금지 문장부호 점검 |
| `_retired/` | 지금 쓰지 않는 이전 자료. 공개되지 않습니다 |

## 한국어와 영어

오른쪽 위 KO, EN 토글로 언어를 바꿉니다. 선택한 언어는 브라우저에 저장되고, 첫 방문은 브라우저 언어를 따릅니다.
`index.html?lang=en` 처럼 주소에 언어를 지정해 공유할 수도 있습니다. 문구를 고칠 때는 `assets/data/i18n-data.js` 의 두 언어를 함께 고칩니다.

## 공개

GitHub Pages 가 `main` 브랜치 루트를 공개합니다. `main` 에 합치면 바로 반영됩니다.

## 저장소 소유자가 할 일

아래 작업은 쓰기 권한으로는 할 수 없어 저장소 소유자(`minkee22`) 계정으로 진행해야 합니다.

### 1. Vercel 로 배포하기

도메인이 없어도 무료 `vercel.app` 주소로 배포할 수 있습니다. 빌드 단계가 없어 설정할 것이 거의 없습니다.

1. https://vercel.com 에 이 GitHub 계정으로 로그인합니다.
2. Add New 에서 Project 를 고르고 `minkee22/minke` 를 Import 합니다. 목록에 없으면 Adjust GitHub App Permissions 에서 이 저장소를 허용합니다.
3. Framework Preset 은 Other 로 두고, Build Command, Output Directory, Install Command 는 비워 둡니다.
4. Deploy 를 누릅니다. 끝나면 `프로젝트이름.vercel.app` 주소가 생깁니다.

이후 `main` 에 합칠 때마다 자동으로 배포되고, pull request 마다 미리보기 주소가 만들어집니다.
`_retired/`, `tools/`, 문서는 `.vercelignore` 로 제외되어 공개되지 않습니다.

배포를 확인한 뒤 남은 일은 다음과 같습니다.

- **대표 주소 교체:** `index.html`, `artwork.html`, `collections.html`, `about.html` 의 `canonical`, `og:url`, `og:image` 를 새 주소로 바꿉니다. 그래야 링크를 공유할 때 새 주소와 미리보기 이미지가 나옵니다.
- **GitHub Pages 끄기:** 새 주소가 잘 열리면 저장소 Settings 의 Pages 에서 Source 를 None 으로 바꿉니다. 두 주소를 함께 두면 검색 결과가 나뉩니다.
- **문서 수정:** 이 파일과 `AGENTS.md`, `CONTRIBUTING.md` 의 라이브 주소와 공개 설명을 Vercel 기준으로 고칩니다.

### 2. 옛 기록 삭제 요청

저장소 기록에서 다른 분의 개인정보를 지웠지만, GitHub 는 옛 커밋을 주소로 계속 보여 줄 수 있습니다.
https://support.github.com 에서 `minkee22/minke` 의 민감 정보 삭제를 요청합니다. 대상 파일은 옛 커밋의 `cv.pdf`, `projects.js` 입니다.

### 3. 저장소 설명 수정

저장소 첫 화면 About 의 설명에서 긴 대시를 지웁니다. 예: `KYUNGEUN MIN fashion design portfolio`

## 함께 작업하기

- 사람: [CONTRIBUTING.md](CONTRIBUTING.md)
- 에이전트: [AGENTS.md](AGENTS.md). 디자인 규칙과 그 이유, 이미지 규격, 남은 일을 모아 두었습니다.
