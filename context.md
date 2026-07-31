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
