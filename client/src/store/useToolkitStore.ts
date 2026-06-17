import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  IdeaValidationData,
  PitchDeckData,
  PitchDeckSlideKey,
  FundingChecklistData,
  CompanyDocsData,
  DocRequirement,
  FundingStageItem,
} from '@/types/toolkit';
import { DEFAULT_FUNDING_STAGES, DEFAULT_DOC_REQUIREMENTS } from '@/types/toolkit';

interface ToolkitState {
  ideaData: IdeaValidationData;
  pitchDeck: PitchDeckData;
  fundingChecklist: FundingChecklistData;
  companyDocs: CompanyDocsData;
}

interface ToolkitActions {
  updateIdeaData: (data: Partial<IdeaValidationData>) => void;
  updatePitchDeckSlide: (key: PitchDeckSlideKey, value: string) => void;
  resetToolkit: () => void;
  toggleFundingItem: (stageId: string, itemId: string) => void;
  updateDocStatus: (categoryId: string, reqId: string, status: DocRequirement['status']) => void;
  updateDocNotes: (categoryId: string, reqId: string, notes: string) => void;
  attachDocFile: (categoryId: string, reqId: string, file: { id: string; name: string; size: number; type: string; dataUrl: string; attachedAt: string }) => void;
  removeDocFile: (categoryId: string, reqId: string, fileId: string) => void;
}

type ToolkitStore = ToolkitState & ToolkitActions;

const defaultIdeaData: IdeaValidationData = {
  targetAudience: '',
  problem: '',
  solution: '',
  competitors: '',
  uniqueValue: '',
};

const defaultPitchDeck: PitchDeckData = {
  problemSlide: '',
  solutionSlide: '',
  marketSlide: '',
  teamSlide: '',
  businessModelSlide: '',
};

const defaultFundingChecklist: FundingChecklistData = {
  stages: DEFAULT_FUNDING_STAGES,
};

const defaultCompanyDocs: CompanyDocsData = {
  categories: DEFAULT_DOC_REQUIREMENTS,
};

export const useToolkitStore = create<ToolkitStore>()(
  persist(
    (set) => ({
      ideaData: defaultIdeaData,
      pitchDeck: defaultPitchDeck,
      fundingChecklist: defaultFundingChecklist,
      companyDocs: defaultCompanyDocs,

      updateIdeaData: (data) => {
        set((state) => ({
          ideaData: { ...state.ideaData, ...data },
        }));
      },

      updatePitchDeckSlide: (key, value) => {
        set((state) => ({
          pitchDeck: { ...state.pitchDeck, [key]: value },
        }));
      },

      resetToolkit: () => {
        set({
          ideaData: defaultIdeaData,
          pitchDeck: defaultPitchDeck,
          fundingChecklist: defaultFundingChecklist,
          companyDocs: defaultCompanyDocs,
        });
      },

      toggleFundingItem: (stageId, itemId) => {
        set((state) => ({
          fundingChecklist: {
            stages: state.fundingChecklist.stages.map((stage) =>
              stage.id === stageId
                ? {
                    ...stage,
                    items: stage.items.map((item: FundingStageItem) =>
                      item.id === itemId ? { ...item, checked: !item.checked } : item
                    ),
                  }
                : stage
            ),
          },
        }));
      },

      updateDocStatus: (categoryId, reqId, status) => {
        set((state) => ({
          companyDocs: {
            categories: state.companyDocs.categories.map((cat) =>
              cat.categoryId === categoryId
                ? {
                    ...cat,
                    requirements: cat.requirements.map((req: DocRequirement) =>
                      req.id === reqId ? { ...req, status } : req
                    ),
                  }
                : cat
            ),
          },
        }));
      },

      updateDocNotes: (categoryId, reqId, notes) => {
        set((state) => ({
          companyDocs: {
            categories: state.companyDocs.categories.map((cat) =>
              cat.categoryId === categoryId
                ? {
                    ...cat,
                    requirements: cat.requirements.map((req: DocRequirement) =>
                      req.id === reqId ? { ...req, notes } : req
                    ),
                  }
                : cat
            ),
          },
        }));
      },

      attachDocFile: (categoryId, reqId, file) => {
        set((state) => ({
          companyDocs: {
            categories: state.companyDocs.categories.map((cat) =>
              cat.categoryId === categoryId
                ? {
                    ...cat,
                    requirements: cat.requirements.map((req: DocRequirement) =>
                      req.id === reqId ? { ...req, files: [...req.files, file] } : req
                    ),
                  }
                : cat
            ),
          },
        }));
      },

      removeDocFile: (categoryId, reqId, fileId) => {
        set((state) => ({
          companyDocs: {
            categories: state.companyDocs.categories.map((cat) =>
              cat.categoryId === categoryId
                ? {
                    ...cat,
                    requirements: cat.requirements.map((req: DocRequirement) =>
                      req.id === reqId
                        ? { ...req, files: req.files.filter((f) => f.id !== fileId) }
                        : req
                    ),
                  }
                : cat
            ),
          },
        }));
      },
    }),
    {
      name: 'bovye-toolkit',
    }
  )
);
