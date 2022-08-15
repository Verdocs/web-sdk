// We have a complicated compile stack here with a lot of opinionated frameworks working "together": StencilJS, Storybook,
// Webpack, Rollup, etc. We want to be ESM/TypeScript here in this project but importing recent PDF.js builds broke in
// v2.13 or so. v2.12 still works but their new module format isn't compatible with the rest of these tools. After trying
// many possible fixes we realized the only real issue during the import was the use of pound-style `#privateFunction`
// syntax for private class members. It's allowed for properties but not methods. Here we just rename them with a hack
// while we evaluate better options.
//
// Note: Tried using the "replace" plugin in Rollup but it didn't work. StencilJS uses its own "magic" Rollup config
// and this doesn't seem to allow replace() to run at the right step.

const {readFileSync, writeFileSync} = require('fs');

const privateMethodReplacements = [
  '#ensureObj',
  '#setModified',
  '#serialize',
  '#addKeyboardManager',
  '#removeKeyboardManager',
  '#dispatchUpdateStates',
  '#dispatchUpdateUI',
  '#enableAll',
  '#disableAll',
  '#addEditorToLayer',
  '#isEmpty',
  '#selectEditors',
  '#restoreInitialState',
  '#evaluateVisibilityExpression',
  '#hasTextLayer',
  '#changeParent',
  '#compareElementPositions',
  '#createNewEditor',
  '#createAndAddNewEditor',
  '#cleanup',
  '#updateFontSize',
  '#updateColor',
  '#extractText',
  '#setEditorDimensions',
  '#updateThickness',
  '#updateColor',
  '#updateOpacity',
  '#getInitialBBox',
  '#setStroke',
  '#startDrawing',
  '#draw',
  '#stopDrawing',
  '#redraw',
  '#endDrawing',
  '#createCanvas',
  '#createObserver',
  '#setCanvasDims',
  '#setScaleFactor',
  '#updateTransform',
  '#buildPath2D',
  '#serializePaths',
  '#extractPointsOnBezier',
  '#isAlmostFlat',
  '#getBbox',
  '#getPadding',
  '#fitToContent',
  '#setMinDims',
];

let pdfjs = readFileSync('node_modules/pdfjs-dist/build/pdf.js', 'utf8');
privateMethodReplacements.forEach(replace => {
  const replacement = replace.replace('#', '__');
  pdfjs = pdfjs.replace(new RegExp(replace, 'g'), replacement);
});

writeFileSync('node_modules/pdfjs-dist/build/pdf.js', pdfjs);
