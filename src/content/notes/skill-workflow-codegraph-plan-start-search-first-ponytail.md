---
title: "좋았던 스킬 4개: 계획부터 최소 구현까지"
description: "개발 요청을 받았을 때 계획하고, 찾고, 영향 범위를 확인하고, 과한 구현을 줄이는 네 가지 스킬을 쉽게 정리합니다."
publishedAt: 2026-08-01
tags:
  - AI 에이전트
  - 개발 워크플로
  - 스킬
---

에이전트에게 "회원가입 기능 만들어 줘"라고 바로 말하면 코드가 빨리 나오기는 한다. 다만 이미 있는 기능을 또 만들거나, 생각보다 많은 파일을 건드릴 수 있다.

나는 큰 요청을 받으면 네 가지를 순서대로 쓴다. `plan-start`로 할 일을 정하고, `search-first`로 기존 코드를 찾는다. 변경이 넓어 보일 때는 `codegraph`로 연결을 확인한다. 마지막에는 Ponytail로 꼭 필요한 만큼만 구현한다.

## 1. plan-start: 시작 전에 할 일을 정한다

`plan-start`는 바로 코드를 쓰지 않고, 먼저 계획을 적는 스킬이다. 목표, 이번에 하지 않을 일, 영향 받을 파일, 예외 상황, 확인 방법을 `plan.md`, `context.md`, `todo.md`에 정리한다.

예를 들어 "회원가입에 이메일 인증도 넣어 줘"라는 요청에는 화면 하나만 바꾸는지, 메일 발송까지 붙이는지부터 정해야 한다. 이 구분이 없으면 작업 범위가 계속 커진다.

### SKILL.md 핵심 흐름

```text
새 프로젝트·기능·여러 파일 변경인가?
→ plan.md, context.md, todo.md 작성
→ 사용자 승인
→ todo의 한 항목씩 구현
→ 검증과 리뷰
```

### SKILL.md 본문 예시

> **Design:** 코드 작성 없이 `plan.md`, `context.md`, `todo.md`를 만든 뒤 사용자 승인을 받는다.
>
> **Execute:** 승인 후 `todo.md`의 최상단 미완료 항목 1개만 진행한다.

### 세 파일은 이렇게 나뉜다

같은 요청인 “회원가입에 이메일 인증을 추가해 줘”도 파일마다 적는 내용이 다르다.

`plan.md`에는 이번 작업의 경계를 적는다.

```md
# 회원가입 이메일 인증

## 목표
- 가입한 이메일로 인증 링크를 보낸다.

## 이번에 하지 않을 일
- 소셜 로그인과 비밀번호 재설정은 건드리지 않는다.
```

`context.md`에는 먼저 확인한 코드와 주의할 점을 적는다.

```md
# 확인한 내용

- 회원가입 화면은 `src/pages/signup`에 있다.
- 메일 발송 서비스는 아직 없다.
- 만료된 인증 링크는 실패 안내가 필요하다.
```

`todo.md`에는 실제 작업 순서를 한 줄씩 적는다.

```md
- [ ] 기존 회원가입 흐름과 관련 테스트 찾기
- [ ] 인증 링크 발송 기능 만들기
- [ ] 링크 만료·중복 인증 처리하기
- [ ] 가입과 인증 흐름 테스트하기
```

```text
회원가입 기능을 추가하고 싶어.
plan-start로 이번에 할 일과 하지 않을 일,
영향 파일, 예외 상황, 검증 방법부터 정리해 줘.
```

## 2. search-first: 이미 있는 코드를 찾는다

`search-first`는 새 함수를 만들기 전에 저장소부터 검색하는 스킬이다. 비슷한 함수, 사용 중인 화면, 테스트가 있는지 먼저 보고 재사용할지 판단한다.

예를 들어 캐시 기능이 필요하다고 새 파일부터 만들면, 이미 비슷한 캐시 함수가 있을 수 있다. 같은 기능이 두 곳에 생기면 나중에 한쪽만 고쳐서 버그가 난다.

### SKILL.md 핵심 흐름

```text
저장소 검색
→ 비슷한 호출부·테스트 확인
→ 필요할 때만 공식 문서 확인
→ 재사용 / 확장 / 새 구현 결정
```

### SKILL.md 본문 예시

