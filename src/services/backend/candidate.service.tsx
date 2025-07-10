import CandidateViewModel from '@viewmodels/candidate.viewmodel';
import BaseBackendService from './base.backend.sevice';

export class CandidateService extends BaseBackendService {
  constructor() {
    super('/candidate');
  }
  public async getCandidatesByElectionId(
    electionId: string,
  ): Promise<CandidateViewModel[]> {
    const response = await this.api.get<CandidateViewModel[]>(
      `${this.endpoint}/of-election/${electionId}`,
    );
    return response.data;
  }
}

export default CandidateService;
