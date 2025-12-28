import { useUser, useSystemLogs } from './hooks';
import { AccessDenied, WelcomeScreen } from './components/screens';
import {
  Header,
  IdentityCard,
  SystemStatus,
  MissionGrid,
  FooterStats,
} from './components/dashboard';
import type { UserSession } from './models/types';

/**
 * Main App component - orchestrates the three application states:
 * 1. Access Denied (no user parameter)
 * 2. Welcome Screen (user authenticated, showing intro animation)
 * 3. Dashboard (main application view)
 */
function App() {
  console.log('🔄 App component rendering...');
  
  const { user, session, showWelcome } = useUser();
  const logs = useSystemLogs(!!user && !showWelcome);

  console.log('👤 User state:', { user, session, showWelcome });

  // State 1: No user - show access denied
  if (!user || !session) {
    console.log('🚫 Rendering AccessDenied screen');
    return <AccessDenied />;
  }

  // State 2: User authenticated but still showing welcome
  if (showWelcome) {
    console.log('👋 Rendering WelcomeScreen');
    return <WelcomeScreen session={session} />;
  }

  // State 3: Main dashboard
  console.log('📊 Rendering Dashboard');
  return <Dashboard session={session} logs={logs} />;
}

interface DashboardProps {
  session: UserSession;
  logs: string[];
}

/**
 * Main dashboard layout component
 */
function Dashboard({ session, logs }: DashboardProps) {
  return (
    <div className="min-h-screen bg-cyber-black scanlines crt hex-pattern">
      <Header user={session.name} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <IdentityCard session={session} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SystemStatus logs={logs} />
          <MissionGrid />
        </div>

        <FooterStats />
      </main>
    </div>
  );
}

export default App;
