let timestamp,index,id,Tabs,defaultTime=.1,timeOut=defaultTime,counter=0,returnFromFunc=!0,ids=new Set;function queryTabs(){chrome.tabs.query({windowType:"normal"},(function(e){e.forEach((e=>{e.hasOwnProperty("timestamp")?console.log("rejected",e):-1==findIndex(e.id)||0==findIndex(e.id)?e.timestamp=new Date:console.log("rejected due to already in array")})),console.log(e),Tabs=e}))}function updateURL(){chrome.tabs.onUpdated.addListener((function(e,o,n){return console.log("update url function run"),n.url}))}function findIndex(e){if(null==Tabs)return!1;console.log(Tabs);for(let o=0;o<Tabs.length;o++)if(e==Tabs[o].id)return o;return-1}shortenURL=e=>{if(e.includes(".com")){let o=e.split(".com");return console.log("url",o[0]),o[0]+".com"}return e},queryTabs(),chrome.windows.onCreated.addListener((e=>{console.log("window created")})),chrome.tabs.onActivated.addListener((e=>{let o;console.log("on activated"),chrome.tabs.get(e.tabId,(e=>{if(console.log(e.id),o=e.id,console.log(o),index=findIndex(o),console.log(index),-1!=index)return Tabs[index].timestamp=new Date,void console.log("timestamp updated ",Tabs);chrome.windows.getCurrent((e=>{console.log(e)})),e.timestamp=new Date,Tabs[Tabs.length]=e,console.log(Tabs)}))})),chrome.tabs.onUpdated.addListener((function(e,o,n){let t=findIndex(e);console.log("updated",t),-1!=t&&(Tabs[t].url=n.url,console.log("updated tab through onupdated"))})),chrome.tabs.onRemoved.addListener((function(e,o){let n=findIndex(e);-1!=n&&(console.log("removed"),Tabs.splice(n,1))})),chrome.runtime.onMessage.addListener(((e,o,n)=>{console.log("message received",e);let t=Number.parseInt(e[1]);"remove"==e[0]?(chrome.tabs.remove(t),console.log("removed from button")):"bookmark"==e[0]?(chrome.bookmarks.create({url:e[2],title:e[2]}),console.log("bookmarked")):chrome.tabs.update(t,{active:!0,highlighted:!0})})),chrome.runtime.onConnect.addListener((function(e){console.assert("tabPort"==e.name),e.onMessage.addListener((function(o){"init"==o.msg&&e.postMessage(Tabs)}))}));