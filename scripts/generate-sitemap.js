// import fs from "fs";
// import { $fetch } from "ohmyfetch";
// import dotenv from "dotenv/config";

// const fetchAllData = async (url, key) => {
//   let data = [];
//   let offset = 0;
//   let limit = 50;

//   try {
//     while (true) {
//       const response = await $fetch(
//         `${url}?limit=${limit}&offset=${offset}&fields=id,handle`,
//         {
//           credentials: "include",
//           headers: {
//             "x-publishable-api-key": process.env.NUXT_MEDUSA_PUBLISHABLE_KEY,
//           },
//         }
//       );

//       if (response[key] && response[key].length > 0) {
//         data = data.concat(response[key]);
//         offset += limit;
//       } else {
//         break;
//       }
//     }

//     return data;
//   } catch (e) {
//     throw e;
//   }
// };

// const generateSitemap = async () => {
//   console.log("⏳ Generowanie sitemapy...");

//   try {
//     const product_categories = await fetchAllData(
//       `${process.env.NUXT_MEDUSA_URL}/store/product-categories`,
//       "product_categories"
//     );

//     const products = await fetchAllData(
//       `${process.env.NUXT_MEDUSA_URL}/store/products`,
//       "products"
//     );

//     const urls = [
//       { loc: "/", changefreq: "daily", priority: 1.0 },
//       { loc: "/kontakt", changefreq: "monthly", priority: 0.7 },
//       { loc: "/konto", changefreq: "monthly", priority: 0.7 },
//       { loc: "/login", changefreq: "monthly", priority: 0.7 },
//       { loc: "/rejestracja", changefreq: "monthly", priority: 0.7 },
//       { loc: "/regulamin", changefreq: "monthly", priority: 0.7 },
//       { loc: "/polityka-prywatnosci", changefreq: "monthly", priority: 0.7 },
//       ...product_categories.map((category) => ({
//         loc: `/kategoria/${category.handle}`,
//         changefreq: "weekly",
//         priority: 0.8,
//       })),
//       ...products.map((product) => ({
//         loc: `/produkt/${product.handle}`,
//         changefreq: "daily",
//         priority: 0.9,
//       })),
//     ];

//     const xml = `
//           <?xml version="1.0" encoding="UTF-8"?>
//           <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//             ${urls
//               .map(
//                 (url) => `
//               <url>
//                 <loc>${process.env.NUXT_STORE_URL}${url.loc}</loc>
//                 <changefreq>${url.changefreq}</changefreq>
//                 <priority>${url.priority}</priority>
//               </url>
//             `
//               )
//               .join("")}
//           </urlset>
//         `;

//     fs.writeFileSync("./.output/public/sitemap.xml", xml);
//     console.log("✅ Sitemap wygenerowana!");
//   } catch (error) {
//     console.error("❌ Wystąpił błąd podczas generowania sitemapy:", error);
//   }
// };

// await generateSitemap();
