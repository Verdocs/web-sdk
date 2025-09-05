import { VerdocsSign } from '@verdocs/web-sdk-react';
import './App.css';

// Replace these with your actual values for testing
const ENVELOPE_ID = 'c2c-283c-47dd-93a5-e2844cb679cc';
const ROLE_ID = 'Buyer';
const INVITE_CODE = 'mavg6yuwv3b6ktpwq3p5uvoe';

function App() {
  return (
    <>
      <VerdocsSign
        envelopeId={ENVELOPE_ID}
        roleId={ROLE_ID}
        inviteCode={INVITE_CODE}
        onEnvelopeUpdated={({ detail }) => console.log('Envelope updated state:', detail)}
        onSdkError={({ detail }) => {
          console.log('SDK error', detail);
        }}
      />
    </>
  );
}

export default App;
