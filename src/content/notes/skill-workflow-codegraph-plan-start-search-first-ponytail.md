---
title: "에이전트 작업 스킬 기록"
description: "계획, 코드 검색, 영향 범위 확인, 최소 구현에 쓰는 네 가지 스킬과 작업 메모."
publishedAt: 2026-08-01
tags:
  - AI 에이전트
  - 개발 워크플로
  - 스킬
---

“회원가입 기능 만들어 줘”라고 바로 요청했을 때는 코드가 빨리 나왔다. 대신 이미 있는 기능을 또 만들거나, 생각보다 많은 파일을 건드릴 위험이 있었다.

큰 요청에서는 먼저 계획을 세우고, 기존 코드를 찾고, 연결을 확인한 뒤, 꼭 필요한 만큼만 구현하는 순서가 잘 맞았다.

## 이번에 남기는 흐름

1. `plan-start` — 큰 작업의 범위를 먼저 정한다.
2. `search-first` — 새 코드를 쓰기 전에 이미 있는 코드를 찾는다.
3. `codegraph` — 한 곳을 바꿨을 때 이어지는 코드와 테스트를 확인한다.
4. `Ponytail` — 더 단순한 해결책이 있으면 거기서 멈춘다.

모든 작업에 네 가지가 다 필요한 것은 아니다. 문구 한 줄을 고칠 때는 검색과 그래프가 과하다. 다만 작업이 커질수록 이 순서가 실수를 줄였다.

## 1. plan-start — 시작 전 범위 기록

**쓴 경우:** 새 기능, 여러 파일 변경, 구조나 API에 영향이 있는 작업

`plan-start`는 바로 코드를 쓰지 않고 먼저 계획을 적는다. 목표, 이번에 하지 않을 일, 영향 파일, 예외 상황, 확인 방법을 정리한 뒤 승인을 받는 흐름이다.

### 핵심 흐름

```text
큰 작업인가?
→ plan.md, context.md, todo.md 작성
→ 사용자 승인
→ todo의 한 항목씩 구현
→ 검증과 리뷰
```

### SKILL.md 본문 일부

> **Design:** 코드 작성 없이 `plan.md`, `context.md`, `todo.md`를 만든 뒤 사용자 승인을 받는다.
>
> **Execute:** 승인 후 `todo.md`의 최상단 미완료 항목 1개만 진행한다.

### 세 파일에 남긴 내용

아래는 “회원가입에 이메일 인증을 추가해 줘”라는 가정으로 남긴 예시다.

**`plan.md` — 이번 작업의 경계**

```md
# 회원가입 이메일 인증

## 목표
- 가입한 이메일로 인증 링크를 보낸다.

## 이번에 하지 않을 일
- 소셜 로그인과 비밀번호 재설정은 건드리지 않는다.
```

**`context.md` — 먼저 확인한 코드와 주의할 점**

```md
# 확인한 내용

- 회원가입 화면은 `src/pages/signup`에 있다.
- 메일 발송 서비스는 아직 없다.
- 만료된 인증 링크는 실패 안내가 필요하다.
```

**`todo.md` — 실제 작업 순서**

```md
- [ ] 기존 회원가입 흐름과 관련 테스트 찾기
- [ ] 인증 링크 발송 기능 만들기
- [ ] 링크 만료·중복 인증 처리하기
- [ ] 가입과 인증 흐름 테스트하기
```

### 에이전트에 남긴 요청

```text
회원가입 기능을 추가하고 싶어.
plan-start로 이번에 할 일과 하지 않을 일,
영향 파일, 예외 상황, 검증 방법부터 정리해 줘.
```

## 2. search-first — 먼저 기존 코드 확인

**쓴 경우:** 새 함수나 컴포넌트를 만들기 전, 비슷한 기능이 있을 법한 작업

`search-first`는 새 파일부터 만들지 않고 저장소를 먼저 검색한다. 비슷한 함수, 사용 중인 화면, 테스트를 확인하고 재사용할지 판단하는 흐름이다.

### 핵심 흐름

