import React from 'react'

class Editor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dateString: 0,
            subject: '',
            amount: 0
        }
        this.save = this.save.bind(this)
        this.dateString = React.createRef()
        this.subject = React.createRef()
        this.amount = React.createRef()
        this.resetForm = this.resetForm.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    getRecordTypeName(type){
        if(type === 0){
            return "Expense";
        }
        else{
            return "Income";
        }
    }

    save(){
        let dateString = new Date(this.dateString.current.value).toUTCString();
        let subject = this.subject.current.value;
        let amount = this.amount.current.value;
        this.props.onSave(dateString, subject, amount);
    }

    resetForm(){
        this.setState({
            dateString: this.props.timestampToString(this.props.record.date * 1000),
            subject: this.props.record.subject,
            amount: this.props.record.amount
        })
    }

    handleChange(event){
        let name = event.target.name;
        let value = event.target.value;
        this.setState(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    render(){
        return(
            <div id="editor" className="pop-editor" style={this.props.showEditor === true? {}:{display: 'none'}}>+
            {this.props.showEditor &&
                <div id="editor-container" className="pop-editor-container">
                    <h2>Edit record</h2>
                    <p>{this.getRecordTypeName(this.props.record.type)}</p>
                    <label>Date: <input type="date" ref={this.dateString} name="dateString" value={this.state.dateString} onChange={this.handleChange}/></label>
                    <label>Subject: <input type="text" ref={this.subject} name="subject" value={this.state.subject} onChange={this.handleChange}/></label>
                    <label>Amount: <input type="number" ref={this.amount} name="amount" value={this.state.amount} onChange={this.handleChange}/></label>
                    <input type="button" value="Save" onClick={this.save} className="block"/>
                    <input type="button" value="Cancel" onClick={this.props.onCloseEditor} className="block"/>
                </div>
            }
            </div>
        )
    }
}

export default Editor