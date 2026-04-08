# Unit Test Execution

## 실행 방법

### API Unit Tests
```bash
cd packages/api
pnpm test
```

### 테스트 결과 (2026-04-08 빌드 기준)
- **Test Files**: 13 passed (13)
- **Tests**: 71 passed (71)
- **Duration**: 1.19s

### 테스트 파일 목록
| 파일 | 테스트 수 |
|---|---|
| auth.service.spec.ts | 7 |
| collaborations.service.spec.ts | 11 |
| referrals.service.spec.ts | 9 |
| orders.service.spec.ts | 8 |
| reviews.service.spec.ts | 7 |
| products.service.spec.ts | 6 |
| influencer.service.spec.ts | 5 |
| influencer-flow.integration.spec.ts | 4 |
| roles.guard.spec.ts | 4 |
| users.service.spec.ts | 3 |
| inventory.service.spec.ts | 3 |
| payments.service.spec.ts | 2 |
| http-exception.filter.spec.ts | 2 |

### Coverage 실행
```bash
cd packages/api
pnpm test:cov
```
