import LightElectionViewModel from '@viewmodels/light.election.viewmodel';
import { IElectionService } from '../abstract/election.service.interface';
import BaseBackendService from './base.backend.sevice';
import { ElectionViewModel } from '@viewmodels/election.viewmodel';
import { ElectionAccessViewModel } from '@viewmodels/election.access.viewmodel';
import { CandidateViewModel } from '@viewmodels/candidate.viewmodel';
import { ElectionChoiceViewModel } from '@viewmodels/election.choice.viewmodel';
import { ElectionCreationViewModel } from '@viewmodels/election.creation.viewmodel';
import CandidateCreateViewModel from '@viewmodels/candidate.create.viewmodel';
import { ImageViewModel } from '@viewmodels/image.viewmodel';
import convertImageToBase64 from '@utility/toBase64';
import DetailedElectionViewModel from '@viewmodels/detailed.election.viewmodel';
export class ElectionService extends BaseBackendService implements IElectionService {
   constructor() {
      super('/election');
   }
   public async getPopularElections(
      searchObject: ElectionSearchObject,
   ): Promise<LightElectionViewModel[]> {
      const response = await this.api.get<LightElectionViewModel[]>(
         `${this.endpoint}/getElections/all`,
      );
      console.log('getPopularElections response:', response.data);
      console.log('getPopularElections response.data::', response.data);
      return response.data;
   }
}

export default ElectionService;
