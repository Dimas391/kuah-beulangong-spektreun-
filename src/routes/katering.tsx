import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RestaurantShell, PageHeading } from '@/components/restaurant';
import { restaurantQuery, pageHead } from '@/lib/restaurant-query';
import { submitCatering } from '@/lib/restaurant.functions';
import { cateringSchema, estimatePortions } from '@/lib/restaurant-schema';

export const Route = createFileRoute('/katering')({
  head: () =>
    pageHead(
      'Katering & Acara',
      'Paket katering kari kambing Aceh untuk kenduri, akikah, pesta dan acara kantor. Hitung porsi dan ajukan kebutuhan acara.'
    ),
  loader: ({ context }) => context.queryClient.ensureQueryData(restaurantQuery),
  component: CateringPage,
});

function CateringPage() {
  const [guests, setGuests] = useState(50);
  const [reserve, setReserve] = useState(true);
  const [pack, setPack] = useState('50 Porsi');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState('');

  const submit = useServerFn(submitCatering);
  const portions = estimatePortions(guests, reserve);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const parsed = cateringSchema.safeParse({
      name: form.get('name'),
      whatsapp: form.get('whatsapp'),
      event_date: form.get('event_date'),
      location: form.get('location'),
      portions: Number(form.get('portions')),
      package: pack,
      notes: form.get('notes'),
      website: form.get('website'),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Periksa data Anda.');
      return;
    }

    setPending(true);
    try {
      const result = await submit({ data: parsed.data });
      setSuccess(result.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Pengajuan gagal. Silakan coba lagi.'
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <RestaurantShell>
      <PageHeading
        label="Hidangan untuk kebersamaan"
        title="Momen istimewa. Rasa istimewa."
        copy="Kari kambing khas Aceh untuk kenduri, akikah, pesta, dan acara kantor. Ceritakan kebutuhan Anda, mulai dari 50 porsi hingga satu blangong."
      />

      <div className="wrap form-layout pt-25 md:pt-25 pb-35">
        {/* Kolom Kiri - Ditambahkan class 'pt-4 md:pt-6' agar judul tidak mepet garis */}
        <div className="pt-4 md:pt-6">
          <h2 className="mb-4">Untuk setiap perayaan.</h2>
          <div className="packages">
            {['50 Porsi', '100 Porsi', 'Blangong Utuh', 'Sesuai kebutuhan'].map(
              (p) => (
                <Button
                  variant={pack === p ? 'editorial' : 'outline'}
                  key={p}
                  onClick={() => setPack(p)}
                >
                  {p}
                </Button>
              )
            )}
          </div>
          <p className="muted-note mt-4">
            Harga paket, kapasitas blangong, dan biaya pengiriman akan
            dikonfirmasi berdasarkan kebutuhan acara Anda.
          </p>

          <div className="calculator mt-8">
            <span className="eyebrow">Kalkulator kebutuhan</span>
            <h2 className="flex items-center gap-3">
              <Users className="size-6" /> Berapa tamu Anda?
            </h2>
            <div className="field mt-5">
              <label htmlFor="guests">Jumlah tamu</label>
              <input
                id="guests"
                type="number"
                min="1"
                max="9000"
                value={guests}
                onChange={(e) =>
                  setGuests(
                    Math.min(9000, Math.max(1, Number(e.target.value)))
                  )
                }
              />
            </div>
            <label className="flex gap-3 items-center text-xs mt-3">
              <input
                type="checkbox"
                checked={reserve}
                onChange={(e) => setReserve(e.target.checked)}
              />
              Tambahkan cadangan 10%
            </label>
            <div className="calculator-result">{portions} porsi</div>
            <p className="muted-note mt-3">
              Estimasi 1 porsi per tamu. Kapasitas per blangong perlu
              dikonfirmasi.
            </p>
          </div>
        </div>

        {/* Kolom Kanan - Ditambahkan class 'pt-4 md:pt-6' agar judul/form tidak mepet garis */}
        <div className="pt-4 md:pt-6">
          {success ? (
            <div className="success" role="status">
              <Check className="mb-5 size-7" />
              <h2>Pengajuan tersimpan.</h2>
              <p>
                Terima kasih. Kebutuhan katering Anda telah tercatat untuk
                ditinjau pengelola. Ini belum merupakan konfirmasi pemesanan.
              </p>
              <p className="muted-note mt-3">
                Nomor pengajuan: {success.slice(0, 8).toUpperCase()}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSuccess('')}
              >
                Ajukan acara lainnya
              </Button>
            </div>
          ) : (
            <form onSubmit={send}>
              <h2 className="mb-4">Rencanakan acara Anda.</h2>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="name">Nama lengkap</label>
                  <input
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Nama Anda"
                  />
                </div>
                <div className="field">
                  <label htmlFor="whatsapp">Nomor WhatsApp</label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    required
                    maxLength={18}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div className="field">
                  <label htmlFor="event-date">Tanggal acara</label>
                  <input
                    id="event-date"
                    name="event_date"
                    type="date"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="portions">Jumlah porsi</label>
                  <input
                    id="portions"
                    name="portions"
                    type="number"
                    min="1"
                    max="10000"
                    required
                    key={portions}
                    defaultValue={portions}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="location">Lokasi acara / pengiriman</label>
                <textarea
                  id="location"
                  name="location"
                  required
                  minLength={5}
                  maxLength={500}
                  placeholder="Alamat lengkap lokasi acara"
                />
              </div>
              <div className="field">
                <label htmlFor="notes">Catatan khusus (opsional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  maxLength={1500}
                  placeholder="Jenis acara, waktu penyajian, atau kebutuhan lainnya"
                />
              </div>
              <input
                name="website"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}
              <Button
                variant="editorial"
                className="h-12 w-full mt-3"
                type="submit"
                disabled={pending}
              >
                {pending
                  ? 'Menyimpan pengajuan…'
                  : 'Ajukan Pesanan Katering'}
                <ArrowUpRight />
              </Button>
              <p className="muted-note mt-4">
                Pengajuan tidak dikenakan pembayaran. Ketersediaan, harga, dan
                detail acara dikonfirmasi oleh pengelola.
              </p>
            </form>
          )}
        </div>
      </div>
    </RestaurantShell>
  );
}