> **Repo Search:** `rg`, `rg --files`, package script, import 경로로 기존 책임자를 찾는다.
>
> **Decision:** 재사용, 확장, 새 구현 중 하나를 고르고 이유를 남긴다.

```text
캐시 기능을 새로 만들기 전에,
저장소에 비슷한 함수와 테스트가 있는지 먼저 찾아줘.
재사용, 확장, 새 구현 중 무엇이 맞는지도 이유와 함께 알려줘.
```

## 3. codegraph: 바꾸기 전에 연결을 본다

`codegraph`는 `.codegraph` 인덱스가 준비된 저장소에서 쓴다. 한 함수를 바꾸면 어디가 함께 영향을 받는지, 누가 그 함수를 부르는지, 어떤 테스트를 봐야 하는지 확인할 수 있다. [CodeGraph 공식 저장소](https://github.com/colbymchenry/codegraph)

예를 들어 `UserService`의 반환값을 바꾸려면 사용자 정보 화면, 로그인 처리, 테스트가 같이 영향을 받을 수 있다. 반대로 버튼 문구 하나를 고치는 정도라면 굳이 쓸 필요가 없다.

![CodeGraph 공식 README의 codegraph init 실행 화면](../../assets/images/codegraph-init-official.png)

*CodeGraph 공식 README의 실제 `codegraph init` 실행 화면입니다. [원본 보기](https://github.com/colbymchenry/codegraph)*

### SKILL.md 핵심 흐름

```text
.codegraph와 인덱스 상태 확인
→ callers / callees / impact 질의
→ 최신 파일 직접 확인
→ 인덱스가 없거나 실패하면 rg 검색으로 전환
```

### SKILL.md 본문 예시

> **Check:** `.codegraph/` 존재 여부와 `codegraph status` 또는 MCP status를 확인한다.
>
> **Fallback:** CodeGraph가 없거나 실패하면 `search-first`의 `rg`, `rg --files`, 직접 파일 읽기 흐름으로 전환한다.

```text
UserService를 바꾸기 전에 codegraph로 호출자와 영향 범위를 확인해 줘.
영향을 받는 파일과 테스트 후보를 알려주고, 최신 소스도 직접 확인해 줘.
```

## 4. Ponytail: 필요한 만큼만 만든다

Ponytail은 "이 기능을 새로 만들어야 하나"를 먼저 묻는 스킬이다. 기존 코드, 표준 라이브러리, 브라우저나 프레임워크 기본 기능, 이미 설치된 패키지 순서로 살핀다. 그래도 없을 때만 작은 구현을 더한다. 검증, 오류 처리, 보안, 접근성은 줄이지 않는다. [Ponytail 공식 저장소](https://github.com/DietrichGebert/ponytail)

예를 들어 날짜 입력이 필요할 때, 처음부터 달력 라이브러리를 설치할 필요는 없다. 기존 컴포넌트나 `<input type="date">`로 해결되는지부터 보는 식이다.

### SKILL.md 핵심 흐름

```text
정말 필요한 기능인가?
→ 기존 코드 재사용
→ 표준 라이브러리
→ 플랫폼 기본 기능
→ 이미 설치된 패키지
→ 한 줄 또는 최소 구현
```

### SKILL.md 본문 예시

> “Stop at the first rung that holds.”
>
> “Native platform feature covers it? `<input type="date">` over a picker lib...”

*Ponytail [SKILL.md 원문](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md)에서 일부 발췌했습니다.*

```text
날짜 선택 UI가 필요해.
Ponytail 기준으로 기존 코드와 브라우저 기본 기능을 먼저 확인하고,
새 의존성 없이 가능한 가장 작은 구현을 제안해 줘.
```

## 이렇게 쓰면 편하다

새 기능이면 `plan-start`부터 쓴다. 기존 코드가 있을 법하면 `search-first`를 붙인다. 공용 함수처럼 연결이 복잡하면 `codegraph`를 더한다. 마지막에는 Ponytail로 과한 라이브러리나 래퍼를 줄인다.

모든 작업에 네 개가 다 필요한 것은 아니다. 한 줄 문구 수정에는 검색과 그래프가 과하다. 대신 작업이 커질수록 이 순서가 실수를 줄여 줬다.

## 참고 자료

- [CodeGraph 공식 저장소](https://github.com/colbymchenry/codegraph)
- [Ponytail 공식 저장소](https://github.com/DietrichGebert/ponytail)
