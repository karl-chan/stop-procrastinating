export interface Backup {
  id: string,
  timestamp: number
}

export interface User {
  name: string;
  avatarUrl: string;
  isAuthenticated: boolean
}

export const defaultUser: User = {
  name: 'Guest',
  avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLYcl_XHEncgPPcaTItRhDHDqhni1tRFRmIw&usqp=CAU",
  isAuthenticated: false
}
