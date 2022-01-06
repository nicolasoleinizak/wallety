import React from "react";
import Editor from './Editor.js'
import New from './New.js'

class Main extends React.Component{
  constructor(props){
      super(props)
      this.state = {
          records: [],
          optionsMenu: 'closed',
          showNew: false,
          showEditor: false,
          editedRecordIndex: 0
      }
      this.editor = React.createRef()
      this.downloadRecords = this.downloadRecords.bind(this);
      this.updateRecords = this.updateRecords.bind(this);
      this.uploadNewRecord = this.uploadNewRecord.bind(this);
      this.openOptionsMenu = this.openOptionsMenu.bind(this);
      this.closeOptionsMenu = this.closeOptionsMenu.bind(this);
      this.save = this.save.bind(this);
      this.editor = React.createRef();
      this.closeEditor = this.closeEditor.bind(this);
      this.new = React.createRef();
      this.openNew = this.openNew.bind(this);
      this.closeNew = this.closeNew.bind(this);
  }
  save(dateString, subject, amount){
    let index = this.state.editedRecordIndex;
    let modifiedRecord = {
      ...this.state.records[index],
      date: this.stringToTimestamp(dateString)/1000,
      subject: subject,
      amount: amount
    }
    this.setState( prevState => {
      return{
        records: prevState.records.slice(0,index).concat(modifiedRecord).concat(prevState.records.slice(index+1)),
        saved: false
      }
    }, () => {
      this.updateRecords()
    })
  }
  async downloadRecords(){
      let headers = new Headers({
        'access-token': this.props.accessToken
      })
      fetch('http://localhost:3001/get_records', {
        method: 'GET',
        headers: headers
      })
      .then((response) => {
        console.log(response)
        response.json().then(jsonData => {
          console.log(jsonData)
          this.setState({
            records: jsonData.data
          })
        })
      })
      .catch(err => console.log(err))
    }

