import {IRecipient, VerdocsEndpoint} from '@verdocs/js-sdk';

// TODO: These mirror @verdocs/js-sdk's unreleased QES additions in ../hub/packages/js-sdk (TQesState, TQesResult,
//  getQesState, startQesSession and IRecipient.signature_level). Once the web-sdk depends on that release, import them from
//  there (note js-sdk's startQesSession takes {return_url}) and keep only getQesReturnUrl and consumeQesResult, which need a browser.

/**
 * Where a 'qualified' recipient stands in an envelope's QES phase, which starts once every recipient has submitted.
 */
export type TQesState = 'waiting' | 'ready' | 'in_progress' | 'signed';

export type ERecipientSignatureLevel = 'qualified' | 'advanced' | 'simple';

/**
 * Whether a recipient must finish by signing with their eID (a QES). Released js-sdk versions don't type signature_level.
 */
export const isQualifiedRecipient = (recipient: IRecipient | null | undefined) =>
  (recipient as (IRecipient & {signature_level?: string}) | null | undefined)?.signature_level === 'qualified';

/**
 * Get where the signer stands in the envelope's QES phase, or null if they aren't a 'qualified' recipient.
 */
export const getQesState = (endpoint: VerdocsEndpoint) =>
  endpoint.api //
    .get<{qes_state: TQesState | null}>('/v2/sign/qes/state')
    .then(r => r.data);

/**
 * How the signer came back from eID Easy's page. The API adds it to return_url as the qes_result query parameter.
 */
export type TQesResult = 'signed' | 'fail' | 'cancel';

/**
 * Start the signer's QES session. Returns eID Easy's hosted signing page. eID Easy sends the signer back to return_url
 * (with qes_result added) when they finish, fail or cancel. Without one, the API sends them to their signing link.
 */
export const startQesSession = (endpoint: VerdocsEndpoint, return_url?: string) =>
  endpoint.api //
    .post<{signing_page_url: string}>('/v2/sign/qes/start', {return_url})
    .then(r => r.data);

/**
 * The page eID Easy should send the signer back to: this one, without the qes_result from an earlier attempt.
 */
export const getQesReturnUrl = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('qes_result');
  return url.href;
};

/**
 * Read the qes_result the signer came back with, and remove it from the address bar so a reload doesn't act on it again.
 */
export const consumeQesResult = (): TQesResult | null => {
  const url = new URL(window.location.href);
  const result = url.searchParams.get('qes_result');
  if (!result) {
    return null;
  }

  url.searchParams.delete('qes_result');
  window.history.replaceState(window.history.state, '', url.href);
  return ['signed', 'fail', 'cancel'].includes(result) ? (result as TQesResult) : null;
};
