import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../docs/data/menu-source.json"), "utf8")
);

const CATEGORY_EN = {
  المشويات: "Grills",
  الجرئ: "Grill plates",
  الجريل: "Grill",
  الصواني: "Family platters",
  الموزة: "Lamb shank",
  السمبوسك: "Sambousak",
  الحواوشي: "Hawawshi",
  السندوتشات: "Sandwiches",
  المطبخ: "Kitchen sides",
  المكرونات: "Pasta",
  الطواجن: "Tagens",
  الممبار: "Mombar",
  المحاشي: "Mahshi",
  السلطات: "Salads",
  المشروبات: "Drinks",
};

const ITEM_EN = {
  "كفته بلدي": "Baladi kofta",
  "طرب بلدي": "Baladi tarab",
  "كفته مبطط": "Flattened kofta",
  "سجق بلدي": "Baladi sausage",
  "كباب ستيك": "Steak kabab",
  "كباب ضاني": "Lamb kabab",
  "ريش ضاني صافي": "Lamb chops",
  "شيش طاووق مخلى": "Boneless shish tawook",
  "فرخة شيش فحم": "Charcoal shish chicken",
  "فرخة تكا": "Chicken tikka",
  "كبده ضاني": "Lamb liver",
  "قلب وكلاوى - مخاصي": "Heart, kidneys and offal",
  "فرد حمام محشي أرز": "Stuffed pigeon with rice",
  مشكل: "Mixed grill",
  "ورقة كبده 1/4 ك": "Liver grill plate 1/4 kg",
  "ورقة سجق 1/4 ك": "Sausage grill plate 1/4 kg",
  "ورقة لحمة 1/4 ك": "Meat grill plate 1/4 kg",
  "ورقة شيش 1/4 ك": "Shish grill plate 1/4 kg",
  "صينية شعبان (تكفي 8 أفراد)": "Shaaban platter (serves 8)",
  "صينية ليلة العمر": "Laylat Al-Omr platter",
  "صينية مشكل": "Mixed platter",
  "صينية شهر الخير": "Shahr El-Kheir platter",
  "صينية الصحاب": "Friends platter",
  "صينية الوليمة": "Banquet platter",
  "صينية ميكس مشويات شعبان": "Shaaban mixed grill platter",
  "موزة على الفحم": "Charcoal lamb shank",
  "موزة تركي": "Turkish-style lamb shank",
  "سمبوسك جبنة": "Cheese sambousak",
  "سمبوسك لحمة": "Meat sambousak",
  "سمبوسك مشكل": "Mixed sambousak",
  "حواوشي عادي": "Hawawshi",
  "حواوشي مخصوص": "Special hawawshi",
  "سندوتش كفته": "Kofta sandwich",
  "سندوتش كباب": "Kabab sandwich",
  "سندوتش طرب": "Tarab sandwich",
  "سندوتش سجق": "Sausage sandwich",
  "سندوتش شيش": "Shish sandwich",
  "سندوتش مشكل": "Mixed sandwich",
  "سندوتش كبده جريل مشوى": "Grilled liver sandwich",
  "طاجن لسان عصفور": "Orzo tagine",
  "بطاطس محمرة": "Fried potatoes",
  "أرز بالشعرية": "Rice with vermicelli",
  "أرز بالكبدة": "Rice with liver",
  "أرز بالسجق": "Rice with sausage",
  "مكرونة بالسجق": "Pasta with sausage",
  "مكرونة بالكبدة": "Pasta with liver",
  "مكرونة لحمة مفرومة": "Pasta with minced meat",
  "مكرونة سادة": "Plain pasta",
  "مكرونة شيش طاووق": "Pasta with shish tawook",
  "مكرونة بشاميل باللحمة المفرومة": "Béchamel pasta with minced meat",
  "طاجن لحمة بالبصل": "Meat and onion tagine",
  "طاجن بطاطس باللحمة": "Potato and meat tagine",
  "طاجن باميه باللحمة": "Okra and meat tagine",
  "طاجن ملوخية": "Molokhia tagine",
  "طاجن كوارع بورق العنب": "Trotters with vine leaves tagine",
  "طاجن خضار مشكل باللحمة": "Mixed vegetable and meat tagine",
  "طاجن عكاوي": "Akkawi tagine",
  "طاجن فريك": "Freekeh tagine",
  ممبار: "Mombar",
  "ورق عنب": "Stuffed vine leaves",
  "محشي مشكل": "Mixed mahshi",
  "سلطة خضراء": "Green salad",
  "سلطة طحينة": "Tahini salad",
  "باذنجان / مخلل": "Eggplant / pickles",
  "بطاطس مخلل": "Pickled potatoes",
  "طماطم متبلة": "Seasoned tomatoes",
  "سلطة بابا غنوج": "Baba ghanoush",
  "سلطة جبنة متبلة": "Seasoned cheese salad",
  "مياه معدنية": "Mineral water",
  بيبسي: "Pepsi",
  شاي: "Tea",
  قهوة: "Coffee",
};

