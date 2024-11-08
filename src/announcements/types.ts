export type AnnouncementCreationParams = {
  apps: string[];
  body: string;
  endDate: Date;
  imageUrl: string;
  isDebug: boolean;
  link: string;
  startDate: Date;
  title: string;
};

export type AnnouncementCreationParamsCreator = {
  apps: string[];
  body: string;
  creator: string;
  endDate: Date;
  imageUrl: string;
  isDebug: boolean;
  link: string;
  startDate: Date;
  title: string;
};

export type AnnouncementUpdateParams = {
  apps?: string[];
  body?: string;
  creator?: string;
  endDate?: Date;
  imageUrl?: string;
  isDebug?: boolean;
  link?: string;
  startDate?: Date;
  title?: string;
};
