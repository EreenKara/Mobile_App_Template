import { IUserService } from '@services/backend/abstract/user.service.interface';
import BaseBackendService from './base.backend.sevice';
import axios, { AxiosError } from 'axios';

export class AddressService extends BaseBackendService {
   constructor() {
      super('');
   }
}

export default AddressService;
