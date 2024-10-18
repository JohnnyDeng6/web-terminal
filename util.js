
export function func() {
    console.log("sup bitsch")
}

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + encodeURIComponent(JSON.stringify(cvalue)) + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();  // Use trim() to remove leading spaces
    if (c.indexOf(name) === 0) {
      let value = c.substring(name.length, c.length);
      try {
        return JSON.parse(value);  // Try to parse the cookie value as JSON
      } catch (e) {
        return value;  // If parsing fails, return it as a string
      }
    }
  }
  return "";
}

export function scrollTop() {
    const terminalBody = document.querySelector('.terminalbody');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

export function commandError(command, path) {
    return command + ": " + path + ": No such file or directory" + '\n';
}

