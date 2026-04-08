# Unit 4: Frontend — Business Logic Model

## 1. 인증 흐름
- 로그인: email + password → JWT token + user 정보 저장 (localStorage)
- 회원가입: 탭 선택(Customer/Influencer) → email + password + name + role → JWT token
- 로그아웃: localStorage 클리어 + 상태 초기화

## 2. 역할 기반 라우팅
- `ProtectedRoute`: token 없으면 /login redirect
- `RoleRoute`: 허용 역할 배열 체크, 불일치 시 / redirect
- Admin 페이지: admin_a, admin_b 허용
- Influencer 페이지: influencer만 허용

## 3. 다크 모드 로직
- 초기값: localStorage 확인 → 없으면 OS prefers-color-scheme
- 토글: light ↔ dark 전환, localStorage 저장
- 적용: `<html>` 태그에 `class="dark"` 토글 (Tailwind dark mode)

## 4. 상품 주문 흐름
- 상품 상세 → 수량 선택 → 주문 생성
- 레퍼럴 코드: URL `?ref={code}` → 주문 시 referralCode 포함
- GST 10% 자동 계산 (백엔드)

## 5. 리뷰 흐름
- 상품 상세 하단에서 리뷰 목록 조회 + 평균 별점 표시
- Customer 로그인 시 리뷰 작성 폼 표시
- 별점(1~5) + 텍스트(필수) + 이미지 URL(선택)

## 6. 인플루언서 대시보드 흐름
- 프로필 탭: 미등록 시 등록 폼, 등록 시 수정 폼
- 협업 탭: 내 협업 목록 + 상태 표시 (proposed/accepted/rejected/in_progress/completed)
- 레퍼럴 탭: 상품 선택 → 링크 생성, 기존 링크 목록
- 커미션 탭: 커미션 내역 테이블

## 7. Admin 흐름
- 대시보드: 매출/주문/상품/재고 요약 카드
- 상품 관리: CRUD + AI 이미지 생성
- 주문 관리: 상태 변경 (pending → processing → shipped → delivered / cancelled)
- 재고 관리: 재고 현황 테이블
- 인플루언서 관리: 목록 조회 + 협업 제안 생성
- 커미션 관리: admin_a만 활성, admin_b는 disabled 표시
