import React from 'react';
import 'regenerator-runtime/runtime'
import './Popup.css';


class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reminder: undefined,
            hours: undefined,
            minutes: undefined,
        }
    }
    render() {
        return (
            <div>
                <h1>Options</h1>
                <button onClick={this.props.switchMode} className="button">Go to Tab Manager</button>
                <br/>
                <br/>
  
                <div id="reminderBlock">
                    <form onSubmit={this.reminderHandler}>
                        Set a reminder for every: {'   '} 
                        <br/>
                            <input onChange={this.handleInputs} className="reminderInput" name="hours" type="number" min="0" max="72" placeholder=""></input> <label>hrs</label>
                            <br/>
                            <input onChange={this.handleInputs} className="reminderInput" name="minutes" type="number" min="0" max="59" placeholder=""></input> <label>min</label>
                            <br/>
                        <input type="submit" id="setBtn" className="close"/>
                    </form>
                </div>
            </div>
            
        )
    }
    stateShow = () => {
        console.log("pressed")
        console.log(this.state.reminder)
    }    

    handleInputs = (event) => {
        let nam = event.target.name
        let val = event.target.value
        this.setState({[nam] : val})
    }

    reminderHandler = (event) => {
        let time = (Number.parseInt(this.state.hours) * 60) + Number.parseInt(this.state.minutes)
        chrome.runtime.sendMessage(["reminder", time])
    }


}

// If tab is active, write opened instead of the time last opened

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render () {
        
        
        const rows = this.props.tabs.map((tab, i) => {
            return (
                <tr id="tabRow" key={i}>
                    <td className="url" title={this.shortenString(tab.title)} key={i} data-index={i} onClick={this.selectTab} >{this.props.shortenURL(tab.url)}</td>
                    <td>{this.parseIsoDatetime(tab.timestamp)}</td>
                    <td><button className="close" data-index={i} onClick={this.closeTab}>Close</button></td>
                    <td><button className="close" data-index={i} onClick={this.bookmark}>Bookmark</button></td>
                </tr>
            )
        })

        return (
            <div className="body">
                <h1>Tabulate</h1>
                <button className="button" onClick={this.props.switchMode}>Go to Options</button>
                {/*<button className="button" onClick={this.stateShow}>Show State</button>*/}
                <br/>
                <br/>
                
                <table>
                    <thead>
                        <tr>
                            <th>Url</th>
                            <th id="lastOpened">Last Opened</th>
                        </tr>
                    </thead>
                    <tbody id="tbody">
                        {rows}
                    </tbody>
                </table>
                <br/>
                <br/>
                <br/>
                {/*<button className="close" onClick={this.openSeparate}>Open in Separate Window</button>*/}
            </div>
        )
    }

    
    //Log state
    stateShow = () => {
        console.log(this.props.tabs)
    }

    shortenString = (str) => {
        return str == "New Tab" ? "" : str.length < 60 ? str : str.substring(0, 85) + "..."
    }


    openSeparate = () => {
        chrome.windows.create({ 
            url: chrome.runtime.getURL("popup.html"), 
            focused: true, 
            type: "popup",
            height: 450, 
            width: 500,
          });
    }

 
    // Handle Tab Manipulation Buttons

    selectTab = (event) => {
        console.log(event.target.dataset.index)
        let tabId = this.props.tabs[event.target.dataset.index].id
        let windowId = this.props.tabs[event.target.dataset.index].windowId
        let urlTemp = this.props.tabs[event.target.dataset.index].url
        chrome.runtime.sendMessage(["select", tabId, urlTemp, windowId])
    }

    closeTab = (event) => {
        let index = event.target.dataset.index
        let tabId = this.props.tabs[index].id
        let urlTemp = this.props.tabs[index].url
        chrome.runtime.sendMessage(["remove", tabId, urlTemp, urlTemp])
        console.log("button clicked")
        this.props.updateState(index, "remove")
        
    }

    bookmark = (event) => {
        let tabId = this.props.tabs[event.target.dataset.index].id
        let urlTemp = this.props.tabs[event.target.dataset.index].url
        chrome.runtime.sendMessage(["bookmark", tabId, urlTemp])
        console.log("button clicked") 
    }

    //Calculate time functions

    parseIsoDatetime = (dtstr) => {
        let dt = dtstr.split(/[: T-]/).map(parseFloat);
        let converted = new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
        console.log(converted)
        let now = new Date().toISOString()
        now = now.split(/[: T-]/).map(parseFloat);
        now = new Date(now[0], now[1] - 1, now[2], now[3] || 0, now[4] || 0, now[5] || 0, 0);
        console.log(now)
        let seconds = ((now - converted) / 1000);
        return seconds < 60 ? "Less than 1 min ago" : seconds >= 60 && seconds < 3600 ? Math.floor((seconds / 60)) + " min ago" : seconds >= 3600 && seconds < 86400 ? this.hourConverter(seconds) : Math.floor(seconds / 86400) + " days ago" 
    }

    
    hourConverter = (seconds) => {
            let arr = (seconds / 3600).toString().split('.')
            let hour = parseInt(arr[0])
            let minutes = parseInt(arr[1])
            console.log(minutes)
            // Condition for exactly 1 hour 
            if (isNaN(minutes) && hour == 1) {
                return hour + " hour ago";
            }
            // Condition for a whole hour above 1 hour
            else if (minutes == 0 && hour > 1) {
                return hour + " hours ago"
            }
            // Condition for mixed hours and minutes
            else {
                let minutes = Math.floor((parseFloat("." + arr[1]) * 60))
                return hour == 1 ? `${hour} hr ${minutes} min ago` : `${hour} hrs ${minutes} min ago`
            }
    }
         
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: false,
            tabs: []

        }
    }

    componentDidMount() {
        let tabManager 
        let port = chrome.runtime.connect({name: "tabPort"})
        port.postMessage({msg: "init"})
        port.onMessage.addListener(msg => {
            console.log("from message", msg)
            this.setState({tabs: msg})
        })
    }


   

    render() {
        if (this.state.options) {
            return <Options
            switchMode={this.switchMode}
            tabs={this.state.tabs}


            />
        }
        else {
            return <Popup
            switchMode={this.switchMode}
            tabs={this.state.tabs}
            shortenURL={this.shortenURL}
            updateState={this.updateState}
            />
        }
    }

    //Switch from options and tab manager
    switchMode = () => {
        this.setState(state => ({
            options: !state.options
        }))
        console.log("pressed", this.state.options)
    }


    shortenURL = (url) => {
        if (!url.includes(".")) {
            return url
        }
        console.log("before", url)
        var regex = /\/\/([^\/,\s]+\.[^\/,\s]+?)(?=\/|,|\s|$|\?|#)/g;
        let match = regex.exec(url)
        return match[1]
    }

    updateState = (index, type) => {
        console.log(index, type)
        let tabsCopy = this.state.tabs;
        if (type == "remove") {
            tabsCopy.splice(index, 1)
            console.log(tabsCopy)
            this.setState({
                tabs: tabsCopy
            })
        }
    }

}


export default App;