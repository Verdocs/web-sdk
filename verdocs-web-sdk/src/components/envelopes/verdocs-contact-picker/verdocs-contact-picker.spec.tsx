jest.mock('@verdocs/js-sdk', () => {
  const actualSdk = jest.requireActual('@verdocs/js-sdk');

  class FakeEndpoint {
    static getDefault() {
      return new FakeEndpoint();
    }

    api = {
      get: jest.fn().mockResolvedValue({}),
      post: jest.fn().mockResolvedValue({}),
      put: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    };

    profile = {};
    session = {};

    loadSession() {}

    onSessionChanged() {}
  }

  return {
    ...actualSdk,
    VerdocsEndpoint: FakeEndpoint,
    getActiveEntitlements: jest.fn(),
  };
});

import {h} from '@stencil/core';
import {newSpecPage} from '@stencil/core/testing';
import {getActiveEntitlements} from '@verdocs/js-sdk';
import {VerdocsContactPicker} from './verdocs-contact-picker';

const qesEntitlement = {id: 'ent-1', feature: 'qes'};

const signerRole = {
  role_name: 'Signer',
  first_name: 'Ada',
  last_name: 'Lovelace',
  email: 'ada@example.com',
};

const createPage = async (templateRole: any = signerRole) =>
  newSpecPage({
    components: [VerdocsContactPicker],
    template: () => <verdocs-contact-picker templateRole={templateRole}></verdocs-contact-picker>,
  });

// The pills under the "Signature Level" group label
const getLevelPills = (page: any) => {
  const group = Array.from(page.root.querySelectorAll('.group') as NodeListOf<HTMLElement>).find(
    el => el.querySelector('.group-label')?.textContent === 'Signature Level',
  );
  const [simple, qualified] = Array.from(group.querySelectorAll('button.pill') as NodeListOf<HTMLButtonElement>);
  return {simple, qualified};
};

const listenForNext = (page: any) => {
  const nextSpy = jest.fn();
  page.root.addEventListener('next', nextSpy);
  return nextSpy;
};

const clickDone = async (page: any) => {
  const done = Array.from(page.root.querySelectorAll('verdocs-button') as NodeListOf<HTMLElement>).find(el => el.getAttribute('label') === 'Done');
  done.click();
  await page.waitForChanges();
};

