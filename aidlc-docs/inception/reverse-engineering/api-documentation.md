# API Documentation

## REST APIs

### Authentication

#### POST /api/auth/login
- **Purpose**: 사용자 로그인
- **Request**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: { id, email, name, role } }`
- **Auth**: 불필요

#### POST /api/auth/register
- **Purpose**: 신규 사용자 등록 (customer 역할 고정)
- **Request**: `{ email: string, password: string, name: string }`
- **Response**: `{ token: string, user: { id, email, name, role } }`
- **Auth**: 불필요

### Products

#### GET /api/products
- **Purpose**: 전체 상품 목록 조회 (최신순)
- **Response**: `Product[]`
- **Auth**: 불필요

#### GET /api/products/:id
- **Purpose**: 단일 상품 상세 조회
- **Response**: `Product`
- **Auth**: 불필요

#### POST /api/products
- **Purpose**: 신규 상품 등록
- **Request**: `{ name, description, price, stock, image_url }`
- **Response**: `Product`
- **Auth**: Admin 필수

#### PUT /api/products/:id
- **Purpose**: 상품 정보 수정
- **Request**: `{ name, description, price, stock, image_url }`
- **Response**: `Product`
- **Auth**: Admin 필수

#### DELETE /api/products/:id
- **Purpose**: 상품 삭제
- **Response**: 204 No Content
- **Auth**: Admin 필수

#### POST /api/products/generate-image
- **Purpose**: AI 기반 상품 이미지 생성 (AWS Bedrock Nova Canvas)
- **Request**: `{ productName: string, description: string }`
- **Response**: `{ imageUrl: string }`
- **Auth**: Admin 필수

### Orders

#### GET /api/orders
- **Purpose**: 주문 목록 조회 (Admin: 전체, Customer: 본인 주문만)
- **Response**: `Order[]` (Admin은 user_name, user_email 포함)
- **Auth**: 필수

#### GET /api/orders/:id
- **Purpose**: 주문 상세 조회 (주문 항목 포함)
- **Response**: `{ ...Order, items: OrderItem[] }`
- **Auth**: 필수 (본인 주문 또는 Admin)

#### POST /api/orders
- **Purpose**: 신규 주문 생성 (재고 확인 → 주문 생성 → 재고 차감)
- **Request**: `{ items: [{ product_id: number, quantity: number }] }`
- **Response**: `{ id, subtotal, gst, total, status }`
- **Auth**: 필수
- **Business Logic**: GST 10% 자동 계산, 재고 부족 시 400 에러

#### PATCH /api/orders/:id/status
- **Purpose**: 주문 상태 변경
- **Request**: `{ status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }`
- **Response**: `{ id, status }`
- **Auth**: Admin 필수

### Analytics

#### GET /api/analytics/dashboard
- **Purpose**: 관리자 대시보드 데이터 (매출, 주문 수, 인기 상품, 상태별 주문)
- **Response**: `{ summary, recentOrders, topProducts, ordersByStatus }`
- **Auth**: Admin 필수

#### GET /api/analytics/inventory
- **Purpose**: 재고 현황 (재고 수준별 상태 포함)
- **Response**: `InventoryItem[]` (status: in_stock/low_stock/out_of_stock)
- **Auth**: Admin 필수

## Data Models

### User
- **Fields**: id (PK), email (UNIQUE), password (hashed), name, role ('admin'|'customer'), created_at
- **Relationships**: 1:N → Orders

### Product
- **Fields**: id (PK), name, description, price (REAL), stock (INTEGER), image_url, created_at
- **Relationships**: 1:N → OrderItems

### Order
- **Fields**: id (PK), user_id (FK→users), subtotal, gst, total, status ('pending'|'processing'|'shipped'|'delivered'|'cancelled'), created_at
- **Relationships**: N:1 → User, 1:N → OrderItems

### OrderItem
- **Fields**: id (PK), order_id (FK→orders), product_id (FK→products), quantity, price
- **Relationships**: N:1 → Order, N:1 → Product
