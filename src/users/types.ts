export type UserCreationParams = {
  email: string;
  isAdmin: boolean;
};

export type UserUpdateParams = {
  email?: string;
  imageUrl?: string;
  isAdmin?: boolean;
  name?: string;
};

export type UserLoginParams = {
  email: string;
  imageUrl?: string;
  name: string;
};
