import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createReadStream, statSync } from 'fs';
import { extname } from 'path';
import { headers as getHeaders } from 'next/headers';

import { VIDEO_BASE_PATH } from '@/config'

// 타입 정의
interface ContentTypes {
  [key: string]: string;
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

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // 리퍼러 체크
    const headersList = await getHeaders();
    const referer = headersList.get('referer');
    const origin = headersList.get('origin');
    

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

    // Content-Type 설정
    if (contentTypes[ext]) {
      headers.set('Content-Type', contentTypes[ext]);
    } else {
      headers.set('Content-Type', 'application/octet-stream');
    }

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