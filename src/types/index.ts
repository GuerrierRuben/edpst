export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: {
    day: string;
    month: string;
  };
  time: string;
  location?: string;
  image?: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  series?: string;
  videoUrl: string;
  thumbnail: string;
}