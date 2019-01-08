import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';
import axios from 'axios';
let socket = {};


class App extends Component {
    constructor() {
        super();
        this.state = {
            inputText: '',
            username: '',
            usernameSet: false,
            messages: []
        }
        this.renderMessages = this.renderMessages.bind(this);
        this.messageWindowRef = React.createRef();
    }
    componentDidMount() {
        const socketPath = window.location.host.split(':')[0];
        socket = io(socketPath + ':3600');
        socket.on('relay message', message => {
            this.createMsg(message);
        });

        axios.get('/messages/get_messages').then(res => {
            this.setState({messages: res.data})
        });
    }
    componentDidUpdate() {
        if (this.messageWindowRef && this.state.usernameSet)
            // console.log(this.messageWindowRef)
            this.messageWindowRef.current.scrollTop = this.messageWindowRef.current.scrollHeight;
    }
    updateInput(e) {
        const { name, value } = e.target;
        this.setState({[name]: value})
    }
    createMsg(message) {
        let { messages } = this.state;
        messages.push(message);
        this.setState({messages});
    }
    sendMsg() {
        socket.emit('send message', {text: this.state.inputText, username: this.state.username});
        this.createMsg({text: this.state.inputText, username: this.state.username});
        this.setState({inputText: ''});
    }
    setUsername() {
        if (this.state.username)
            this.setState({usernameSet: true});
    }
    renderMessages() {
        return this.state.messages.map((message, i) => {
            const messageContent = message.message_text ? message.message_text : message.text;
            return <div key={i} style={{borderBottom: '1px solid black', padding: 5}}><span style={{fontWeight: 'bold'}}>{message.username}</span><br /><br />{messageContent}</div>
        });
    }
    render() {
        return (
            <div className="App">
                {this.state.usernameSet ? 
                    <div>
                        <h1>{this.state.username}</h1>
                        <div className="chat-window" ref={this.messageWindowRef}>
                            {this.renderMessages()}
                        </div>
                        <div className="chat-bar-holder">
                            <input 
                                type="text" 
                                name="inputText" 
                                value={this.state.inputText} 
                                className="chat-bar" 
                                onChange={e => this.updateInput(e)} 
                                onKeyPress={e => {if (e.key === "Enter") this.sendMsg()}}
                            />
                        </div>
                    </div>
                :
                    <input 
                        type="text" 
                        name="username" 
                        value={this.state.username} 
                        className="chat-bar" 
                        onChange={e => this.updateInput(e)} 
                        onKeyPress={e => {if (e.key === "Enter") this.setUsername()}}
                        placeholder="Username"
                    />
                }
            </div>
        );
    }
}

export default App;
