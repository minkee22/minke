# 기여 안내

이 저장소를 함께 고치는 분들을 위한 안내입니다. 디자인 규칙과 콘텐츠 규격은 [AGENTS.md](AGENTS.md) 에 있습니다.

## 작업 순서

1. 최신 `main` 에서 브랜치를 만듭니다. 이름은 `design/`, `content/`, `fix/` 로 시작합니다.
2. 로컬에서 확인합니다.

   ```sh
   python3 -m http.server 4173
   ```

3. 올리기 전에 점검을 돌립니다.

   ```sh
   node tools/check-site.js
   ```

4. Pull request 를 열고 템플릿을 채웁니다. 같은 점검이 GitHub Actions 에서도 돌아갑니다.
5. `main` 에 합치면 GitHub Pages 가 바로 공개합니다. 합치기 전에 사이트 주인의 확인을 받습니다.

## 커밋 메시지

- 영어 명령문으로 한 줄 요약을 씁니다. 예: `Restore the last image of each section`
- 왜 바꿨는지 필요하면 본문에 적습니다.

## 문구 규칙

화면 문구, 문서, 커밋 메시지에 em dash, en dash, 가운데 점, 단독 `--` 를 쓰지 않습니다.
쉼표, 괄호, 슬래시로 바꿔 씁니다. `tools/check-site.js` 가 이 규칙도 검사합니다.

## 민감한 정보

이 저장소는 공개 저장소이고 한 번 올린 파일은 기록에 남습니다.
전화번호나 이력서처럼 개인정보가 담긴 파일은 올리기 전에 주인의 확인을 받습니다.