  async uploadNewRecord(type, dateString, subject, amount){
    let headers = new Headers({
      'access-token': this.props.accessToken,
      'Content-Type': 'application/json'
    })
    fetch('http://localhost:3001/create_record', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        type: type,
        date: new Date(dateString) / 1000,
        subject: subject,
        amount: amount
      })
    })
    .then(response => {
      response.json().then(jsonResponse => {
        if(jsonResponse.status === 'HTTP1.0 200 OK'){
          console.log(jsonResponse)
          let newOrder = {
            id: jsonResponse.newOrderId,
            type: type,
            date: new Date(dateString).getTime(),
            subject: subject,
            amount: amount
          }
          console.log(newOrder);
          this.createNewRecord(newOrder)
        }
        else{
          console.log(jsonResponse);
          alert('The record couldn\'t be created.')
        }
      })
    })
    .catch(err => {
      alert('The record couldn\'t be created. Error:'+err)
    })
  }

  createNewRecord({id, type, date, subject, amount}){
    this.setState(prevState => {
      return{
        records: prevState.records.concat({
          id,
          type,
          date: this.timestampToString(date),
          subject,
          amount
        })
      }
    }, () => {
      this.closeNew()
    })
  }
  
  async updateRecords(){
    let headers = new Headers({
      'access-token': this.props.accessToken,
      'Content-Type': 'application/json'
    })
    fetch('http://localhost:3001/update_records', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        data: this.state.records
      })
    })
    .then((response) => {
      response.json().then(jsonResponse => {
        if(jsonResponse.status === 'HTTP1.0 200 OK'){
          this.setState({
            saved: true,
            showEditor: false
          })
        }
        else{
          alert("The data couldn't be saved")
        }
      })
    })
    .catch(err => {console.log(err)})
  }

  async deleteRecord(id, index){
    let headers = new Headers({
      'access-token': this.props.accessToken,
      'Content-Type': 'application/json'
    })
    fetch('http://localhost:3001/delete_record?id='+id, {
      method: 'delete',
      headers: headers
    })
    .then(response => {
      if(response.status === 200){
        this.setState((prevState) => {
          return {
            records: prevState.records.slice(0, index).concat(prevState.records.slice(index+1))
          }
        })
      }
      response.json().then(jsonResponse => {
        console.log(jsonResponse)
      })
    })
  }

  openOptionsMenu(){
    this.setState({
      optionsMenu: 'open'
    })
  }
  
  closeOptionsMenu(){
    this.setState({
      optionsMenu: 'closed'
    })
  }
  
  openEditor(index){
    this.setState({
      editedRecordIndex: index,
      showEditor: true
    }, () => {
      this.editor.current.resetForm();
    })
  }
  
  closeEditor(){
    this.setState({
      showEditor: false
    })
  }

  openNew(){
    this.setState({
      showNew: true
    })
  }

  closeNew(){
    this.setState({
      showNew: false
    }, () => {
      this.new.current.reset()
    })
  }

  timestampToString(msTimestamp){
    let date = new Date(msTimestamp);
    let year = date.getUTCFullYear()
    let month = ("0" + (date.getUTCMonth()+1)).slice(-2);
    let day = ("0" + (date.getUTCDate())).slice(-2);
    return year + "-" + month + "-" + day;
  }
  
  stringToTimestamp(dateString){
    return new Date(dateString).valueOf()
  }
  
  componentDidMount(){
    console.log("mounted main")
    console.log(this.state.showEditor)
      if(this.props.accessToken){
          this.downloadRecords()
      }
  }
  
  render(){
    return(
      <div id="main">
              <header>
                  <h1>Presupuesto</h1>
                <nav id="main-menu">
                    <ul>
                        <li><a className="image-button"><img src="./assets/img/icons/casa.png" alt="home"/></a></li>
                        <li><a className="image-button"><img src="./assets/img/icons/portapapeles.png" alt="records"/></a></li>
                        <li><a className="image-button" onClick={this.openNew}><img src="./assets/img/icons/mas.png" alt="new record"/></a></li>
                        <li><a className="image-button" onClick={this.openOptionsMenu}><img src="./assets/img/icons/settings.png" alt="options"/></a></li>
                    </ul>
                </nav>
                <nav style={this.state.optionsMenu === 'closed'? {display: 'none'}:{}}>
                  <ul id="options-menu">
                    <li><a href="#" className="a-button block">Logout</a></li>
                    <li><a href="#" className="a-button block" onClick={this.closeOptionsMenu}>Close menu</a></li>
                  </ul>
                </nav>
              </header>
              <div className="content">
                <div className="records-list">
                    <h2>Records</h2>
                    {
                        this.state.records.map( (record, index) => {
                            return(
                                <div className={`record record-type-${record.type}`} key={`record-id-${record.id}`}>
                                    <input type="date" value={this.timestampToString(record.date * 1000)} readOnly/>
                                    <div>{record.subject}</div>
                                    <div>{record.amount}</div>
                                    <a href="#" className="image-button" onClick={() => {this.openEditor(index)}}><img src="assets/img/icons/editar.png" alt="edit"/></a>
                                    <a href="#" className="image-button" onClick={() => {this.deleteRecord(record.id, index)}}><img src="./assets/img/icons/remove.png" alt="remove"/></a>
                                </div>
                            )
                        })
                    }
                </div>
                <Editor ref={this.editor} timestampToString={this.timestampToString} showEditor={this.state.showEditor} record={this.state.records[this.state.editedRecordIndex]} onSave={this.save} onCloseEditor={this.closeEditor} timestampToString={this.timestampToString}/>
                <New ref={this.new} showNew={this.state.showNew} stringToTimestamp={this.stringToTimestamp} timestampToString={this.timestampToString} uploadNewRecord={this.uploadNewRecord} onClose={this.closeNew}/>
              </div>
          </div>
      )
  }
}

export default Main