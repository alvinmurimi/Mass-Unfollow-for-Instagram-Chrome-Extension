{
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const unfollowSomebody = (a,b,c) => {
    const followingButton = document
        .evaluate(`//button[text()="${a}"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue
    if (followingButton) {
        console.log('Found following button. Clicking ...')
        followingButton.click()
        console.log('Clicked following button.')
        let unfollowButton = document.evaluate(`//button[text()="${b}"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        let attempts = 1
        while (attempts < c && !unfollowButton) {
            console.log(`Attempted to find unfollowButton but could not. Retry #${attempts++}`)
            unfollowButton = document.evaluate(`//button[text()="${b}"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        }
        if (attempts < c) {
            console.log('Found unfollow button. Scrolling and clicking ...')
            unfollowButton.scrollIntoView(true)
            unfollowButton.click()
        } else {
            console.log(`Failed after ${c} retries`)
        }
        return false
    }
    return true
}



const unfollowEveryone = async (a,b,c,d) => {
    let shouldStop = false
    while (!shouldStop) {
        shouldStop = unfollowSomebody(a,b,c)
        const unfollowTimeout = d
        console.log(`Waiting ${unfollowTimeout} ms. Should stop: ${shouldStop}.`)
        await timeout(unfollowTimeout)
    }
    console.log('No following.')
}
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    if (msg.type == "input") {
        var start = unfollowEveryone(msg.following, msg.unfollow,3, msg.timeout);
        if(start){
            port.postMessage({ status: "started"});
        }else{
            port.postMessage({ status: "failed"});
        }
    }else if(msg.type == "stop"){
        //stop script
    }
  });
});
}