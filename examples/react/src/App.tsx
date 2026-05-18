import {BuildPage} from './pages/BuildPage';
import {SignPage} from './pages/SignPage';
import {navigateToRoute, useHashRoute, type AppRoute} from './lib/useHashRoute';

const NAV_ITEMS: {route: AppRoute; label: string}[] = [
  {route: 'build', label: 'Build'},
  {route: 'sign', label: 'Sign'},
];

export const App = () => {
  const route = useHashRoute();

  return (
    <div className={`app ${route === 'sign' ? 'app--sign' : ''}`}>
      <header className="app-header">
        <div>
          <h1>Verdocs React Examples</h1>
          <p>Reference integrations for <code>@verdocs/web-sdk-react</code> embeds.</p>
        </div>
        <nav className="app-nav" aria-label="Example pages">
          {NAV_ITEMS.map(({route: navRoute, label}) => (
            <a
              key={navRoute}
              href={navRoute === 'sign' ? '#/sign' : '#/build'}
              className={`app-nav-link ${route === navRoute ? 'app-nav-link--active' : ''}`}
              aria-current={route === navRoute ? 'page' : undefined}
              onClick={e => {
                e.preventDefault();
                navigateToRoute(navRoute);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      {route === 'sign' ? <SignPage /> : <BuildPage />}
    </div>
  );
};
