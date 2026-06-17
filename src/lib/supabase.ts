import { Product, products } from "./products";

// A mock Supabase Query Builder to conforming to supabase-js types
class MockBuilder {
  private tableName: string;
  private filters: ((item: any) => boolean)[] = [];
  private orderByColumn: string | null = null;
  private orderAscending = true;
  private limitCount: number | null = null;
  private operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE" = "SELECT";
  private updateFields: any = null;
  private insertRows: any[] = [];

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = "*") {
    this.operation = "SELECT";
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this.orderByColumn = column;
    this.orderAscending = ascending;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  insert(rows: any | any[]) {
    this.operation = "INSERT";
    this.insertRows = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(fields: any) {
    this.operation = "UPDATE";
    this.updateFields = fields;
    return this;
  }

  delete() {
    this.operation = "DELETE";
    return this;
  }

  async single() {
    const { data, error } = await this.execute();
    return { data: data && data.length > 0 ? data[0] : null, error };
  }

  // Support then for standard awaiting
  async then(onfulfilled?: (value: any) => any) {
    const result = await this.execute();
    return onfulfilled ? onfulfilled(result) : result;
  }

  private async execute() {
    if (typeof window === "undefined") return { data: [], error: null };
    const stored = localStorage.getItem(`db_${this.tableName}`);
    let data: any[] = [];
    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }

    if (this.operation === "SELECT") {
      // Filters
      for (const filter of this.filters) {
        data = data.filter(filter);
      }

      // Ordering
      if (this.orderByColumn) {
        const col = this.orderByColumn;
        const asc = this.orderAscending;
        data.sort((a, b) => {
          if (a[col] < b[col]) return asc ? -1 : 1;
          if (a[col] > b[col]) return asc ? 1 : -1;
          return 0;
        });
      }

      // Limit
      if (this.limitCount !== null) {
        data = data.slice(0, this.limitCount);
      }

      return { data, error: null };
    }

    if (this.operation === "INSERT") {
      const maxId = data.reduce((max, item) => (item.id > max ? item.id : max), 0);
      const enriched = this.insertRows.map((row, idx) => ({
        id: row.id || maxId + idx + 1,
        createdAt: new Date().toISOString(),
        ...row
      }));
      data = [...data, ...enriched];
      localStorage.setItem(`db_${this.tableName}`, JSON.stringify(data));
      window.dispatchEvent(new Event(`db_${this.tableName}_changed`));
      return { data: enriched, error: null };
    }

    if (this.operation === "UPDATE") {
      let updatedItems: any[] = [];
      data = data.map((item) => {
        const matches = this.filters.every((filter) => filter(item));
        if (matches) {
          const updated = { ...item, ...this.updateFields };
          updatedItems.push(updated);
          return updated;
        }
        return item;
      });
      localStorage.setItem(`db_${this.tableName}`, JSON.stringify(data));
      window.dispatchEvent(new Event(`db_${this.tableName}_changed`));
      return { data: updatedItems, error: null };
    }

    if (this.operation === "DELETE") {
      let deletedItems: any[] = [];
      data = data.filter((item) => {
        const matches = this.filters.every((filter) => filter(item));
        if (matches) {
          deletedItems.push(item);
          return false;
        }
        return true;
      });
      localStorage.setItem(`db_${this.tableName}`, JSON.stringify(data));
      window.dispatchEvent(new Event(`db_${this.tableName}_changed`));
      return { data: deletedItems, error: null };
    }

    return { data: [], error: null };
  }
}

// Mock Supabase Client class
export class MockSupabaseClient {
  from(tableName: string) {
    return new MockBuilder(tableName);
  }

  // Auth mock API
  auth = {
    async getSession() {
      if (typeof window === "undefined") return { data: { session: null }, error: null };
      const stored = localStorage.getItem("admin_user");
      if (stored) {
        try {
          const user = JSON.parse(stored);
          return { data: { session: { user } }, error: null };
        } catch (e) {}
      }
      return { data: { session: null }, error: null };
    },
    async signInWithPassword({ email, password }: any) {
      if (email === "admin@earthybites.com" && password === "admin123") {
        const user = { email, role: "SUPER_ADMIN", name: "Earthy Admin" };
        localStorage.setItem("admin_user", JSON.stringify(user));
        return { data: { user, session: { user } }, error: null };
      }
      return { data: null, error: { message: "Invalid credentials. Use admin@earthybites.com / admin123" } };
    },
    async signOut() {
      localStorage.removeItem("admin_user");
      return { error: null };
    }
  };

