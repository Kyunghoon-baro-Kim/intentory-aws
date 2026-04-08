# Code Quality Assessment

## Test Coverage
- **Overall**: None (테스트 코드 없음)
- **Unit Tests**: 없음
- **Integration Tests**: 없음

## Code Quality Indicators
- **Linting**: 미설정 (ESLint/Prettier 없음)
- **Code Style**: 비교적 일관적 (TypeScript strict 모드 사용)
- **Documentation**: 최소한 (README.md만 존재, 코드 내 주석 없음)

## Technical Debt

### 🔴 Critical
1. **하드코딩된 JWT Secret**: `middleware/auth.ts`에 기본 시크릿 키가 소스 코드에 포함 (`'inventrix-secret-key-change-in-production'`)
2. **하드코딩된 기본 비밀번호**: `db.ts`에 admin123, customer123 평문 비밀번호 존재
3. **SQLite 프로덕션 사용**: 동시성 제한, 네트워크 접근 불가, 수평 확장 불가
4. **입력 유효성 검증 없음**: 모든 API 엔드포인트에서 request body 유효성 검증 미수행
5. **테스트 코드 없음**: 단위/통합 테스트 전무

### 🟡 Important
6. **인라인 스타일**: 모든 React 컴포넌트에서 CSS-in-JS 인라인 스타일 사용 (유지보수 어려움)
7. **에러 처리 미흡**: 대부분의 API 호출에서 generic 에러 메시지만 반환
8. **CORS 완전 개방**: `app.use(cors())` - 모든 origin 허용
9. **Rate Limiting 없음**: API 남용 방지 메커니즘 없음
10. **토큰 만료 7일**: JWT 만료 기간이 과도하게 길음 (7d)
11. **주문 생성 시 트랜잭션 미사용**: 재고 확인 → 주문 생성 → 재고 차감이 원자적이지 않음
12. **데이터 접근 레이어 없음**: Route 핸들러에서 직접 SQL 실행 (관심사 분리 부족)

### 🟢 Minor
13. **반응형 디자인 미흡**: 모바일 최적화 없음
14. **접근성 미준수**: WCAG 기준 미충족 (aria 속성, 키보드 네비게이션 등)
15. **다크 모드 미지원**
16. **로깅 프레임워크 없음**: `console.log`만 사용
17. **환경 변수 관리 미흡**: dotenv 미사용, 일부 값 하드코딩

## Patterns and Anti-patterns

### Good Patterns
- TypeScript strict 모드 사용
- Monorepo 구조 (packages/api, packages/frontend)
- JWT 기반 stateless 인증
- bcrypt 비밀번호 해싱 (10 rounds)
- Prepared statements 사용 (SQL injection 방지)
- React Context API로 전역 상태 관리
- ProtectedRoute 패턴으로 라우트 보호

### Anti-patterns
- **Fat Controller**: Route 핸들러에 비즈니스 로직 + 데이터 접근 혼재 (`routes/orders.ts`)
- **Inline Styles**: 모든 컴포넌트에서 인라인 스타일 사용 (재사용성 없음)
- **Magic Numbers**: GST 10% (`0.1`), low stock 임계값 (`10`) 등 하드코딩
- **No Error Boundary**: React 에러 바운더리 없음
- **No Loading States**: 일부 페이지에서 로딩 상태 처리 미흡
- **Hardcoded Secrets**: JWT secret, 기본 비밀번호 소스 코드 포함
- **No Validation Layer**: 입력 유효성 검증 레이어 부재
