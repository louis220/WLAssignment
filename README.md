# 게시판 서버

게시판 API 서버

## 개발 환경

- NestJS framework
- NodeJS v20.18.0
- MySQL
- Jest testing
- npm

## 명령어

### 로컬 개발:

```bash
npm run start:dev 개발환경 실행
npm run start 운영환경 실행
```

서버 실행 후 http://localhost:3000 접속

### 테스트:

```bash
npm install
npm run test               # 유닛 테스트 실행
npm run test:e2e           # e2e 테스트 실행
```

## 참고 사항

- npm install 후 작업을 진행해야 합니다.
- 환경 변수 : `.env.sample` 파일 참고해 `.env` 파일을 생성해야 합니다.
- 운영환경에서는 docs폴더 내부의 DB_CREATE_SCHEMA.sql 반영해야 합니다.
- docs폴더 내부의 Anonymous board.postman_collection 파일을 postman에 import하여 테스트 가능합니다.
