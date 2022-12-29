import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import TemplateStore from './templateStore';

export const loadTemplate = async (endpoint: VerdocsEndpoint, templateId: string) => {
  TemplateStore.template = null;

  if (!templateId) {
    console.log(`[TEMPLATES] Missing required template ID`);
    return;
  }

  TemplateStore.loading = true;

  try {
    console.log(`[TEMPLATES] Loading template ${templateId}`);
    const template = await getTemplate(endpoint, templateId);
    if (!template) {
      console.log('[TEMPLATES] Unable to load template');
      return;
    }

    TemplateStore.template = template;
    TemplateStore.loading = false;
  } catch (e) {
    console.log('[TEMPLATES] Error loading template', e);
    throw e;
  }
};
