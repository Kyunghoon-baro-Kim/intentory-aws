# Inventrix 현대화 프로젝트 — Requirements Document (축소판)

## Intent Analysis Summary
- **User Request**: 2시간 내 4명 개발자가 최종 결과물을 볼 수 있도록 축소. Influencer 페르소나 유지.
- **Request Type**: 아키텍처 현대화 + 핵심 기능만
- **Scope**: 눈에 보이는 기능만 (보안/분석/멀티채널/AI예측/바코드/배치 삭제)
- **Complexity**: Moderate (축소)
- **Time Constraint**: 2시간

---

## 삭제된 기능 (눈에 보이지 않는 기능)
- ~~엔터프라이즈 보안 (MFA, Rate Limiting, 보안 헤더, SOC2/GDPR)~~
- ~~분석/KPI 대시보드~~
- ~~멀티채널 재고 관리 (Shopify/Amazon)~~
- ~~AI 수요 예측 / 자동 재주문~~
- ~~바코드/QR 스캐닝~~
- ~~배치/로트 추적~~
- ~~배송 추적~~
- ~~감사 로그~~
- ~~WCAG 접근성~~
- ~~API 버전닝 (v1/v2)~~
- ~~Security Extension Rules~~

---

## 1. Functional Requirements

### FR-01: 데이터베이스 마이그레이션
- SQLite → PostgreSQL (Prisma ORM)
- 기존 테이블 마이그레이션 (users, products, orders, order_items)
- 신규 테이블 추가 (reviews, influencer_profiles, collaborations, referrals, commissions)

### FR-02: 백엔드 프레임워크 전환
- Express → NestJS
- 모듈화 구조 (Module, Controller, Service)

### FR-03: 사용자 인증 (기본)
- 4개 역할: customer, admin_a, admin_b, influencer
- JWT 인증 (기본 — Access Token만)
- 역할 기반 접근 제어 (RolesGuard)
- Admin-A: 전체 권한 (회계 포함)
- Admin-B: 운영 권한 (회계 제외)

### FR-04: 상품 관리
- 상품 CRUD (Admin-A, Admin-B)
- AI 이미지 생성 (기존 유지)

### FR-05: 주문 처리
- 주문 생성 (Mock 결제, 재고 차감)
- 주문 조회 (본인/전체)
- 주문 상태 관리 (Admin)

### FR-06: 재고 관리
- 재고 현황 조회 (in_stock/low_stock/out_of_stock)

### FR-07: 사용자 리뷰 및 별점
- 5점 만점 별점 + 텍스트 + 이미지 첨부
- 상품별 리뷰 목록 + 평균 별점
- 리뷰 삭제 (Admin)

### FR-08: 인플루언서 협업 채널
- 인플루언서 프로필 등록/수정
- 협업 제안 생성 (Admin → Influencer)
- 협업 상태 추적 (proposed → accepted/rejected → in_progress → completed)

### FR-09: 인플루언서 레퍼럴 보상
- 레퍼럴 링크 생성 (Influencer)
- 레퍼럴 주문 귀속 추적
- 커미션 내역 조회 (Influencer: 본인, Admin-A: 전체)

### FR-10: 프론트엔드 현대화
- 인라인 스타일 → Tailwind CSS
- 다크 모드 (시스템 감지 + 수동 전환)
- Mobile-First 반응형

---

## 2. Non-Functional Requirements

### NFR-01: TDD
- Vitest (frontend + backend)
- Unit test + Integration test
- 기존 코드 refactoring 시 regression test 먼저

### NFR-02: Side Effect 방지
- 기존 API 계약 유지
- 테스트로 regression 검증

### NFR-03: 인프라
- Docker Compose (로컬 개발: API + PostgreSQL + Redis)

### NFR-04: 보안 (최소한)
- JWT 인증
- 입력 유효성 검증 (기본)
- CORS 설정

---

## 3. Technical Decisions

| 영역 | 결정 |
|---|---|
| Database | PostgreSQL (Prisma ORM) |
| Backend | NestJS |
| Frontend | Tailwind CSS |
| Test | Vitest |
| Infra | Docker Compose (로컬만) |
| Payment | Mock |
| Security | 기본 (JWT + 입력 검증) |
| Security Extensions | Disabled |

---

## 4. Constraints
- 2시간 내 4명 개발자가 결과물 확인 가능
- Influencer 페르소나 유지
- 눈에 보이는 기능만 구현
- 역할 체계: Customer, Admin-A, Admin-B, Influencer
