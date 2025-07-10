import { IUserService } from '@services/backend/abstract/user.service.interface';
import BaseBackendService from './base.backend.sevice';
import axios, { AxiosError } from 'axios';
import RegisterViewModel from '@viewmodels/register.viewmodel';
import LoginViewModel from '@viewmodels/login.viewmodel';
import UserViewModel from '@viewmodels/user.viewmodel';
import { AddressViewModel } from '@viewmodels/address.viewmodel';
import GroupViewModel from '@viewmodels/group.viewmodel';
import { BackendError } from './backend.error';
import LightUserViewModel from '@viewmodels/light.user.viewmodel';
import { AddressChangeViewModel } from '@viewmodels/address.change.viewmodel';

export class UserAddressService extends BaseBackendService {
   constructor() {
      super('/userAddress');
   }
}

export default UserAddressService;
