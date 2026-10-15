import type { MetadataRoute } from "next"

const SITE = (process.env.NEXT_PUBLIC_APP_URL || "https://neurafiki.becomechange.institute").replace(/\/$/, "")

const PUBLIC_PAGES = ["", "/about", "/faq", "/blog", "/contact", "/support/resources", "/privacy", "/terms", "/guidelines"]

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PAGES.map((p) => ({ url: `${SITE}${p}` }))
}
