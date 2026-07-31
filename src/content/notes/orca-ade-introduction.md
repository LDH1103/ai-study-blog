---
title: "Orca ADE: 여러 코딩 에이전트를 한 작업 흐름으로 묶는 방법"
description: "Orca ADE가 CLI 코딩 에이전트, Git worktree, 터미널, 브라우저, 코드 리뷰를 어떻게 한곳에서 관리하는지 정리합니다."
publishedAt: 2026-08-01
tags:
  - AI 개발 도구
  - 코딩 에이전트
  - Orca ADE
---

## Orca ADE란?

Orca는 Codex나 Claude Code 같은 CLI 코딩 에이전트를 한 곳에서 실행하고 관리하는 ADE입니다. 새 모델을 제공하는 서비스가 아니라, 기존 로그인과 구독을 연결해 worktree·터미널·브라우저·코드 리뷰 흐름을 묶는 작업 환경에 가깝습니다.

## 핵심 기능

- **병렬 worktree**: 작업마다 Git worktree를 분리해 여러 에이전트의 수정을 섞지 않고 비교합니다.
- **여러 에이전트 연결**: Codex, Claude Code, Gemini, Copilot, OpenCode 등 CLI 에이전트를 같은 화면에서 실행합니다.
- **Design Mode**: 브라우저 요소를 클릭해 HTML·CSS·스크린샷을 에이전트에게 전달합니다.
- **검토와 원격 작업**: diff에 의견을 남겨 다시 요청하고, SSH worktree와 사용량 확인도 지원합니다.

## 언제 유용할까?

독립적으로 나눌 수 있는 버그 수정, 실험적인 구현, 테스트 보강에 효과가 큽니다. 같은 요청을 두 에이전트에게 맡기고 diff와 테스트 결과를 비교한 뒤, 더 적절한 변경만 고르면 됩니다.

## 기억할 점

Git worktree는 작업 충돌을 줄이는 도구일 뿐 보안 sandbox는 아닙니다. 에이전트가 실행하는 명령과 접근 권한은 여전히 확인해야 합니다. 병렬 실행은 결과뿐 아니라 사용량과 검토량도 함께 늘리므로, 처음에는 작은 작업부터 나누는 편이 좋습니다.

Orca는 에이전트가 알아서 개발해 주는 도구라기보다, 여러 에이전트의 작업을 분리하고 사람이 검토하기 쉽게 만드는 관제 화면에 가깝습니다.

## 참고 자료

- [Orca 공식 사이트 — 제품 개요와 기능 목록](https://www.onorca.dev/)
- [Orca GitHub 저장소](https://github.com/stablyai/orca)
