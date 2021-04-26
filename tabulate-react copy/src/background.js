//Keep track of open tabs by creating a class that tracks the time its opened

let defaultTime = .1;
let timeOut = defaultTime;
let counter = 0;

// Create variable so that it will return from function when the url is the notfication page
let returnFromFunc = true;
let timestamp;
let index;
let id;
let ids = new Set()
let Tabs

shortenURL = (url) => {
  let conditions = ['.com', '.org', '.gov', '.edu', '.en', '.net', '.']
  if (url.includes('.com')) {
      let arr = url.split(".com")
      console.log("url", arr[0])
      return arr[0] + ".com"
  }
  return url;
}

//Finds the original arrays
//UPDATE NEEDED: make sure when the background script refires, it doesn't reset all the tab times -- hasownproperty should work but error check it 
// Can you filter based on duplicates
function queryTabs() {
  chrome.tabs.query({windowType: 'normal'}, function(tabs)
  {
    tabs.forEach(tabs => {
      
      if (tabs.hasOwnProperty('timestamp')) {
        console.log("rejected", tabs)
        return;
      }
      if (findIndex(tabs.id) != -1 && findIndex(tabs.id) != false) {
        console.log("rejected due to already in array")
        return
      }

      tabs.timestamp = new Date()
    })
    console.log(tabs)
    Tabs = tabs;
  });
}
queryTabs()





function updateURL() {
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      console.log("update url function run")
      return tab.url
    })
}

//Handle window opens

chrome.windows.onCreated.addListener(window => {
  console.log("window created")
  
})


// When user takes an action, update global tabs array info
chrome.tabs.onActivated.addListener(tab => {
  console.log("on activated")
  let tempId;
  let windowId;

    chrome.tabs.get(tab.tabId, currentTab => {
      console.log(currentTab.id)
      tempId = currentTab.id
      console.log(tempId)
      index = findIndex(tempId)
      console.log(index)

      //If it is already in global tabs array, update the timestamp
      if (index != -1) {
        Tabs[index].timestamp = new Date;
        console.log("timestamp updated ", Tabs)
        return
      }
      // Find the active tab to add
      chrome.windows.getCurrent(window => {
        console.log(window)
      })
      
      // Update its timestamp
      currentTab.timestamp = new Date()
      // Update the Tabs global object to add new tab
      Tabs[Tabs.length] = currentTab
      console.log(Tabs)
    })
})


  // Listen for any update and manage the url property of tabs object
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    let index = findIndex(tabId)
    console.log("updated", index)
      if (index != -1) {
        Tabs[index].url = tab.url;
        console.log("updated tab through onupdated")
      }
  }) 




// Remove tabs from global tab array if user closes tab
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  let index = findIndex(tabId);
  if (index != -1) {
    console.log("removed")
    Tabs.splice(index, 1)
    
  }
  
})


// Function to find if tab is in global tabs array
function findIndex(id) {
  if (Tabs == null) {
    return false
  }
  console.log(Tabs)
  for (let i = 0; i < Tabs.length; i++) {
    if (id == Tabs[i].id) {
      return i
    }
  }
  // if it is -1 that means that the tab is not in the global array tabs
  return -1 
}



// Handle requests from frontend to bookmark/close/select
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  console.log("message received", request)
  let tabId = Number.parseInt(request[1])
  if (request[0] == "remove") {
    chrome.tabs.remove(tabId)
    console.log("removed from button")
  } 
  else if (request[0] == "bookmark") {
      chrome.bookmarks.create({url: request[2],
        title: request[2]})
        console.log("bookmarked")
  }
  else {
      chrome.tabs.update(tabId, {active: true, highlighted: true})
  }
  
})


chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "tabPort")
  port.onMessage.addListener(function(msg) {
    if (msg.msg == "init") {
      port.postMessage(Tabs)
    }
      
  })
})



