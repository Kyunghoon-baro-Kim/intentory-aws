# Unit of Work (축소판 — 4명 2시간)

## Unit 분해 (4개 Unit = 4명 병렬)

### Unit 1: Backend Core (Dev A)
- **범위**: NestJS 골격, Prisma 스키마, AuthModule, UsersModule, Docker Compose
- **Stories**: US-1.1, 1.2, 1.3
- **산출물**: 프로젝트 부트스트랩, DB 스키마, 인증 API, Docker Compose

### Unit 2: Products & Orders (Dev B)
- **범위**: ProductsModule, OrdersModule, PaymentsModule(mock), InventoryModule
- **Stories**: US-2.1, 2.2, 3.1, 3.2, 3.3
- **산출물**: 상품/주문/재고 API

### Unit 3: Reviews & Influencer (Dev C)
- **범위**: ReviewsModule, InfluencerModule, CollaborationsModule, ReferralsModule
- **Stories**: US-4.1, 4.2, 5.1, 5.2, 5.3, 5.4
- **산출물**: 리뷰/인플루언서/협업/레퍼럴 API

### Unit 4: Frontend (Dev D)
- **범위**: packages/frontend 전체 (Tailwind CSS, 다크 모드, 반응형, 모든 페이지)
- **Stories**: US-6.1 + 모든 페이지 UI
- **산출물**: React 프론트엔드 전체

---

## 2시간 타임라인

```
0:00-0:20  Dev A: NestJS 골격 + Prisma 스키마 (전원 공유)
           Dev B: (대기 → 스키마 공유 후 시작)
           Dev C: (대기 → 스키마 공유 후 시작)
           Dev D: Tailwind 설정 + 레이아웃 + 다크 모드

0:20-1:00  Dev A: Auth + Users API + Docker Compose
           Dev B: Products + Orders + Mock Payment API
           Dev C: Reviews + Influencer + Collaborations + Referrals API
           Dev D: 로그인/회원가입 + 상점 + 상품상세 페이지

1:00-1:30  Dev A: 통합 테스트 + Auth mock 교체
           Dev B: 주문 흐름 테스트
           Dev C: 레퍼럴 흐름 테스트
           Dev D: 주문 + 리뷰 + 인플루언서 페이지

1:30-2:00  전원: 통합 테스트 + 버그 수정 + 데모 준비
```

## 의존성

```
Unit 1 (Dev A: 0:00~) → Unit 2, 3 (Dev B,C: 0:20~ 스키마 공유 후)
Unit 1,2,3 → Unit 4 (Dev D: API mock으로 병렬 시작, 1:00~ 실제 연결)
```
