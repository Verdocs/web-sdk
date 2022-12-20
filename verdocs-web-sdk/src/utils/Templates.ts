import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getPageImage} from '@verdocs/js-sdk/Templates/Pages';
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

    const pageUris: Record<number, string> = {};
    for await (let page of TemplateStore.template.pages) {
      console.log('[TEMPLATES] Loading page', page);
      // TODO: Make an endpoint to get all of the pages for a template
      // TODO: When uploading a new template, pre-process its pages into images and comment that the individual page-loader is a utility,
      //  not the primary mechanism.
      const image = await getPageImage(endpoint, templateId, page.sequence);
      // TODO: Make this uri to match the rest of the terminology?
      pageUris[page.sequence] = image.url;
      console.log('[TEMPLATES] Got image Uri', image.url);
      TemplateStore.loadProgress = page.sequence / TemplateStore.template.pages.length;
    }

    TemplateStore.pageUris = pageUris;
    TemplateStore.loadProgress = 100;
    TemplateStore.loading = false;
  } catch (e) {
    console.log('[TEMPLATES] Error loading template', e);
    throw e;
  }
};
