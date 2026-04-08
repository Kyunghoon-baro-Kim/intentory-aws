# Component Methods (축소판)

---

## AuthService
- `register(dto: RegisterDto): Promise<AuthResponse>` — 회원가입 (Customer/Influencer)
- `login(dto: LoginDto): Promise<AuthResponse>` — 로그인 + JWT 발급

## UsersService
- `findById(id: number): Promise<User>` — 사용자 조회
- `findByEmail(email: string): Promise<User>` — 이메일로 조회
- `createAdmin(dto: CreateAdminDto, role: 'admin_a' | 'admin_b'): Promise<User>` — Admin 계정 생성 (Admin-A만)

## ProductsService
- `findAll(): Promise<Product[]>` — 상품 목록
- `findById(id: number): Promise<Product>` — 상품 상세
- `create(dto: CreateProductDto): Promise<Product>` — 상품 생성
- `update(id: number, dto: UpdateProductDto): Promise<Product>` — 상품 수정
- `delete(id: number): Promise<void>` — 상품 삭제
- `generateImage(dto: GenerateImageDto): Promise<string>` — AI 이미지 생성

## OrdersService
- `create(userId: number, dto: CreateOrderDto): Promise<Order>` — 주문 생성 (Mock 결제, 트랜잭션)
- `findAll(userId: number, role: string): Promise<Order[]>` — 주문 목록
- `findById(id: number, userId: number, role: string): Promise<OrderDetail>` — 주문 상세
- `updateStatus(id: number, status: OrderStatus): Promise<Order>` — 상태 변경

## InventoryService
- `getInventory(): Promise<InventoryItem[]>` — 재고 현황

## PaymentsService (Mock)
- `processPayment(orderId: number, amount: number): Promise<PaymentResult>` — Mock 결제 (성공/실패 시뮬레이션)
- `refund(orderId: number): Promise<RefundResult>` — Mock 환불

## ReviewsService
- `create(userId: number, dto: CreateReviewDto): Promise<Review>` — 리뷰 작성
- `findByProduct(productId: number): Promise<Review[]>` — 상품별 리뷰
- `delete(id: number): Promise<void>` — 리뷰 삭제 (Admin)
- `getAverageRating(productId: number): Promise<number>` — 평균 별점

## InfluencerService
- `createProfile(userId: number, dto: CreateInfluencerProfileDto): Promise<InfluencerProfile>` — 프로필 등록
- `updateProfile(userId: number, dto: UpdateInfluencerProfileDto): Promise<InfluencerProfile>` — 프로필 수정
- `findAll(): Promise<InfluencerProfile[]>` — 인플루언서 목록

## CollaborationsService
- `create(dto: CreateCollaborationDto): Promise<Collaboration>` — 협업 제안 생성
- `updateStatus(id: number, status: CollaborationStatus): Promise<Collaboration>` — 상태 변경
- `findByInfluencer(userId: number): Promise<Collaboration[]>` — 인플루언서별 협업 목록

## ReferralsService
- `generateLink(userId: number, productId: number): Promise<ReferralLink>` — 레퍼럴 링크 생성
- `trackReferral(referralCode: string, orderId: number): Promise<void>` — 주문 귀속
- `getStats(userId: number): Promise<ReferralStats>` — 인플루언서 실적 조회
- `getCommissions(userId?: number): Promise<Commission[]>` — 커미션 내역

## PrismaService
- `onModuleInit(): Promise<void>` — DB 연결
- `onModuleDestroy(): Promise<void>` — DB 연결 해제
