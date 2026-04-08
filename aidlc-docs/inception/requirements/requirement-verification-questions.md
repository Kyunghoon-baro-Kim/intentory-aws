# Requirements Verification Questions

Inventrix 현대화 프로젝트의 요구사항을 명확히 하기 위한 질문입니다.
각 질문의 `[Answer]:` 태그 뒤에 선택한 옵션 문자를 입력해 주세요.

---

## Question 1
이번 현대화의 주요 목표 우선순위는 무엇인가요?

A) 아키텍처 현대화 우선 (DB 마이그레이션, 코드 구조 개선, TDD 기반 구축) → 이후 새 기능 추가
B) 새 기능 추가 우선 (실시간 재고, 멀티채널, 바코드 스캐닝 등) → 이후 아키텍처 개선
C) 아키텍처 현대화와 새 기능 추가를 동시에 진행
D) 기술 부채 해결 우선 (보안 취약점, 입력 검증, 테스트 코드) → 이후 현대화
X) Other (please describe after [Answer]: tag below)

[Answer]: C, D

---

## Question 2
데이터베이스 마이그레이션 전략은 어떻게 하시겠습니까?

A) SQLite → PostgreSQL 전환 (ORM으로 Prisma 사용)
B) SQLite → PostgreSQL 전환 (ORM으로 TypeORM 사용)
C) SQLite → PostgreSQL 전환 (ORM 없이 raw SQL + pg 드라이버)
D) SQLite 유지하면서 Redis 캐싱만 추가
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
TDD 적용 범위와 테스트 프레임워크는 어떻게 하시겠습니까?

A) Vitest (frontend + backend 통합) — unit test + integration test 모두
B) Jest (backend) + Vitest (frontend) — 각각 분리
C) Jest (frontend + backend 통합) — unit test + integration test 모두
D) Vitest (unit test만) — integration test는 추후 별도 추가
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
이번 현대화에서 추가하고 싶은 새 기능의 우선순위를 선택해 주세요. (가장 중요한 것)

A) 실시간 재고 업데이트 (WebSocket/SSE) + 실시간 KPI 대시보드
B) 바코드/QR 스캐닝 + 배치/로트 추적
C) 멀티채널 재고 관리 (Shopify/Amazon 통합)
D) AI 수요 예측 + 자동 재주문 시스템
E) 결제 게이트웨이 통합 (Stripe) + 배송 API 통합
X) Other (please describe after [Answer]: tag below)

[Answer]: A, E, C, B, D

---

## Question 5
프론트엔드 현대화 방향은 어떻게 하시겠습니까?

A) 현재 인라인 스타일 → Tailwind CSS 전환 + 다크 모드 + 반응형 (Mobile-First)
B) 현재 인라인 스타일 → CSS Modules 전환 + 다크 모드 + 반응형
C) 현재 인라인 스타일 → styled-components 전환 + 다크 모드 + 반응형
D) UI 라이브러리 도입 (shadcn/ui 또는 MUI) + 다크 모드 + 반응형
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
백엔드 프레임워크 전환을 고려하시나요?

A) Express 유지하면서 구조만 개선 (service layer, repository pattern 분리)
B) Express → NestJS 전환 (모듈화, DI, 데코레이터 기반)
C) Express 유지 + 점진적으로 NestJS 패턴 도입 (service/repository 분리 후 추후 전환)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 7
배포 환경과 인프라 전략은 어떻게 하시겠습니까?

A) AWS 기반 — EC2 + RDS (PostgreSQL) + ElastiCache (Redis)
B) AWS 기반 — ECS (Docker 컨테이너) + RDS + ElastiCache
C) AWS 기반 — Lambda (Serverless) + Aurora Serverless + ElastiCache
D) 로컬 개발 환경만 우선 구축 (Docker Compose) — 클라우드 배포는 추후
X) Other (please describe after [Answer]: tag below)

[Answer]: B, X(local환경도 하이브리드로 구성해줘)

---

## Question 8
보안 강화 수준은 어떻게 하시겠습니까?

A) 기본 보안만 (입력 검증, JWT 개선, CORS 제한, Rate Limiting)
B) 표준 보안 (기본 + HTTPS 강제, 보안 헤더, 감사 로그, 환경 변수 관리)
C) 엔터프라이즈 보안 (표준 + SOC 2/GDPR 준비, MFA, 취약점 스캔)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 9
refactoring 시 side effect 방지를 위한 구체적인 전략은 어떤 것을 원하시나요?

A) 기존 API 계약(contract) 유지 + 테스트로 regression 방지 — 내부 구조만 변경
B) API 버전닝 (v1/v2) 도입 — 기존 API 유지하면서 새 API 병행
C) Feature flag 기반 — 새 기능을 flag로 제어하여 점진적 전환
D) A + C 조합 (API 계약 유지 + feature flag + 테스트)
X) Other (please describe after [Answer]: tag below)

[Answer]: A, B

---

## Question 10: Security Extensions
이 프로젝트에 security extension rules를 적용하시겠습니까?

A) Yes — 모든 SECURITY rules를 blocking constraints로 적용 (프로덕션 수준 애플리케이션에 권장)
B) No — SECURITY rules 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: A
