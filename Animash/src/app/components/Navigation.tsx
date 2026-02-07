import { Link, useLocation } from 'react-router';

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      height: 'var(--animash-nav-height)',
      background: 'var(--animash-bg)',
      borderBottom: '1px solid var(--animash-border)',
      zIndex: 100,
      backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(11, 11, 13, 0.8)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        height: '100%',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link 
          to="/"
          style={{
            fontSize: 'var(--animash-text-title)',
            fontWeight: 600,
            color: 'var(--animash-text)',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
          }}
        >
          Animash
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
        }}>
          <Link
            to="/"
            style={{
              fontSize: 'var(--animash-text-base)',
              fontWeight: 500,
              color: isActive('/') ? 'var(--animash-red)' : 'var(--animash-text-muted)',
              textDecoration: 'none',
              transition: 'color var(--animash-transition)',
              borderBottom: isActive('/') ? '2px solid var(--animash-red)' : '2px solid transparent',
              paddingBottom: '4px',
            }}
            onMouseEnter={(e) => {
              if (!isActive('/')) {
                e.currentTarget.style.color = 'var(--animash-text)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/')) {
                e.currentTarget.style.color = 'var(--animash-text-muted)';
              }
            }}
          >
            Arena
          </Link>

          <Link
            to="/leaderboard"
            style={{
              fontSize: 'var(--animash-text-base)',
              fontWeight: 500,
              color: isActive('/leaderboard') ? 'var(--animash-red)' : 'var(--animash-text-muted)',
              textDecoration: 'none',
              transition: 'color var(--animash-transition)',
              borderBottom: isActive('/leaderboard') ? '2px solid var(--animash-red)' : '2px solid transparent',
              paddingBottom: '4px',
            }}
            onMouseEnter={(e) => {
              if (!isActive('/leaderboard')) {
                e.currentTarget.style.color = 'var(--animash-text)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/leaderboard')) {
                e.currentTarget.style.color = 'var(--animash-text-muted)';
              }
            }}
          >
            Rankings
          </Link>
        </div>
      </div>
    </nav>
  );
}
