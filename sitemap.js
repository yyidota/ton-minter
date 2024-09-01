const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");
const { resolve } = require("path");

// 定义基本的链接和频率信息
const baseLinks = [
  { url: "/", changefreq: "monthly", priority: 1 },
  { url: "/token-creator/solana", changefreq: "monthly", priority: 0.8 },
];

// 创建并保存站点地图
const createSitemap = async (hostname, languages) => {
  const sitemapStream = new SitemapStream({
    hostname: hostname,
    xmlns: {
      news: false,
      image: false,
      video: false,
      xhtml: true,
    },
  });

  const links = baseLinks.flatMap((link) =>
    languages.map((lang) => ({
      url: `/${lang}${link.url}`,
      changefreq: link.changefreq,
      priority: link.priority,
      links: languages.map((l) => ({
        lang: l,
        url: `https://${hostname}/${l}${link.url}`,
      })),
    })),
  );

  // 写入路由和多语言链接信息
  links.forEach((link) => sitemapStream.write(link));
  sitemapStream.end();

  // 将流转换为 Promise 以便保存文件
  const sitemap = await streamToPromise(sitemapStream);
  const path = resolve(process.cwd(), "public", "sitemap.xml");
  createWriteStream(path).write(sitemap.toString());
  console.log("Sitemap generated at:", path);
};

// 调用函数生成站点地图
createSitemap("https://bot.slerf.tools", ["en", "zh-cn"]).catch((e) =>
  console.error("Failed to generate sitemap:", e),
);
