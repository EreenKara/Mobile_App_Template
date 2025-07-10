// import BaseBackendService from './base.backend.sevice';
// import {UserService} from './user.service';
// import {ElectionService} from './election.service';
// import {GroupService} from './group.service';
// import {UserAddressService} from './user.address.service';
// import {AddressService} from './address.service';

// export class ServiceContainer {
//   private static instance: ServiceContainer;
//   private services: Map<ServiceType, BaseBackendService> = new Map();

//   private constructor() {}
//   private static getInstance(): ServiceContainer {
//     if (!ServiceContainer.instance) {
//       ServiceContainer.instance = new ServiceContainer();
//     }
//     return ServiceContainer.instance;
//   }
//   public static getService(serviceType: ServiceType): BaseBackendService {
//     const instance = ServiceContainer.getInstance();
//     if (!instance.services.has(serviceType)) {
//       let service;
//       switch (serviceType) {
//         case ServiceType.UserService:
//           service = new UserService();
//           break;
//         case ServiceType.ElectionService:
//           service = new ElectionService();
//           break;
//         case ServiceType.GroupService:
//           service = new GroupService();
//           break;
//         case ServiceType.UserAddressService:
//           service = new UserAddressService();
//           break;
//         case ServiceType.AddressService:
//           service = new AddressService(); // Assuming AddressService is similar to UserAddressService
//           break;
//         default:
//           throw new Error('Service not found');
//       }
//       instance.services.set(serviceType, service as BaseBackendService);
//     }
//     return instance.services.get(serviceType) as BaseBackendService;
//   }
// }
