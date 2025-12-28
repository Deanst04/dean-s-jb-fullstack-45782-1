import { StrictMode, Component, ReactNode, ErrorInfo } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('🚀 main.tsx loaded');

/**
 * Error Boundary to catch and display runtime errors
 */
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('💥 React Error Boundary caught an error:', error);
    console.error('📍 Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          fontFamily: 'monospace',
          backgroundColor: '#1a1a2e',
          color: '#ff6b6b',
          minHeight: '100vh'
        }}>
          <h1 style={{ color: '#ff6b6b', marginBottom: '20px' }}>
            💥 Application Crashed
          </h1>
          <pre style={{ 
            backgroundColor: '#16213e', 
            padding: '20px', 
            borderRadius: '8px',
            overflow: 'auto',
            color: '#ffd93d'
          }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ 
            backgroundColor: '#16213e', 
            padding: '20px', 
            borderRadius: '8px',
            overflow: 'auto',
            marginTop: '10px',
            fontSize: '12px',
            color: '#a8a8a8'
          }}>
            {this.state.error?.stack}
          </pre>
          <p style={{ marginTop: '20px', color: '#4ecca3' }}>
            Check the browser console (F12) for more details.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
console.log('🎯 Root element found:', rootElement);

if (!rootElement) {
  console.error('❌ Could not find root element!');
} else {
  console.log('✅ Creating React root...');
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  console.log('✅ React render called');
}
