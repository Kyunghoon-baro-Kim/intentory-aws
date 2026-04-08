# Unit 4: Frontend — Frontend Components Design

## 컴포넌트 계층 구조

```
App
├── ThemeProvider (다크 모드 상태)
├── AuthProvider (인증 상태)
├── BrowserRouter
│   ├── /login → Login
│   ├── /register → Register
│   ├── / → Layout
│   │   ├── Navbar (역할별 동적 메뉴)
│   │   ├── Outlet
│   │   │   ├── / → Storefront
│   │   │   ├── /products/:id → ProductDetail
│   │   │   │   └── ReviewSection (리뷰 목록 + 작성 폼)
│   │   │   ├── /orders → Orders (ProtectedRoute)
│   │   │   ├── /influencer → InfluencerDashboard (ProtectedRoute, influencer)
│   │   │   │   ├── Tab: 프로필
│   │   │   │   ├── Tab: 협업
│   │   │   │   ├── Tab: 레퍼럴 링크
│   │   │   │   └── Tab: 커미션
│   │   │   ├── /admin → AdminDashboard (ProtectedRoute, admin)
│   │   │   ├── /admin/products → AdminProducts
│   │   │   ├── /admin/orders → AdminOrders
│   │   │   ├── /admin/inventory → AdminInventory
│   │   │   ├── /admin/influencers → AdminInfluencers
│   │   │   └── /admin/commissions → AdminCommissions (admin_a only, disabled for admin_b)
│   │   └── DarkModeToggle (Navbar 내 배치)
```

## 컴포넌트 상세

### ThemeProvider
- **State**: `theme: 'light' | 'dark' | 'system'`
- **로직**: localStorage 저장, OS prefers-color-scheme 감지, `<html>` class 토글
- **Props**: children

### AuthContext (수정)
- **State 추가**: `role: Role` (customer, admin_a, admin_b, influencer)
- **register 수정**: `role` 파라미터 추가
- **API 변경**: `/api/auth/register` body에 `role` 필드 추가

### Layout / Navbar
- **역할별 메뉴**:
  - Public: Store
  - Customer: Store, My Orders
  - Admin (admin_a, admin_b): Store, Admin
  - Influencer: Store, My Dashboard
- **DarkModeToggle**: 🌙/☀️ 아이콘 토글 버튼

### Register (수정)
- **탭 UI**: Customer / Influencer 탭
- **State**: `activeTab: 'customer' | 'influencer'`
- **API**: role 필드를 탭 선택에 따라 전송

### ProductDetail (수정)
- **추가**: ReviewSection 컴포넌트 하단 통합
- **레퍼럴**: URL query `?ref={code}` 감지 → 주문 시 referralCode 전송

### ReviewSection (신규)
- **Props**: `productId: number`
- **State**: `reviews: Review[]`, `rating: number`, `comment: string`
- **API**: `GET /reviews/product/:id`, `POST /reviews`
- **조건**: 로그인 + Customer 역할만 작성 폼 표시

### InfluencerDashboard (신규)
- **State**: `activeTab: 'profile' | 'collaborations' | 'referrals' | 'commissions'`
- **탭 컴포넌트**:
  - ProfileTab: 프로필 등록/수정 폼
  - CollaborationsTab: 협업 목록 + 상태 표시
  - ReferralsTab: 레퍼럴 링크 생성 + 목록
  - CommissionsTab: 커미션 내역 테이블

### AdminDashboard (수정)
- **역할 구분**: admin_a / admin_b
- **admin_b 비활성화**: 커미션 조회 메뉴 disabled 표시
- **추가 메뉴**: Influencers, Commissions

### AdminInfluencers (신규)
- **API**: `GET /influencer` (인플루언서 목록)
- **기능**: 협업 제안 생성 (`POST /collaborations`)

### AdminCommissions (신규)
- **API**: `GET /referrals/commissions`
- **접근**: admin_a만 활성, admin_b는 disabled

## 라우트 정의

| Path | Component | Guard | 역할 |
|---|---|---|---|
| /login | Login | - | Public |
| /register | Register | - | Public |
| / | Storefront | - | Public |
| /products/:id | ProductDetail | - | Public |
| /orders | Orders | Auth | customer, admin_a, admin_b |
| /influencer | InfluencerDashboard | Auth+Role | influencer |
| /admin | AdminDashboard | Auth+Role | admin_a, admin_b |
| /admin/products | AdminProducts | Auth+Role | admin_a, admin_b |
| /admin/orders | AdminOrders | Auth+Role | admin_a, admin_b |
| /admin/inventory | AdminInventory | Auth+Role | admin_a, admin_b |
| /admin/influencers | AdminInfluencers | Auth+Role | admin_a, admin_b |
| /admin/commissions | AdminCommissions | Auth+Role | admin_a (admin_b: disabled) |
