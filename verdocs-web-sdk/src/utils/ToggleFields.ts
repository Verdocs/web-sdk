import interact from 'interactjs';
import {ITemplate, ITemplateField, updateField, VerdocsEndpoint} from '@verdocs/js-sdk';
import {getToggleScale} from './utils';
import {VerdocsToast} from './Toast';
import {Store} from './Datastore';

/**
 * Let a builder user resize a checkbox or radio from a single corner grip, keeping its proportions.
 * Edge handles like the text fields use would cover most of a 14pt box and turn drags into resizes.
 */
export const makeToggleFieldResizable = (
  el: HTMLElement,
  options: {sourceid: string; fieldname: string; xscale: number; yscale: number; onSaved: (field: ITemplateField) => void},
) => {
  interact(el).resizable({
    edges: {right: '.resize-grip', bottom: '.resize-grip'},
    modifiers: [interact.modifiers.aspectRatio({ratio: 'preserve'}), interact.modifiers.restrictSize({min: {width: 8, height: 8}})],
    listeners: {
      start(e: any) {
        e.target.dataset.originalBottom = e.target.style.bottom;
      },

      move(e: any) {
        const width = e.rect.width / options.xscale;
        const height = e.rect.height / options.yscale;
        const currentLeft = parseFloat(e.target.style.left);
        const currentBottom = parseFloat(e.target.style.bottom);

        Object.assign(e.target.style, {
          width: `${width}px`,
          height: `${height}px`,
          left: `${currentLeft + e.deltaRect.left}px`,
          bottom: `${currentBottom - e.deltaRect.bottom}px`,
        });
        e.target.style.setProperty('--verdocs-toggle-scale', String(getToggleScale({width, height})));
      },

      async end(e: any) {
        const {sourceid, fieldname} = options;
        const width = Math.round(parseFloat(e.target.style.width));
        const height = Math.round(parseFloat(e.target.style.height));
        const newBottom = parseFloat(e.target.style.bottom);
        const originalBottom = parseFloat(e.target.dataset.originalBottom);

        try {
          const template = await Store.getTemplate(VerdocsEndpoint.getDefault(), sourceid);
          const oldField = template?.fields?.find(field => field.name === fieldname);
          const y = newBottom !== originalBottom ? Math.round(newBottom / options.yscale) : oldField?.y;

          const updatedField = await updateField(VerdocsEndpoint.getDefault(), sourceid, fieldname, {width, height, y});
          // Re-read after the save so another field's change that landed meanwhile isn't overwritten.
          const latest = await Store.getTemplate(VerdocsEndpoint.getDefault(), sourceid);
          const newTemplate = JSON.parse(JSON.stringify(latest)) as ITemplate;
          const fieldIndex = newTemplate.fields.findIndex(field => field.name === fieldname);
          if (fieldIndex > -1) {
            newTemplate.fields[fieldIndex] = updatedField;
          }

          Store.updateTemplate(sourceid, newTemplate);
          options.onSaved(updatedField);
        } catch (err) {
          console.log('[FIELDS] Unable to save resized field', err);
          VerdocsToast(err.response?.data?.error || 'Unable to resize the field. Please try again.', {style: 'error'});
        }
      },
    },
  });
};