const VARIANT_EN = {
  "1 ك": "1 kg",
  "1ك": "1 kg",
  "1/2 ك": "1/2 kg",
  "1/2ك": "1/2 kg",
  "1/4 ك": "1/4 kg",
  "1/4ك": "1/4 kg",
  "1/8 ك": "1/8 kg",
  كاملة: "Whole",
  "1/2": "Half",
  "1/4": "Quarter",
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[éè]/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toPiastres(egp) {
  return Math.round(Number(egp) * 100);
}

function isQuarter(name) {
  const n = name.replace(/\s+/g, "");
  return n === "1/4ك" || n === "1/4" || n === "1/4ك.";
}

function pickDefaultVariant(variants) {
  const quarter = variants.find((v) => isQuarter(v.name.ar));
  if (quarter) return quarter.id;
  if (variants.length === 1) return variants[0].id;
  return [...variants].sort((a, b) => a.priceAmount - b.priceAmount)[0].id;
}

function variantCode(nameAr, index) {
  const n = nameAr.replace(/\s+/g, "");
  const map = {
    "1ك": "1kg",
    "1/2ك": "half-kg",
    "1/4ك": "quarter-kg",
    "1/8ك": "eighth-kg",
    كاملة: "whole",
    "1/2": "half",
    "1/4": "quarter",
    حبة: "single",
  };
  return map[n] || `v${index + 1}`;
}

const categories = [];
const products = [];
const dataWarnings = [];
let catSort = 0;

for (const cat of source.categories) {
  const en = CATEGORY_EN[cat.name];
  if (!en) throw new Error(`Missing category EN: ${cat.name}`);
  const category = {
    id: `cat_${slugify(en)}`,
    slug: slugify(en),
    name: { ar: cat.name, en },
    description: cat.description
      ? {
          ar: cat.description,
          en:
            cat.name === "الطواجن"
              ? "All meat tagines use 1/4 kg of baladi meat."
              : cat.name === "الجريل"
                ? "Grill plates / wara2."
                : null,
        }
      : { ar: null, en: null },
    sortOrder: catSort++,
  };
  categories.push(category);

  let itemSort = 0;
  for (const item of cat.items) {
    const enName = ITEM_EN[item.name];
    if (!enName) throw new Error(`Missing item EN: ${item.name}`);

    let rawVariants = (item.variants || []).filter((v) => v && v.price != null);
    if (!rawVariants.length && item.price != null) {
      rawVariants = [{ name: "حبة", price: item.price, implicit: true }];
    }
    if (!rawVariants.length) {
      dataWarnings.push({ item: item.name, issue: "No price and no variants" });
      continue;
    }

    const variants = rawVariants.map((v, i) => {
      const nameAr = v.implicit ? "حبة" : v.name;
      const nameEn = v.implicit ? "Single" : VARIANT_EN[v.name];
      if (!nameEn) throw new Error(`Missing variant EN: ${v.name} (${item.name})`);
      return {
        id: `var_${slugify(enName)}_${variantCode(nameAr, i)}`,
        code: variantCode(nameAr, i),
        name: { ar: nameAr, en: nameEn },
        priceAmount: toPiastres(v.price),
        priceEgp: v.price,
        isImplicit: Boolean(v.implicit),
        sortOrder: i,
      };
    });

    const defaultVariantId = pickDefaultVariant(variants);
    variants.forEach((v) => {
      v.isDefault = v.id === defaultVariantId;
    });

    if (item.needsReview || item.reviewReason) {
      dataWarnings.push({
        item: item.name,
        issue: item.reviewReason || "needsReview",
      });
    }

    products.push({
      id: `prd_${slugify(enName)}`,
      slug: slugify(enName),
      categoryId: category.id,
      title: { ar: item.name, en: enName },
      description: {
        ar: item.description || null,
        en: null,
      },
      status: "published",
      isAvailable: true,
      currency: "EGP",
      discountType: "none",
      discountValue: 0,
      defaultVariantId,
      variants,
      images: [],
      sortOrder: itemSort++,
      featuredOnHome: false,
    });
  }
}

const imageMap = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../docs/data/image-map.json"), "utf8")
);
const withPhoto = new Set(Object.keys(imageMap.products || {}));
for (const product of products) {
  const mapped = imageMap.products[product.id];
  if (mapped?.file) {
    product.images = [
      {
        src: mapped.file.replace(/^docs\/brand\/assets\//, "/brand/"),
        sourceFile: mapped.file,
        alt: product.title,
      },
    ];
  }
  if (withPhoto.has(product.id)) product.featuredOnHome = true;
}

VARIANT_EN["حبة"] = "Single";

const seed = {
  restaurantId: "kababgy-shaaban",
  currency: "EGP",
  money: "Amounts in the API are integers in piastres (1 EGP = 100).",
  defaultVariantRule:
    "Prefer 1/4 kg (or 1/4 chicken) when it exists — the usual neighborhood order. Otherwise the only variant, otherwise the cheapest.",
  homeAndCatalog:
    "Cards show ONLY the default variant name + priced default. Detail screen lists every variant. Cart lines are productId + variantId.",
  categories,
  products,
  dataWarnings,
  counts: {
    categories: categories.length,
    products: products.length,
    variants: products.reduce((n, p) => n + p.variants.length, 0),
    productsWithPhotos: products.filter((p) => p.images.length).length,
  },
  hero: imageMap.hero,
  banners: imageMap.banners,
};

const out = path.resolve(__dirname, "../../docs/data/menu-seed.json");
fs.writeFileSync(out, JSON.stringify(seed, null, 2), "utf8");
console.log(
  `Wrote ${out} — ${seed.counts.categories} categories, ${seed.counts.products} products, ${seed.counts.variants} variants, ${dataWarnings.length} warnings`
);
if (dataWarnings.length) console.log(JSON.stringify(dataWarnings, null, 2));
