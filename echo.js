// (async function(){
//   const fileURL = browser.runtime.getURL('narcissus/lib/' + 'options' + '.js');
//   const response = await fetch(fileURL);
//   const text = await response.text();
//   console.log(text);
// })();
(async function(envGlobal) {
  var moduleNames = [
      "options",
      "definitions",
      "lexer",
      "parser",
      "decompiler",
      "resolver",
      "desugaring",
      "bytecode",
      "interpreter"
  ];

  const moduleSources = [];

  for (let index = 0; index < moduleNames.length; index++) {
    const moduleName = moduleNames[index];
    const fileURL = browser.runtime.getURL('narcissus/lib/' + moduleName + '.js');
    const response = await fetch(fileURL);
    const text = await response.text();
    moduleSources.push(text);
  }

  const evalWithLocation = envGlobal.evalWithLocation || function evalWithLocation(src) {
      return (0,eval)(src);
  };

  const fileURL = browser.runtime.getURL('narcissus/init.js');
  const response = await fetch(fileURL);
  const text = await response.text();

  const init = evalWithLocation(text, 'init.js', 1);

  envGlobal.Narcissus = init(moduleNames, moduleSources, evalWithLocation, envGlobal);
  envGlobal.Narcissus.interpreter.global.document = document;
  envGlobal.windowEval = envGlobal.eval;
  start();
  nativeDomListeners();
})(window);

function start(){
  const narcissusTags = document.querySelectorAll('script[type="text/narcissus"]');
  for (let index = 0; index < narcissusTags.length; index++) {
    const script = narcissusTags[index];
    if (script.src !== undefined) continue;
    const lines = script.text.trim();
    Narcissus.interpreter.evaluate(lines);
  }
  for (let index = 0; index < narcissusTags.length; index++) {
    const script = narcissusTags[index];
    if (script.src !== undefined) {
      fetch(script.src)
        .then(response => response.text())
        .then(text => {
          const lines = text.trim();
          Narcissus.interpreter.evaluate(lines);
        })
        .catch(error => {
          console.error('Error fetching and interpreting script:', error);
        });
    }
  }

}

// Generate unique ids for tagging elements without ids
const generateUniqueId = (function() {
  let id=0;
  return function() {
    return "narcUid" + id++;
  }
})();

function nativeDomListeners () {
  const actions = [ 'abort', 'blur', 'change', 'click', 'dblclick', 'error',
      'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mouseup',
      'mouseout', 'mouseover', 'mousemove', 'reset', 'resize', 'select', 'submit', 'unload' ];
  const elems = document.getElementsByTagName('*');
  for (let i=0; i<elems.length; i++) {
    let elem = elems[i];
    for (let j=0; j<actions.length; j++) {
      let action = actions[j];
      if (elem['on' + action]) {
        (function() {
          if(!elem.id) {
            let newId = generateUniqueId();
            elem.setAttribute('id', newId)
          }
          let fun = function(evnt){
            Narcissus.interpreter.global.event = evnt;
            elem['on' + action].apply(elem, [evnt]);
            Narcissus.interpreter.global.event = undefined;
          };
          elem.addEventListener(action, fun, false);
          // Execute load immediately
          if (action === "load") {
            fun();
          }
        })();
      }
    }
  }
}

function taintInputElements(){
  const inputElements = document.getElementsByTagName('input');
  for (let i = 0; i < inputElements.length; i++){
    let inputElement = inputElements[i];
    inputElement.addEventListener('change', function(event){
      Narcissus.interpreter.global.event = event;
      inputElement.isTainted(true);
      Narcissus.interpreter.global.event = undefined;
    });
  }
  const textElements = document.getElementsByTagName('textarea');
  for (let i = 0; i < inputElements.length; i++){
    let textAreaElement = inputElements[i];
    textAreaElement.addEventListener('change', function(event){
      Narcissus.interpreter.global.event = event;
      textAreaElement.isTainted(true);
      Narcissus.interpreter.global.event = undefined;
    });
  }
}
