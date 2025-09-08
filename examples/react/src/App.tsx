import { VerdocsSign } from "@verdocs/web-sdk-react";
import "./App.css";

// Replace these with your actual values for testing
const ENVELOPE_ID = "<ENVELOPE_ID>";
const ROLE_ID = "<ROLE_ID>";
const INVITE_CODE = "<INVITE_CODE>";

function App() {
  return (
    <>
      <VerdocsSign
        envelopeId={ENVELOPE_ID}
        roleId={ROLE_ID}
        inviteCode={INVITE_CODE}
        onEnvelopeUpdated={({ detail }) =>
          console.log("Envelope updated state:", detail)
        }
        onSdkError={({ detail }) => {
          console.log("SDK error", detail);
        }}
      />
    </>
  );
}

export default App;
