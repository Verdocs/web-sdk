import { VerdocsAuth } from "@verdocs/web-sdk-react";
// import { ColorPalette } from "../components/shared/ColorPalette";

interface AuthPageProps {
  // themeRevision: number;
  // onAuthenticated: () => void;
}
export const AuthPage: React.FC<AuthPageProps> = () => (
  <div className="auth-page">
    <div className="auth-page-intro">
      <h2>Sign in to Verdocs</h2>
      <p>
        Use <code>VerdocsAuth</code> for login. Your session is stored in <strong>localStorage</strong> via the JS SDK
        so you stay signed in across reloads.
      </p>
    </div>
    {/* <ColorPalette themeRevision={themeRevision} /> */}
    <div className="auth-embed-wrap">
      <VerdocsAuth
        visible
        onAuthenticated={(e) => {
          if ((e as CustomEvent<{ authenticated: boolean }>).detail.authenticated) {
            // onAuthenticated();
          }
        }}
        onSdkError={(e) => console.error("[Auth]", (e as CustomEvent<{ message?: string }>).detail)}
      />
    </div>
  </div>
);
