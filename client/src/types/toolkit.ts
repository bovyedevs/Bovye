export interface IdeaValidationData {
  targetAudience: string;
  problem: string;
  solution: string;
  competitors: string;
  uniqueValue: string;
}

export interface PitchDeckData {
  problemSlide: string;
  solutionSlide: string;
  marketSlide: string;
  teamSlide: string;
  businessModelSlide: string;
}

export type PitchDeckSlideKey = keyof PitchDeckData;

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  attachedAt: string;
}

export interface FundingStageItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface FundingStage {
  id: string;
  label: string;
  description: string;
  items: FundingStageItem[];
}

export interface FundingChecklistData {
  stages: FundingStage[];
}

export interface DocCategory {
  id: string;
  label: string;
  description: string;
}

export interface DocRequirement {
  id: string;
  label: string;
  status: 'not-started' | 'in-progress' | 'complete';
  notes: string;
  files: AttachedFile[];
}

export interface CompanyDocsData {
  categories: {
    categoryId: string;
    requirements: DocRequirement[];
  }[];
}

export const PITCH_DECK_SLIDES: {
  key: PitchDeckSlideKey;
  label: string;
  icon: string;
  tips: string[];
}[] = [
  {
    key: 'problemSlide',
    label: 'Problem',
    icon: '🎯',
    tips: [
      'Describe the pain point in 1-2 sentences',
      'Who experiences this problem most acutely?',
      'How are people solving it today (workarounds)?',
      'Quantify the cost of this problem if unsolved',
    ],
  },
  {
    key: 'solutionSlide',
    label: 'Solution',
    icon: '💡',
    tips: [
      'What is your product in one sentence?',
      'How does it directly solve the stated problem?',
      'What makes your approach fundamentally different?',
      'Show a mockup or screenshot if possible',
    ],
  },
  {
    key: 'marketSlide',
    label: 'Market Size',
    icon: '📊',
    tips: [
      'Total Addressable Market (TAM) in dollars',
      'Serviceable Addressable Market (SAM)',
      'Serviceable Obtainable Market (SOM) — year 1-3',
      'Cite your sources — investors will check',
    ],
  },
  {
    key: 'teamSlide',
    label: 'Team',
    icon: '👥',
    tips: [
      'Founder names, roles, and relevant experience',
      'Why is THIS team the right one to solve this?',
      'Any prior exits, domain expertise, or unfair advantage?',
      'Key hires you plan to make next',
    ],
  },
  {
    key: 'businessModelSlide',
    label: 'Business Model',
    icon: '💰',
    tips: [
      'How do you make money? (subscription, marketplace, etc.)',
      'Pricing strategy and rationale',
      'Customer acquisition cost (CAC) estimate',
      'Lifetime value (LTV) projections',
    ],
  },
];

export const DEFAULT_FUNDING_STAGES: FundingStage[] = [
  {
    id: 'pre-seed',
    label: 'Pre-Seed',
    description: 'Validate idea, build MVP, find first users',
    items: [
      { id: 'ps1', label: 'Problem statement finalized', checked: false },
      { id: 'ps2', label: 'MVP built and tested', checked: false },
      { id: 'ps3', label: 'First 10+ users acquired', checked: false },
      { id: 'ps4', label: 'Initial pitch deck drafted', checked: false },
      { id: 'ps5', label: 'Early traction metrics collected', checked: false },
    ],
  },
  {
    id: 'seed',
    label: 'Seed',
    description: 'Product-market fit, initial revenue, team building',
    items: [
      { id: 's1', label: 'Pitch deck investor-ready', checked: false },
      { id: 's2', label: 'Financial model built (12-24 months)', checked: false },
      { id: 's3', label: 'Cap table prepared', checked: false },
      { id: 's4', label: 'Monthly recurring revenue established', checked: false },
      { id: 's5', label: 'Core team (3+ people) assembled', checked: false },
      { id: 's6', label: 'Customer retention metrics tracked', checked: false },
    ],
  },
  {
    id: 'series-a',
    label: 'Series A',
    description: 'Scale operations, expand market, optimize unit economics',
    items: [
      { id: 'sa1', label: 'Product-market fit proven', checked: false },
      { id: 'sa2', label: 'Revenue > $1M ARR', checked: false },
      { id: 'sa3', label: 'LTV:CAC ratio > 3:1', checked: false },
      { id: 'sa4', label: 'Board of directors established', checked: false },
      { id: 'sa5', label: 'Growth strategy documented', checked: false },
      { id: 'sa6', label: 'Due diligence materials prepared', checked: false },
    ],
  },
];

export const DOC_CATEGORIES: DocCategory[] = [
  { id: 'legal', label: 'Legal', description: 'Incorporation, IP, contracts' },
  { id: 'financial', label: 'Financial', description: 'Projections, cap table, tax' },
  { id: 'product', label: 'Product', description: 'Roadmaps, specs, research' },
  { id: 'operations', label: 'Operations', description: 'HR, policies, processes' },
];

export const DEFAULT_DOC_REQUIREMENTS: { categoryId: string; requirements: DocRequirement[] }[] = [
  {
    categoryId: 'legal',
    requirements: [
      { id: 'l1', label: 'Articles of Incorporation', status: 'not-started', notes: '', files: [] },
      { id: 'l2', label: 'Operating Agreement / Bylaws', status: 'not-started', notes: '', files: [] },
      { id: 'l3', label: 'IP Assignment Agreements', status: 'not-started', notes: '', files: [] },
      { id: 'l4', label: 'Founders Agreement', status: 'not-started', notes: '', files: [] },
      { id: 'l5', label: 'NDA Templates', status: 'not-started', notes: '', files: [] },
    ],
  },
  {
    categoryId: 'financial',
    requirements: [
      { id: 'f1', label: 'Financial Projections (24 months)', status: 'not-started', notes: '', files: [] },
      { id: 'f2', label: 'Cap Table', status: 'not-started', notes: '', files: [] },
      { id: 'f3', label: 'Bank Account Setup', status: 'not-started', notes: '', files: [] },
      { id: 'f4', label: 'Tax Registration Documents', status: 'not-started', notes: '', files: [] },
    ],
  },
  {
    categoryId: 'product',
    requirements: [
      { id: 'p1', label: 'Product Roadmap', status: 'not-started', notes: '', files: [] },
      { id: 'p2', label: 'Technical Architecture Doc', status: 'not-started', notes: '', files: [] },
      { id: 'p3', label: 'User Research Findings', status: 'not-started', notes: '', files: [] },
    ],
  },
  {
    categoryId: 'operations',
    requirements: [
      { id: 'o1', label: 'Employee Handbook', status: 'not-started', notes: '', files: [] },
      { id: 'o2', label: 'Remote Work Policy', status: 'not-started', notes: '', files: [] },
      { id: 'o3', label: 'Equipment & Tools List', status: 'not-started', notes: '', files: [] },
    ],
  },
];

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
