import React from 'react'

class List extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listingType: 1
        }
        this.handleChange = this.handleChange.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }

    getRecordTypeName(type){
        if(type == 0){
            return "Expense";
        }
        else{
            return "Income";
        }
    }

    edit(id){
        this.props.onEdit(id);
    }

    delete(id, index){
        this.props.onDelete(id, index);
    }

    handleChange(event){
        this.setState({
            listingType: event.target.value
        })
    }

    render(){
        return(
            <div id="records-list">
                <div id="record-list-container" className="content">
                    <div className="radio-group">
                        <label className={this.state.listingType == 1? 'checked-label': ''}><input type="radio" name="listingType" value="1" onChange={this.handleChange} checked={this.state.listingType == 1}/>Incomes</label>
                        <label className={this.state.listingType == 0? 'checked-label': ''}><input type="radio" name="listingType" value="0" onChange={this.handleChange} checked={this.state.listingType == 0}/>Expenses</label>
                    </div>
                    <h2>
                        {this.getRecordTypeName(this.state.listingType)}
                    </h2>
                    <div className="records-header">
                        <span>Date</span>
                        <span>Subject</span>
                        <span>Amount</span>
                        <span>Actions</span>
                    </div>
                    {
                        this.props.records.filter( record => {
                            return record.type == this.state.listingType;
                        })
                        .sort( (a, b) => {
                            if(a.date > b.date){
                                return -1;
                            }
                            else{
                                return 1;
                            }
                        })
                        .map( (record, index) => {
                            return(
                                <div className={`record record-type-${record.type}`} key={`record-id-${record.id}`}>
                                    <div>{this.props.timestampToString(record.date * 1000, 1)}</div>
                                    <div>{record.subject}</div>
                                    <div>{record.amount}</div>
                                    <a href="#" className="image-button" onClick={() => {this.edit(record.id)}}><img src="assets/img/icons/editar.png" alt="edit"/></a>
                                    <a href="#" className="image-button" onClick={() => {this.delete(record.id, index)}}><img src="./assets/img/icons/remove.png" alt="remove"/></a>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

}

export default List