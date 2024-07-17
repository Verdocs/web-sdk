# Verdocs React SDK

> Library of components and embeds to quickly build Verdocs-enabled apps in React.

This SDK provides UI controls and components for building rich, Verdocs-enabled document signing experiences for the Web. Components
are built in [StencilJS](https://stenciljs.com/) for maximum portability between front-end frameworks. This package contains the
React framework components - for Angular or Vue, please see the parent repository.

## Installation

Begin by installing the SDK into your app. Currently React >= 16.7.0 is supported. You will also need the Verdocs JS SDK:

    npm i -S @verdocs/web-sdk-react @verdocs/js-sdk

or:

    yarn add @verdocs/web-sdk-react @verdocs/js-sdk

Then authenticate to the Verdocs API somewhere in your app. The best way to do this is by logging in with a username/password
created at [Verdocs.com](https://verdocs.com). Most Web applications have some type of login process, and if your app uses the
same username/password for access, you can reuse that for this step:

```typescript
import {Auth} from '@verdocs/js-sdk/Users';
import {Transport} from '@verdocs/js-sdk/HTTP';

try {
  const {accessToken} = await Auth.authenticateUser({
    username: MY_USERNAME,
    password: MY_PASSWORD,
  });
  console.log('Authenticated to Verdocs', accessToken.substring(0, 10));
  Transport.setAuthToken(accessToken);
} catch (e) {
  console.error('Unable to authenticate to Verdocs.', e);
}
```

Note that the components in this library leverage the same underlying Verdocs JS SDK that you can call directly from your code.
Authenticating via the above process will provide access both for the JS SDK and this library's components at the same time.

## Usage

```typescript jsx
import { PdfViewer } from "@verdocs/web-sdk-react";

export const SimplePDFView: FC = () => {
  const templateId = "c3fc6310-bf9d-47a1-b0ad-daf2bbf657c2";
  const documentId = "ed117472-4d4e-4c62-9386-af047a3373a2";
  const pdfurl = `https://api.verdocs.com/templates/${templateId}/documents/${documentId}?file=true`;

  return (
    <div style={{ width: 600, height: 800 }}>
      <PdfViewer src={pdfUrl} />
    </div>
  );
};
```

Components available in this package are broken down into three categories:

- `controls` - Low level UI controls such as drop-downs, buttons, etc. UI controls should be 100% independent from one another. If
  a control requires data to operate properly, it should be passed in as a property (controls should not call the API directly).
- `elements` - Elements are widgets that combine one or more controls and potentially additional business logic into a functional unit,
  such as a search result entry, a Template preview "card", or a document "actions" menu (with appropriate logic to hide/show certain
  options that may not be available based on the document's state). Elements are more complex than simple controls, but still require the
  parent to provide some data, control, and business logic.
- `embeds` - Embeds are fully functional "mini-apps". If provided with appropriate configurations (e.g API endpoints and authorization
  details) they can be used to represent entire experiences such as document preview, document signing, or search.

For more information, please refer to the [Verdocs Embeds Documentation](https://developers.verdocs.com/embeds/index.html).

## Styles and Fonts

Most of the widgets in this library specify "Barlow" as the default font, but do not include it as a dependency to keep the package size
as small as possible. To support Barlow in your own app, including the following lines of code in your `<head>` tag:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700&display=swap" rel="stylesheet" />
```

## compomnents.ts fixups

Replace

`import type { JSX } from '@verdocs/web-sdk/components';`

with

`import type { JSX } from '@verdocs/web-sdk/dist/types';`
