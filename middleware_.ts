// middleware.ts
import createMiddleware from "next-intl/middleware";
import {locales} from "./next-locales";

export default createMiddleware({
  locales,
  defaultLocale: "en"
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
