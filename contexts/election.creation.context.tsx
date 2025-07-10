import {FormValues} from '@screens/home/ElectionInfo';
import React, {createContext, useContext, useEffect, useState} from 'react';
import useElectionInfoStep from '@hooks/ElectionCreation/use.election.info.step';
import {ElectionAccessViewModel} from '@viewmodels/election.access.viewmodel';
import useElectionAccess from '@hooks/ElectionCreation/use.election.access';
import useElectionCandidate from '@hooks/ElectionCreation/use.election.candidate';
import {CandidateViewModel} from '@viewmodels/candidate.viewmodel';
import useElectionChoices from '@hooks/ElectionCreation/use.election.choices';
import {ElectionChoiceViewModel} from '@viewmodels/election.choice.viewmodel';
import {ElectionCreationViewModel} from '@viewmodels/election.creation.viewmodel';
import CandidateCreateViewModel from '@viewmodels/candidate.create.viewmodel';

interface ElectionCreationContextType {
  election: ElectionCreationViewModel | null;
  electionAccess: ElectionAccessViewModel | null;
  candidates: CandidateCreateViewModel[];
  choices: ElectionChoiceViewModel[];
  electionType: 'database' | 'blockchain' | null;
  setElectionType: (electionType: 'database' | 'blockchain' | null) => void;
  electionId: string | null;
  step:
    | 'Info completed'
    | 'Access completed'
    | 'Candidate completed'
    | 'Choices completed'
    | 'Election completed'
    | null;
  submitting: {
    info: boolean;
    access: boolean;
    candidate: boolean;
    choice: boolean;
  };
  errors: {
    info: string | null;
    access: string | null;
    candidate: string | null;
    choice: string | null;
  };

  // Adım yönetimi

  // Fonksiyonlar
  handleElectionInfoStep: (
    values: FormValues,
  ) => Promise<{success: boolean; error: string | null}>;
  handleElectionAccessStep: (
    values: ElectionAccessViewModel,
  ) => Promise<{success: boolean; error: string | null}>;
  handleElectionCandidateStep: (
    values: CandidateCreateViewModel[],
  ) => Promise<{success: boolean; error: string | null}>;
  handleElectionChoiceStep: (
    values: ElectionChoiceViewModel[],
  ) => Promise<{success: boolean; error: string | null}>;
  resetElectionCreation: () => void;
  updateCandidateAt: (
    index: number,
    updatedCandidate: CandidateCreateViewModel,
  ) => void;
  addCandidate: () => void;
}

const ElectionCreationContext = createContext<
  ElectionCreationContextType | undefined
>(undefined);

export const ElectionCreationProvider: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  // Tek bir electionId
  const [electionId, setElectionId] = useState<string | null>(null);
  const [step, setStep] = useState<
    | 'Info completed'
    | 'Access completed'
    | 'Candidate completed'
    | 'Choices completed'
    | 'Election completed'
    | null
  >(null);

  // 1) Info adımı
  const {
    election,
    submitting: infoSubmitting,
    handleElectionInfoStep: originalHandleElectionInfoStep,
    setElectionType,
    electionType,
    reset: resetInfo,
    error: infoError,
  } = useElectionInfoStep();

  // 2) Access adımı
  //    Artık useElectionAccess'e electionId parametresini veriyoruz
  const {
    electionAccess,
    submitting: accessSubmitting,
    handleElectionAccessStep: originalHandleElectionAccessStep,
    reset: resetAccess,
    error: accessError,
  } = useElectionAccess(electionId);

  // 3) Candidate adımı
  const {
    candidates,
    submitting: candidateSubmitting,
    handleElectionCandidateStep: originalHandleElectionCandidateStep,
    reset: resetCandidate,
    error: candidateError,
    updateCandidateAt,
    addCandidate,
  } = useElectionCandidate(electionId);

  // 4) Choice adımı
  const {
    choices,
    submitting: choiceSubmitting,
    handleElectionChoiceStep: originalHandleElectionChoiceStep,
    reset: resetChoice,
    error: choiceError,
  } = useElectionChoices(electionId);

  useEffect(() => {
    console.log('ElectionCreationContext:', election);
    if (election && election.id) {
      setElectionId(election.id);
    }
  }, [election]);
  // --------------------------------------
  // Adımları saran fonksiyonlar
  // --------------------------------------
  const handleElectionInfoStep = async (values: FormValues) => {
    const success = await originalHandleElectionInfoStep(values);
    if (success) {
      // Info step tamamlanınca bir ID döndüğünü varsayalım
      // Hook'unuz election'ı create edip ID'sini döndürüyor olabilir
      setStep('Info completed');
      console.log('Info Completed');
    }
    return success;
  };

  const handleElectionAccessStep = async (values: ElectionAccessViewModel) => {
    const success = await originalHandleElectionAccessStep(values);
    if (success) setStep('Access completed');
    return success;
  };

  const handleElectionCandidateStep = async (
    values: CandidateCreateViewModel[],
  ) => {
    const success = await originalHandleElectionCandidateStep(values);
    if (success) setStep('Candidate completed');
    return success;
  };

  const handleElectionChoiceStep = async (
    values: ElectionChoiceViewModel[],
  ) => {
    const success = await originalHandleElectionChoiceStep(values);
    if (success) setStep('Choices completed');
    return success;
  };

  const resetElectionCreation = () => {
    resetInfo();
    resetAccess();
    resetCandidate();
    resetChoice();
    setStep(null);
    setElectionId(null);
  };

  // --------------------------------------
  // Error & Submitting
  // --------------------------------------

  const submitting = {
    info: infoSubmitting,
    access: accessSubmitting,
    candidate: candidateSubmitting,
    choice: choiceSubmitting,
  };
  const errors = {
    info: infoError,
    access: accessError,
    candidate: candidateError,
    choice: choiceError,
  };
  // --------------------------------------
  // Return
  // --------------------------------------
  return (
    <ElectionCreationContext.Provider
      value={{
        election: election ?? null,
        electionAccess,
        candidates,
        choices,
        electionType,
        setElectionType,
        electionId,
        step,
        submitting,
        errors,
        handleElectionInfoStep,
        handleElectionAccessStep,
        handleElectionCandidateStep,
        handleElectionChoiceStep,
        resetElectionCreation,
        updateCandidateAt,
        addCandidate,
      }}>
      {children}
    </ElectionCreationContext.Provider>
  );
};

export const useElectionCreationContext = () => {
  const context = useContext(ElectionCreationContext);
  if (!context) {
    throw new Error(
      'useElectionCreationContext must be used within a ElectionCreationProvider',
    );
  }
  return context;
};
