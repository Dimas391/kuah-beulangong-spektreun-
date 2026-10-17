import { createFileRoute } from '@tanstack/react-router';
import { RestaurantShell, PageHeading } from '@/components/restaurant';
import { restaurantQuery, pageHead } from '@/lib/restaurant-query';
import hero from '@/assets/kari-hero.jpg';
import story from '@/assets/blangong-story.jpg';
import kari from '@/assets/kari-menu.jpg';
import timun from '@/assets/timun-menu.jpg';
export const Route=createFileRoute('/galeri')({head:()=>pageHead('Galeri','Galeri ilustrasi sajian kari kambing khas Aceh dan proses memasak kuah beulangong tradisional.'),loader:({context})=>context.queryClient.ensureQueryData(restaurantQuery),component:GalleryPage});
function GalleryPage(){return <RestaurantShell><PageHeading label="Dari dekat" title="Rasa, dalam gambar." copy="Kuah yang hangat, rempah yang kaya, dan kebersamaan di sekitar blangong."/><div className="wrap pt-12 pb-28"><div className="gallery-grid">{[{src:hero,name:'Kuah beulangong, sajian khas Aceh'},{src:story,name:'Tradisi memasak dalam blangong'},{src:kari,name:'Seporsi kari kambing hangat'},{src:timun,name:'Kesegaran es timun serut'}].map(i=><figure className="m-0" key={i.name}><img src={i.src} alt={i.name} width={1000} height={800} loading="lazy"/><figcaption>{i.name}</figcaption></figure>)}</div><p className="muted-note mt-6">Seluruh foto merupakan ilustrasi buatan AI, bukan dokumentasi rumah makan. Foto suasana, video, ulasan pelanggan, dan liputan media akan ditampilkan setelah materi asli tersedia.</p></div></RestaurantShell>;}
