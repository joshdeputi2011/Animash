import { Outlet } from 'react-router';
import { Navigation } from './Navigation';

export function Root() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--animash-bg)',
    }}>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
