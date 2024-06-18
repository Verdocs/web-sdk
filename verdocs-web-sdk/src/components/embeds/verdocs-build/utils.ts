import {IEnvelopeField, rescale} from '@verdocs/js-sdk';

export function getInputStyle(field: IEnvelopeField, mode, browserType: string) {
  const fontSize = 11;
  let setting = 'setting';
  if (!!field['settings']) {
    setting = 'settings';
  }
  const inputStyle = {
    height: '100%',
    width: '100%',
    background: 'none',
  };
  if ((field[setting] && field[setting].font_size) || field.type === 'date' || field.type === 'signature' || field.type === 'initial' || field.type === 'timestamp') {
    inputStyle['fontSize'] = fontSize + 'px';
    inputStyle['letterSpacing'] = '.3px !important';
  }

  if (field.type === 'dropdown') {
    inputStyle['fontSize'] = '10.8px';
    delete inputStyle.background;
  }

  if (field.type === 'textbox') {
    inputStyle['fontSize'] = fontSize + 'px';
    inputStyle['letterSpacing'] = getLetterSpacing(browserType) + 'px';
  }
  if (field['required']) {
    inputStyle['border'] = '1px solid #cc0000';
  }
  if (field['prepared'] && field['prepared'] === true && mode !== 'prepareview') {
    inputStyle['visibility'] = 'hidden';
  }
  if (field[setting] && field[setting].color) {
    inputStyle['color'] = field[setting].color;
  }
  if (field[setting] && field[setting].upperCase) {
    inputStyle['textTransform'] = 'uppercase';
  }

  if (field[setting] && field[setting].leading > 0) {
    inputStyle['lineHeight'] = `${rescale(1, field[setting].leading + 0.5)}px`;
  } else if (field['leading'] && field['leading'] > 0) {
    inputStyle['lineHeight'] = `${rescale(1, field['leading'] + 0.5)}px`;
  }

  return inputStyle;
}

export function getLetterSpacing(browserType: string) {
  switch (browserType) {
    case 'opera':
      return -0.0018;
    case 'firefox':
      return -0.23594210526315787;
    case 'ie':
      return -0.0019;
    case 'edge':
      return -0.0019;
    case 'chrome':
      return -0.0018;
    case 'safari':
      return -0.0018;
    case 'blink':
      return -0.0018;
    default:
      return -0.0018;
  }
}
