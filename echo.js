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

  var evalWithLocation = envGlobal.evalWithLocation || function evalWithLocation(src) {
      return (0,eval)(src);
  };

  // // defines the init function in this local scope
  // var init = evalWithLocation(fs.readFileSync(path.join(__dirname, './init.js'), 'utf-8'), "init.js", 1);

  const fileURL = browser.runtime.getURL('narcissus/init.js');
  const response = await fetch(fileURL);
  const text = await response.text();

  const init = evalWithLocation(text, 'init.js', 1);

  envGlobal.Narcissus = init(moduleNames, moduleSources, evalWithLocation, envGlobal);
  console.log(envGlobal.Narcissus.interpreter.evaluate(''))
  start();

})(window);

function start(){
  const narcissusTags = document.querySelectorAll('script[type="text/narcissus"]');

  for (let index = 0; index < narcissusTags.length; index++) {
    const script = narcissusTags[index];
    const lines = script.text.trim();
    Narcissus.interpreter.evaluate(lines);
  }
}
