# Unit 4: Frontend — Code Generation Plan

## Unit Context
- **범위**: packages/frontend 전체
- **Stories**: US-6.1 + 모든 페이지 UI
- **의존성**: Backend API endpoint 확정 (Unit 1 push 완료)

## Code Generation Steps

- [x] Step 1: Tailwind CSS 설치 및 설정 (tailwind.config.js, postcss, index.css, dark mode)
- [x] Step 2: ThemeProvider (다크 모드 context) + AuthContext 수정 (role 추가)
- [x] Step 3: Layout + Navbar 리팩토링 (Tailwind + 역할별 동적 메뉴 + DarkModeToggle)
- [x] Step 4: Login / Register 페이지 리팩토링 (Tailwind + 역할 탭)
- [x] Step 5: Storefront 페이지 리팩토링 (Tailwind + 반응형 그리드)
- [x] Step 6: ProductDetail 리팩토링 + ReviewSection 신규 (Tailwind + 리뷰 통합)
- [x] Step 7: Orders 페이지 리팩토링 (Tailwind)
- [x] Step 8: AdminDashboard 리팩토링 (Tailwind + admin_b disabled 처리 + 신규 메뉴)
- [x] Step 9: AdminProducts / AdminOrders / AdminInventory 리팩토링 (Tailwind)
- [x] Step 10: AdminInfluencers 신규 (인플루언서 목록 + 협업 제안)
- [x] Step 11: AdminCommissions 신규 (커미션 내역, admin_a only)
- [x] Step 12: InfluencerDashboard 신규 (프로필/협업/레퍼럴/커미션 탭)
- [x] Step 13: App.tsx 라우트 업데이트 (신규 페이지 + RoleRoute)

## Story Traceability
| Step | Stories |
|---|---|
| Step 1-3 | US-6.1 (Tailwind + 다크 모드 + 반응형) |
| Step 4 | US-1.1 (역할 선택 회원가입), US-1.2 (로그인) |
| Step 5 | US-2.2 (상품 목록) |
| Step 6 | US-2.2 (상품 상세), US-4.1 (리뷰 작성), US-4.2 (리뷰 조회) |
| Step 7 | US-3.2 (주문 조회) |
| Step 8-9 | US-2.1 (상품 CRUD), US-3.3 (주문 상태), US-1.3 (권한 분리) |
| Step 10 | US-5.2 (협업 제안) |
| Step 11 | US-5.4 (커미션 조회) |
| Step 12 | US-5.1 (프로필), US-5.2 (협업), US-5.3 (레퍼럴), US-5.4 (커미션) |
| Step 13 | 전체 라우팅 통합 |
