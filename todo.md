# AI Study Blog 작업 목록

- [x] [설정] Astro·MDX·Marp 프로젝트 및 Git 저장소 초기화 (산출물: `package.json`, `astro.config.*`, 디렉터리 구조)
- [x] [설정] GitHub Pages 프로젝트 배포 workflow 추가 (산출물: `.github/workflows/deploy.yml`)
- [x] [UI] 읽기 중심의 공통 레이아웃·디자인 토큰 구현 (산출물: `src/layouts/`, `src/styles/`)
- [x] [UI] 홈·노트·발표·소개 페이지 구현 (산출물: `src/pages/`)
- [x] [콘텐츠] 첫 학습 노트와 발표 템플릿 추가 (산출물: `src/content/`, `talks/`)
- [x] [검증] 정적 빌드와 프로젝트 경로 링크 점검 (산출물: build 결과; `slides:build`·`build`·7개 정적 산출물·프로젝트 경로 링크 PASS)
- [x] [배포] GitHub 저장소 생성·초기 커밋·Pages 배포 확인 (산출물: https://ldh1103.github.io/ai-study-blog/; workflow와 공개 URL 200 PASS)

## 디자인·정보 구조 보강: AI Lab Log

- [x] [구조] 발표 탭·목록·상세·컬렉션을 제거하고 첫 글에서 기존 슬라이드를 선택적으로 연결 (산출물: `src/content.config.ts`, `src/pages/talks/` 제거, 첫 글 메타데이터)
- [x] [UI] 홈을 compact AI Lab Log Hero·현재 학습 상태·최신 글 피드로 재구성 (산출물: `src/pages/index.astro`)
- [x] [UI] 공통 masthead·글 목록·상세에 dark technical palette, monospace 메타데이터, 아카이브 행 규칙 적용 (산출물: `src/layouts/BaseLayout.astro`, `src/styles/global.css`, 필요 시 기존 페이지)
- [x] [검증] 데스크톱 1280px·모바일 390px 시각 및 키보드·경로 smoke 점검 (산출물: desktop/mobile screenshot, `slides:build`·`build`·내부 경로 PASS)
- [x] [배포] 블로그형 디자인 보강 커밋·GitHub Pages 배포 확인 (산출물: `f1c24c7`, workflow `30618199020`, 홈·글·슬라이드 200 PASS, `/talks/` 404 확인)
