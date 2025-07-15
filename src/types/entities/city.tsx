export default interface City {
   id: string;
   name: string;
   plateCode?: string;
   coordinates?: {
      latitude: number;
   };
}
