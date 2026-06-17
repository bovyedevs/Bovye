import { useProfileStore } from '@/store/useProfileStore';
import FounderDashboard from '@/components/dashboard/FounderDashboard';
import InvestorDashboard from '@/components/dashboard/InvestorDashboard';
import MentorDashboard from '@/components/dashboard/MentorDashboard';
import ExplorerDashboard from '@/components/dashboard/ExplorerDashboard';

export default function Dashboard() {
  const role = useProfileStore((s) => s.role);

  switch (role) {
    case 'investor':
      return <InvestorDashboard />;
    case 'mentor':
      return <MentorDashboard />;
    case 'explorer':
      return <ExplorerDashboard />;
    default:
      return <FounderDashboard />;
  }
}