```text
저장소 검색
→ 비슷한 호출부·테스트 확인
→ 필요할 때만 공식 문서 확인
→ 재사용 / 확장 / 새 구현 결정
```

### SKILL.md 본문 일부

> **Repo Search:** `rg`, `rg --files`, package script, import 경로로 기존 책임자를 찾는다.
>
> **Decision:** 재사용, 확장, 새 구현 중 하나를 고르고 이유를 남긴다.

### 에이전트에 남긴 요청

```text
캐시 기능을 새로 만들기 전에,
저장소에 비슷한 함수와 테스트가 있는지 먼저 찾아줘.
재사용, 확장, 새 구현 중 무엇이 맞는지도 이유와 함께 알려줘.
```

## 3. CodeGraph — 변경 전 연결 확인

**쓴 경우:** 공용 함수, 로그인·결제 같은 핵심 흐름, 여러 화면과 연결된 API를 바꿀 때

CodeGraph는 `.codegraph` 인덱스가 준비된 저장소에서 쓴다. 함수 하나를 바꿀 때 호출하는 곳, 이어지는 영향, 확인할 테스트를 좁히는 데 썼다. [CodeGraph 공식 저장소](https://github.com/colbymchenry/codegraph)

![CodeGraph 공식 README의 codegraph init 실행 화면](../../assets/images/codegraph-init-official.png)

*CodeGraph 공식 README의 실제 `codegraph init` 실행 화면입니다. [원본 보기](https://github.com/colbymchenry/codegraph)*

### 검색만으로 부족했던 지점

`rg`는 “`UserService`라는 글자가 어디에 있지?”를 찾는 데 좋다. CodeGraph는 함수·클래스·파일을 점으로, 호출·import·상속 관계를 선으로 연결해 둔다. 그래서 “이 함수를 누가 호출하지?”나 “반환값을 바꾸면 어디가 깨질 수 있지?”를 확인할 때 썼다.

```text
소스 코드
→ 함수·클래스·import 관계 분석
→ .codegraph/codegraph.db에 저장
→ 관련 소스·호출 경로·영향 범위 확인
```

`codegraph init`은 프로젝트마다 로컬 인덱스를 만들고 첫 분석까지 수행한다. 이후 파일 변경을 감시해 자동으로 갱신한다.

### 자주 던진 질문

- **전체 흐름:** `로그인 요청이 DB까지 어떻게 가는지 설명해 줘`
- **호출하는 곳:** `UserService.getProfile을 누가 호출하는지 찾아줘`
- **호출하는 대상:** `login 함수가 내부에서 무엇을 부르는지 보여줘`
- **변경 영향:** `UserService 반환값을 바꾸면 영향 받는 곳을 알려줘`
- **테스트 범위:** `src/auth.ts 변경분에 필요한 테스트를 찾아줘`

MCP로 연결했을 때는 보통 `codegraph_explore` 하나로 이런 질문을 던진다. 관련 소스, 호출 경로, 영향 범위가 함께 나온다. CLI에서는 `callers`, `callees`, `impact`, `affected`처럼 목적별 명령도 쓸 수 있다.

### 반환값을 바꾸는 예시

`UserService.getProfile()`이 사용자 이름만 돌려주다가 이메일도 함께 돌려주도록 바꿀 때, 수정 전에 아래처럼 확인해 둔다.

```text
UserService.getProfile의 호출자와 영향 범위를 확인해 줘.
반환값에 email을 추가하면 함께 확인해야 할 화면, API, 테스트를 알려줘.
```

> **메모:** CodeGraph는 탐색 시간을 줄이는 도구다. 수정 직후 동기화 대기나 오래된 인덱스 경고가 보이면, 해당 파일은 직접 열어 최신 내용을 확인한다.

### SKILL.md 본문 일부

> **Check:** `.codegraph/` 존재 여부와 `codegraph status` 또는 MCP status를 확인한다.
>
> **Fallback:** CodeGraph가 없거나 실패하면 `search-first`의 `rg`, `rg --files`, 직접 파일 읽기 흐름으로 전환한다.

### 에이전트에 남긴 요청

```text
UserService를 바꾸기 전에 codegraph로 호출자와 영향 범위를 확인해 줘.
영향을 받는 파일과 테스트 후보를 알려주고, 최신 소스도 직접 확인해 줘.
```

## 4. Ponytail — 필요한 만큼만 구현

**쓴 경우:** 새 라이브러리나 긴 코드를 추가하기 직전

Ponytail은 “이 기능을 새로 만들어야 하나?”를 먼저 확인한다. 기존 코드, 표준 라이브러리, 플랫폼 기본 기능, 이미 설치된 패키지 순서로 살핀다. 그래도 없을 때만 작은 구현을 더한다. 검증, 오류 처리, 보안, 접근성은 줄이지 않는다. [Ponytail 공식 저장소](https://github.com/DietrichGebert/ponytail)

### 핵심 흐름

```text
정말 필요한 기능인가?
→ 기존 코드 재사용
→ 표준 라이브러리
→ 플랫폼 기본 기능
→ 이미 설치된 패키지
→ 한 줄 또는 최소 구현
```

### SKILL.md 본문 일부

> “Stop at the first rung that holds.”
>
> “Native platform feature covers it? `<input type="date">` over a picker lib...”

자연스럽게 옮기면 다음 뜻이다.

> “문제가 해결되는 가장 이른 단계에서 멈춘다.”
>
> “플랫폼 기본 기능으로 해결된다면, 날짜 선택 라이브러리보다 `<input type="date">`를 먼저 쓴다.”

*Ponytail [SKILL.md 원문](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md)에서 일부 발췌했습니다.*

### 코드로 비교해 보면

목록 화면에서 URL의 `tab` 값 하나만 읽는 상황을 기록해 둔다. 필요한 값은 `all`, `open`, `done` 중 하나이고, 복잡한 URL 직렬화는 없다.

**과잉 구현 — 새 라이브러리와 래퍼 추가**

```ts
import queryString from "query-string";

export function getSelectedTab(search: string) {
  const parsed = queryString.parse(search);
  const tab = parsed.tab;

  return tab === "open" || tab === "done" ? tab : "all";
}
```

이 코드 자체가 틀린 것은 아니다. 다만 값 하나를 읽기 위해 새 패키지와 별도 래퍼를 관리하게 된다.

**간략 구현 — 브라우저 기본 기능 사용**

```ts
const tab = new URLSearchParams(location.search).get("tab");
const selectedTab = tab === "open" || tab === "done" ? tab : "all";
```

`URLSearchParams`로 값을 읽고, 허용하지 않은 값은 `all`로 되돌린다. 배열 파라미터, 중첩 객체, 특수한 직렬화 규칙이 생길 때만 기존 유틸이나 라이브러리를 다시 검토하면 된다.

### 비교 메모

- **소스량:** 과잉 구현은 빈 줄을 뺀 6줄, 간략 구현은 2줄이다.
- **의존성:** 과잉 구현은 `query-string` 패키지 1개가 추가되고, 간략 구현은 추가 패키지가 없다.
- **새 함수:** `getSelectedTab`은 한 번만 쓰면서 두 줄을 감싼다. 재사용할 곳이나 독립된 예외 규칙이 없다면 함수로 분리할 이유가 약하다.

같은 파싱이 두 곳 이상에서 반복되거나, 탭 허용 규칙이 별도 테스트 대상이 되면 함수로 분리한다. Ponytail은 함수를 없애는 규칙이 아니라, 지금 필요한 책임이 있는지 먼저 확인하는 기준에 가깝다.

### 에이전트에 남긴 요청

```text
날짜 선택 UI가 필요해.
Ponytail 기준으로 기존 코드와 브라우저 기본 기능을 먼저 확인하고,
새 의존성 없이 가능한 가장 작은 구현을 제안해 줘.
```

## 참고 자료

- [CodeGraph 공식 저장소](https://github.com/colbymchenry/codegraph)
- [Ponytail 공식 저장소](https://github.com/DietrichGebert/ponytail)
