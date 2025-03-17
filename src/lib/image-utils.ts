/**
 * 강의 썸네일 이미지 URL을 생성합니다.
 * imageId가 없는 경우 기본 이미지를 반환합니다.
 */
export function getClassThumbnailUrl(imageId: string | null | undefined, size: string = '640xauto'): string {
  if (!imageId) {
    return '/images/defaultClassThumbnail.jpg';
  }
  return `https://cdn.class101.net/images/${imageId}/${size}.webp`;
} 