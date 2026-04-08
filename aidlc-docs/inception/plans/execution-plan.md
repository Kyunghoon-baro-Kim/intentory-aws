# Execution Plan (축소판 — 4명 2시간)

## Detailed Analysis Summary

### Transformation Scope
- **Transformation Type**: Architectural (축소 현대화)
- **Primary Changes**: DB 마이그레이션, 프레임워크 전환, 핵심 기능 + 인플루언서
- **Time Constraint**: 2시간

### Change Impact Assessment
- **User-facing changes**: Yes — 4개 역할, 리뷰, 인플루언서 협업, 다크 모드
- **Structural changes**: Yes — Express→NestJS, SQLite→PostgreSQL
- **Data model changes**: Yes — reviews, influencer_profiles, collaborations, referrals, commissions

### Risk Assessment
- **Risk Level**: Medium (축소된 범위)
- **Testing Complexity**: Moderate (TDD, unit + integration)

---

## Phases to Execute

### INCEPTION PHASE (모두 완료)
- [x] Workspace Detection
- [x] Reverse Engineering
- [x] Requirements Analysis (축소판)
- [x] User Stories (축소판 16개)
- [x] Workflow Planning (축소판)
- [x] Application Design (축소판 11모듈)
- [x] Units Generation (축소판 4 unit)

### CONSTRUCTION PHASE
- [ ] Code Generation — Unit 1: Backend Core (Dev A)
- [ ] Code Generation — Unit 2: Products & Orders (Dev B)
- [ ] Code Generation — Unit 3: Reviews & Influencer (Dev C)
- [ ] Code Generation — Unit 4: Frontend (Dev D)
- [ ] Build and Test

**축소로 인해 SKIP된 단계:**
- ~~Functional Design~~ (2시간 제약으로 Code Generation에 통합)
- ~~NFR Requirements~~ (보안/성능 축소)
- ~~NFR Design~~ (보안/성능 축소)
- ~~Infrastructure Design~~ (Docker Compose만, 별도 설계 불필요)

---

## Success Criteria
- **Primary Goal**: 2시간 내 동작하는 Inventrix 현대화 결과물
- **Key Deliverables**:
  - NestJS 백엔드 (Prisma + PostgreSQL)
  - Tailwind CSS 프론트엔드 (다크 모드, 반응형)
  - 4개 역할 RBAC
  - 상품/주문/리뷰/인플루언서 협업/레퍼럴 기능
  - Docker Compose 로컬 환경
  - Vitest TDD
