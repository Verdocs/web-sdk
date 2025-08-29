import {IOrganization} from '@verdocs/js-sdk';
import {newSpecPage} from '@stencil/core/testing';
import {VerdocsOrganizationCard} from './verdocs-organization-card';
import {h} from '@stencil/core';

describe('verdocs-organization-card', () => {
  const baseOrg: IOrganization = {
    address: '',
    address2: '',
    contact_email: '',
    parent_id: '',
    phone: '',
    updated_at: '',
    id: 'org1',
    name: 'Test Org',
    thumbnail_url: '',
    full_logo_url: '',
    created_at: '2021-01-01T00:00:00Z',
  };

  it('renders with minimal organization data', async () => {
    const page = await newSpecPage({
      components: [VerdocsOrganizationCard],
      template: () => <verdocs-organization-card organization={{...baseOrg}} />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders with thumbnail and full logo', async () => {
    const org = {
      ...baseOrg,
      thumbnail_url: 'https://example.com/thumb.png',
      full_logo_url: 'https://example.com/logo.png',
    };
    const page = await newSpecPage({
      components: [VerdocsOrganizationCard],
      template: () => <verdocs-organization-card organization={org} />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders with only name', async () => {
    const org: IOrganization = {
      address: '',
      address2: '',
      contact_email: '',
      parent_id: '',
      phone: '',
      updated_at: '',
      id: 'org2',
      name: 'Name Only',
      thumbnail_url: '',
      full_logo_url: '',
      created_at: '2022-02-02T00:00:00Z',
    };
    const page = await newSpecPage({
      components: [VerdocsOrganizationCard],
      template: () => <verdocs-organization-card organization={org} />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
