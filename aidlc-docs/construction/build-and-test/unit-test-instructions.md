# Unit Test Execution

## Run All Unit Tests
```bash
pnpm --filter api test
```

## Test Results (2026-04-08)

| Test File | Tests | Status |
|---|---|---|
| auth.service.spec.ts | 7 | ✅ |
| products.service.spec.ts | 6 | ✅ |
| orders.service.spec.ts | 8 | ✅ |
| payments.service.spec.ts | 2 | ✅ |
| inventory.service.spec.ts | 3 | ✅ |
| reviews.service.spec.ts | 7 | ✅ |
| influencer.service.spec.ts | 5 | ✅ |
| collaborations.service.spec.ts | 6 | ✅ |
| referrals.service.spec.ts | 9 | ✅ |
| **Total** | **53** | **✅ All Passed** |

- **Duration**: ~900ms
- **Framework**: Vitest 1.6.1

## Test Coverage by Unit

### Unit 1 (Backend Core)
- AuthService: register, login, createAdmin, 중복 이메일, 잘못된 역할

### Unit 2 (Products & Orders)
- ProductsService: findAll, findById(성공/404), create, update, delete
- OrdersService: create(GST 계산/재고부족/결제실패), findAll(admin/customer), findById(성공/404), updateStatus
- PaymentsService: processPayment, refund
- InventoryService: out_of_stock, low_stock, in_stock

### Unit 3 (Reviews & Influencer)
- ReviewsService: create, findByProduct, delete, getAverageRating
- InfluencerService: createProfile, updateProfile, findAll
- CollaborationsService: create, updateStatus, findByInfluencer
- ReferralsService: generateLink, trackReferral, getStats, getCommissions
