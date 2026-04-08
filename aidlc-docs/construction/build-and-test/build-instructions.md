# Build Instructions

## Prerequisites
- **Node.js**: v22+
- **pnpm**: v10+
- **PostgreSQL**: 16 (production) 또는 docker-compose (로컬)

## Build Steps

### 1. Dependencies 설치
```bash
pnpm install
```

### 2. Prisma Client 생성
```bash
cd packages/api
npx prisma generate
```

### 3. 전체 빌드
```bash
# 루트에서 실행
pnpm build
```

### 4. 빌드 결과 확인
- **API**: `packages/api/dist/` — NestJS 컴파일 결과
- **Frontend**: `packages/frontend/dist/` — Vite 번들 결과
  - `index.html`, `assets/index-*.css`, `assets/index-*.js`

## 로컬 실행 (개발)
```bash
# PostgreSQL 시작
docker-compose up -d

# DB 마이그레이션 + 시드
cd packages/api
npx prisma db push
npx ts-node prisma/seed.ts

# 개발 서버 시작
cd ../..
pnpm dev
```

## Troubleshooting

### Prisma generate 실패
- `pnpm approve-builds` 실행 후 prisma 관련 패키지 승인
- `npx prisma generate` 재실행

### 빌드 시 TypeScript 에러
- `node_modules` 삭제 후 `pnpm install` 재실행
