import {ElectionType} from '@enums/election.type';
import {electionService} from '@services/backend/concrete/service.container.instances';
import LightElectionViewModel from '@viewmodels/light.election.viewmodel';
import {ElectionSearchObject} from '@services/backend/concrete/election.service';

const useGetElectionsFunction = (
  electionType: ElectionType,
): ((
  searchObject: ElectionSearchObject,
) => Promise<LightElectionViewModel[]>) => {
  let getElectionFunc;
  switch (electionType) {
    case ElectionType.Past:
      getElectionFunc = electionService.getPastElections.bind(electionService);
      break;
    case ElectionType.Current:
      getElectionFunc =
        electionService.getCurrentElections.bind(electionService);
      break;
    case ElectionType.Upcoming:
      getElectionFunc =
        electionService.getUpcomingElections.bind(electionService);
      break;
    case ElectionType.Popular:
      getElectionFunc =
        electionService.getPopularElections.bind(electionService);
      break;
    case ElectionType.Search:
      getElectionFunc =
        electionService.getElectionsByUserId.bind(electionService);
      break;
    case ElectionType.BeingCandidate:
      getElectionFunc =
        electionService.getElectionsByUserId.bind(electionService);
      break;
    case ElectionType.Casted:
      getElectionFunc =
        electionService.getElectionsByUserId.bind(electionService);
      break;
    case ElectionType.Created:
      getElectionFunc = electionService.getMyElections.bind(electionService);
      break;
    case ElectionType.Private:
      getElectionFunc =
        electionService.getPrivateElections.bind(electionService);
      break;
    default:
      throw new Error(`Invalid electionType: ${electionType}`);
      break;
  }
  if (!getElectionFunc) {
    throw new Error('getElectionFunc is undefined!');
  }
  return getElectionFunc;
};

export {useGetElectionsFunction};
