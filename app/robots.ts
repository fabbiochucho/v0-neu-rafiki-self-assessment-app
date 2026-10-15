import type { MetadataRoute } from "next"

const SITE = (process.env.NEXT_PUBLIC_APP_URL || "https://neurafiki.becomechange.institute").replace(/\/$/, "")

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account", "/admin", "/dashboard", "/assessment", "/check-in", "/connect"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  }
}
