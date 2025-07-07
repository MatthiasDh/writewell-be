export type JwtPayload = {
  user: JWTUser;
};

export type JWTUser = {
  sub: string;
  username: string;
  email: string;
  tenantId: string;
};
