CREATE TABLE public.restaurant_settings (id integer PRIMARY KEY DEFAULT 1, whatsapp text, address text, maps_url text, instagram_url text, tiktok_url text, opening_time time, closing_time time, status text NOT NULL DEFAULT 'unconfirmed' CHECK (status IN ('unconfirmed','open','closed','sold_out')), seats integer, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.restaurant_settings TO anon, authenticated; GRANT ALL ON public.restaurant_settings TO service_role;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public store information" ON public.restaurant_settings FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.menu_items (id text PRIMARY KEY, name text NOT NULL, description text NOT NULL, category text NOT NULL, price integer, image_key text NOT NULL, available boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0);
GRANT SELECT ON public.menu_items TO anon, authenticated; GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public menu" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.catering_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, whatsapp text NOT NULL, event_date date NOT NULL, location text NOT NULL, portions integer NOT NULL CHECK (portions BETWEEN 1 AND 10000), package text NOT NULL, notes text, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.catering_requests TO service_role;
ALTER TABLE public.catering_requests ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.form_rate_limits (key text PRIMARY KEY, window_start timestamptz NOT NULL DEFAULT now(), requests integer NOT NULL DEFAULT 1);
GRANT ALL ON public.form_rate_limits TO service_role;
ALTER TABLE public.form_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.check_form_limit(limit_key text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ DECLARE n integer; BEGIN INSERT INTO public.form_rate_limits(key) VALUES(limit_key) ON CONFLICT(key) DO UPDATE SET requests = CASE WHEN form_rate_limits.window_start < now() - interval '1 hour' THEN 1 ELSE form_rate_limits.requests + 1 END, window_start = CASE WHEN form_rate_limits.window_start < now() - interval '1 hour' THEN now() ELSE form_rate_limits.window_start END RETURNING requests INTO n; RETURN n <= 5; END; $$;
REVOKE ALL ON FUNCTION public.check_form_limit(text) FROM PUBLIC, anon, authenticated; GRANT EXECUTE ON FUNCTION public.check_form_limit(text) TO service_role;
INSERT INTO public.restaurant_settings (id) VALUES (1);
INSERT INTO public.menu_items (id,name,description,category,image_key,sort_order) VALUES
('kari-biasa','Kari Kambing','Daging kambing dalam kuah rempah khas Aceh. Hangat, gurih, dan kaya rasa.','Hidangan utama','kari',1),
('kari-spesial','Kari Kambing Spesial','Pilihan porsi spesial untuk menikmati kuah beulangong lebih puas.','Hidangan utama','kari',2),
('cincang','Daging Cincang','Potongan daging kecil dengan bumbu pekat yang meresap.','Hidangan utama','cincang',3),
('sumsum','Tulang & Sumsum','Tulang kambing dan sumsum lembut dalam kuah kari yang gurih.','Hidangan utama','sumsum',4),
('nasi-gurih','Nasi Gurih','Nasi harum sebagai pendamping kari kambing.','Pelengkap','none',5),
('nasi-putih','Nasi Putih','Nasi putih hangat untuk melengkapi hidangan.','Pelengkap','none',6),
('acar','Acar Bawang','Acar bawang segar penyeimbang kaya rasa kari.','Pelengkap','none',7),
('emping','Emping','Pelengkap renyah untuk setiap suapan.','Pelengkap','none',8),
('timun','Es Timun Serut','Timun serut segar dan es untuk menemani hidangan.','Minuman','timun',9),
('teh','Teh Hijau','Teh hijau dengan cita rasa ringan.','Minuman','none',10),
('jeruk','Jus Jeruk','Kesegaran jeruk untuk melengkapi santap Anda.','Minuman','none',11);