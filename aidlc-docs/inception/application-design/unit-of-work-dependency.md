# Unit of Work Dependencies (축소판 — 4명 2시간)

## 팀 구성
- **Dev A, Dev B, Dev C, Dev D** (4명)

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

## Mock 전략

### Auth Mock (Dev B, Dev C가 0:00~0:20에 사용)
```typescript
export const mockAuthGuard = { canActivate: () => true };
export const mockCurrentUser = { id: 1, role: 'admin_a' };
```

Dev A가 Auth 인터페이스를 먼저 정의 → Dev B, C는 mock으로 병렬 개발 → 0:20 이후 실제 연결
