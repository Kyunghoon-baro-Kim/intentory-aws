# Integration Test Instructions

## Purpose
Unit 간 상호작용을 테스트하여 전체 비즈니스 흐름이 정상 동작하는지 검증.

## Test Scenarios

### Scenario 1: 주문 흐름 (Auth → Products → Orders → Inventory)
- **Description**: 회원가입 → 로그인 → 상품 조회 → 주문 생성 → 재고 차감 확인
- **Setup**: DB에 상품 seed 데이터 필요
- **Test Steps**:
  1. `POST /api/auth/register` — Customer 회원가입
  2. `POST /api/auth/login` — JWT 토큰 획득
  3. `GET /api/products` — 상품 목록 조회
  4. `POST /api/orders` — 주문 생성 (items + quantity)
  5. `GET /api/inventory` — 재고 차감 확인
- **Expected**: 주문 생성 후 상품 stock이 quantity만큼 감소

### Scenario 2: 리뷰 흐름 (Auth → Orders → Reviews)
- **Description**: 배송 완료된 주문에 대해 리뷰 작성
- **Setup**: delivered 상태의 주문 필요
- **Test Steps**:
  1. 로그인 (Customer)
  2. `POST /api/reviews` — 리뷰 작성 (rating + comment)
  3. `GET /api/reviews/product/:id` — 상품별 리뷰 확인
  4. `GET /api/reviews/product/:id/rating` — 평균 별점 확인
- **Expected**: 리뷰 생성 후 상품별 리뷰 목록에 포함

### Scenario 3: 레퍼럴 흐름 (Auth → Referrals → Orders)
- **Description**: 인플루언서 레퍼럴 링크로 주문 시 커미션 귀속
- **Setup**: Influencer 계정 + 상품 필요
- **Test Steps**:
  1. 로그인 (Influencer)
  2. `POST /api/referrals/link/:productId` — 레퍼럴 링크 생성
  3. 로그인 (Customer)
  4. `POST /api/orders` — referralCode 포함 주문
  5. `GET /api/referrals/stats` — 레퍼럴 실적 확인
- **Expected**: 주문이 레퍼럴 코드로 귀속

### Scenario 4: 협업 흐름 (Auth → Influencer → Collaborations)
- **Description**: Admin이 인플루언서에게 협업 제안
- **Test Steps**:
  1. 로그인 (Influencer) → 프로필 등록
  2. 로그인 (Admin-A)
  3. `POST /api/collaborations` — 협업 제안
  4. `PATCH /api/collaborations/:id/status` — 상태 변경 (accepted)
- **Expected**: 협업 상태가 proposed → accepted로 변경

## Setup Integration Test Environment

### 1. Start Database
```bash
docker run -d --name inventrix-db \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=inventrix \
  -p 5432:5432 postgres:14-alpine
```

### 2. Apply Schema & Start Server
```bash
cd packages/api
npx prisma generate
pnpm run build
node dist/main.js  # port 3003
```

### 3. Run Integration Tests
```bash
# curl 또는 httpie로 수동 테스트
# 또는 추후 e2e test suite 작성
```

## Cleanup
```bash
docker stop inventrix-db && docker rm inventrix-db
```
