# Unit 4: Frontend — Functional Design Plan

## Unit Context
- **범위**: packages/frontend 전체 (Tailwind CSS, 다크 모드, 반응형, 모든 페이지)
- **Stories**: US-6.1 + 모든 페이지 UI
- **프로젝트 타입**: Brownfield (기존 React + inline style → Tailwind CSS 전환)
- **의존성**: Unit 1(Auth API), Unit 2(Products/Orders API), Unit 3(Reviews/Influencer/Collaborations/Referrals API)

## Plan Steps
- [x] Step 1: 기존 프론트엔드 컴포넌트 분석
- [x] Step 2: 질문 수집 및 답변 확인
- [x] Step 3: 프론트엔드 컴포넌트 설계 (component hierarchy, props, state)
- [x] Step 4: 비즈니스 로직 모델 생성
- [x] Step 5: 비즈니스 규칙 정의
- [x] Step 6: 도메인 엔티티 정의

## Functional Design 질문

아래 질문에 답변해주세요. 각 질문의 `[Answer]:` 뒤에 답변을 작성해주세요.

---

### Q1. 다크 모드 기본값
다크 모드의 기본 동작을 어떻게 설정할까요?

A) 시스템 설정 따르기 (OS 다크 모드 감지) — 기본값, 수동 토글 가능
B) 항상 라이트 모드 — 수동 토글로 다크 모드 전환
C) 항상 다크 모드 — 수동 토글로 라이트 모드 전환

[Answer]: A

---

### Q2. 회원가입 시 역할 선택 UI
새로운 역할 체계(Customer, Influencer)에 맞게 회원가입 UI를 어떻게 구성할까요?

A) 라디오 버튼으로 Customer / Influencer 선택
B) 탭 형태로 Customer / Influencer 분리
C) 기본 Customer로 가입, 이후 Influencer 전환 기능 제공

[Answer]: B

---

### Q3. 인플루언서 전용 페이지 구성
인플루언서 관련 페이지를 어떻게 구성할까요?

A) 단일 대시보드 페이지에 프로필/협업/레퍼럴/커미션 탭으로 구성
B) 각각 별도 페이지 (프로필, 협업 목록, 레퍼럴 링크, 커미션)
C) 프로필은 별도 페이지, 나머지는 대시보드에 통합

[Answer]: A

---

### Q4. 리뷰 작성 UI 위치
리뷰 작성 기능을 어디에 배치할까요?

A) 상품 상세 페이지 하단에 리뷰 섹션 통합
B) 별도 리뷰 작성 페이지
C) 주문 내역에서 "리뷰 작성" 버튼 → 모달

[Answer]: A

---

### Q5. Admin 역할 구분 UI
Admin-A와 Admin-B의 UI 차이를 어떻게 처리할까요?

A) 동일 Admin 페이지에서 역할에 따라 메뉴/기능 숨김 처리
B) Admin-A / Admin-B 별도 대시보드
C) 동일 대시보드, 접근 불가 기능은 비활성화(disabled) 표시

[Answer]: C

---

### Q6. 네비게이션 구조
역할별 네비게이션을 어떻게 구성할까요?

A) 단일 상단 네비게이션 바 — 역할에 따라 메뉴 항목 동적 표시
B) 상단 네비게이션 + 사이드바 (Admin/Influencer 전용)
C) 상단 네비게이션만 — 모든 역할 동일 구조

[Answer]: A

---
