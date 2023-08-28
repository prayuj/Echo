const ALERT_REGEX = /^\s*alert\s+'([^0-9']+)'/;
const TIMEOUT_REGEX = /^\s*in\s+(\d+)\s+seconds\s+do\s+(.+)/;

function customInterpreter(code) {
    const lines = code.split(';');

    for (const line of lines) {
      console.log({line})
        if (line.match(ALERT_REGEX)) {
            const message = line.match(ALERT_REGEX);
            if (message && message[1]) {
              alert(message[1]);
            }
          }
        else if (line.match(TIMEOUT_REGEX)) {
            const match = line.match(TIMEOUT_REGEX)
            const seconds = parseInt(match[1]);
            const command = match[2];
            console.log(seconds, command);
            setTimeout(customInterpreter.bind(this, command.trim()), seconds * 1000);
        }
    }
  }

const narcissusTags = document.querySelectorAll('script[type="text/narcissus"]');

for (let index = 0; index < narcissusTags.length; index++) {
    const script = narcissusTags[index];
    const lines = script.text.trim();
    customInterpreter(lines);
}

