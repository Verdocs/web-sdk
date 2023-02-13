import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import TemplateStore from './templateStore';

const pendingNotifications: {resolve: Function; reject: Function}[] = [];
export const loadTemplate = async (endpoint: VerdocsEndpoint, templateId: string, forceReload: boolean = false) => {
  if (!templateId) {
    console.log(`[TEMPLATES] Missing required template ID`);
    throw new Error('Missing required template ID');
  }

  // TODO: This resolves a race condition where multiple components might share the template store and all want to load the same template
  //  at once. It also creates a problem where two components might want DIFFERENT templates. This should be rare because most components
  //  are visually "large" experiences that wouldn't run well in parallel with others anyway. But just to cover the base we may want to
  //  account for that in the future.
  if (TemplateStore.loading) {
    return new Promise((resolve, reject) => {
      pendingNotifications.push({resolve, reject});
    });
  }

  if (templateId === TemplateStore.templateId && !forceReload) {
    return TemplateStore.template;
  }

  TemplateStore.loading = true;
  TemplateStore.template = null;

  try {
    console.log(`[TEMPLATES] Loading template ${templateId}`);
    const template = await getTemplate(endpoint, templateId, true);
    if (!template) {
      console.log('[TEMPLATES] Unable to load template');
      return;
    }

    TemplateStore.loading = false;
    TemplateStore.template = template;
    TemplateStore.templateId = templateId;
    pendingNotifications.forEach(notification => notification.resolve(true));
    pendingNotifications.length = 0;
    return true;
  } catch (e) {
    console.log('[TEMPLATES] Error loading template', e);
    TemplateStore.loading = false;
    pendingNotifications.forEach(notification => notification.reject(e));
    pendingNotifications.length = 0;
    throw e;
  }
};
