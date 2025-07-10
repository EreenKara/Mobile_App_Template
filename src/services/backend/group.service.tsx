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
import LightGroupViewModel from '@viewmodels/light.group.viewmodel';

export class GroupService extends BaseBackendService {
   constructor() {
      super('/group');
   }
}

export default GroupService;
