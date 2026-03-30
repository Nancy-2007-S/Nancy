import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorStr: '' };
  }
  static getDerivedStateFromError(error) { return { hasError: true, errorStr: error.toString() }; }
  componentDidCatch(error, errorInfo) { console.error("Caught error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'red', color: 'white', fontSize: '24px', padding: '40px', zIndex: 9999, overflow: 'auto' }}>
          <h1>React Crash Log</h1>
          <pre>{this.state.errorStr}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
