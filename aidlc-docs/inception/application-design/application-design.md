# Application Design — 통합 문서 (축소판)

## 1. 아키텍처 개요

### 기술 스택
- **Backend**: NestJS + TypeScript + Prisma ORM + PostgreSQL
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Payment**: Mock (추후 Stripe 교체 가능)
- **Test**: Vitest (TDD)
- **Infra**: Docker Compose (로컬만)

### 역할 체계
| 역할 | 코드 | 설명 |
|---|---|---|
| Customer | `customer` | 상품 구매, 리뷰 작성 |
| Admin-A | `admin_a` | 전체 권한 (회계 포함) |
| Admin-B | `admin_b` | 운영 권한 (회계 제외) |
| Influencer | `influencer` | 프로필 관리, 협업, 레퍼럴 |

## 2. 모듈 구조 (11개 모듈)

Auth, Users, Products, Orders, Inventory, Payments(mock), Reviews, Influencer, Collaborations, Referrals, Prisma

상세: `components.md` 참조

## 3. 메서드 시그니처

상세: `component-methods.md` 참조

## 4. Orchestration 패턴 (3개)

1. 주문 생성 (Mock 결제 → 재고 차감 → 레퍼럴 귀속)
2. 협업 제안 (인플루언서 확인 → 상태 추적)
3. 레퍼럴 커미션 (레퍼럴 코드 → 주문 귀속 → 커미션 생성)

상세: `services.md` 참조

## 5. 의존성 및 RBAC

11개 모듈 간 의존성 + 4개 역할 RBAC 매트릭스

상세: `component-dependency.md` 참조
