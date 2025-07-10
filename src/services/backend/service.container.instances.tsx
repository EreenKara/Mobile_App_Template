import {ElectionService} from './election.service';
import {UserService} from './user.service';
import GroupService from './group.service';
import UserAddressService from './user.address.service';
import AddressService from './address.service';
import CandidateService from './candidate.service';
export enum ServiceType {
  UserService = 'UserService',
  GroupService = 'GroupService',
  ElectionService = 'ElectionService',
  UserAddressService = 'UserAddressService',
  AddressService = 'AddressService',
  CandidateService = 'CandidateService',
}
export const electionService = new ElectionService();
export const userService = new UserService();
export const candidateService = new CandidateService();
export const groupService = new GroupService();
export const userAddressService = new UserAddressService();
export const addressService = new AddressService(); // Assuming AddressService is similar to UserAddressService
// export const userService = ServiceContainer.getService(
//   ServiceType.UserService,
// ) as UserService;

// export const groupService = ServiceContainer.getService(
//   ServiceType.GroupService,
// ) as GroupService;

// export const userAddressService = ServiceContainer.getService(
//   ServiceType.UserAddressService,
// ) as UserAddressService;

// export const addressService = ServiceContainer.getService(
//   ServiceType.AddressService,
// ) as AddressService;
