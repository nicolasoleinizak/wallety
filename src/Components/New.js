import React from 'react'

class New extends React.Component{
    constructor(props){
        super(props);
        this.type = React.createRef();
        this.dateString = React.createRef();
        this.subject = React.createRef();
        this.amount = React.createRef();
        this.create = this.create.bind(this)
        this.reset = this.reset.bind(this)
    }

    create(){
        this.props.uploadNewRecord(
            this.type.current.value,
            new Date(this.dateString.current.value).toUTCString(),
            this.subject.current.value,
            this.amount.current.value
        )
    }

    reset(){
        this.dateString.current.value = this.props.timestampToString(new Date());
        this.subject.current.value = '';
        this.amount.current.value = 0;
    }

    componentDidMount(){
        this.reset()
    }

    render(){
        return(
            <div id="new-record" className="pop-editor" style={this.props.showNew? {}: {display: 'none'}}>
                <div id="new-record-container" className="pop-editor-container">
                    <h2>New record</h2>
                    <form>
                        <select ref={this.type}>
                            <option value="1">Income</option>
                            <option value="0">Expense</option>
                        </select>
                        <label>Date: <input type="date" ref={this.dateString}/></label>
                        <label>Subject: <input type="text" ref={this.subject}/></label>
                        <label>Amount: <input type="number" ref={this.amount}/></label>
                        <input type="button" onClick={this.create} value="Create"/>
                        <input type="button" onClick={this.props.onClose} value="Cancel"/> 
                    </form>
                </div>
            </div>
        )
    }
}

export default New