# Components (축소판)

## NestJS Module 구조

```
packages/api/src/
├── app.module.ts
├── main.ts
├── common/
│   ├── guards/          # RolesGuard
│   ├── decorators/      # @Roles, @CurrentUser
│   └── pipes/           # ValidationPipe
├── prisma/              # PrismaModule
├── auth/                # AuthModule
├── users/               # UsersModule
├── products/            # ProductsModule
├── orders/              # OrdersModule
├── inventory/           # InventoryModule
├── payments/            # PaymentsModule (mock)
├── reviews/             # ReviewsModule
├── influencer/          # InfluencerModule
├── collaborations/      # CollaborationsModule
└── referrals/           # ReferralsModule
```

## Component 정의 (11개 모듈)

| Module | Purpose | Responsibilities |
|---|---|---|
| PrismaModule | DB 접근 | Prisma Client, 트랜잭션 |
| AuthModule | 인증 | 로그인, 회원가입, JWT |
| UsersModule | 사용자 관리 | CRUD, 역할 관리 (4개 역할) |
| ProductsModule | 상품 관리 | CRUD, AI 이미지 생성 |
| OrdersModule | 주문 처리 | 주문 생성/조회/상태 변경 |
| InventoryModule | 재고 관리 | 재고 현황 조회 |
| PaymentsModule | 결제 (mock) | Mock 결제 처리 |
| ReviewsModule | 리뷰 | 별점+텍스트+이미지, 조회, 삭제 |
| InfluencerModule | 인플루언서 | 프로필 등록/수정 |
| CollaborationsModule | 협업 | 제안 생성, 상태 추적 |
| ReferralsModule | 레퍼럴 | 링크 생성, 주문 귀속, 커미션 |

## RBAC 매트릭스

| 기능 | Customer | Admin-A | Admin-B | Influencer | Public |
|---|---|---|---|---|---|
| 상품 조회 | — | — | — | — | ✅ |
| 상품 CRUD | ❌ | ✅ | ✅ | ❌ | ❌ |
| 주문 (본인) | ✅ | ✅ | ✅ | ❌ | ❌ |
| 주문 (전체) | ❌ | ✅ | ✅ | ❌ | ❌ |
| 재고 조회 | ❌ | ✅ | ✅ | ❌ | ❌ |
| 리뷰 작성 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 리뷰 삭제 | ❌ | ✅ | ✅ | ❌ | ❌ |
| 인플루언서 프로필 | ❌ | ✅ | ✅ | ✅(own) | ❌ |
| 협업 제안 | ❌ | ✅ | ✅ | ❌ | ❌ |
| 레퍼럴 생성 | ❌ | ❌ | ❌ | ✅ | ❌ |
| 커미션 조회 | ❌ | ✅ | ❌ | ✅(own) | ❌ |
| Admin 관리 | ❌ | ✅ | ❌ | ❌ | ❌ |
