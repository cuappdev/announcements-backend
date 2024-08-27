export type AnnouncementCreationParams = {
  apps: string[];
  body: string;
  endDate: Date;
  imageUrl: string;
  link: string;
  startDate: Date;
  title: string;
};

export type AnnouncementUpdateParams = {
  apps?: string[];
  body?: string;
  endDate?: Date;
  imageUrl?: string;
  link?: string;
  startDate?: Date;
  title?: string;
};
