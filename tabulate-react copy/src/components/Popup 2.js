import React from 'react';
import 'regenerator-runtime/runtime'
import './Popup.css';

let tabManager = []

function getStorage() {
    chrome.storage.local.get(['tabs'], function(value) {
        let tabObject = JSON.parse(value["tabs"])
        console.log(tabObject)

        // add new data to tab manager
        for (let i = 0; i < tabObject.length; i++) {
            tabManager.push(tabObject[i])
        }
    })
}
getStorage()

class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    render() {
        return (
            <div>
                <h1>Options</h1>
                <button onClick={() => {this.props.updateTabs(this.props.parseTime, this.props.convertToHour); this.props.switchMode()}} class="button">Go to Tab Manager</button>
            </div>
            
        )
    }    
}


class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_counter: tabManager.length,
        }
    }

 

    render () {
        const rows = this.props.tabs.map((tab, i) => {
            return (
                <tr id="tabRow" key={i}>
                    <td>{this.props.shortenURL(tab.url)}</td>
                    <td>{tab.timestamp}</td>
                    <td><button className="close" data-index={i}>Close</button></td>
                    <td><button className="close" data-index={i}>Bookmark</button></td>
                </tr>
            )
        })

        return (
            <div className="body">
                <h1>Tabulate</h1>
                <button class="button" onClick={this.props.switchMode}>Go to Options</button>
                
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
                <button class="button" onClick={this.stateshow}>Log State</button>
            </div>
        )
    }

    stateshow = () => {
        console.log(this.props.tabs)
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        function getStorage() {
            chrome.storage.local.get(['tabs'], function(value) {
                let tabObject = JSON.parse(value["tabs"])
                console.log(tabObject)
        
                // add new data to tab manager
                for (let i = 0; i < tabObject.length; i++) {
                    tabManager.push(tabObject[i])
                    console.log("run")
                }
            })
        }
        getStorage()
        if (tabManager.length == 0) {
            tabManager = [{id: "", timestamp: "...", url: "no tabs yet..."}] 
        }
        
        this.state = {
            options: false,
            //tabs: [{id: "", timestamp: "...", url: "no tabs yet..."}],
            tabs: tabManager
        }
    }

    render() {
        if (this.state.options) {
            return <Options
            switchMode={this.switchMode}
            shortenURL={this.shortenURL}
            convertToHour={this.convertToHour}
            updateTabs={this.updateState}
            parseTime={this.parseIsoDatetime}

            />
        }
        else {
            return <Popup
            switchMode={this.switchMode}
            tabs={this.state.tabs}
            parseTime={this.parseIsoDatetime}
            updateTabs={this.updateState}
            shortenURL={this.shortenURL}
            convertToHour={this.convertToHour}
            />
        }
    }
    switchMode = () => {
        this.setState(state => ({
            options: !state.options
        }))
        console.log("pressed", this.state.options)
    }


    shortenURL = (url) => {
        let conditions = ['.com', '.org', '.gov', '.edu', '.en', '.net', '.']
        if (url.includes('.com')) {
            let arr = url.split(".com")
            console.log("url", arr[0])
            return arr[0] + ".com"
        }
        return url;
    }


    convertToHour = (seconds) => {
        let arr = (seconds / 3600).toString().split('.')
        if (arr[1] == null) {
            return arr[0] + " hour ago";
        }
        else {
            let decimal = Math.floor((parseFloat("." + arr[1]) * 60))
            console.log(arr[0], decimal)
            return decimal < 10 ? parseInt(arr[0]) + ".0" + decimal + " hours ago" : parseInt(arr[0]) + "." + decimal + " hours ago";

        }
        
    }

    parseIsoDatetime = (dtstr, hourConverter) => {
        let dt = dtstr.split(/[: T-]/).map(parseFloat);
        let converted = new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
        console.log(converted)
        let now = new Date().toISOString()
        now = now.split(/[: T-]/).map(parseFloat);
        now = new Date(now[0], now[1] - 1, now[2], now[3] || 0, now[4] || 0, now[5] || 0, 0);
        console.log(now)
        let seconds = ((now - converted) / 1000);
        return seconds < 60 ? "Less than one minute ago" : seconds >= 60 && seconds < 3600 ? Math.floor((seconds / 60)) + " minutes ago" : seconds >= 3600 && seconds < 86400 ? hourConverter(seconds) : Math.floor(seconds / 86400) + " days ago" 
    }


    updateState = (isoConverter, hourConverter) => {
        console.log(tabManager)
        if (tabManager.length == 0) {
            this.setState(state => ({
                tabs: [{id: "", timestamp: "...", url: "no tabs yet..."}]
            }))
            console.log("empty", tabManager, tabManager.length)
        }
        else {
            console.log(tabManager, "triggered by options")
            for (let i = 0; i < tabManager.length; i++) {
                tabManager[i].timestamp = isoConverter(tabManager[i].timestamp, hourConverter)
            }
            this.setState(state => ({
                tabs: tabManager
            }))
            console.log("full",tabManager)
        }
    }   



}


export default App;