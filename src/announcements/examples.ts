import { exampleUser } from "../users/examples";

export const exampleAnnouncement = {
  id: "6645282bdc295809ab5c0c28",
  apps: ["eatery", "transit", "uplift", "coursegrab", "volume", "resell"],
  body: "Pizza will be provided. Come and see us! We would love to speak with you!",
  creator: exampleUser,
  endDate: "2024-08-16T03:00:00Z",
  imageUrl:
    "https://appdev-upload.nyc3.digitaloceanspaces.com/announcements/pc6k6o8z.png",
  isDebug: false,
  link: "https://www.instagram.com/p/C4ft4SyOaUj/",
  startDate: "2024-08-15T03:00:00Z",
  title: "Demo Day",
};

export const exampleAnnouncements = [exampleAnnouncement];
