import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Aliore Café database…");

  const adminPass = await bcrypt.hash("admin123456", 12);
  const userPass  = await bcrypt.hash("user123456",  12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@aliore.cafe" }, update: {},
    create: { name: "Admin Aliore", email: "admin@aliore.cafe", password: adminPass, role: "ADMIN" },
  });
  const customer = await prisma.user.upsert({
    where: { email: "guest@aliore.cafe" }, update: {},
    create: { name: "Isabelle Fontaine", email: "guest@aliore.cafe", password: userPass, role: "CUSTOMER" },
  });
  console.log(`✅ Users: ${admin.email}, ${customer.email}`);

  const cats = await Promise.all([
    prisma.category.upsert({ where:{slug:"breakfast"}, update:{}, create:{name:"Breakfast",slug:"breakfast",sortOrder:1,nameTranslations:JSON.stringify({fr:"Petit-déjeuner",de:"Frühstück",zh:"早餐",fa:"صبحانه"})} }),
    prisma.category.upsert({ where:{slug:"lunch"},     update:{}, create:{name:"Lunch",    slug:"lunch",    sortOrder:2,nameTranslations:JSON.stringify({fr:"Déjeuner",      de:"Mittagessen",zh:"午餐",fa:"ناهار"})} }),
    prisma.category.upsert({ where:{slug:"dinner"},    update:{}, create:{name:"Dinner",   slug:"dinner",   sortOrder:3,nameTranslations:JSON.stringify({fr:"Dîner",          de:"Abendessen", zh:"晚餐",fa:"شام"})} }),
    prisma.category.upsert({ where:{slug:"coffee"},    update:{}, create:{name:"Coffee",   slug:"coffee",   sortOrder:4,nameTranslations:JSON.stringify({fr:"Café",            de:"Kaffee",     zh:"咖啡",fa:"قهوه"})} }),
    prisma.category.upsert({ where:{slug:"desserts"},  update:{}, create:{name:"Desserts", slug:"desserts", sortOrder:5,nameTranslations:JSON.stringify({fr:"Desserts",        de:"Desserts",   zh:"甜点",fa:"دسر"})} }),
    prisma.category.upsert({ where:{slug:"drinks"},    update:{}, create:{name:"Drinks",   slug:"drinks",   sortOrder:6,nameTranslations:JSON.stringify({fr:"Boissons",        de:"Getränke",   zh:"饮品",fa:"نوشیدنی"})} }),
  ]);
  const [breakfast, lunch, dinner, coffee, desserts, drinks] = cats;
  console.log(`✅ ${cats.length} categories`);

  const menuItems = [
    {categoryId:breakfast.id,name:"Croque Monsieur",       price:14,isFeatured:false,isVegan:false,isGlutenFree:false,calories:480,prepTime:12,sortOrder:1,description:"Gruyère, jambon de Paris, béchamel maison, sourdough artisanal"},
    {categoryId:breakfast.id,name:"Avocado Toast",         price:16,isFeatured:false,isVegan:false,isGlutenFree:false,calories:390,prepTime:10,sortOrder:2,description:"Smashed avocado, poached egg, dukkah, microherbs, sourdough"},
    {categoryId:breakfast.id,name:"Granola Bowl",          price:13,isFeatured:false,isVegan:true, isGlutenFree:true, calories:320,prepTime:5, sortOrder:3,description:"Coconut yoghurt, seasonal fruits, house-made granola, honey"},
    {categoryId:breakfast.id,name:"French Omelette",       price:15,isFeatured:false,isVegan:false,isGlutenFree:true, calories:340,prepTime:12,sortOrder:4,description:"Three-egg omelette, herbs, truffle salt, beurre noisette"},
    {categoryId:lunch.id,    name:"Seared Salmon",         price:34,isFeatured:true, isVegan:false,isGlutenFree:true, calories:480,prepTime:20,sortOrder:1,description:"Butter-basted fillet, fennel purée, citrus beurre blanc, micro dill"},
    {categoryId:lunch.id,    name:"Burrata Salad",         price:22,isFeatured:false,isVegan:false,isGlutenFree:true, calories:280,prepTime:8, sortOrder:2,description:"Heritage tomatoes, buffalo burrata, basil oil, aged 12yr balsamic"},
    {categoryId:lunch.id,    name:"Duck Confit Tartine",   price:28,isFeatured:false,isVegan:false,isGlutenFree:false,calories:560,prepTime:15,sortOrder:3,description:"Slow-confit duck, fig chutney, rocket, walnut rye"},
    {categoryId:dinner.id,   name:"Truffle Risotto",       price:38,isFeatured:true, isVegan:false,isGlutenFree:true, calories:520,prepTime:25,sortOrder:1,description:"Aged parmesan, black truffle, wild mushroom consommé, chives"},
    {categoryId:dinner.id,   name:"Beef Tenderloin",       price:58,isFeatured:true, isVegan:false,isGlutenFree:true, calories:680,prepTime:30,sortOrder:2,description:"45-day dry-aged, truffle jus, pomme purée, glazed shallots"},
    {categoryId:dinner.id,   name:"Lobster Bisque",        price:26,isFeatured:false,isVegan:false,isGlutenFree:true, calories:380,prepTime:15,sortOrder:3,description:"Blue lobster, cognac cream, chervil oil, sourdough crouton"},
    {categoryId:dinner.id,   name:"Mushroom Wellington",   price:42,isFeatured:false,isVegan:true, isGlutenFree:false,calories:490,prepTime:35,sortOrder:4,description:"Wild mushroom duxelles, puff pastry, red wine jus, seasonal greens"},
    {categoryId:coffee.id,   name:"Signature Espresso",    price:8, isFeatured:true, isVegan:true, isGlutenFree:true, calories:10, prepTime:5, sortOrder:1,description:"Ethiopian Yirgacheffe single-origin, volcanic stone filtered water"},
    {categoryId:coffee.id,   name:"Gold Flat White",       price:9, isFeatured:false,isVegan:false,isGlutenFree:true, calories:90, prepTime:5, sortOrder:2,description:"House blend, velvety micro-foam, edible 24k gold dust"},
    {categoryId:coffee.id,   name:"Matcha Latte",          price:10,isFeatured:false,isVegan:true, isGlutenFree:true, calories:120,prepTime:5, sortOrder:3,description:"Ceremonial grade matcha, oat milk, cold-pressed honey"},
    {categoryId:coffee.id,   name:"Cold Brew Tonic",       price:11,isFeatured:false,isVegan:true, isGlutenFree:true, calories:60, prepTime:3, sortOrder:4,description:"18-hour cold brew, Fever-Tree tonic, orange zest, ice sphere"},
    {categoryId:desserts.id, name:"Crème Brûlée",         price:16,isFeatured:true, isVegan:false,isGlutenFree:true, calories:340,prepTime:15,sortOrder:1,description:"Madagascar vanilla, caramelised demerara, 24k gold leaf"},
    {categoryId:desserts.id, name:"Dark Chocolate Fondant",price:18,isFeatured:false,isVegan:false,isGlutenFree:false,calories:520,prepTime:12,sortOrder:2,description:"Valrhona 72%, liquid salted caramel core, vanilla Chantilly"},
    {categoryId:desserts.id, name:"Tarte Tatin",          price:14,isFeatured:false,isVegan:false,isGlutenFree:false,calories:420,prepTime:10,sortOrder:3,description:"Caramelised apple, puff pastry, crème fraîche, calvados"},
    {categoryId:drinks.id,   name:"Negroni Bianco",        price:16,isFeatured:false,isVegan:true, isGlutenFree:true, calories:180,prepTime:3, sortOrder:1,description:"Hendrick's gin, Lillet Blanc, white vermouth, cucumber"},
    {categoryId:drinks.id,   name:"Champagne Cocktail",   price:24,isFeatured:false,isVegan:true, isGlutenFree:true, calories:150,prepTime:3, sortOrder:2,description:"Veuve Clicquot NV, Grand Marnier, Angostura, sugar cube"},
    {categoryId:drinks.id,   name:"Aliore Spritz",        price:14,isFeatured:false,isVegan:true, isGlutenFree:true, calories:130,prepTime:3, sortOrder:3,description:"Aperol, Provence rosé, prosecco, blood orange, ice"},
  ];
  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }
  console.log(`✅ ${menuItems.length} menu items`);

  const tables = [
    {number:1, zone:"INDOOR"  as const,capacity:2, posX:120,posY:120,shape:"round",pricePerSeat:0 },
    {number:2, zone:"INDOOR"  as const,capacity:2, posX:200,posY:120,shape:"round",pricePerSeat:0 },
    {number:3, zone:"INDOOR"  as const,capacity:4, posX:310,posY:120,shape:"rect", pricePerSeat:0 },
    {number:4, zone:"INDOOR"  as const,capacity:4, posX:420,posY:120,shape:"rect", pricePerSeat:0 },
    {number:5, zone:"INDOOR"  as const,capacity:2, posX:120,posY:220,shape:"round",pricePerSeat:0 },
    {number:6, zone:"INDOOR"  as const,capacity:6, posX:250,posY:220,shape:"rect", pricePerSeat:0 },
    {number:7, zone:"INDOOR"  as const,capacity:4, posX:420,posY:220,shape:"rect", pricePerSeat:0 },
    {number:8, zone:"TERRACE" as const,capacity:2, posX:120,posY:380,shape:"round",pricePerSeat:5 },
    {number:9, zone:"TERRACE" as const,capacity:2, posX:220,posY:380,shape:"round",pricePerSeat:5 },
    {number:10,zone:"TERRACE" as const,capacity:4, posX:340,posY:380,shape:"round",pricePerSeat:5 },
    {number:11,zone:"TERRACE" as const,capacity:4, posX:460,posY:380,shape:"round",pricePerSeat:5 },
    {number:12,zone:"BAR"     as const,capacity:2, posX:120,posY:520,shape:"round",pricePerSeat:0 },
    {number:13,zone:"BAR"     as const,capacity:2, posX:200,posY:520,shape:"round",pricePerSeat:0 },
    {number:14,zone:"BAR"     as const,capacity:2, posX:280,posY:520,shape:"round",pricePerSeat:0 },
    {number:15,zone:"PRIVATE" as const,capacity:10,posX:380,posY:500,shape:"rect", pricePerSeat:15},
  ];
  for (const t of tables) {
    await prisma.restaurantTable.upsert({ where:{number:t.number}, update:{}, create:t });
  }
  console.log(`✅ ${tables.length} tables`);

  const table4 = await prisma.restaurantTable.findUnique({ where:{number:4} });
  if (table4) {
    const existingRes = await prisma.reservation.findFirst({ where:{guestEmail:"guest@aliore.cafe"} });
    if (!existingRes) {
      await prisma.reservation.create({ data:{
        userId:customer.id, tableId:table4.id,
        guestName:"Isabelle Fontaine", guestEmail:"guest@aliore.cafe",
        guestPhone:"+33 6 12 34 56 78", guestCount:2,
        date:new Date("2025-03-15"), timeSlot:"19:30",
        status:"CONFIRMED", totalAmount:0,
      }});
    }
  }
  console.log("✅ Sample reservation");

  const existingT = await prisma.testimonial.count();
  if (existingT === 0) {
    for (const t of [
      {name:"Isabelle Fontaine",role:"Food Critic, Le Figaro",  rating:5,isActive:true,content:"Aliore is the rarest of things — a restaurant that genuinely earns its reputation. The truffle risotto alone is worth the visit."},
      {name:"Marcus Klein",     role:"Restaurateur, Berlin",     rating:5,isActive:true,content:"I have dined across three continents. Aliore's coffee programme is among the finest I have encountered."},
      {name:"Yuki Tanaka",      role:"Travel Blogger",           rating:5,isActive:true,content:"The interactive reservation map is a revelation. The staff remembered my dietary preferences from six months prior."},
      {name:"Arash Karimi",     role:"Architect",                rating:5,isActive:true,content:"As someone who appreciates design, Aliore is exceptional. Everything speaks the same refined language."},
    ]) { await prisma.testimonial.create({ data: t }); }
  }
  console.log("✅ Testimonials");

  for (const post of [
    {title:"The Art of the Perfect Espresso",slug:"the-art-of-perfect-espresso",excerpt:"The science and soul behind Aliore's espresso.",content:"At Aliore, coffee is not a beverage. It is a ritual...",isPublished:true,publishedAt:new Date("2024-12-12"),authorId:admin.id,tags:JSON.stringify(["coffee"])},
    {title:"Truffle Season: What's on the Menu",slug:"truffle-season-2024",excerpt:"Black truffle — Chef Alexandre shares his philosophy.",content:"The black truffle arrives each December...",isPublished:true,publishedAt:new Date("2024-11-28"),authorId:admin.id,tags:JSON.stringify(["seasonal"])},
    {title:"Planning the Perfect Private Dinner",slug:"private-dining-guide",excerpt:"From proposals to celebrations — making it unforgettable.",content:"Our private dining rooms have hosted marriage proposals...",isPublished:true,publishedAt:new Date("2024-11-10"),authorId:admin.id,tags:JSON.stringify(["events"])},
  ]) {
    const existing = await prisma.blogPost.findUnique({ where:{slug:post.slug} });
    if (!existing) await prisma.blogPost.create({ data: post });
  }
  console.log("✅ Blog posts");

  const existingG = await prisma.galleryImage.count();
  if (existingG === 0) {
    for (const img of [
      {url:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",alt:"Restaurant interior",category:"interior",sortOrder:1},
      {url:"https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",alt:"Truffle risotto",    category:"food",    sortOrder:2},
      {url:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",alt:"Espresso pour",      category:"coffee",  sortOrder:3},
      {url:"https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80",alt:"Crème brûlée",       category:"food",    sortOrder:4},
      {url:"https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",alt:"Beef tenderloin",   category:"food",    sortOrder:5},
      {url:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",alt:"Coffee art",         category:"coffee",  sortOrder:6},
    ]) { await prisma.galleryImage.create({ data: img }); }
  }
  console.log("✅ Gallery images");

  console.log("\n🎉 Done! Credentials:");
  console.log("   Admin    → admin@aliore.cafe  / admin123456");
  console.log("   Customer → guest@aliore.cafe  / user123456");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
