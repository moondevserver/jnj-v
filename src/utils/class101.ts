import dotenv from 'dotenv';
import { loadJson, sanitizeName } from 'jnu-abc';
import fs from 'fs';
import path from 'path';

dotenv.config({path: '../../.env'});

const { DATA_ROOT_PATH } = process.env;

const getClassName = (classId: string) => {
  const classJsonPath = `${DATA_ROOT_PATH}/class101/json/myclasses.json`;
  const classJson = loadJson(classJsonPath);
  
  // classJson이 배열인지 확인
  if (!Array.isArray(classJson)) {
    console.error('Invalid JSON format:', classJson);
    return '';
  }

  const className = classJson.find((item: any) => item.classId === classId)?.title;
  if (!className) {
    console.error('Class not found:', classId);
    return '';
  }
  
  return sanitizeName(className);
};

const _getLectureName = (sn: number, lectureName: string) => {
  const snStr = sn.toString().padStart(3, '0');
  return `${snStr}_${sanitizeName(lectureName)}`;
};

const getLectureName = (classId: string, lectureId: string) => {
  const jsonPath = `${DATA_ROOT_PATH}/class101/json/classes/${classId}.json`;
  const classJson = loadJson(jsonPath);
  
  // classJson이 배열인지 확인
  if (!Array.isArray(classJson)) {
    console.error('Invalid JSON format:', classJson);
    return '';
  }

  const lecture = classJson.find((item: any) => item.lectureId === lectureId);
  if (!lecture) {
    console.error('Lecture not found:', lectureId);
    return '';
  }

  return _getLectureName(lecture.sn, lecture.title);
};

const getVideoApiUrl = (classId: string, lectureId: string) => {
  const className = getClassName(classId);
  console.log('@@@@@Class name:', className);
  const lectureName = getLectureName(classId, lectureId);
  console.log('@@@@Lecture name:', lectureName);
  
  // 전체 파일 경로 생성 (DATA_ROOT_PATH에서 _data 제거)
  // const videoRootPath = DATA_ROOT_PATH?.replace('/_data', '');
  // const fullPath = `${videoRootPath}/class101/${className}`;
  // const mp4Path = path.join(fullPath, `${lectureName}.mp4`);
  
  // API 경로 반환
  const apiPath = `/api/stream/class101/${className}/${lectureName}.mp4`;
  console.log('API path:', apiPath);  // 디버깅용
  
  return apiPath;
};

/*
* 클래스 썸네일 이미지 가져오기
* 
* @param classId 클래스 ID
* @param size 이미지 크기 (기본값: 640)
* @returns 이미지 URL
*/
const getClassThumbnailUrl = (classId: string, size: string = '640') => {
  // https://cdn.class101.net/images/e5c94ca3-d542-47c8-ba35-b39aa2fca19b/640xauto.webp
  const classJsonPath = `${DATA_ROOT_PATH}/class101/json/myclasses.json`;
  const classJson = loadJson(classJsonPath);
  const imageIds = classJson.find((item: any) => item.classId === classId)?.imageIds;
  if (!imageIds || imageIds.length == 0) {
    return '/images/defaultClassThumbnail.jpg';
  }
  const imageId = imageIds[0];

  return `https://cdn.class101.net/images/${imageId}/${size}xauto.webp`;;
};

const getFilePaths = (classId: string, lectureId: string) => {
  try {
    const paths: any[] = [];
    const classJsonPath = `${DATA_ROOT_PATH}/class101/json/classes/${classId}.json`;
    console.log('Loading JSON from:', classJsonPath);
    
    const classJson = loadJson(classJsonPath);
    console.log('Loaded classJson:', classJson);
    
    // classJson이 배열인지 확인
    if (!Array.isArray(classJson)) {
      console.error('Invalid JSON format:', classJson);
      return paths;
    }

    const lecture = classJson.find((item: any) => item.lectureId === lectureId);
    console.log('Found lecture:', lecture);
    
    if (!lecture) {
      console.error('Lecture not found:', lectureId);
      return paths;
    }

    // // subtitles가 있는 경우 자막 파일 추가
    // if (lecture.subtitles && Array.isArray(lecture.subtitles)) {
    //   console.log('Found subtitles:', lecture.subtitles);
    //   for (const subtitle of lecture.subtitles) {
    //     paths.push({
    //       name: `${subtitle.lang} 자막`,
    //       path: `/api/stream/class101/html/classes/${classId}/subtitles/${subtitle.name}`
    //     });
    //   }
    // }

    // attachments가 있는 경우 첨부 파일 추가
    if (lecture.attachments && Array.isArray(lecture.attachments)) {
      console.log('Found attachments:', lecture.attachments);
      const strSn = lecture.sn.toString().padStart(3, '0');
      const folder = `_data/class101/html/classes/${classId}/${strSn}_${lectureId}/files`;

      for (const file of lecture.attachments) {
        paths.push({
          name: file,
          path: `/api/stream/${folder}/${file}`
        });
      }
    }
    
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@Generated paths:', paths);
    return paths;
  } catch (error) {
    console.error('Error in getFilePaths:', error);
    return [];
  }
};

export { getVideoApiUrl, getClassName, getLectureName, getFilePaths, getClassThumbnailUrl };
