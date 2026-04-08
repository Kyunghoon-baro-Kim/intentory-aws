# Unit 4: Frontend — Business Rules

## 인증 규칙
- 회원가입 역할: customer 또는 influencer만 선택 가능 (admin은 Admin-A가 별도 생성)
- JWT token은 localStorage에 저장, 모든 인증 API 요청에 Authorization 헤더 포함

## 역할 접근 규칙
- admin_a: 모든 Admin 기능 접근 가능
- admin_b: 커미션 조회 불가 (UI에서 disabled 표시)
- influencer: 인플루언서 대시보드만 접근
- customer: 주문, 리뷰 작성 가능

## 리뷰 규칙
- Customer 역할만 리뷰 작성 가능
- 별점: 1~5 정수, 필수
- 텍스트: 필수
- 이미지 URL: 선택
- 동일 상품에 중복 리뷰 불가 (userId + productId unique)

## 주문 규칙
- 로그인 필수
- 재고 부족 시 주문 불가 (백엔드 검증)
- 수량: 1 이상, 재고 이하
- 레퍼럴 코드: URL query에서 자동 감지

## 인플루언서 규칙
- influencer 역할만 프로필 등록/수정 가능
- 레퍼럴 링크: influencer만 생성 가능
- 커미션: influencer는 본인 것만, admin_a는 전체 조회

## 다크 모드 규칙
- 기본: OS 시스템 설정 따름
- 수동 토글 시 localStorage에 저장, 이후 시스템 설정보다 우선
