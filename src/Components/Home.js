import React from 'react'

class Home extends React.Component{
    constructor(props){
        super(props);
        this.setState({
          totalIncome: 0,
          totalExpense: 0
        })
    }

    edit(id){
        this.props.onEdit(id);
    }

    delete(id, index){
        this.props.onDelete(id, index);
    }

    getLastRecords(quantity){
      return this.props.records.sort((a, b) => {
        if(a.date > b.date){
          return -1;
        }
        else if(b.date > a.date){
          return 1;
        }
      }).filter((record, index) => {
        return index < quantity;
      })
    }

    amountSum(type){
        if(this.props.records.length > 0){
            return this.props.records.reduce((sum, record) => {
            if(record.type == type){
                return sum + parseInt(record.amount)
            }
            else {
                return sum
            }
            }, 0)
        }
        else{
            return 0
        }
    }

    render(){
        return(
            <div id="home" className="content">
                <div id="balance" className={`${this.amountSum(1)-this.amountSum(0) < 0? 'negative':'positive'}-balance`}>Current balance: <span id="balance-amount">${this.amountSum(1) - this.amountSum(0)}</span></div>
                <div className="records-list">
                    <h2>Last {this.props.itemsdisplayed} records</h2>
                    <div className="records-header">
                        <span>Date</span>
                        <span>Subject</span>
                        <span>Amount</span>
                        <span>Actions</span>
                    </div>
                    {
                        this.getLastRecords(10).map( (record, index) => {
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

export default Home