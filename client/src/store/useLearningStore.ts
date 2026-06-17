import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncLearningToggle } from '@/services/sync';

export interface LearningResource {
  id: string;
  title: string;
  url: string;
  description: string;
  author: string;
  completed: boolean;
}

export interface LearningTrack {
  id: string;
  title: string;
  description: string;
  resources: LearningResource[];
}

interface LearningState {
  tracks: LearningTrack[];
}

interface LearningActions {
  toggleResource: (trackId: string, resourceId: string) => void;
}

export type LearningStore = LearningState & LearningActions;

export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'startup-101',
    title: 'Startup 101',
    description: 'The fundamentals of building a startup from zero to one',
    resources: [
      {
        id: 's101-1',
        title: 'How to Start a Startup',
        url: 'https://www.ycombinator.com/library/6j-how-to-start-a-startup',
        description: 'Sam Altman\'s legendary Stanford course on the fundamentals',
        author: 'Sam Altman',
        completed: false,
      },
      {
        id: 's101-2',
        title: 'The Lean Startup',
        url: 'https://theleanstartup.com/principles',
        description: 'Build-Measure-Learn feedback loop methodology',
        author: 'Eric Ries',
        completed: false,
      },
      {
        id: 's101-3',
        title: 'Do Things That Don\'t Scale',
        url: 'https://www.paulgraham.com/ds.html',
        description: 'Paul Graham on the counterintuitive early-stage playbook',
        author: 'Paul Graham',
        completed: false,
      },
      {
        id: 's101-4',
        title: 'Before the MVP',
        url: 'https://www.ycombinator.com/library/6p-before-the-mvp',
        description: 'YC guide on what to do before building anything',
        author: 'Y Combinator',
        completed: false,
      },
      {
        id: 's101-5',
        title: 'How to Get Startup Ideas',
        url: 'https://www.paulgraham.com/startupideas.html',
        description: 'PG on the best way to find startup ideas that actually work',
        author: 'Paul Graham',
        completed: false,
      },
      {
        id: 's101-6',
        title: 'Product-Market Fit',
        url: 'https://a16z.com/how-to-know-if-you-have-product-market-fit/',
        description: 'Andreessen Horowitz framework for evaluating PMF',
        author: 'a16z',
        completed: false,
      },
    ],
  },
  {
    id: 'fundraising',
    title: 'Fundraising',
    description: 'Raise capital from pre-seed to Series A and beyond',
    resources: [
      {
        id: 'f-1',
        title: 'Y Combinator Funding Guide',
        url: 'https://www.ycombinator.com/library/6f-fundraising',
        description: 'Comprehensive guide from YC on raising your first round',
        author: 'Y Combinator',
        completed: false,
      },
      {
        id: 'f-2',
        title: 'SAFE Document',
        url: 'https://www.ycombinator.com/documents',
        description: 'The Simple Agreement for Future Equity — standard early-stage instrument',
        author: 'Y Combinator',
        completed: false,
      },
      {
        id: 'f-3',
        title: 'Venture Deals',
        url: 'https://www.venturedealsbook.com/',
        description: 'Brad Feld\'s definitive guide to term sheets and negotiations',
        author: 'Brad Feld',
        completed: false,
      },
      {
        id: 'f-4',
        title: 'How to Talk to Investors',
        url: 'https://www.ycombinator.com/library/9b-how-to-talk-to-investors',
        description: 'YC on the art of the investor conversation',
        author: 'Y Combinator',
        completed: false,
      },
      {
        id: 'f-5',
        title: 'Building a Cap Table',
        url: 'https://carta.com/blog/cap-table/',
        description: 'Carta\'s guide to setting up and managing your equity structure',
        author: 'Carta',
        completed: false,
      },
    ],
  },
  {
    id: 'product',
    title: 'Product',
    description: 'Design, build, and ship products users love',
    resources: [
      {
        id: 'p-1',
        title: 'The Mom Test',
        url: 'https://momtestbook.com/',
        description: 'How to talk to customers and validate ideas without bias',
        author: 'Rob Fitzpatrick',
        completed: false,
      },
      {
        id: 'p-2',
        title: 'Inspired: How to Create Tech Products',
        url: 'https://www.svpg.com/books/inspired-how-to-create-tech-products-customers-love/',
        description: 'Marty Cagan on building products customers love',
        author: 'Marty Cagan',
        completed: false,
      },
      {
        id: 'p-3',
        title: 'Design Sprint Methodology',
        url: 'https://designsprintkit.withgoogle.com/',
        description: 'Google\'s 5-day process for solving big problems',
        author: 'Google Ventures',
        completed: false,
      },
      {
        id: 'p-4',
        title: 'Jobs To Be Done Framework',
        url: 'https://jtbd.info/',
        description: 'Understanding what customers are really hiring your product to do',
        author: 'JTBD.info',
        completed: false,
      },
      {
        id: 'p-5',
        title: 'Building Features Users Want',
        url: 'https://www.intercom.com/blog/product-management/',
        description: 'Intercom\'s guide to prioritization and feature discovery',
        author: 'Intercom',
        completed: false,
      },
    ],
  },
  {
    id: 'growth',
    title: 'Growth',
    description: 'Scale your startup with sustainable growth strategies',
    resources: [
      {
        id: 'g-1',
        title: 'Traction: How Startups Get Growth',
        url: 'https://www.gabrielweinberg.com/traction',
        description: '19 channels for startup growth — pick the ones that work for you',
        author: 'Gabriel Weinberg',
        completed: false,
      },
      {
        id: 'g-2',
        title: 'Growth Loops vs Funnels',
        url: 'https://www.reforge.com/blog/growth-loops',
        description: 'Why loops beat funnels for sustainable growth',
        author: 'Reforge',
        completed: false,
      },
      {
        id: 'g-3',
        title: 'Pirate Metrics (AARRR)',
        url: 'https://500.co/pirate-metrics/',
        description: 'Acquisition, Activation, Retention, Revenue, Referral framework',
        author: '500 Global',
        completed: false,
      },
      {
        id: 'g-4',
        title: 'How to Build a Growth Model',
        url: 'https://www.elephantinthevalley.com/',
        description: 'Practical guide to modeling your startup\'s growth drivers',
        author: 'Elephant in the Valley',
        completed: false,
      },
      {
        id: 'g-5',
        title: 'Content Marketing for Startups',
        url: 'https://www.hubspot.com/startups/resources/content-marketing',
        description: 'HubSpot\'s startup guide to building a content engine',
        author: 'HubSpot',
        completed: false,
      },
      {
        id: 'g-6',
        title: 'Referral Programs That Work',
        url: 'https://www.referralcandy.com/blog/referral-program-examples',
        description: 'Case studies from Dropbox, Airbnb, and more',
        author: 'ReferralCandy',
        completed: false,
      },
    ],
  },
];

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      tracks: LEARNING_TRACKS,

      toggleResource: (trackId, resourceId) => {
        const track = get().tracks.find((t) => t.id === trackId);
        const resource = track?.resources.find((r) => r.id === resourceId);
        const newCompleted = resource ? !resource.completed : true;

        set((state) => ({
          tracks: state.tracks.map((t) =>
            t.id === trackId
              ? {
                  ...t,
                  resources: t.resources.map((r) =>
                    r.id === resourceId ? { ...r, completed: !r.completed } : r
                  ),
                }
              : t
          ),
        }));

        syncLearningToggle(trackId, resourceId, newCompleted);
      },
    }),
    {
      name: 'bovye-learning',
    }
  )
);
