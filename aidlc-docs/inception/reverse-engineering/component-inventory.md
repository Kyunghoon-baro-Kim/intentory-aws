# Component Inventory

## Application Packages
- **packages/api** - Express REST API 백엔드 (인증, 상품, 주문, 분석, 이미지 생성)
- **packages/frontend** - React SPA 프론트엔드 (고객 상점, 관리자 대시보드)

## Infrastructure Packages
- 없음 (CDK/Terraform/CloudFormation 미사용)
- `deploy.sh` - 쉘 스크립트 기반 AWS 배포
- `destroy.sh` - 인프라 정리 스크립트

## Shared Packages
- 없음 (공유 모델/유틸리티 패키지 미분리)

## Test Packages
- 없음 (테스트 코드 미존재)

## Total Count
- **Total Packages**: 2
- **Application**: 2 (api, frontend)
- **Infrastructure**: 0
- **Shared**: 0
- **Test**: 0
