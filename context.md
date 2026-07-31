# AI Study Blog 맥락

## 기술 스택

- Node.js LTS와 npm
- Astro 최신 안정 버전
- TypeScript
- Markdown/MDX 콘텐츠 컬렉션
- Marp CLI
- GitHub Actions와 GitHub Pages

## 코드 규칙

- 콘텐츠와 UI를 분리한다. 글·발표는 `src/content/`에, 화면과 스타일은 `src/`에 둔다.
- 콘텐츠 파일명은 영문 kebab-case, 사용자에게 보이는 문구는 한국어를 기본으로 한다.
- 클라이언트 JavaScript와 외부 의존성은 필요한 경우에만 추가한다.
- 스타일은 재사용 가능한 토큰과 작은 컴포넌트로 유지하되, 단일 페이지 전용 표현을 과도하게 추상화하지 않는다.

## 제약 사항

- 첫 버전은 정적 배포만 사용한다.
- GitHub Pages의 프로젝트 경로(`/ai-study-blog/`)에서 링크·자산이 정상 동작해야 한다.
- 모바일 360px 이상과 일반 데스크톱 폭에서 읽기·탐색이 가능해야 한다.
- 키보드 focus, 충분한 색상 대비, 의미 있는 heading 구조를 지킨다.

## 의존성

| 의존성 | 용도 | 대안 |
|---|---|---|
| `astro` | 정적 사이트 생성 | VitePress, Docusaurus |
| `@astrojs/mdx` | MDX 글 렌더링 | 일반 Markdown만 사용 |
| `@astrojs/rss` | 후속 RSS 제공 기반 | 첫 버전에서 생략 가능 |
| `@marp-team/marp-cli` | 발표 Markdown의 HTML·PDF·PPTX 변환 | Slidev |

## 참고 자료

- Astro Content Collections: https://docs.astro.build/en/reference/modules/astro-content/
- Astro GitHub Pages 배포: https://docs.astro.build/en/guides/deploy/github/
- Marp: https://marp.app/

## 가정

- GitHub 계정은 `LDH1103`이며, 공개 저장소 생성과 GitHub Pages 활성화 권한이 있다.
- 저장소 이름은 `ai-study-blog`로 사용한다.
- 첫 콘텐츠는 구조를 검증하는 짧은 샘플 노트와 발표 템플릿으로 시작한다.

## 디자인 보강 제약

- 디자인 방향은 "AI Lab Log": 개인 랜딩 페이지가 아닌, 날짜순 실험·검증 기록이 축적되는 개인 AI 기술 블로그다.
- 기존의 종이색·세리프 중심 방향은 폐기한다. 짙은 그래파이트 배경, 높은 대비의 본문, 청록 signal accent, sans-serif 제목과 monospace 메타데이터를 사용한다.
- 노트의 제목·날짜·태그·요약을 블로그 글 메타데이터로 재사용한다. 슬라이드는 글에서만 선택적으로 연결한다.
- 발표의 독립 탭·목록·상세 페이지와 `talks` 콘텐츠 컬렉션은 제거한다. 새 API, 새 의존성, 외부 이미지·폰트는 추가하지 않는다.
- 실제 검증 viewport는 데스크톱 1280px와 모바일 390px이며, 페이지 내 링크와 키보드 focus를 유지한다.

## 디자인 단순화 제약

- 상단 탐색 항목은 `글` 하나만 둔다. 브랜드명은 홈 링크지만 메뉴 항목으로 취급하지 않는다.
- 홈은 짧은 소개와 최신 글이라는 두 계층으로 제한한다. 기록 수·관심 주제·운영 상태·순번·영문 보조 라벨은 표시하지 않는다.
- 색상은 밝은 중립 바탕, 진한 본문, 파란 링크 포인트로 제한한다. 카드·강한 테두리·상단 색 막대·장식용 monospace 라벨은 사용하지 않는다.
- 글 URL, `notes` 컬렉션, 슬라이드 선택 링크, Pages 프로젝트 경로는 그대로 유지한다.
