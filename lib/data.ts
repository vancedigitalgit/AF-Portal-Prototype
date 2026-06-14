export type ProductType = "fresh" | "processed";

export type Product = {
  id: string;
  name: string;
  type: ProductType;
  category: string;
  unit: string;
  active: boolean;
};

export type Customer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  type: string;
  address: string;
  active: boolean;
  since: string;
};

export type OrderStatus = "new" | "printed" | "done" | "cancelled";

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  note?: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerType: string;
  status: OrderStatus;
  notes: string;
  poNumber?: string;
  items: OrderItem[];
  createdAt: string;
};

export const products: Product[] = [
  // ── VEGETABLES ──────────────────────────────────────────────────────────
  { id: "f1",  name: "Asparagus",                      type: "fresh", category: "Vegetables",        unit: "bunch",         active: true },
  { id: "f2",  name: "Beans",                          type: "fresh", category: "Vegetables",        unit: "kg",            active: true },
  { id: "f3",  name: "Beetroot",                       type: "fresh", category: "Vegetables",        unit: "10kg bag",      active: true },
  { id: "f4",  name: "Broccoli",                       type: "fresh", category: "Vegetables",        unit: "8kg case",      active: true },
  { id: "f5",  name: "Broccolini",                     type: "fresh", category: "Vegetables",        unit: "case",          active: true },
  { id: "f6",  name: "Cabbage (Drum or Sugar)",        type: "fresh", category: "Vegetables",        unit: "unit",          active: true },
  { id: "f7",  name: "Cabbage Red",                    type: "fresh", category: "Vegetables",        unit: "unit",          active: true },
  { id: "f8",  name: "Capsicum Green",                 type: "fresh", category: "Vegetables",        unit: "8kg case",      active: true },
  { id: "f9",  name: "Capsicum Red",                   type: "fresh", category: "Vegetables",        unit: "8kg case",      active: true },
  { id: "f10", name: "Carrots",                        type: "fresh", category: "Vegetables",        unit: "20kg case",     active: true },
  { id: "f11", name: "Cauliflower",                    type: "fresh", category: "Vegetables",        unit: "case (11 ct)",  active: true },
  { id: "f12", name: "Celery",                         type: "fresh", category: "Vegetables",        unit: "case",          active: true },
  { id: "f13", name: "Chili - Birdseye",               type: "fresh", category: "Vegetables",        unit: "kg",            active: true },
  { id: "f14", name: "Chili - Cayenne Green/Red",      type: "fresh", category: "Vegetables",        unit: "kg",            active: true },
  { id: "f15", name: "Cucumbers - Continental",        type: "fresh", category: "Vegetables",        unit: "15 count bag",  active: true },
  { id: "f16", name: "Cucumbers - Lebanese",           type: "fresh", category: "Vegetables",        unit: "kg",            active: true },
  { id: "f17", name: "Daikon",                         type: "fresh", category: "Vegetables",        unit: "unit",          active: true },
  { id: "f18", name: "Eggplant",                       type: "fresh", category: "Vegetables",        unit: "8kg case",      active: true },
  { id: "f19", name: "Eschalots",                      type: "fresh", category: "Vegetables",        unit: "10 bch bag",    active: true },
  { id: "f20", name: "Garlic Peeled",                  type: "fresh", category: "Vegetables",        unit: "kg",            active: true },
  { id: "f21", name: "Ginger",                         type: "fresh", category: "Vegetables",        unit: "kg",            active: true },
  { id: "f22", name: "Jalapeño",                       type: "fresh", category: "Vegetables",        unit: "kg",            active: true },
  { id: "f23", name: "Leek",                           type: "fresh", category: "Vegetables",        unit: "bunch",         active: true },
  { id: "f24", name: "Lettuce - COS",                  type: "fresh", category: "Vegetables",        unit: "unit",          active: true },
  { id: "f25", name: "Lettuce - Coral",                type: "fresh", category: "Vegetables",        unit: "8pk",           active: true },
  { id: "f26", name: "Lettuce - Iceberg",              type: "fresh", category: "Vegetables",        unit: "12pk",          active: true },
  { id: "f27", name: "Lettuce - Mesclun",              type: "fresh", category: "Vegetables",        unit: "1.5kg case",    active: true },
  { id: "f28", name: "Lettuce - Oak",                  type: "fresh", category: "Vegetables",        unit: "8pk",           active: true },
  { id: "f29", name: "Mushrooms - Button",             type: "fresh", category: "Vegetables",        unit: "4kg case",      active: true },
  { id: "f30", name: "Mushrooms - Cups",               type: "fresh", category: "Vegetables",        unit: "4kg case",      active: true },
  { id: "f31", name: "Onions - Brown",                 type: "fresh", category: "Vegetables",        unit: "20kg bag",      active: true },
  { id: "f32", name: "Onions - Jarra/Picklers",        type: "fresh", category: "Vegetables",        unit: "10kg",          active: true },
  { id: "f33", name: "Onions - Red",                   type: "fresh", category: "Vegetables",        unit: "10kg bag",      active: true },
  { id: "f34", name: "Parsnips",                       type: "fresh", category: "Vegetables",        unit: "20kg bag",      active: true },
  { id: "f35", name: "Potato - Red Chats",             type: "fresh", category: "Vegetables",        unit: "15-20kg",       active: true },
  { id: "f36", name: "Potato - Washed Kipflers",       type: "fresh", category: "Vegetables",        unit: "10kg",          active: true },
  { id: "f37", name: "Potato - White Chats",           type: "fresh", category: "Vegetables",        unit: "15-20kg",       active: true },
  { id: "f38", name: "Potato Brushed Red Soil",        type: "fresh", category: "Vegetables",        unit: "20kg",          active: true },
  { id: "f39", name: "Potato Dutch Cream",             type: "fresh", category: "Vegetables",        unit: "15kg",          active: true },
  { id: "f40", name: "Potato Large White Washed",      type: "fresh", category: "Vegetables",        unit: "15-20kg",       active: true },
  { id: "f41", name: "Potato Washed Desirees",         type: "fresh", category: "Vegetables",        unit: "15-20kg",       active: true },
  { id: "f42", name: "Pumpkin - Butternut",            type: "fresh", category: "Vegetables",        unit: "kg",            active: true },
  { id: "f43", name: "Pumpkin - Jap/Kent",             type: "fresh", category: "Vegetables",        unit: "kg",            active: true },
  { id: "f44", name: "Pumpkin - Jarrah",               type: "fresh", category: "Vegetables",        unit: "kg",            active: true },
  { id: "f45", name: "Silverbeet",                     type: "fresh", category: "Vegetables",        unit: "10 bch case",   active: true },
  { id: "f46", name: "Snow Peas",                      type: "fresh", category: "Vegetables",        unit: "kg",            active: true },
  { id: "f47", name: "Squash",                         type: "fresh", category: "Vegetables",        unit: "4kg / 10kg",    active: true },
  { id: "f48", name: "Swede",                          type: "fresh", category: "Vegetables",        unit: "10kg bag",      active: true },
  { id: "f49", name: "Sweet Corn",                     type: "fresh", category: "Vegetables",        unit: "unit",          active: true },
  { id: "f50", name: "Tomato",                         type: "fresh", category: "Vegetables",        unit: "10kg case",     active: true },
  { id: "f51", name: "Tomato - Cherry",                type: "fresh", category: "Vegetables",        unit: "punnet",        active: true },
  { id: "f52", name: "Tomato - Roma",                  type: "fresh", category: "Vegetables",        unit: "10kg case",     active: true },
  { id: "f53", name: "Turnip",                         type: "fresh", category: "Vegetables",        unit: "10kg bag",      active: true },
  { id: "f54", name: "Zucchini",                       type: "fresh", category: "Vegetables",        unit: "10kg case",     active: true },

  // ── FRUIT ───────────────────────────────────────────────────────────────
  { id: "f55", name: "Apples - Delicious",             type: "fresh", category: "Fruit",             unit: "small ctn",     active: true },
  { id: "f56", name: "Apples - Granny Smith",          type: "fresh", category: "Fruit",             unit: "ctn",           active: true },
  { id: "f57", name: "Apples - Pink Lady",             type: "fresh", category: "Fruit",             unit: "ctn",           active: true },
  { id: "f58", name: "Apples - Pink Lady Juicing",     type: "fresh", category: "Fruit",             unit: "ctn",           active: true },
  { id: "f59", name: "Apricots",                       type: "fresh", category: "Fruit",             unit: "kg",            active: false },
  { id: "f60", name: "Avocado",                        type: "fresh", category: "Fruit",             unit: "tray",          active: true },
  { id: "f61", name: "Bananas - Cavs + Lady Fingers",  type: "fresh", category: "Fruit",             unit: "case",          active: true },
  { id: "f62", name: "Blueberries",                    type: "fresh", category: "Fruit",             unit: "punnet",        active: true },
  { id: "f63", name: "Dragon Fruit",                   type: "fresh", category: "Fruit",             unit: "tray",          active: false },
  { id: "f64", name: "Grapefruit",                     type: "fresh", category: "Fruit",             unit: "kg",            active: true },
  { id: "f65", name: "Grapes - Red Seedless",          type: "fresh", category: "Fruit",             unit: "9.5kg",         active: true },
  { id: "f66", name: "Grapes - White Seedless",        type: "fresh", category: "Fruit",             unit: "9.5kg",         active: true },
  { id: "f67", name: "Kiwi Fruit",                     type: "fresh", category: "Fruit",             unit: "case",          active: true },
  { id: "f68", name: "Lemons",                         type: "fresh", category: "Fruit",             unit: "case",          active: true },
  { id: "f69", name: "Limes",                          type: "fresh", category: "Fruit",             unit: "4kg case",      active: true },
  { id: "f70", name: "Mandarins",                      type: "fresh", category: "Fruit",             unit: "9-15kg case",   active: true },
  { id: "f71", name: "Mangoes",                        type: "fresh", category: "Fruit",             unit: "tray",          active: false },
  { id: "f72", name: "Melon - Honeydew",               type: "fresh", category: "Fruit",             unit: "case",          active: true },
  { id: "f73", name: "Melon - Rockmelon",              type: "fresh", category: "Fruit",             unit: "case",          active: true },
  { id: "f74", name: "Melon - Seedless Watermelon",    type: "fresh", category: "Fruit",             unit: "kg",            active: true },
  { id: "f75", name: "Nectarines",                     type: "fresh", category: "Fruit",             unit: "case",          active: false },
  { id: "f76", name: "Oranges - Juicing",              type: "fresh", category: "Fruit",             unit: "case",          active: true },
  { id: "f77", name: "Oranges - Navel",                type: "fresh", category: "Fruit",             unit: "case",          active: true },
  { id: "f78", name: "Oranges - Valencia",             type: "fresh", category: "Fruit",             unit: "case",          active: true },
  { id: "f79", name: "Passionfruit",                   type: "fresh", category: "Fruit",             unit: "kg",            active: true },
  { id: "f80", name: "Paw Paw Green",                  type: "fresh", category: "Fruit",             unit: "unit",          active: true },
  { id: "f81", name: "Paw Paw Red",                    type: "fresh", category: "Fruit",             unit: "unit",          active: true },
  { id: "f82", name: "Peaches",                        type: "fresh", category: "Fruit",             unit: "case",          active: false },
  { id: "f83", name: "Pears",                          type: "fresh", category: "Fruit",             unit: "case",          active: true },
  { id: "f84", name: "Pineapples",                     type: "fresh", category: "Fruit",             unit: "case",          active: true },
  { id: "f85", name: "Plums",                          type: "fresh", category: "Fruit",             unit: "case",          active: false },
  { id: "f86", name: "Raspberries",                    type: "fresh", category: "Fruit",             unit: "punnet",        active: false },
  { id: "f87", name: "Strawberries",                   type: "fresh", category: "Fruit",             unit: "15 punnet tray",active: true },

  // ── HERBS ────────────────────────────────────────────────────────────────
  { id: "f88", name: "Basil",                          type: "fresh", category: "Herbs",             unit: "bunch",         active: true },
  { id: "f89", name: "Chives",                         type: "fresh", category: "Herbs",             unit: "bunch",         active: true },
  { id: "f90", name: "Coriander",                      type: "fresh", category: "Herbs",             unit: "bunch",         active: true },
  { id: "f91", name: "Dill",                           type: "fresh", category: "Herbs",             unit: "bunch",         active: true },
  { id: "f92", name: "Fennel",                         type: "fresh", category: "Herbs",             unit: "bunch",         active: true },
  { id: "f93", name: "Oregano",                        type: "fresh", category: "Herbs",             unit: "bunch",         active: true },
  { id: "f94", name: "Parsley Curly",                  type: "fresh", category: "Herbs",             unit: "bunch",         active: true },
  { id: "f95", name: "Parsley Flat",                   type: "fresh", category: "Herbs",             unit: "bunch",         active: true },
  { id: "f96", name: "Rosemary",                       type: "fresh", category: "Herbs",             unit: "bunch",         active: true },
  { id: "f97", name: "Sage",                           type: "fresh", category: "Herbs",             unit: "bunch",         active: true },
  { id: "f98", name: "Tarragon",                       type: "fresh", category: "Herbs",             unit: "bunch",         active: true },
  { id: "f99", name: "Thyme",                          type: "fresh", category: "Herbs",             unit: "bunch",         active: true },

  // ── CHINESE VEG ──────────────────────────────────────────────────────────
  { id: "f100", name: "Bok Choy",                      type: "fresh", category: "Chinese Veg",       unit: "bunch",         active: true },
  { id: "f101", name: "Choy Sum",                      type: "fresh", category: "Chinese Veg",       unit: "bunch",         active: true },
  { id: "f102", name: "Gai Lan",                       type: "fresh", category: "Chinese Veg",       unit: "bunch",         active: true },
  { id: "f103", name: "Pac Choy",                      type: "fresh", category: "Chinese Veg",       unit: "bunch",         active: true },

  // ── OTHER (fresh) ────────────────────────────────────────────────────────
  { id: "f104", name: "Alfalfa",                       type: "fresh", category: "Other",             unit: "500g punnet",   active: true },
  { id: "f105", name: "Baby Spinach",                  type: "fresh", category: "Other",             unit: "1.5kg case",    active: true },
  { id: "f106", name: "Bean Sprouts",                  type: "fresh", category: "Other",             unit: "1kg",           active: true },
  { id: "f107", name: "Eggs - Cage or Free Range",     type: "fresh", category: "Other",             unit: "case (15 doz)", active: true },
  { id: "f108", name: "Kale",                          type: "fresh", category: "Other",             unit: "bunch",         active: true },
  { id: "f109", name: "Rocket",                        type: "fresh", category: "Other",             unit: "1.5kg case",    active: true },
  { id: "f110", name: "Snow Pea Sprouts",              type: "fresh", category: "Other",             unit: "500g",          active: true },
  { id: "f111", name: "Wombok",                        type: "fresh", category: "Other",             unit: "bulk case",     active: true },

  // ── POTATO PRODUCTS ──────────────────────────────────────────────────────
  { id: "pr1",  name: "Peeled Potato 5kg",             type: "processed", category: "Potato Products",       unit: "5kg",   active: true },
  { id: "pr2",  name: "Vac Pac Potatoes",              type: "processed", category: "Potato Products",       unit: "kg",    active: true },
  { id: "pr3",  name: "Peeled Potato 10kg",            type: "processed", category: "Potato Products",       unit: "10kg",  active: true },
  { id: "pr4",  name: "Wedges",                        type: "processed", category: "Potato Products",       unit: "kg",    active: true },
  { id: "pr5",  name: "Sliced Potato 3mm",             type: "processed", category: "Potato Products",       unit: "kg",    active: true },
  { id: "pr6",  name: "Sliced Potato 5mm",             type: "processed", category: "Potato Products",       unit: "kg",    active: true },
  { id: "pr7",  name: "Diced Potato 14/20mm",          type: "processed", category: "Potato Products",       unit: "kg",    active: true },
  { id: "pr8",  name: "Shredded Potato",               type: "processed", category: "Potato Products",       unit: "kg",    active: true },
  { id: "pr9",  name: "Potato 1/4s / Portions",        type: "processed", category: "Potato Products",       unit: "kg",    active: true },
  { id: "pr10", name: "Scallops",                      type: "processed", category: "Potato Products",       unit: "kg",    active: true },
  { id: "pr11", name: "Chats Cut in 1/2",              type: "processed", category: "Potato Products",       unit: "kg",    active: true },
  { id: "pr12", name: "Kipflers Cut in 1/2",           type: "processed", category: "Potato Products",       unit: "kg",    active: true },

  // ── SWEET POTATO PRODUCTS ────────────────────────────────────────────────
  { id: "pr13", name: "Whole Peeled Sweet Potato",     type: "processed", category: "Sweet Potato Products", unit: "kg",    active: true },
  { id: "pr14", name: "Sweet Skin-On Portions",        type: "processed", category: "Sweet Potato Products", unit: "kg",    active: true },
  { id: "pr15", name: "Sweet Potato Portions",         type: "processed", category: "Sweet Potato Products", unit: "kg",    active: true },
  { id: "pr16", name: "Sweet Potato Shredded",         type: "processed", category: "Sweet Potato Products", unit: "kg",    active: true },
  { id: "pr17", name: "Sweet Potato Sliced 5mm",       type: "processed", category: "Sweet Potato Products", unit: "kg",    active: true },
  { id: "pr18", name: "Sweet Potato Diced 14/20mm",    type: "processed", category: "Sweet Potato Products", unit: "kg",    active: true },

  // ── PUMPKIN PRODUCTS ─────────────────────────────────────────────────────
  { id: "pr19", name: "Peeled Pumpkin 1/4s",           type: "processed", category: "Pumpkin Products",      unit: "kg",    active: true },
  { id: "pr20", name: "Peeled Pumpkin Portions",       type: "processed", category: "Pumpkin Products",      unit: "kg",    active: true },
  { id: "pr21", name: "Jap Skin-On Portions",          type: "processed", category: "Pumpkin Products",      unit: "kg",    active: true },
  { id: "pr22", name: "Grey Skin-On Portions",         type: "processed", category: "Pumpkin Products",      unit: "kg",    active: true },
  { id: "pr23", name: "Sliced Pumpkin 5mm",            type: "processed", category: "Pumpkin Products",      unit: "kg",    active: true },
  { id: "pr24", name: "Diced Pumpkin 10mm",            type: "processed", category: "Pumpkin Products",      unit: "kg",    active: true },
  { id: "pr25", name: "Diced Pumpkin 14mm",            type: "processed", category: "Pumpkin Products",      unit: "kg",    active: true },
  { id: "pr26", name: "Diced Pumpkin 20mm",            type: "processed", category: "Pumpkin Products",      unit: "kg",    active: true },
  { id: "pr27", name: "Shredded Pumpkin",              type: "processed", category: "Pumpkin Products",      unit: "kg",    active: true },

  // ── ONION PRODUCTS ───────────────────────────────────────────────────────
  { id: "pr28", name: "Whole Peeled Onions",           type: "processed", category: "Onion Products",        unit: "kg",    active: true },
  { id: "pr29", name: "Sliced Onions 3mm",             type: "processed", category: "Onion Products",        unit: "kg",    active: true },
  { id: "pr30", name: "10mm Diced Onions",             type: "processed", category: "Onion Products",        unit: "kg",    active: true },
  { id: "pr31", name: "14mm Diced Onions",             type: "processed", category: "Onion Products",        unit: "kg",    active: true },
  { id: "pr32", name: "20mm Diced Onions",             type: "processed", category: "Onion Products",        unit: "kg",    active: true },
  { id: "pr33", name: "Hand Diced Onions",             type: "processed", category: "Onion Products",        unit: "kg",    active: true },
  { id: "pr34", name: "Whole Peeled Red Onions",       type: "processed", category: "Onion Products",        unit: "kg",    active: true },
  { id: "pr35", name: "Sliced Red Onions",             type: "processed", category: "Onion Products",        unit: "kg",    active: true },
  { id: "pr36", name: "Diced Red Onions",              type: "processed", category: "Onion Products",        unit: "kg",    active: true },
  { id: "pr37", name: "Pickler Onions",                type: "processed", category: "Onion Products",        unit: "kg",    active: true },

  // ── CARROT PRODUCTS ──────────────────────────────────────────────────────
  { id: "pr38", name: "Whole Peeled Carrots",          type: "processed", category: "Carrot Products",       unit: "kg",    active: true },
  { id: "pr39", name: "Sliced Carrots (Rings)",        type: "processed", category: "Carrot Products",       unit: "kg",    active: true },
  { id: "pr40", name: "Shredded Carrot",               type: "processed", category: "Carrot Products",       unit: "kg",    active: true },
  { id: "pr41", name: "Carrot Curls",                  type: "processed", category: "Carrot Products",       unit: "kg",    active: true },
  { id: "pr42", name: "Baby Carrots",                  type: "processed", category: "Carrot Products",       unit: "unit",  active: true },
  { id: "pr43", name: "Carrot Batons 10mm",            type: "processed", category: "Carrot Products",       unit: "kg",    active: true },
  { id: "pr44", name: "Carrot Batons 14mm",            type: "processed", category: "Carrot Products",       unit: "kg",    active: true },
  { id: "pr45", name: "Julienne Carrots 5mm",          type: "processed", category: "Carrot Products",       unit: "kg",    active: true },
  { id: "pr46", name: "10mm Diced Carrots",            type: "processed", category: "Carrot Products",       unit: "kg",    active: true },
  { id: "pr47", name: "14mm Diced Carrots",            type: "processed", category: "Carrot Products",       unit: "kg",    active: true },
  { id: "pr48", name: "Hand Diced Carrots",            type: "processed", category: "Carrot Products",       unit: "kg",    active: true },

  // ── OTHERS (processed) ──────────────────────────────────────────────────
  { id: "pr49", name: "Beans Top & Tailed",            type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr50", name: "Beetroot Curls",                type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr51", name: "Beetroot Peeled",               type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr52", name: "Cabbage Shredded 3mm",          type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr53", name: "Capsicum Red/Green Diced",      type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr54", name: "Capsicum Red/Green Sliced",     type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr55", name: "Celery Diced 10mm",             type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr56", name: "Continental Cucumber Sliced",   type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr57", name: "Cos Leaves Washed",             type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr58", name: "Dry Slaw",                      type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr59", name: "Broccoli Florets",              type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr60", name: "Cauliflower Florets",           type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr61", name: "Fruit Salad 20mm",              type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr62", name: "Lettuce Shredded",              type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr63", name: "Mushrooms Sliced",              type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr64", name: "Orange Wedges",                 type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr65", name: "Parsnip Peeled",                type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr66", name: "Pineapple Wedges",              type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr67", name: "Red Cabbage Shredded",          type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr68", name: "Roast Mix 30mm",                type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr69", name: "Soup Mix - Basic",              type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr70", name: "Soup Mix - Soft Diet",          type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr71", name: "Stir Fry - Steaming Mix",       type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr72", name: "Stir Fry Asian Greens",         type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr73", name: "Stir Fry Asian Mix",            type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr74", name: "Swede Diced",                   type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr75", name: "Swede Peeled",                  type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr76", name: "Tomato Diced",                  type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr77", name: "Tomato Sliced",                 type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr78", name: "Tossed Salad",                  type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr79", name: "Turnip Peeled",                 type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr80", name: "Watermelon Wedges",             type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr81", name: "Zucchini Hand Diced 20mm",      type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr82", name: "Zucchini Shredded",             type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr83", name: "Zucchini Sliced",               type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr84", name: "Zucchini Batons 14mm",          type: "processed", category: "Others",                unit: "kg",    active: true },
  { id: "pr85", name: "Fruit Platter for 10 People",   type: "processed", category: "Others",                unit: "each",  active: true },
];

export const customers: Customer[] = [
  { id: "c1", name: "The Collective Café",           contact: "Sarah Thompson", email: "sarah@collectivecafe.com.au",       phone: "07 5512 3344", type: "Café / Restaurant", address: "12 Burleigh Heads Rd, Gold Coast QLD",          active: true, since: "2019" },
  { id: "c2", name: "Burleigh Aged Care",             contact: "Mark Davies",    email: "mark.davies@burleighagedcare.com.au", phone: "07 5559 8801", type: "Aged Care",         address: "45 James Street, Burleigh Heads QLD",           active: true, since: "2017" },
  { id: "c3", name: "Tweed Valley Primary School",   contact: "Jenny Walsh",    email: "canteen@tweedvalleyps.edu.au",       phone: "02 6672 1543", type: "School",            address: "88 School Road, Murwillumbah NSW",              active: true, since: "2020" },
  { id: "c4", name: "The Anchor Hotel",              contact: "Chris Norris",   email: "kitchen@anchorhotel.com.au",         phone: "07 5536 1200", type: "Pub & Club",        address: "1 Pacific Parade, Coolangatta QLD",             active: true, since: "2018" },
  { id: "c5", name: "Cabarita Beach Resort",         contact: "Natalie Ford",   email: "nford@cabaritaresort.com.au",        phone: "02 6676 2200", type: "Resort / Hotel",    address: "2 Tweed Coast Road, Cabarita Beach NSW",        active: true, since: "2021" },
  { id: "c6", name: "Little Seeds Child Care",       contact: "Amanda Price",   email: "amanda@littleseeds.com.au",          phone: "07 5525 9900", type: "Child Care",        address: "32 Palm Avenue, Currumbin QLD",                 active: true, since: "2022" },
  { id: "c7", name: "Feast Catering Co.",            contact: "David Nguyen",   email: "david@feastcatering.com.au",         phone: "07 5530 7700", type: "Food Manufacturer", address: "14 Industrial Drive, Tweed Heads South NSW",    active: true, since: "2019" },
  { id: "c8", name: "Northern Rivers Meals on Wheels", contact: "Susan Farrell", email: "orders@nrmow.org.au",              phone: "02 6672 4400", type: "Charity",           address: "7 Civic Way, Lismore NSW",                      active: true, since: "2016" },
];

export const orders: Order[] = [
  {
    id: "ORD-1045", customerId: "c1", customerName: "The Collective Café", customerType: "Café / Restaurant",
    status: "new", notes: "Early delivery if possible — kitchen starts at 6am.", createdAt: "2026-06-13T07:05:00",
    items: [
      { productId: "f24", productName: "Lettuce - COS",        quantity: 4,  unit: "unit" },
      { productId: "f50", productName: "Tomato",               quantity: 2,  unit: "10kg case" },
      { productId: "f88", productName: "Basil",                quantity: 6,  unit: "bunch" },
      { productId: "pr57", productName: "Cos Leaves Washed",   quantity: 3,  unit: "kg" },
    ],
  },
  {
    id: "ORD-1044", customerId: "c6", customerName: "Little Seeds Child Care", customerType: "Child Care",
    status: "printed", notes: "", createdAt: "2026-06-13T06:30:00",
    items: [
      { productId: "f61",  productName: "Bananas - Cavs + Lady Fingers", quantity: 2, unit: "case" },
      { productId: "f77",  productName: "Oranges - Navel",   quantity: 1,  unit: "case" },
      { productId: "f105", productName: "Baby Spinach",       quantity: 2,  unit: "1.5kg case" },
    ],
  },
  {
    id: "ORD-1043", customerId: "c3", customerName: "Tweed Valley Primary School", customerType: "School",
    status: "new", notes: "Canteen restock — please send firm avocados.", poNumber: "PO-6612", createdAt: "2026-06-13T06:15:00",
    items: [
      { productId: "f60",  productName: "Avocado",             quantity: 2,  unit: "tray" },
      { productId: "f16",  productName: "Cucumbers - Lebanese", quantity: 4, unit: "kg" },
      { productId: "f4",   productName: "Broccoli",            quantity: 1,  unit: "8kg case" },
      { productId: "f61",  productName: "Bananas - Cavs + Lady Fingers", quantity: 1, unit: "case" },
    ],
  },
  {
    id: "ORD-1042", customerId: "c8", customerName: "Northern Rivers Meals on Wheels", customerType: "Charity",
    status: "printed", notes: "", createdAt: "2026-06-13T05:50:00",
    items: [
      { productId: "pr69", productName: "Soup Mix - Basic",    quantity: 12, unit: "kg" },
      { productId: "pr70", productName: "Soup Mix - Soft Diet", quantity: 6, unit: "kg" },
      { productId: "f42",  productName: "Pumpkin - Butternut", quantity: 5,  unit: "kg" },
    ],
  },
  {
    id: "ORD-1041", customerId: "c1", customerName: "The Collective Café", customerType: "Café / Restaurant",
    status: "new", notes: "Please include the stir fry mix in separate bags if possible.", createdAt: "2026-06-12T07:22:00",
    items: [
      { productId: "f4",  productName: "Broccoli",       quantity: 5, unit: "8kg case" },
      { productId: "f52", productName: "Tomato - Roma",  quantity: 2, unit: "10kg case" },
      { productId: "pr71", productName: "Stir Fry - Steaming Mix", quantity: 3, unit: "kg" },
      { productId: "f105", productName: "Baby Spinach",  quantity: 4, unit: "1.5kg case" },
    ],
  },
  {
    id: "ORD-1040", customerId: "c2", customerName: "Burleigh Aged Care", customerType: "Aged Care",
    status: "new", notes: "", poNumber: "PO-7821", createdAt: "2026-06-12T06:45:00",
    items: [
      { productId: "pr69", productName: "Soup Mix - Basic",     quantity: 10, unit: "kg" },
      { productId: "pr70", productName: "Soup Mix - Soft Diet", quantity: 5,  unit: "kg" },
      { productId: "f42",  productName: "Pumpkin - Butternut",  quantity: 8,  unit: "kg" },
      { productId: "f77",  productName: "Oranges - Navel",      quantity: 2,  unit: "case" },
    ],
  },
  {
    id: "ORD-1039", customerId: "c7", customerName: "Feast Catering Co.", customerType: "Food Manufacturer",
    status: "printed", notes: "Double check the diced onion is freshly cut — last batch was slightly old.", createdAt: "2026-06-12T05:30:00",
    items: [
      { productId: "pr32", productName: "20mm Diced Onions",    quantity: 15, unit: "kg" },
      { productId: "pr53", productName: "Capsicum Red/Green Diced", quantity: 8, unit: "kg" },
      { productId: "pr26", productName: "Diced Pumpkin 20mm",   quantity: 10, unit: "kg" },
      { productId: "pr45", productName: "Julienne Carrots 5mm", quantity: 6,  unit: "kg" },
    ],
  },
  {
    id: "ORD-1038", customerId: "c5", customerName: "Cabarita Beach Resort", customerType: "Resort / Hotel",
    status: "done", notes: "", createdAt: "2026-06-10T07:10:00",
    items: [
      { productId: "f61", productName: "Bananas - Cavs + Lady Fingers", quantity: 2, unit: "case" },
      { productId: "f62", productName: "Blueberries",    quantity: 12, unit: "punnet" },
      { productId: "f84", productName: "Pineapples",     quantity: 1,  unit: "case" },
      { productId: "f26", productName: "Lettuce - Iceberg", quantity: 1, unit: "12pk" },
      { productId: "f9",  productName: "Capsicum Red",   quantity: 1,  unit: "8kg case" },
    ],
  },
  {
    id: "ORD-1037", customerId: "c3", customerName: "Tweed Valley Primary School", customerType: "School",
    status: "done", notes: "Canteen order for the week.", createdAt: "2026-06-09T06:55:00",
    items: [
      { productId: "f4",  productName: "Broccoli",           quantity: 1,  unit: "8kg case" },
      { productId: "f16", productName: "Cucumbers - Lebanese", quantity: 5, unit: "kg" },
      { productId: "f61", productName: "Bananas - Cavs + Lady Fingers", quantity: 1, unit: "case" },
      { productId: "f68", productName: "Lemons",             quantity: 1,  unit: "case" },
    ],
  },
  {
    id: "ORD-1036", customerId: "c4", customerName: "The Anchor Hotel", customerType: "Pub & Club",
    status: "done", notes: "", createdAt: "2026-06-05T07:30:00",
    items: [
      { productId: "f31", productName: "Onions - Brown",      quantity: 1,  unit: "20kg bag" },
      { productId: "f52", productName: "Tomato - Roma",        quantity: 2,  unit: "10kg case" },
      { productId: "f26", productName: "Lettuce - Iceberg",    quantity: 1,  unit: "12pk" },
      { productId: "f95", productName: "Parsley Flat",         quantity: 4,  unit: "bunch" },
    ],
  },
  {
    id: "ORD-1035", customerId: "c8", customerName: "Northern Rivers Meals on Wheels", customerType: "Charity",
    status: "cancelled", notes: "Order cancelled — client on leave this week.", createdAt: "2026-06-03T08:00:00",
    items: [
      { productId: "pr69", productName: "Soup Mix - Basic", quantity: 8, unit: "kg" },
    ],
  },
  {
    id: "ORD-1034", customerId: "c6", customerName: "Little Seeds Child Care", customerType: "Child Care",
    status: "done", notes: "", createdAt: "2026-05-27T07:20:00",
    items: [
      { productId: "f61",  productName: "Bananas - Cavs + Lady Fingers", quantity: 1, unit: "case" },
      { productId: "f105", productName: "Baby Spinach",   quantity: 2,  unit: "1.5kg case" },
      { productId: "f4",   productName: "Broccoli",       quantity: 1,  unit: "8kg case" },
      { productId: "f77",  productName: "Oranges - Navel", quantity: 1, unit: "case" },
    ],
  },
];

export function getOrdersByStatus(status: OrderStatus) {
  return orders.filter((o) => o.status === status);
}

export function getOrderById(id: string) {
  return orders.find((o) => o.id === id);
}

export function getCustomerById(id: string) {
  return customers.find((c) => c.id === id);
}

export function getProductsByCategory() {
  const map: Record<string, Product[]> = {};
  for (const p of products) {
    if (!map[p.category]) map[p.category] = [];
    map[p.category].push(p);
  }
  return map;
}
