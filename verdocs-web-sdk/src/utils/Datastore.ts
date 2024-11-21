import {createStore} from 'tinybase';

export const verdocsStore = createStore();
verdocsStore.setValue('schemaVersion', '1');
verdocsStore.setRow('templates', '1234', {id: '1234', name: 'Test Template'});

console.log('[STORE] Created verdocsStore with schemaVersion', verdocsStore.getValue('schemaVersion'));
console.log('[STORE] Template 1234:', verdocsStore.getRow('templates', '1234'));