describe('verdocs-contact-picker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    (getActiveEntitlements as jest.Mock).mockResolvedValue({qes: qesEntitlement});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsContactPicker],
      html: '<verdocs-contact-picker></verdocs-contact-picker>',
    });
    expect(page.root).toBeTruthy();
  });

  describe('signature level', () => {
    it('defaults to simple when the role has no signature level', async () => {
      const page = await createPage();
      const {simple, qualified} = getLevelPills(page);
      const expected = 'simple';

      expect((page.rootInstance as VerdocsContactPicker).signatureLevel).toBe(expected);
      expect(simple.getAttribute('aria-pressed')).toBe('true');
      expect(qualified.getAttribute('aria-pressed')).toBe('false');
    });

    it('defaults to simple without a template role', async () => {
      const page = await createPage(null);
      const expected = 'simple';

      expect((page.rootInstance as VerdocsContactPicker).signatureLevel).toBe(expected);
    });

    it('starts on the role signature level', async () => {
      const page = await createPage({...signerRole, signature_level: 'qualified'});
      const {simple, qualified} = getLevelPills(page);
      const expected = 'qualified';

      expect((page.rootInstance as VerdocsContactPicker).signatureLevel).toBe(expected);
      expect(qualified.getAttribute('aria-pressed')).toBe('true');
      expect(simple.getAttribute('aria-pressed')).toBe('false');
    });

    it('keeps a qualified role qualified when the entitlements lack qes', async () => {
      (getActiveEntitlements as jest.Mock).mockResolvedValue({});
      const page = await createPage({...signerRole, signature_level: 'qualified'});
      const {qualified} = getLevelPills(page);
      const expected = 'qualified';

      expect((page.rootInstance as VerdocsContactPicker).signatureLevel).toBe(expected);
      expect(qualified.getAttribute('aria-pressed')).toBe('true');
      // Locked, but still shown as the selection rather than disabled out from under the role
      expect(qualified.classList.contains('locked')).toBe(true);
      expect(qualified.hasAttribute('disabled')).toBe(false);
    });

    it('keeps a qualified role qualified when the entitlements fail to load', async () => {
      (getActiveEntitlements as jest.Mock).mockRejectedValue(new Error('Network error'));
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      const page = await createPage({...signerRole, signature_level: 'qualified'});
      const {qualified} = getLevelPills(page);
      const expected = 'qualified';

      expect((page.rootInstance as VerdocsContactPicker).signatureLevel).toBe(expected);
      expect(qualified.getAttribute('aria-pressed')).toBe('true');
    });

    it('locks the Qualified pill without the qes entitlement', async () => {
      (getActiveEntitlements as jest.Mock).mockResolvedValue({});
      const page = await createPage();
      const {simple, qualified} = getLevelPills(page);

      expect(qualified.classList.contains('locked')).toBe(true);
      expect(qualified.hasAttribute('disabled')).toBe(true);
      expect(qualified.querySelector('.pill-icon')).toBeTruthy();
      expect(simple.classList.contains('locked')).toBe(false);
    });

    it('locks the Qualified pill when the entitlements fail to load', async () => {
      (getActiveEntitlements as jest.Mock).mockRejectedValue(new Error('Network error'));
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      const page = await createPage();
      const {qualified} = getLevelPills(page);

      expect(qualified.classList.contains('locked')).toBe(true);
      expect(qualified.hasAttribute('disabled')).toBe(true);
    });

    it('unlocks the Qualified pill with the qes entitlement', async () => {
      const page = await createPage();
      const {qualified} = getLevelPills(page);

      expect(qualified.classList.contains('locked')).toBe(false);
      expect(qualified.hasAttribute('disabled')).toBe(false);
    });

    it('selects Qualified when its pill is clicked', async () => {
      const page = await createPage();

      getLevelPills(page).qualified.click();
      await page.waitForChanges();

      const {simple, qualified} = getLevelPills(page);
      expect(qualified.getAttribute('aria-pressed')).toBe('true');
      expect(simple.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('next', () => {
    it('includes the default signature level', async () => {
      const page = await createPage();
      const nextSpy = listenForNext(page);
      const expected = 'simple';

      await clickDone(page);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy.mock.calls[0][0].detail.signature_level).toBe(expected);
    });

    it('includes the role signature level', async () => {
      const page = await createPage({...signerRole, signature_level: 'qualified'});
      const nextSpy = listenForNext(page);
      const expected = 'qualified';

      await clickDone(page);

      expect(nextSpy.mock.calls[0][0].detail.signature_level).toBe(expected);
    });

    it('includes a qualified role signature level without the qes entitlement', async () => {
      (getActiveEntitlements as jest.Mock).mockResolvedValue({});
      const page = await createPage({...signerRole, signature_level: 'qualified'});
      const nextSpy = listenForNext(page);
      const expected = 'qualified';

      await clickDone(page);

      expect(nextSpy.mock.calls[0][0].detail.signature_level).toBe(expected);
    });

    it('includes the signature level after switching to Qualified', async () => {
      const page = await createPage();
      const nextSpy = listenForNext(page);
      const expected = 'qualified';

      getLevelPills(page).qualified.click();
      await page.waitForChanges();
      await clickDone(page);

      expect(nextSpy.mock.calls[0][0].detail.signature_level).toBe(expected);
    });

    it('includes the signature level after switching back to Simple', async () => {
      const page = await createPage({...signerRole, signature_level: 'qualified'});
      const nextSpy = listenForNext(page);
      const expected = 'simple';

      getLevelPills(page).simple.click();
      await page.waitForChanges();
      await clickDone(page);

      expect(nextSpy.mock.calls[0][0].detail.signature_level).toBe(expected);
    });
  });
});
