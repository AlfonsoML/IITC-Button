function parse_meta(code) {
  let meta = code.split('\n');

  let is_userscript = false;
  let data = {};
  for (let i = 0; i < meta.length; i++) {
    let line = meta[i];
    if (line.indexOf("==UserScript==") > (- 1)) {
      is_userscript = true;
      continue;
    }
    if (line.indexOf("==/UserScript==") > (- 1)) {
        return data;
    }
    if (is_userscript) {
      line = line.trim();
      let sp = line.split(/\s+/);

      let key = sp[1].replace("@", "");
      let value = sp.slice(2).join(" ");
      if (["name", "id", "version", "description", "updateURL", "downloadURL", "supportURL"].indexOf(key) !== -1) {
        if (data[key]) continue;
        if (key === "description") key = "desc";
        if (key === "name") {
          value = value.replace("IITC plugin: ", "").replace("IITC Plugin: ", "");
        }
        data[key] = value;
      }
    }
  }
  return data;
}

const ajaxGet = (url, parseJSON) => new Promise(resolve => {
  let xhr = null;
  xhr = new XMLHttpRequest();
  if (!xhr) return null;
  xhr.timeout = 5000;
  xhr.open("GET", url+"?"+Date.now(),true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let response = xhr.responseText;
        if (parseJSON) {
          response = JSON.parse(response);
        }
        resolve(response)
      } else {
        resolve(null)
      }
    }
  };
  xhr.send(null);
});