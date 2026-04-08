# Services — Orchestration Patterns (축소판)

## 핵심 Orchestration 흐름

### 1. 주문 생성 흐름 (OrdersService orchestrates)
```
OrdersService.create()
  → ProductsService.findById() (재고 확인)
  → PaymentsService.processPayment() (Mock 결제 — 즉시 성공/실패)
  → 성공: OrdersService.updateStatus('paid') + InventoryService.adjustStock()
  → 실패: OrdersService.updateStatus('cancelled')
  → ReferralsService.trackReferral() (레퍼럴 귀속, if applicable)
```

### 2. 협업 제안 흐름 (CollaborationsService orchestrates)
```
CollaborationsService.create()
  → InfluencerService.findById() (인플루언서 확인)
  → 협업 레코드 생성 (status: proposed)
  → [상태 변경] CollaborationsService.updateStatus()
```

### 3. 레퍼럴 커미션 흐름 (ReferralsService orchestrates)
```
고객 접속: /products/{id}?ref={code}
  → ReferralsService (레퍼럴 코드 저장)
  → 주문 생성 시: ReferralsService.trackReferral()
    → Commission 레코드 생성 (status: pending)
```

---

## 서비스 간 통신 패턴

| 패턴 | 사용처 | 설명 |
|---|---|---|
| Direct Injection | 모든 서비스 간 호출 | NestJS DI로 서비스 주입 |
