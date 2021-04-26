import React from 'react';
import 'regenerator-runtime/runtime'
import './notification.css';

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    render() {
        return (
            <div>
                <h1>Reminder</h1>
        <p>Close your tab at url: {}</p>
            </div>
            
        )
    }    
}



export default Notification;