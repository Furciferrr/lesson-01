import { UserViewType } from "../../types";

declare global {
  declare namespace Express {
    export interface Request {
      user: UserViewType | null;
    }
  }
}
/* declare global{
  namespace Express {
      interface Request {
        user: UserViewType | null;
      }
  }
} */