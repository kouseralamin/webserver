/**
 * 
 * @param {string} path 
 * @param {string} method 
 * 
 * @returns {JSON}
 */
function webserver(path, method) {
  const bURL = "http://192.168.0.124:8080";
  return fetch(bURL + path, {method: method}).then(function (value) {
    return value.json();
  })
}

webserver(window.location.hash.substring(1), "GET").then(function(value) {
  console.table(value);
  window.document.body.getElementsByTagName("div")[0].innerText = JSON.stringify(value);
});

addEventListener('hashchange', _ => {
  webserver(window.location.hash.substring(1), "GET").then(function(value) {
    console.table(value);
    window.document.body.getElementsByTagName("div")[0].innerText = JSON.stringify(value);
  });
});
