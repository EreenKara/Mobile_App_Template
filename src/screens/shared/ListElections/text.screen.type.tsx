import {ElectionType} from '@enums/election.type';

const getElectionTexts = (electionType: ElectionType) => {
  switch (electionType) {
    case ElectionType.Past:
      return {
        title: 'Geçmiş Seçimler',
        description: 'Geçmiş seçimlerin listesi aşağıdadır.',
        errorTitle: 'Geçmiş seçim bulunmamaktadır',
      };
    case ElectionType.Current:
      return {
        title: 'Güncel Seçimler',
        description: 'Güncel seçimlerin listesi aşağıdadır.',
        errorTitle: 'Aktif seçim bulunmamaktadır',
      };
    case ElectionType.Upcoming:
      return {
        title: 'Gelecek Seçimler',
        description: 'Gelecek seçimlerin listesi aşağıdadır.',
        errorTitle: 'Gelecek seçim bulunmamaktadır',
      };
    case ElectionType.Casted:
      return {
        title: 'Oy Kullandığın Seçimler',
        description: 'Oy kullandığın seçimlerin listesi aşağıdadır.',
        errorTitle: 'Oy kullandığın seçim bulunmamaktadır',
      };
    case ElectionType.BeingCandidate:
      return {
        title: 'Aday Olduğun Seçimler',
        description: 'Aday olduğun seçimlerin listesi aşağıdadır.',
        errorTitle: 'Aday olduğun seçim bulunmamaktadır',
      };
    case ElectionType.Search:
      return {
        title: 'Seçim Ara',
        description: 'Seçim ara',
        errorTitle: 'Seçim bulunmamaktadır',
      };
    case ElectionType.Popular:
      return {
        title: 'Popüler Seçimler',
        description: 'Popüler seçimlerin listesi aşağıdadır.',
        errorTitle: 'Popüler seçim bulunmamaktadır',
      };
    case ElectionType.Created:
      return {
        title: 'Oluşturduğun Seçimler',
        description: 'Oluşturduğum seçimlerin listesi aşağıdadır.',
        errorTitle: 'Oluşturduğum seçimler bulunmamaktadır',
      };
    default:
      return {
        title: 'Seçimler',
        description: 'Seçimlerin listesi aşağıdadır.',
        errorTitle: 'Seçim bulunmamaktadır',
      };
  }
};

export default getElectionTexts;
