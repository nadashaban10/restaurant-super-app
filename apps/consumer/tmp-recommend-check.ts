import assert from "node:assert/strict";
import { recommendAddonGroups, recommendAddonPicks } from "./lib/recommendations/recommend";
import { checkoutAddonGroups, trayAddonGroups } from "./lib/recommendations/rules";

const groups = (anchors: string[], exclude: string[] = []) =>
  recommendAddonGroups(anchors, exclude).map((group) => ({
    id: group.id,
    products: group.products.map((product) => product.id),
  }));

const kofta = groups(["prd_baladi-kofta"]);
assert.deepEqual(kofta.map((group) => group.id), ["rice", "pasta", "salads", "drinks"]);
assert.deepEqual(kofta[0].products, [
  "prd_rice-with-vermicelli",
  "prd_rice-with-liver",
  "prd_rice-with-sausage",
]);
assert.equal(kofta[1].products[0], "prd_plain-pasta");
assert.equal(kofta[1].products.includes("prd_bechamel-pasta-with-minced-meat"), true);
assert.equal(kofta[2].products[0], "prd_tahini-salad");
assert.equal(kofta[3].products[0], "prd_pepsi");

const sandwich = groups(["prd_kofta-sandwich"]);
assert.equal(sandwich[0].products[0], "prd_fried-potatoes");
assert.equal(sandwich[0].products[1], "prd_rice-with-vermicelli");

const hidden = groups(["prd_baladi-kofta"], ["prd_tahini-salad", "prd_plain-pasta"]);
assert.equal(hidden.find((group) => group.id === "salads")?.products.includes("prd_tahini-salad"), false);
assert.equal(hidden.find((group) => group.id === "pasta")?.products.includes("prd_plain-pasta"), false);

assert.deepEqual(
  recommendAddonPicks(["prd_baladi-kofta"], [], trayAddonGroups, 4).map((product) => product.id),
  ["prd_rice-with-vermicelli", "prd_plain-pasta", "prd_tahini-salad", "prd_pepsi"],
);

assert.deepEqual(
  recommendAddonPicks(["prd_kofta-sandwich"], [], checkoutAddonGroups, 3).map((product) => product.id),
  ["prd_fried-potatoes", "prd_tahini-salad", "prd_pepsi"],
);

console.log("addon group checks passed");
