# User Stories (축소판)

2시간 내 결과물 확인 가능한 핵심 stories만.

---

## Epic 1: 인증 (Auth)

### US-1.1: 회원가입 (역할 선택)
**As a** 신규 사용자, **I want to** Customer/Influencer 역할로 가입, **so that** 역할에 맞는 기능 이용.
**Persona**: Customer, Influencer
**Acceptance Criteria**:
- [ ] 역할 선택 (Customer/Influencer)
- [ ] JWT 토큰 발급
- [ ] Admin 계정은 Admin-A가 생성

### US-1.2: 로그인
**As a** 사용자, **I want to** 이메일/비밀번호로 로그인, **so that** 서비스 이용.
**Persona**: Customer, Admin-A, Admin-B, Influencer
**Acceptance Criteria**:
- [ ] JWT Access Token 발급
- [ ] 역할 정보 포함

### US-1.3: 관리자 권한 분리
**As a** Admin-A, **I want to** Admin-A/Admin-B 계정 생성, **so that** 회계 데이터 접근 제한.
**Persona**: Admin-A
**Acceptance Criteria**:
- [ ] Admin-A: 전체 접근
- [ ] Admin-B: 회계 데이터 제외
- [ ] 권한 없는 접근 시 403

---

## Epic 2: 상품 관리

### US-2.1: 상품 CRUD
**As a** Admin, **I want to** 상품 생성/조회/수정/삭제, **so that** 카탈로그 관리.
**Persona**: Admin-A, Admin-B
**Acceptance Criteria**:
- [ ] 상품 CRUD API
- [ ] 입력 유효성 검증

### US-2.2: 상품 목록/상세 조회
**As a** Customer, **I want to** 상품을 탐색, **so that** 구매할 상품 선택.
**Persona**: Customer (Public)
**Acceptance Criteria**:
- [ ] 상품 목록 (그리드)
- [ ] 상품 상세 페이지

---

## Epic 3: 주문

### US-3.1: 주문 생성
**As a** Customer, **I want to** 상품을 주문, **so that** 구매.
**Persona**: Customer
**Acceptance Criteria**:
- [ ] 재고 확인 → Mock 결제 → 재고 차감
- [ ] GST 10% 자동 계산
- [ ] 트랜잭션 보장

### US-3.2: 주문 조회
**As a** Customer, **I want to** 내 주문 확인, **so that** 상태 파악.
**Persona**: Customer, Admin-A, Admin-B
**Acceptance Criteria**:
- [ ] Customer: 본인 주문만
- [ ] Admin: 전체 주문

### US-3.3: 주문 상태 변경
**As a** Admin, **I want to** 주문 상태 변경, **so that** 처리 흐름 관리.
**Persona**: Admin-A, Admin-B
**Acceptance Criteria**:
- [ ] pending → processing → shipped → delivered / cancelled

---

## Epic 4: 리뷰

### US-4.1: 리뷰 작성
**As a** Customer, **I want to** 별점+텍스트+이미지 리뷰 작성, **so that** 경험 공유.
**Persona**: Customer
**Acceptance Criteria**:
- [ ] 별점 1~5, 텍스트 필수, 이미지 선택
- [ ] delivered 상품만 리뷰 가능

### US-4.2: 리뷰 조회
**As a** Customer, **I want to** 상품 리뷰 확인, **so that** 구매 참고.
**Persona**: Public
**Acceptance Criteria**:
- [ ] 상품별 리뷰 목록 + 평균 별점

---

## Epic 5: 인플루언서

### US-5.1: 프로필 등록
**As a** Influencer, **I want to** 프로필 등록, **so that** 협업 기회 확보.
**Persona**: Influencer
**Acceptance Criteria**:
- [ ] 채널 URL, 구독자 수, 카테고리, 소개

### US-5.2: 협업 제안
**As a** Admin, **I want to** 인플루언서에게 협업 제안, **so that** 마케팅 확대.
**Persona**: Admin-A, Admin-B
**Acceptance Criteria**:
- [ ] 제안서 작성 (상품, 조건)
- [ ] 상태: proposed → accepted/rejected → in_progress → completed

### US-5.3: 레퍼럴 링크
**As a** Influencer, **I want to** 레퍼럴 링크 생성, **so that** 구매 추적.
**Persona**: Influencer
**Acceptance Criteria**:
- [ ] 상품별 고유 레퍼럴 코드
- [ ] 레퍼럴 주문 귀속

### US-5.4: 커미션 조회
**As a** Influencer, **I want to** 내 레퍼럴 실적 확인, **so that** 수익 파악.
**Persona**: Influencer (본인), Admin-A (전체)
**Acceptance Criteria**:
- [ ] 레퍼럴 주문 수, 총 매출, 커미션

---

## Epic 6: 프론트엔드

### US-6.1: Tailwind CSS + 다크 모드 + 반응형
**As a** 사용자, **I want to** 현대적 UI, **so that** 편리한 사용.
**Persona**: All
**Acceptance Criteria**:
- [ ] Tailwind CSS 전환
- [ ] 다크 모드 (시스템 감지 + 수동 토글)
- [ ] Mobile-First 반응형

---

## Persona-Story 매핑

| Persona | Stories |
|---|---|
| Customer | US-1.1, 1.2, 2.2, 3.1, 3.2, 4.1, 4.2, 6.1 |
| Admin-A | US-1.2, 1.3, 2.1, 3.2, 3.3, 5.2, 5.4, 6.1 |
| Admin-B | US-1.2, 2.1, 3.2, 3.3, 5.2, 6.1 |
| Influencer | US-1.1, 1.2, 5.1, 5.2, 5.3, 5.4, 6.1 |

**총 Stories: 16개** (기존 31개에서 축소)
