import { describe,it,expect } from 'vitest';
import { cateringSchema,estimatePortions,orderMessage } from '@/lib/restaurant-schema';
describe('Restaurant utilities',()=>{
 it('calculates reserve portions',()=>{expect(estimatePortions(50,true)).toBe(55);expect(estimatePortions(100,true)).toBe(110);expect(estimatePortions(100,false)).toBe(100);});
 it('composes orders with quantities and pickup time',()=>{expect(orderMessage([{name:'Kari Kambing',quantity:2}],'12:30','Takeaway')).toContain('Kari Kambing × 2');});
 it('rejects invalid catering details',()=>{expect(cateringSchema.safeParse({name:'A',whatsapp:'abc',event_date:'2020-01-01',portions:0}).success).toBe(false);});
});
