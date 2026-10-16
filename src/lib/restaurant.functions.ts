import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { getRequestHeader } from "@tanstack/react-start/server";
import { cateringSchema } from "./restaurant-schema";
import type { Database } from "@/integrations/supabase/types";
const defaultSettings: Database["public"]["Tables"]["restaurant_settings"]["Row"] = {
  id: 1,
  whatsapp: null,
  address: null,
  maps_url: null,
  instagram_url: null,
  tiktok_url: null,
  opening_time: null,
  closing_time: null,
  status: "unconfirmed",
  seats: null,
  updated_at: new Date().toISOString(),
};

const defaultMenuItems: Database["public"]["Tables"]["menu_items"]["Row"][] = [
  {
    id: "kari-biasa",
    name: "Kari Kambing",
    description: "Daging kambing dalam kuah rempah khas Aceh. Hangat, gurih, dan kaya rasa.",
    category: "Hidangan utama",
    price: null,
    image_key: "kari",
    available: true,
    sort_order: 1,
  },
  {
    id: "kari-spesial",
    name: "Kari Kambing Spesial",
    description: "Pilihan porsi spesial untuk menikmati kuah beulangong lebih puas.",
    category: "Hidangan utama",
    price: null,
    image_key: "kari",
    available: true,
    sort_order: 2,
  },
  {
    id: "cincang",
    name: "Daging Cincang",
    description: "Potongan daging kecil dengan bumbu pekat yang meresap.",
    category: "Hidangan utama",
    price: null,
    image_key: "cincang",
    available: true,
    sort_order: 3,
  },
  {
    id: "sumsum",
    name: "Tulang & Sumsum",
    description: "Tulang kambing dan sumsum lembut dalam kuah kari yang gurih.",
    category: "Hidangan utama",
    price: null,
    image_key: "sumsum",
    available: true,
    sort_order: 4,
  },
  {
    id: "nasi-gurih",
    name: "Nasi Gurih",
    description: "Nasi harum sebagai pendamping kari kambing.",
    category: "Pelengkap",
    price: null,
    image_key: "none",
    available: true,
    sort_order: 5,
  },
  {
    id: "nasi-putih",
    name: "Nasi Putih",
    description: "Nasi putih hangat untuk melengkapi hidangan.",
    category: "Pelengkap",
    price: null,
    image_key: "none",
    available: true,
    sort_order: 6,
  },
  {
    id: "acar",
    name: "Acar Bawang",
    description: "Acar bawang segar penyeimbang kaya rasa kari.",
    category: "Pelengkap",
    price: null,
    image_key: "none",
    available: true,
    sort_order: 7,
  },
  {
    id: "emping",
    name: "Emping",
    description: "Pelengkap renyah untuk setiap suapan.",
    category: "Pelengkap",
    price: null,
    image_key: "none",
    available: true,
    sort_order: 8,
  },
  {
    id: "timun",
    name: "Es Timun Serut",
    description: "Timun serut segar dan es untuk menemani hidangan.",
    category: "Pelengkap",
    price: null,
    image_key: "timun",
    available: true,
    sort_order: 9,
  },
  {
    id: "teh",
    name: "Teh Hijau",
    description: "Teh hijau dengan cita rasa ringan.",
    category: "Minuman",
    price: null,
    image_key: "none",
    available: true,
    sort_order: 10,
  },
  {
    id: "jeruk",
    name: "Jus Jeruk",
    description: "Kesegaran jeruk untuk melengkapi santap Anda.",
    category: "Minuman",
    price: null,
    image_key: "none",
    available: true,
    sort_order: 11,
  },
];

export const getRestaurant = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return { menu: defaultMenuItems, settings: defaultSettings };
  try {
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_")) {
            headers.delete("Authorization");
            headers.set("apikey", key);
          }
          return fetch(input, { ...init, headers });
        },
      },
    });
    const [menu, settings] = await Promise.all([
      client.from("menu_items").select("*").order("sort_order"),
      client.from("restaurant_settings").select("*").eq("id", 1).single(),
    ]);
    if (menu.error || settings.error || !menu.data || !settings.data) {
      console.warn(
        "[Supabase] Database query returned an error, falling back to initial catalog:",
        menu.error?.message || settings.error?.message,
      );
      return { menu: menu.data || defaultMenuItems, settings: settings.data || defaultSettings };
    }
    return { menu: menu.data, settings: settings.data };
  } catch (err) {
    console.warn("[Supabase] Failed to fetch store data, falling back to initial catalog:", err);
    return { menu: defaultMenuItems, settings: defaultSettings };
  }
});
export const submitCatering = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => cateringSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ip =
      getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for") || "unknown";
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`catering:${ip}`));
    const key = Array.from(new Uint8Array(bytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const { data: allowed, error: limitError } = await supabaseAdmin.rpc("check_form_limit", {
      limit_key: key,
    });
    if (limitError || !allowed)
      throw new Error("Terlalu banyak pengajuan. Silakan coba kembali nanti.");
    const { website, ...payload } = data;
    const { data: row, error } = await supabaseAdmin
      .from("catering_requests")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error("Pengajuan belum tersimpan. Silakan coba kembali.");
    return { id: row.id };
  });
