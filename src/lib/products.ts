export type Product = {
  id: number;
  name: string;
  origin: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  img: string;
  tag: "BESTSELLER" | "NEW HARVEST" | "SINGLE ORIGIN" | "TRENDING" | "RARE" | "SUN-DRIED";
  tagline: string;
  flavor: string;
  nutrition: string;
  harvest: string;
};

export const products: Product[] = [
  { id:1, name:"California Almonds", origin:"Sacramento Valley", price:"₹599", oldPrice:"₹849", discount:"-29%", img:"/products/almonds.png", tag:"BESTSELLER", tagline:"Slowly dried on the branch under the valley sun. Concentrated oils and buttery sweetness no industrial process can replicate.", flavor:"Wild honey · almond milk · vanilla finish", nutrition:"Vitamin E · biotin · magnesium · plant protein", harvest:"Hand-shucked, solar-dried over 5–7 days" },
  { id:2, name:"Iranian Pistachios", origin:"Kerman · 1600m", price:"₹899", oldPrice:"₹1299", discount:"-30%", img:"/products/pistachios.png", tag:"TRENDING", tagline:"Grown at altitude on mineral-rich soils. Handpicked at peak split in October only — the world's most prized pistachio.", flavor:"Earthy · saline · roasted walnut undertones", nutrition:"Copper · B6 · exceptional thiamine density", harvest:"Single-handpicked at peak split — October only" },
  { id:3, name:"Medjool Dates", origin:"Jordan Valley", price:"₹699", oldPrice:"₹999", discount:"-30%", img:"/products/dates.png", tag:"BESTSELLER", tagline:"From trees over 30 years old — a depth of flavor no young palm can offer. The original energy food.", flavor:"Dark molasses · honey · black tea · caramel", nutrition:"High-fiber · polyphenols · natural glucose", harvest:"Individually selected at peak ripeness" },
  { id:4, name:"Kashmir Walnuts", origin:"Himalayan Groves · 1800m", price:"₹849", oldPrice:"₹1199", discount:"-29%", img:"/products/walnuts.png", tag:"SINGLE ORIGIN", tagline:"Wild-gathered from old-growth Himalayan groves. Exceptional paper-shell thinness and resinous character.", flavor:"Robust tannin · earthy pine · buttery finish", nutrition:"Highest plant-based ALA Omega-3 available", harvest:"Wild-gathered, cold-stone cracked" },
  { id:5, name:"Macadamia Nuts", origin:"Hawaii · Kona Coast", price:"₹1099", oldPrice:"₹1599", discount:"-31%", img:"/products/macadamia.png", tag:"RARE", tagline:"Hand-harvested from volcanic Kona soils. The highest monounsaturated fat content of any nut.", flavor:"Coconut cream · caramel · delicate sweetness", nutrition:"Manganese · thiamine · monounsaturated fats", harvest:"Tree-dropped, hand-collected when naturally ripe" },
  { id:6, name:"Afghan Raisins", origin:"Kandahar · Sun-dried", price:"₹399", oldPrice:"₹599", discount:"-33%", img:"/products/raisins.png", tag:"SUN-DRIED", tagline:"Dried under the relentless Kandahari sun. A natural concentrate of grape sugars, iron and polyphenols.", flavor:"Jammy · dark fruit · mild tannin", nutrition:"Iron · potassium · antioxidant polyphenols", harvest:"Sun-dried on elevated trays for 20 days" },
  { id:7, name:"Turkish Hazelnuts", origin:"Black Sea Region", price:"₹749", oldPrice:"₹1049", discount:"-28%", img:"/products/hazelnuts.png", tag:"NEW HARVEST", tagline:"The world's finest hazelnuts from the misty Black Sea coast. A rich, chocolatey nut prized by confectioners globally.", flavor:"Deep cocoa · warm spice · sweet cream", nutrition:"Vitamin E · folate · healthy fats", harvest:"Shake-harvested in September, stone-dried" },
  { id:8, name:"Cashew Nuts W240", origin:"Mombasa, Kenya", price:"₹649", oldPrice:"₹899", discount:"-27%", img:"/products/cashews.png", tag:"TRENDING", tagline:"Grade W240 — the world's largest cashew grade, hand-graded for size, color and zero breakage.", flavor:"Butter · mild sweet · creamy richness", nutrition:"Zinc · selenium · heart-healthy fats", harvest:"Hand-shelled in small batches, steam-treated" },
  { id:9, name:"Mamra Almonds", origin:"Bamiyan Valley · 2200m", price:"₹1499", oldPrice:"₹1999", discount:"-25%", img:"/products/mamra_almonds.png", tag:"RARE", tagline:"Concave, narrow shape. Rich in almond oil and highly prized for cognitive vitality.", flavor:"Marzipan · intense nuttiness · floral oil", nutrition:"High almond oil density · Vitamin E · Omega-6", harvest:"Wild-harvested, hand-sorted in Kabul" },
  { id:10, name:"Gurbandi Almonds", origin:"Ghor Province, Afghanistan", price:"₹899", oldPrice:"₹1199", discount:"-25%", img:"/products/gurbandi_almonds.png", tag:"NEW HARVEST", tagline:"Wild mountain almonds, slightly bitter tones confirming high nutrient density.", flavor:"Earthy · intense almond flavor · herbal finish", nutrition:"High protein · minerals · riboflavin", harvest:"Hand-gathered, shell-on cracked" },
  { id:11, name:"Antep Pistachios", origin:"Gaziantep, Turkey", price:"₹1099", oldPrice:"₹1499", discount:"-26%", img:"/products/antep_pistachios.png", tag:"RARE", tagline:"The world's most aromatic pistachio, smaller in size with a signature deep emerald green kernel.", flavor:"Highly sweet · piney · rich pistachio oil", nutrition:"Lutein · zeaxanthin · B-complex vitamins", harvest:"Early picked in August for greenness" },
  { id:12, name:"Ajwa Dates", origin:"Medina, Saudi Arabia", price:"₹1299", oldPrice:"₹1799", discount:"-27%", img:"/products/ajwa_dates.png", tag:"BESTSELLER", tagline:"Deep black, soft, and naturally sweet dates with active immune-boosting properties.", flavor:"Brown sugar · dark raisin · prune · mild licorice", nutrition:"High potassium · calcium · active antioxidants", harvest:"Selected from certified Medina oasis groves" },
  { id:13, name:"Chandler Walnuts", origin:"San Joaquin Valley, USA", price:"₹799", oldPrice:"₹1099", discount:"-27%", img:"/products/chandler_walnuts.png", tag:"TRENDING", tagline:"Prized for their beautiful light amber color and mild, zero-bitterness buttery flavor.", flavor:"Sweet cream · mild walnut · buttery finish", nutrition:"ALA Omega-3 fats · fiber · copper", harvest:"Machine shaken, air-dried immediately" },
  { id:14, name:"Honey Macadamias", origin:"Byron Bay, Australia", price:"₹1249", oldPrice:"₹1699", discount:"-26%", img:"/products/honey_macadamias.png", tag:"TRENDING", tagline:"Premium macadamia nuts lightly glazed with pure, cold-extracted Australian bush honey.", flavor:"Buttercream · floral honey · toasted crunch", nutrition:"Monounsaturated fats · iron · vitamin B1", harvest:"Dry-roasted, honey-tossed in small batches" },
  { id:15, name:"Golden Raisins", origin:"Xinjiang, Sun-dried", price:"₹499", oldPrice:"₹699", discount:"-28%", img:"/products/golden_raisins.png", tag:"SUN-DRIED", tagline:"Plump, seedless golden grapes dried in traditional mud-brick houses under desert wind.", flavor:"Tangy honey · citrus zest · apricot finish", nutrition:"Resveratrol · iron · natural fructose", harvest:"Shade-dried in brick kilns over 40 days" },
  { id:16, name:"Oregon Hazelnuts", origin:"Willamette Valley, USA", price:"₹899", oldPrice:"₹1299", discount:"-30%", img:"/products/oregon_hazelnuts.png", tag:"NEW HARVEST", tagline:"Grown in fertile volcanic soils under misty Pacific Northwest skies, toasted to absolute perfection.", flavor:"Warm praline · roasted hazelnut butter · sweet cream", nutrition:"Manganese · Vitamin E · folate", harvest:"September shaker-harvested, hot-air roasted" },
  { id:17, name:"Jumbo Cashews W180", origin:"Kollam, Kerala", price:"₹999", oldPrice:"₹1399", discount:"-28%", img:"/products/jumbo_cashews.png", tag:"SINGLE ORIGIN", tagline:"The absolute largest cashew size grade (W180 - 'King Cashew'), dry-roasted in small batches.", flavor:"Roasted cashew butter · sweet dairy · hint of sea salt", nutrition:"Copper · zinc · magnesium · high protein", harvest:"Handpicked, wood-fired roasting, manually peeled" },
  { id:18, name:"Salted Pistachios", origin:"Gauripur, India / Kerman", price:"₹899", oldPrice:"₹1199", discount:"-25%", img:"/products/salted_pistachios.png", tag:"BESTSELLER", tagline:"Roasted in small batches with premium Himalayan pink salt, opening split at peak flavor.", flavor:"Saline · smoke roast · creamy pistachio finish", nutrition:"High protein · vitamin B6 · potassium", harvest:"September harvested, dry-salted roast" },
  { id:19, name:"Kimia Dates", origin:"Bam, Iran", price:"₹349", oldPrice:"₹499", discount:"-30%", img:"/products/kimia_dates.png", tag:"BESTSELLER", tagline:"Super soft, moist, and dark black dates that melt in the mouth. Extremely popular across India.", flavor:"Juicy honey · brown sugar · fresh caramel", nutrition:"Instant energy · iron · fiber", harvest:"Harvested fresh in September, temperature-controlled transit" },
  { id:20, name:"Kalmi Dates", origin:"Safawi, Saudi Arabia", price:"₹749", oldPrice:"₹999", discount:"-25%", img:"/products/kalmi_dates.png", tag:"TRENDING", tagline:"Moderately sweet, dark brown dates with a firm, chewy texture, packed with restorative properties.", flavor:"Fudge · dark berry undertones · mild honey", nutrition:"High calcium · iron · natural digestive sugars", harvest:"August harvested, naturally dry cured" },
  { id:21, name:"Green Raisins", origin:"Nashik, Maharashtra", price:"₹299", oldPrice:"₹399", discount:"-25%", img:"/products/green_raisins.png", tag:"SINGLE ORIGIN", tagline:"Long, sweet, seedless green raisins dried under solar shade houses in Indian vineyards.", flavor:"Tart grape · fresh grass · sweet honey finish", nutrition:"Iron · boron · active polyphenols", harvest:"Vine-plucked, shade-dried over 15 days" },
  { id:22, name:"Munakka Raisins", origin:"Kandahar / Nashik", price:"₹599", oldPrice:"₹799", discount:"-25%", img:"/products/munakka.png", tag:"SUN-DRIED", tagline:"Large seeded raisins, traditionally soaked overnight in India for cooling and digestive benefits.", flavor:"Deep grape nectar · jammy berry · herbal finish", nutrition:"High iron · digestive fiber · heart-healthy antioxidants", harvest:"Sun-cured large grapes with seeds intact" },
  { id:23, name:"Spicy Masala Cashews", origin:"Goa, India", price:"₹749", oldPrice:"₹999", discount:"-25%", img:"/products/masala_cashews.png", tag:"TRENDING", tagline:"Whole grade-W240 cashews dry-roasted and dusted with premium spices like black pepper and dry mango.", flavor:"Spicy tang · toasted cashew cream · black pepper kick", nutrition:"Zinc · heart-healthy fats · iron", harvest:"Handpicked, wood-fired roast with spice dusting" },
  { id:24, name:"Salted Almonds", origin:"Mumbai Roast / California", price:"₹699", oldPrice:"₹899", discount:"-22%", img:"/products/salted_almonds.png", tag:"BESTSELLER", tagline:"Crunchy California almonds lightly tossed with rock salt and slow-roasted for maximum nuttiness.", flavor:"Salted butter · smoky almond · crisp toasted finish", nutrition:"Vitamin E · healthy fats · magnesium", harvest:"Shaker harvested, small-batch oven-salted" },
];

export function calculatePrice(basePriceStr: string, weight: string): string {
  const base = parseInt(basePriceStr.replace(/[^\d]/g, ""), 10);
  if (isNaN(base)) return basePriceStr;

  let multiplier = 1.0;
  if (weight === "100g") multiplier = 0.45;
  else if (weight === "250g") multiplier = 1.0;
  else if (weight === "500g") multiplier = 1.8;
  else if (weight === "1kg") multiplier = 3.4;

  return `₹${Math.round(base * multiplier)}`;
}

export function calculateOldPrice(oldPriceStr: string | undefined, weight: string): string | undefined {
  if (!oldPriceStr) return undefined;
  const base = parseInt(oldPriceStr.replace(/[^\d]/g, ""), 10);
  if (isNaN(base)) return oldPriceStr;

  let multiplier = 1.0;
  if (weight === "100g") multiplier = 0.45;
  else if (weight === "250g") multiplier = 1.0;
  else if (weight === "500g") multiplier = 1.8;
  else if (weight === "1kg") multiplier = 3.4;

  return `₹${Math.round(base * multiplier)}`;
}
