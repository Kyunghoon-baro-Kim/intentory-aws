# Integration Test Instructions

## 목적
Frontend ↔ API ↔ PostgreSQL 간 연동 테스트

## 환경 설정

### 1. PostgreSQL 시작
```bash
docker-compose up -d
```

### 2. DB 초기화
```bash
cd packages/api
npx prisma db push
npx ts-node prisma/seed.ts
```

### 3. API 서버 시작
```bash
cd packages/api
pnpm dev
```

## 테스트 시나리오

### Scenario 1: 인증 플로우
1. POST `/api/auth/register` — 회원가입
2. POST `/api/auth/login` — 로그인, JWT 토큰 수신
3. GET `/api/users/me` — 토큰으로 프로필 조회

### Scenario 2: 상품 → 주문 플로우
1. GET `/api/products` — 상품 목록 조회
2. POST `/api/orders` — 주문 생성 (JWT 필요)
3. GET `/api/orders` — 내 주문 목록 확인

### Scenario 3: Influencer 플로우
1. POST `/api/auth/login` (influencer 계정)
2. GET `/api/influencer/profile` — 프로필 조회
3. POST `/api/referrals` — 추천 링크 생성
4. GET `/api/collaborations` — 협업 목록 조회

### Scenario 4: Admin 플로우
1. POST `/api/auth/login` (admin 계정)
2. GET `/api/products` → PUT `/api/products/:id` — 상품 수정
3. GET `/api/orders` → PATCH `/api/orders/:id` — 주문 상태 변경

## 기존 Integration Test 실행
```bash
cd packages/api
pnpm test -- src/test/influencer-flow.integration.spec.ts
```

## Cleanup
```bash
docker-compose down -v
```
