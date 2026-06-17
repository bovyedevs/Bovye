import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Calendar,
  Search,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/store/useProfileStore';
import { apiClient } from '@/lib/api';

interface FounderInfo {
  id: string;
  name: string;
  email: string;
  startupType: string | null;
  company: string | null;
  industry: string | null;
  bio: string | null;
  createdAt: string;
}

interface FounderFeature {
  icon: typeof Users;
  title: string;
  description: string;
  status: string;
}

interface InvestorFeature {
  icon: typeof TrendingUp;
  title: string;
  description: string;
  status: string;
}

interface MentorFeature {
  icon: typeof GraduationCap;
  title: string;
  description: string;
  status: string;
}

interface ExplorerFeature {
  icon: typeof Users;
  title: string;
  description: string;
  status: string;
}

const founderFeatures: FounderFeature[] = [
  {
    icon: Users,
    title: 'Peer Matching',
    description: 'Get matched with founders at your stage. Share struggles, swap tactics, and build accountability partnerships.',
    status: 'Coming Soon',
  },
  {
    icon: MessageSquare,
    title: 'Founder Forums',
    description: 'Topic-based discussion boards for every stage: ideation, MVP, product-market fit, scaling, and beyond.',
    status: 'Coming Soon',
  },
  {
    icon: GraduationCap,
    title: 'Mentor Directory',
    description: 'Browse verified mentors by domain expertise. Book 1:1 sessions and get guidance from people who have built before.',
    status: 'Coming Soon',
  },
  {
    icon: Briefcase,
    title: 'Co-Founder Matching',
    description: 'Find complementary skill sets. Whether you need a technical co-founder or a growth hacker, we help you connect.',
    status: 'Coming Soon',
  },
];

const investorFeatures: InvestorFeature[] = [
  {
    icon: Search,
    title: 'Startup Directory',
    description: 'Browse and filter startups by industry, stage, and traction. Discover your next investment opportunity.',
    status: 'Active',
  },
  {
    icon: TrendingUp,
    title: 'Deal Flow',
    description: 'Get curated startup recommendations based on your investment thesis and past activity.',
    status: 'Coming Soon',
  },
  {
    icon: Briefcase,
    title: 'Portfolio Tracker',
    description: 'Monitor your investments, track milestones, and stay updated on your portfolio companies.',
    status: 'Coming Soon',
  },
  {
    icon: Calendar,
    title: 'Demo Days',
    description: 'RSVP to virtual and in-person pitch events. See startups present live and connect with founders.',
    status: 'Coming Soon',
  },
];

const mentorFeatures: MentorFeature[] = [
  {
    icon: Calendar,
    title: 'Session Booking',
    description: 'Open your calendar for mentees to book 1:1 sessions. Set availability and preferred topics.',
    status: 'Coming Soon',
  },
  {
    icon: GraduationCap,
    title: 'Course Builder',
    description: 'Create structured learning experiences for founders. Publish courses and reach hundreds of learners.',
    status: 'Active',
  },
  {
    icon: MessageSquare,
    title: 'Office Hours',
    description: 'Host open office hours where multiple founders can drop in and ask questions in real-time.',
    status: 'Coming Soon',
  },
  {
    icon: Users,
    title: 'Mentee Matching',
    description: 'Get matched with founders whose needs align with your expertise and availability.',
    status: 'Coming Soon',
  },
];

const explorerFeatures: ExplorerFeature[] = [
  {
    icon: MessageSquare,
    title: 'Public Forums',
    description: 'Join open discussions about startups, technology, and business. Learn from the community before committing.',
    status: 'Coming Soon',
  },
  {
    icon: Users,
    title: 'Learning Groups',
    description: 'Join topic-based study groups with other explorers. Learn together and share insights.',
    status: 'Coming Soon',
  },
  {
    icon: TrendingUp,
    title: 'Industry Insights',
    description: 'Read curated articles, reports, and trend analyses across industries and sectors.',
    status: 'Coming Soon',
  },
  {
    icon: Search,
    title: 'Startup Explorer',
    description: 'Browse what founders are building. Get a feel for the ecosystem before deciding your path.',
    status: 'Active',
  },
];

