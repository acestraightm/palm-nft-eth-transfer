import { AnyAction } from "redux";
import { getCookie, removeCookies, setCookie } from "cookies-next";

export const AuthActionType = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  REGISTER: "REGISTER",
  LOGOUT: "LOGOUT",
};

export type TAuthReducer = {
  token: string | null;
  email: string | null;
  password: string | null;
};

const initialState: TAuthReducer = {
  token: getCookie("token") as string | null,
  email: getCookie("email") as string | null,
  password: getCookie("password") as string | null,
};

const FAKE_TOKEN = "fake_token";

export default function (state: TAuthReducer = initialState, action: AnyAction): TAuthReducer {
  switch (action.type) {
    case AuthActionType.REGISTER:
      setCookie("email", action.payload.email);
      setCookie("password", action.payload.password);
      return {
        token: null,
        password: action.payload.password,
        email: action.payload.email,
      };
      
    case AuthActionType.LOGIN_SUCCESS:
      setCookie("token", FAKE_TOKEN);
      setCookie("email", action.payload.email);
      return {
        ...state,
        token: FAKE_TOKEN,
      };

    case AuthActionType.LOGOUT:
      removeCookies("token");
      removeCookies("email");
      return {
        password: null,
        token: null,
        email: null,
      };
    default:
      return state;
  }
}
