window.onload = (_) => {
  fetch("http://192.168.0.104:8080/").then(function(value) {
    return value.json();
  }).then(function(data) {
    console.log(data);
  });
};