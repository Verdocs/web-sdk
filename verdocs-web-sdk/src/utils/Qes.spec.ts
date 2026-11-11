import {consumeQesResult, getQesReturnUrl, getQesState, isQualifiedRecipient, startQesSession} from './Qes';

const createEndpoint = (data: any = {}) =>
  ({
    api: {
      get: jest.fn().mockResolvedValue({data}),
      post: jest.fn().mockResolvedValue({data}),
    },
  }) as any;

describe('Qes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    window.location.href = 'http://mockdoc.stenciljs.com/';
  });

  describe('isQualifiedRecipient', () => {
    it('is true for a qualified recipient', () => {
      expect(isQualifiedRecipient({signature_level: 'qualified'} as any)).toBe(true);
    });

    it('is false for other signature levels', () => {
      const expected = false;

      expect(isQualifiedRecipient({signature_level: 'simple'} as any)).toBe(expected);
      expect(isQualifiedRecipient({signature_level: 'advanced'} as any)).toBe(expected);
      expect(isQualifiedRecipient({} as any)).toBe(expected);
    });

    it('is false for a missing recipient', () => {
      const expected = false;

      expect(isQualifiedRecipient(null)).toBe(expected);
      expect(isQualifiedRecipient(undefined)).toBe(expected);
    });
  });

  describe('getQesReturnUrl', () => {
    it('removes qes_result but keeps the other params', () => {
      window.location.href = 'https://app.example.com/sign/env-1/role-1?invite=abc&qes_result=cancel&theme=dark#top';
      const expected = 'https://app.example.com/sign/env-1/role-1?invite=abc&theme=dark#top';

      expect(getQesReturnUrl()).toBe(expected);
    });

    it('returns the current page unchanged without a qes_result', () => {
      window.location.href = 'https://app.example.com/sign/env-1/role-1?invite=abc';
      const expected = 'https://app.example.com/sign/env-1/role-1?invite=abc';

      expect(getQesReturnUrl()).toBe(expected);
    });
  });

  describe('consumeQesResult', () => {
    it.each(['signed', 'fail', 'cancel'])('returns %s', result => {
      window.location.href = `https://app.example.com/sign?invite=abc&qes_result=${result}`;

      expect(consumeQesResult()).toBe(result);
    });

    it('returns null without a qes_result and leaves the address bar alone', () => {
      window.location.href = 'https://app.example.com/sign?invite=abc';
      const replaceState = jest.spyOn(window.history, 'replaceState');

      expect(consumeQesResult()).toBeNull();
      expect(replaceState).not.toHaveBeenCalled();
    });

    it('returns null for an unknown qes_result', () => {
      window.location.href = 'https://app.example.com/sign?invite=abc&qes_result=bogus';

      expect(consumeQesResult()).toBeNull();
    });

    it('removes qes_result from the address bar, keeping the other params', () => {
      window.location.href = 'https://app.example.com/sign?invite=abc&qes_result=signed&theme=dark';
      const replaceState = jest.spyOn(window.history, 'replaceState');
      const expected = 'https://app.example.com/sign?invite=abc&theme=dark';

      consumeQesResult();

      expect(replaceState).toHaveBeenCalledTimes(1);
      expect(replaceState.mock.calls[0][2]).toBe(expected);
    });

    it('removes an unknown qes_result from the address bar too', () => {
      window.location.href = 'https://app.example.com/sign?qes_result=bogus';
      const replaceState = jest.spyOn(window.history, 'replaceState');
      const expected = 'https://app.example.com/sign';

      consumeQesResult();

      expect(replaceState.mock.calls[0][2]).toBe(expected);
    });
  });

  describe('getQesState', () => {
    it('gets the signer state from /v2/sign/qes/state', async () => {
      const endpoint = createEndpoint({qes_state: 'ready'});
      const expected = {qes_state: 'ready'};

      const result = await getQesState(endpoint);

      expect(endpoint.api.get).toHaveBeenCalledWith('/v2/sign/qes/state');
      expect(result).toEqual(expected);
    });

    it('passes through a null state for non-qualified signers', async () => {
      const endpoint = createEndpoint({qes_state: null});
      const expected = {qes_state: null};

      expect(await getQesState(endpoint)).toEqual(expected);
    });
  });

  describe('startQesSession', () => {
    it('posts the return url to /v2/sign/qes/start', async () => {
      const endpoint = createEndpoint({signing_page_url: 'https://eideasy.example.com/sign/123'});
      const expected = {signing_page_url: 'https://eideasy.example.com/sign/123'};

      const result = await startQesSession(endpoint, 'https://app.example.com/sign?invite=abc');

      expect(endpoint.api.post).toHaveBeenCalledWith('/v2/sign/qes/start', {return_url: 'https://app.example.com/sign?invite=abc'});
      expect(result).toEqual(expected);
    });

    it('posts an undefined return url when none is given', async () => {
      const endpoint = createEndpoint({signing_page_url: 'https://eideasy.example.com/sign/123'});

      await startQesSession(endpoint);

      expect(endpoint.api.post).toHaveBeenCalledWith('/v2/sign/qes/start', {return_url: undefined});
    });
  });
});
