// middleware.ts
import createMiddleware from "next-intl/middleware";

const locales = ["en", "hi", "te"];
export default createMiddleware({
  locales,
  defaultLocale: "en"
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
