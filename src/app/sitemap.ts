import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://deadraon.dev";

  const routes = ["", "/about", "/portfolio", "/tools", "/services", "/contact", "/pay"];

  return routes.map((route) => {
    let priority = 0.5;
    let changeFrequency: "daily" | "weekly" | "monthly" = "weekly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (route === "/tools" || route === "/portfolio") {
      priority = 0.9;
      changeFrequency = "daily";
    } else if (route === "/services" || route === "/about") {
      priority = 0.8;
      changeFrequency = "weekly";
    } else if (route === "/contact") {
      priority = 0.7;
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });
}
