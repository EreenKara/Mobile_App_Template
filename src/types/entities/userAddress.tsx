export interface UserAddress {
   id?: string;
   userId: string;
   type: 'home' | 'work' | 'other';
   title: string;
   cityId: string;
   cityName: string;
   districtId: string;
   districtName: string;
   fullAddress: string;
   buildingNo?: string;
   apartmentNo?: string;
   floor?: string;
   postalCode?: string;
   isDefault: boolean;
   isActive: boolean;
   createdAt?: string;
   updatedAt?: string;
}