  // Mock storage API
  storage = {
    from(bucketName: string) {
      return {
        async upload(path: string, file: File) {
          // In mock storage, we just represent the uploaded URL
          return { data: { path, publicUrl: URL.createObjectURL(file) }, error: null };
        },
        getPublicUrl(path: string) {
          return { data: { publicUrl: `/products/${path}` } };
        }
      };
    }
  };
}

export const supabase = new MockSupabaseClient();

// Seeding standard mock database if not already seeded
export function seedDatabase() {
  if (typeof window === "undefined") return;

  // 1. Seed Products
  if (!localStorage.getItem("db_products")) {
    const seededProducts = products.map((p) => {
      const basePrice = parseInt(p.price.replace(/[^\d]/g, ""), 10);
      const costPrice = Math.round(basePrice * 0.62); // 38% Gross Margin
      const sku = p.name.toUpperCase().substring(0, 3) + "-" + p.origin.toUpperCase().substring(0, 2) + "-" + p.id;
      const category = p.name.includes("Almond") ? "Almonds" :
                       p.name.includes("Pistachio") ? "Pistachios" :
                       p.name.includes("Date") ? "Dates" :
                       p.name.includes("Walnut") ? "Walnuts" :
                       p.name.includes("Macadamia") ? "Macadamia" :
                       p.name.includes("Raisin") ? "Raisins" :
                       p.name.includes("Hazelnut") ? "Hazelnuts" : "Cashews";
      return {
        ...p,
        sku,
        category,
        costPrice: `₹${costPrice}`,
        salePrice: p.price,
        stock: Math.floor(Math.random() * 200) + 12,
        status: "ACTIVE",
        featured: p.tag === "BESTSELLER" || p.tag === "TRENDING",
        bestSeller: p.tag === "BESTSELLER"
      };
    });
    localStorage.setItem("db_products", JSON.stringify(seededProducts));
  }

  // 2. Seed Orders
  if (!localStorage.getItem("db_orders")) {
    const seedOrders = [
      { id: 1001, customerName: "Rahul Sharma", email: "rahul.sharma@gmail.com", status: "DELIVERED", total: "₹2,447", items: "Mamra Almonds (250g) x1, Ajwa Dates (500g) x1", date: "2026-06-16T10:14:00Z", trackingNumber: "EB-TRK-78401", shippingAddress: "Apt 4B, Skyview Towers, Sector 62, Noida, UP - 201301", paymentStatus: "PAID", notes: "Please wrap as corporate gift." },
      { id: 1002, customerName: "Ananya Iyer", email: "ananya.iyer@yahoo.com", status: "SHIPPED", total: "₹1,498", items: "California Almonds (500g) x1, Salted Pistachios (250g) x1", date: "2026-06-16T14:32:00Z", trackingNumber: "EB-TRK-78402", shippingAddress: "12/A, Fernwood Lane, Indiranagar, Bengaluru, KA - 560038", paymentStatus: "PAID", notes: "Leave at security desk if not home." },
      { id: 1003, customerName: "Vikram Malhotra", email: "v.malhotra@outlook.com", status: "PACKED", total: "₹899", items: "Iranian Pistachios (250g) x1", date: "2026-06-17T09:05:00Z", trackingNumber: "EB-TRK-78403", shippingAddress: "Villa 9, Palm Meadows, Whitefield, Bengaluru, KA - 560066", paymentStatus: "PAID", notes: "" },
      { id: 1004, customerName: "Priya Patel", email: "priya.patel@gmail.com", status: "PROCESSING", total: "₹4,147", items: "Mamra Almonds (1kg) x1, Medjool Dates (500g) x1, green Raisins (250g) x2", date: "2026-06-17T11:20:00Z", trackingNumber: "EB-TRK-78404", shippingAddress: "Flat 902, Cypress Heights, Hiranandani Estate, Thane, MH - 400607", paymentStatus: "PAID", notes: "Fragile items. Handle with care." },
      { id: 1005, customerName: "Kabir Mehta", email: "kabir.m@gmail.com", status: "PENDING", total: "₹649", items: "Cashew Nuts W240 (250g) x1", date: "2026-06-17T16:45:00Z", trackingNumber: "", shippingAddress: "22, Silver Birch Estate, Koregaon Park, Pune, MH - 411001", paymentStatus: "UNPAID", notes: "Cash on delivery order." },
      { id: 1006, customerName: "Neha Kapoor", email: "neha.k@hotmail.com", status: "DELIVERED", total: "₹3,197", items: "Hawaii Macadamias (500g) x1, Ajwa Dates (250g) x1, Oregon Hazelnuts (250g) x1", date: "2026-06-15T13:22:00Z", trackingNumber: "EB-TRK-78396", shippingAddress: "House 104, Sector 15-A, Chandigarh - 160015", paymentStatus: "PAID", notes: "" },
      { id: 1007, customerName: "Amit Verma", email: "amit.verma@gmail.com", status: "DELIVERED", total: "₹1,248", items: "Kashmir Walnuts (250g) x1, Afghan Raisins (500g) x1", date: "2026-06-15T17:40:00Z", trackingNumber: "EB-TRK-78397", shippingAddress: "56-C, DDA Flats, Saket, New Delhi - 110017", paymentStatus: "PAID", notes: "" },
      { id: 1008, customerName: "Rohan Deshmukh", email: "rohan.d@gmail.com", status: "CANCELLED", total: "₹899", items: "Mamra Almonds (100g) x1, Iranian Pistachios (100g) x1", date: "2026-06-16T11:10:00Z", trackingNumber: "", shippingAddress: "402, Pinnacle Crest, Baner, Pune, MH - 411045", paymentStatus: "REFUNDED", notes: "User cancelled before packing." }
    ];
    localStorage.setItem("db_orders", JSON.stringify(seedOrders));
  }

  // 3. Seed Customers
  if (!localStorage.getItem("db_customers")) {
    const seedCustomers = [
      { id: 1, name: "Rahul Sharma", email: "rahul.sharma@gmail.com", spent: "₹15,420", ordersCount: 6, loyaltyPoints: 1540, status: "ACTIVE", wishlist: "Mamra Almonds, Medjool Dates", timeline: [{ date: "2026-06-16", event: "Placed Order #1001 (₹2,447)" }] },
      { id: 2, name: "Ananya Iyer", email: "ananya.iyer@yahoo.com", spent: "₹8,920", ordersCount: 4, loyaltyPoints: 890, status: "ACTIVE", wishlist: "Kashmir Walnuts, Hawaii Macadamias", timeline: [{ date: "2026-06-16", event: "Placed Order #1002 (₹1,498)" }] },
      { id: 3, name: "Vikram Malhotra", email: "v.malhotra@outlook.com", spent: "₹5,430", ordersCount: 3, loyaltyPoints: 540, status: "ACTIVE", wishlist: "Ajwa Dates", timeline: [{ date: "2026-06-17", event: "Placed Order #1003 (₹899)" }] },
      { id: 4, name: "Priya Patel", email: "priya.patel@gmail.com", spent: "₹24,310", ordersCount: 9, loyaltyPoints: 2430, status: "ACTIVE", wishlist: " Mamra Almonds, Antep Pistachios", timeline: [{ date: "2026-06-17", event: "Placed Order #1004 (₹4,147)" }] },
      { id: 5, name: "Kabir Mehta", email: "kabir.m@gmail.com", spent: "₹649", ordersCount: 1, loyaltyPoints: 60, status: "ACTIVE", wishlist: "", timeline: [{ date: "2026-06-17", event: "Signed up & Placed Order #1005 (₹649)" }] },
      { id: 6, name: "Neha Kapoor", email: "neha.k@hotmail.com", spent: "₹12,490", ordersCount: 5, loyaltyPoints: 1240, status: "ACTIVE", wishlist: "", timeline: [{ date: "2026-06-15", event: "Placed Order #1006 (₹3,197)" }] },
      { id: 7, name: "Amit Verma", email: "amit.verma@gmail.com", spent: "₹7,840", ordersCount: 4, loyaltyPoints: 780, status: "ACTIVE", wishlist: "Golden Raisins", timeline: [{ date: "2026-06-15", event: "Placed Order #1007 (₹1,248)" }] },
      { id: 8, name: "Rajesh Kulkarni", email: "r.kulkarni@gmail.com", spent: "₹0", ordersCount: 0, loyaltyPoints: 100, status: "BLOCKED", wishlist: "", timeline: [{ date: "2026-06-10", event: "Blocked due to coupon abuse behavior." }] }
    ];
    localStorage.setItem("db_customers", JSON.stringify(seedCustomers));
  }

  // 4. Seed Coupons
  if (!localStorage.getItem("db_coupons")) {
    const seedCoupons = [
      { id: 1, code: "EARTHY10", type: "PERCENTAGE", value: 10, minOrder: 999, expiry: "2026-12-31", limit: 500, usageCount: 142, status: "ACTIVE" },
      { id: 2, code: "WELCOME150", type: "FIXED", value: 150, minOrder: 1499, expiry: "2026-09-30", limit: 1000, usageCount: 384, status: "ACTIVE" },
      { id: 3, code: "FREESHIP", type: "FREE_SHIPPING", value: 0, minOrder: 499, expiry: "2026-12-31", limit: 2000, usageCount: 812, status: "ACTIVE" },
      { id: 4, code: "BOGO2026", type: "BOGO", value: 0, minOrder: 1999, expiry: "2026-07-31", limit: 200, usageCount: 45, status: "ACTIVE" },
      { id: 5, code: "FESTIVE500", type: "FIXED", value: 500, minOrder: 4999, expiry: "2026-06-25", limit: 100, usageCount: 8, status: "ACTIVE" }
    ];
    localStorage.setItem("db_coupons", JSON.stringify(seedCoupons));
  }

  // 5. Seed Reviews
  if (!localStorage.getItem("db_reviews")) {
    const seedReviews = [
      { id: 1, productName: "California Almonds", customerName: "Rohan S.", rating: 5, content: "Extremely fresh and crunchy. Best almonds I've had in India.", image: "", status: "APPROVED", spamScore: 0.02 },
      { id: 2, productName: "Medjool Dates", customerName: "Deepika R.", rating: 5, content: "Super soft, sweet, and caramel-like. Worth the price.", image: "", status: "APPROVED", spamScore: 0.05 },
      { id: 3, productName: "Kashmir Walnuts", customerName: "Arun K.", rating: 4, content: "Good thin shells, but a couple of nuts were slightly dry.", image: "", status: "APPROVED", spamScore: 0.12 },
      { id: 4, productName: "Iranian Pistachios", customerName: "Sanjay D.", rating: 5, content: "Nicely opened split pistachios. Sourcing is top tier.", image: "", status: "APPROVED", spamScore: 0.04 },
      { id: 5, productName: "Mamra Almonds", customerName: "Priyanka M.", rating: 2, content: "Too expensive and sizes are not consistent.", image: "", status: "PENDING", spamScore: 0.28 },
      { id: 6, productName: "Ajwa Dates", customerName: "Mohammed A.", rating: 5, content: "Mashallah, very high quality dates straight from Medina.", image: "", status: "APPROVED", spamScore: 0.01 },
      { id: 7, productName: "Golden Raisins", customerName: "BuyCheapNuts", rating: 5, content: "CLICK HERE TO BUY CHEAP DRYS FRUITS AT WWW.SPAMNUTS.COM", image: "", status: "PENDING", spamScore: 0.98 }
    ];
    localStorage.setItem("db_reviews", JSON.stringify(seedReviews));
  }

  // 6. Seed Blogs
  if (!localStorage.getItem("db_blogs")) {
    const seedBlogs = [
      { id: 1, title: "Sourcing Dates in the Jordan Valley", author: "Dev Sharma", category: "Sourcing Dispatch", status: "PUBLISHED", publishedAt: "2026-05-12", content: "Exploring organic palms in the valley...", seoTitle: "Jordan Valley Medjool Sourcing" },
      { id: 2, title: "Rich Fats & Mindful Mornings", author: "Dr. Kriti Rao", category: "Nutrition Science", status: "PUBLISHED", publishedAt: "2026-04-18", content: "The molecular science of monounsaturated fats...", seoTitle: "Almonds Cognitive Benefits" },
      { id: 3, title: "Micro-Nutrients of High Altitudes", author: "Aman Gupta", category: "Agriculture", status: "PUBLISHED", publishedAt: "2026-03-05", content: "Why height creates nutrient-dense nuts...", seoTitle: "High Altitude Farming Benefits" },
      { id: 4, title: "The Terroir of Bam: Iran's Date Oasis", author: "Sourcing Team", category: "Sourcing Dispatch", status: "DRAFT", publishedAt: "", content: "Bam Oasis dates irrigated by natural springs...", seoTitle: "Bam Iran Date Terroir" }
    ];
    localStorage.setItem("db_blogs", JSON.stringify(seedBlogs));
  }

  // 7. Seed Team Admins
  if (!localStorage.getItem("db_admins")) {
    const seedAdmins = [
      { id: 1, name: "Earthy Admin", email: "admin@earthybites.com", role: "SUPER_ADMIN", permissions: ["ALL"], status: "ACTIVE" },
      { id: 2, name: "Siddharth Sen", email: "siddharth@earthybites.com", role: "MANAGER", permissions: ["products", "inventory", "orders"], status: "ACTIVE" },
      { id: 3, name: "Preeti Nair", email: "preeti@earthybites.com", role: "CUSTOMER_SUPPORT", permissions: ["orders", "reviews"], status: "ACTIVE" },
      { id: 4, name: "Karan Johar", email: "karan@earthybites.com", role: "EDITOR", permissions: ["blog", "reviews"], status: "INACTIVE" }
    ];
    localStorage.setItem("db_admins", JSON.stringify(seedAdmins));
  }
}
