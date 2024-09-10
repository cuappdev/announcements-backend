export type UserCreationParams = {
  email: string;
  imageUrl: string;
  isAdmin: boolean;
  name: string;
};

export type UserUpdateParams = {
  email?: string;
  imageUrl?: string;
  isAdmin?: boolean;
  name?: string;
};
