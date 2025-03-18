import fs from 'fs/promises';
import path from 'path';
import { UserRole } from '@/types/auth';

interface UserData {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: UserRole;
  provider?: string;
  providerAccountId?: string;
}

interface UsersData {
  users: UserData[];
}

const USER_FILE_PATH = path.join(process.env.DATA_ROOT_PATH || '', 'users.json');

// 모든 사용자 가져오기
export async function getAllUsers(): Promise<UserData[]> {
  try {
    const data = await fs.readFile(USER_FILE_PATH, 'utf-8');
    const users: UsersData = JSON.parse(data);
    return users.users || [];
  } catch (error) {
    console.error('Failed to read users:', error);
    return [];
  }
}

// 사용자 찾기
export async function findUserByEmail(email: string): Promise<UserData | null> {
  const users = await getAllUsers();
  return users.find(user => user.email === email) || null;
}

// 사용자 찾기 (소셜 계정 ID로)
export async function findUserByProviderAccount(
  provider: string,
  providerAccountId: string
): Promise<UserData | null> {
  const users = await getAllUsers();
  return users.find(
    user => user.provider === provider && user.providerAccountId === providerAccountId
  ) || null;
}

// 새 사용자 생성
export async function createUser(userData: Omit<UserData, 'id'>): Promise<UserData> {
  const users = await getAllUsers();
  
  // 새 ID 생성
  const newId = (Math.max(...users.map(u => parseInt(u.id)), 0) + 1).toString();
  
  const newUser: UserData = {
    id: newId,
    ...userData,
    role: userData.role || UserRole.USER
  };
  
  // 사용자 추가
  users.push(newUser);
  
  // 파일에 저장
  await fs.writeFile(
    USER_FILE_PATH,
    JSON.stringify({ users }, null, 2),
    'utf-8'
  );
  
  return newUser;
}

// 사용자 정보 업데이트
export async function updateUser(
  id: string,
  userData: Partial<Omit<UserData, 'id'>>
): Promise<UserData | null> {
  const users = await getAllUsers();
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) return null;
  
  // 사용자 정보 업데이트
  users[userIndex] = {
    ...users[userIndex],
    ...userData
  };
  
  // 파일에 저장
  await fs.writeFile(
    USER_FILE_PATH,
    JSON.stringify({ users }, null, 2),
    'utf-8'
  );
  
  return users[userIndex];
}