export default function Community() {
  const [email, setEmail] = useState('');
  const role = useProfileStore((s) => s.role);
  const [founders, setFounders] = useState<FounderInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === 'investor') {
      setLoading(true);
      apiClient.get<{ founders: FounderInfo[] }>('/users/founders')
        .then((res) => setFounders(res.founders))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [role]);

  const getFeatures = () => {
    switch (role) {
      case 'investor':
        return investorFeatures;
      case 'mentor':
        return mentorFeatures;
      case 'explorer':
        return explorerFeatures;
      default:
        return founderFeatures;
    }
  };

  const getTitle = () => {
    switch (role) {
      case 'investor':
        return 'Investor Network';
      case 'mentor':
        return 'Mentor Hub';
      case 'explorer':
        return 'Community & Forums';
      default:
        return 'Community';
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case 'investor':
        return 'Discover startups, track deals, and build your portfolio';
      case 'mentor':
        return 'Share expertise, book sessions, and guide founders';
      case 'explorer':
        return 'Learn, discuss, and explore the startup ecosystem';
      default:
        return 'Connect with founders, mentors, and investors';
    }
  };

  const getHeroTitle = () => {
    switch (role) {
      case 'investor':
        return 'Find your next investment';
      case 'mentor':
        return 'Your experience can change a founder\'s trajectory';
      case 'explorer':
        return 'Every expert was once a beginner';
      default:
        return 'Building a startup shouldn\'t be a solo journey';
    }
  };

  const getHeroDescription = () => {
    switch (role) {
      case 'investor':
        return 'Access a curated pipeline of vetted startups actively seeking investment. Connect with founders, review pitch decks, and build your deal flow.';
      case 'mentor':
        return 'Founders need your experience. Whether through 1:1 sessions, courses, or office hours, your guidance helps them avoid costly mistakes.';
      case 'explorer':
        return 'Dive into discussions, join learning groups, and explore what the startup world has to offer. No commitment required.';
      default:
        return 'We\'re building a community where founders connect with peers at their stage, get guidance from experienced mentors, and find the right investors at the right time.';
    }
  };

  const features = getFeatures();
  const isInvestorWithStartups = role === 'investor' && founders.length > 0 && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="min-h-full p-4 md:p-6 lg:p-8"
    >
      <div className="mb-12">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {getTitle()}<span className="text-primary">.</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {getSubtitle()}
        </p>
      </div>

      {role === 'investor' && (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: 'spring', stiffness: 280, damping: 22 },
            },
          }}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Startup Directory
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Loading startups...</p>
            </div>
          ) : founders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
              <Search className="mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No startups yet</p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Startups will appear here as they join the platform
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {founders.map((founder) => (
                <motion.div
                  key={founder.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-card p-5 shadow-warm-sm transition-all hover:shadow-warm hover:border-primary/30"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {founder.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {founder.company || founder.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {founder.industry || 'No industry specified'}
                      </p>
                    </div>
                  </div>
                  {founder.bio && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                      {founder.bio}
                    </p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    {founder.startupType && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {founder.startupType}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground/60">
                      Joined {new Date(founder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      <div className="rounded-2xl border border-border bg-card p-8 md:p-12 mb-12 shadow-warm-sm">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              {role === 'investor' ? (
                <TrendingUp className="h-8 w-8 text-primary" />
              ) : role === 'mentor' ? (
                <GraduationCap className="h-8 w-8 text-primary" />
              ) : role === 'explorer' ? (
                <Search className="h-8 w-8 text-primary" />
              ) : (
                <Users className="h-8 w-8 text-primary" />
              )}
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-3">
            {getHeroTitle()}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8">
            {getHeroDescription()}
            <br />
            <span className="text-primary font-medium">Launching Q2 2026.</span>
          </p>

          {!isInvestorWithStartups && (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 text-sm"
              />
              <Button className="h-11 px-6 text-sm font-semibold whitespace-nowrap">
                Get Notified
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="group p-6 shadow-warm-sm hover:shadow-warm-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {feature.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
