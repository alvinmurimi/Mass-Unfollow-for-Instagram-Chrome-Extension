{
document.getElementById("btnFollowing").value = "Following";
document.getElementById("btnUnfollow").value = "Unfollow";
document.getElementById("timeout").value = 1000;
document.getElementById("stop").disabled = true;

window.addEventListener('load', (event) => {
    chrome.tabs.executeScript(null,
        { file: 'content.js' },
        connect
    );
});
function connect() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id);
    port.postMessage({ function: 'html' });
    port.onMessage.addListener((response) => {
      html = response.html;
      title = response.title;
      description = response.description;
    });
  });
}
$('.switch').on('click', function(e) {
  if(document.getElementById("checkbox").checked == true){
    document.getElementById("timeout").disabled = true;
  }else{
    document.getElementById("timeout").disabled = false;
  }
});

$('.form').on('submit', function(e) {
  var ms;
  var following = document.getElementById("btnFollowing").value;
  var unfollow = document.getElementById("btnUnfollow").value;
  var time = document.getElementById("timeout");
  document.getElementById("stop").disabled = false;
  
  if(document.getElementById("checkbox").checked == true){
    ms = (Math.floor((Math.random() * 10) + 1) * 1000) + 30000;
  }else{
    ms = document.getElementById("timeout").value;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id);
    port.postMessage({following:following, unfollow:unfollow, timeout:ms, type:"input"});
    port.onMessage.addListener((response) => {
      status = response.status;
      if(status !== "started"){
        console.log("error");
      }
    });
  });
});
$('#stop').on('click', function(e) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id);
    port.postMessage({type:"stop"});
    port.onMessage.addListener((response) => {
      //
    });
  });
});

}



/*
TODO

Error handling for other domains
Auto open followers page if not opened
Stop script without refreshing entire page
 
*/