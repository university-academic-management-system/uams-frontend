
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
}
