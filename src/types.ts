export interface GameStats {
  hari: number;
  bulan: number;
  tahun: number;
  atasan: string;
  reputasiPribadi: number;
  kepercayaanAtasan: number;
  tingkatStres: number;
  politicalPower: number;
  opiniPublik: number;
  dukunganPartai: number;
}

export interface Task {
  title: string;
  description: string;
  progress: number;
}

export interface Option {
  id: string;
  text: string;
  riskText: string;
}

export interface Memory {
  hari: number;
  text: string;
  impact: string;
}

export interface Notification {
  title: string;
  description: string;
}

export interface GameResponse {
  eventTitle: string;
  narrative: string;
  newsHeadlines: string[];
  tasks: Task[];
  options: Option[];
  stats: GameStats;
  memories: Memory[];
  notifications: Notification[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text?: string;
  gameData?: GameResponse;
}
