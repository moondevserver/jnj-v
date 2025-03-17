# 로그인 사용자만 파일 접근을 허용하는 스트리밍 API 수정 방법

파일에 직접 접근했을 때 로그인되지 않은 사용자의 다운로드를 막기 위해 현재 코드를 수정해 보겠습니다. 주요 변경 사항은 인증 검증 로직을 추가하는 것입니다.

**핵심 변경 사항:**

1. 요청 헤더에서 인증 토큰을 확인
2. 로그인되지 않은 사용자에게 적절한 오류 응답 반환
3. 리퍼러 체크 로직 활성화

다음과 같이 코드를 수정할 수 있습니다:

```typescript
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createReadStream, statSync } from 'fs';
import { extname } from 'path';
import { headers as getHeaders } from 'next/headers';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken'; // JWT 검증을 위해 추가 필요

import { VIDEO_BASE_PATH } from '@/config'

// 타입 정의
interface ContentTypes {
  [key: string]: string;
}

// JWT 검증 결과 인터페이스
interface JwtPayload {
  userId: string;
  // 기타 필요한 페이로드 속성
}

const contentTypes: ContentTypes = {
  '.vtt': 'text/vtt',
  '.html': 'text/html',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.avi': 'video/x-msvideo',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.py': 'text/x-python',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.hwp': 'application/x-hwp',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.md': 'text/markdown',
};

// 인증 검증 함수
async function verifyAuthentication(request: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth_token')?.value; // 쿠키에서 토큰 가져오기
  
  // Authorization 헤더에서도 토큰 확인 (Bearer 토큰)
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
  
  const token = authToken || headerToken;
  
  if (!token) {
    return false;
  }
  
  try {
    // JWT_SECRET은 환경 변수에서 가져오거나 설정 파일에서 임포트해야 함
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = verify(token, JWT_SECRET) as JwtPayload;
    return !!decoded.userId; // 유효한 사용자 ID가 있으면 인증됨
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // 리퍼러 체크 - 주석 해제
    const headersList = await getHeaders();
    const referer = headersList.get('referer');
    const origin = headersList.get('origin');
    
    // 직접 접근 방지 로직 활성화
    if (!referer && !origin) {
      return new Response('직접 접근이 불가능합니다.', { 
        status: 403,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }
    
    // 인증 검증
    const isAuthenticated = await verifyAuthentication(request);
    if (!isAuthenticated) {
      return new Response('인증이 필요합니다. 로그인 후 이용해주세요.', { 
        status: 401,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }

    const filePath = path.join(VIDEO_BASE_PATH!, ...params.path);
    const ext = path.extname(filePath).toLowerCase();

    // 파일이 존재하는지 확인
    if (!fs.existsSync(filePath)) {
      return new Response('파일을 찾을 수 없습니다.', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }

    const stat = fs.statSync(filePath);
    const headers = new Headers();

    // 보안 헤더 설정
    headers.set('Content-Security-Policy', "default-src 'self'");
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('Cross-Origin-Resource-Policy', 'same-origin');
    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    
    // 캐시 제어
    headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    // Content-Type 설정
    if (contentTypes[ext]) {
      headers.set('Content-Type', contentTypes[ext]);
    } else {
      headers.set('Content-Type', 'application/octet-stream');
    }

    // 다운로드 방지
    headers.set('Content-Disposition', 'inline; filename="video.mp4"');
    headers.set('accept-ranges', 'bytes');
    headers.set('content-length', stat.size.toString());

    // Range 요청 처리
    const range = request.headers.get('range');
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;

      headers.set('content-range', `bytes ${start}-${end}/${stat.size}`);
      headers.set('content-length', chunksize.toString());

      const stream = fs.createReadStream(filePath, { start, end });
      return new Response(stream as any, { 
        status: 206, 
        headers 
      });
    }

    // 전체 파일 스트리밍
    const stream = fs.createReadStream(filePath);
    return new Response(stream as any, { headers });

  } catch (error) {
    console.error('Error serving file:', error);
    return new Response('파일 스트리밍 중 오류가 발생했습니다.', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }
}
```

**주요 수정 내용 설명:**

1. **인증 검증 로직 추가**:
   - `verifyAuthentication` 함수를 만들어 사용자 인증 상태를 확인합니다.
   - 쿠키와 Authorization 헤더 모두에서 토큰을 확인합니다.
   - JWT 검증을 통해 토큰의 유효성을 확인합니다.

2. **리퍼러 체크 활성화**:
   - 주석 처리된 리퍼러 체크 로직을 활성화하여 직접 URL 접근을 제한합니다.

3. **인증 확인 후 처리**:
   - 인증되지 않은 사용자에게는 401 상태 코드와 함께 로그인 필요 메시지를 반환합니다.

**설치 필요 패키지:**
- jsonwebtoken 패키지가 필요합니다: `npm install jsonwebtoken @types/jsonwebtoken`

**추가 고려사항:**

1. JWT_SECRET은 환경 변수로 관리하는 것이 보안상 좋습니다.
2. 인증 방식은 프로젝트의 현재 인증 구현에 맞게 수정해야 할 수 있습니다.
3. 인증 외에도 권한 검사(특정 비디오에 대한 접근 권한)를 추가할 수 있습니다.
4. 보안을 더 강화하고 싶다면 URL 서명이나 일회용 토큰 방식도 고려해볼 수 있습니다.

이 수정을 통해 로그인하지 않은 사용자가 직접 URL을 통해 비디오 파일에 접근하는 것을 방지할 수 있습니다.