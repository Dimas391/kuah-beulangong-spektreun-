import { queryOptions } from '@tanstack/react-query';
import { getRestaurant } from './restaurant.functions';
export const restaurantQuery=queryOptions({queryKey:['restaurant'],queryFn:()=>getRestaurant(),staleTime:30000,refetchInterval:60000});
export function pageHead(title:string,description:string){return {meta:[{title:`${title} — Kari Kambing Cb Sp Ektreun`},{name:'description',content:description},{property:'og:title',content:`${title} — Kari Kambing Cb Sp Ektreun`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]};}
