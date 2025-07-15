export default interface District {
   id: string;
   name: string;
   cityId: string;
   coordinates?: {
      latitude: number;
      longitude: number;
   };
}
