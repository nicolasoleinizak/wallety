import React from "react";
import Editor from './Editor.js'
import New from './New.js'
import Home from './Home.js'
import List from './List.js'

class Main extends React.Component{
  constructor(props){
      super(props)
      this.state = {
          records: [],
          optionsMenu: 'closed',
          showNew: false,
          showEditor: false,
          editedRecordIndex: 0,
          itemsdisplayed: 10,
          view: 'Home'
      }
      this.editor = React.createRef()
      this.downloadRecords = this.downloadRecords.bind(this);
      this.updateRecords = this.updateRecords.bind(this);
      this.uploadNewRecord = this.uploadNewRecord.bind(this);
      this.deleteRecord = this.deleteRecord.bind(this);
      this.openOptionsMenu = this.openOptionsMenu.bind(this);
      this.closeOptionsMenu = this.closeOptionsMenu.bind(this);
      this.save = this.save.bind(this);
      this.editor = React.createRef();
      this.openEditor = this.openEditor.bind(this);
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
      response.json().then(jsonResults => {
        console.log(jsonResults)
        if(jsonResults.status === 'HTTP1.0 200 OK'){
          this.setState({
            records: jsonResults.data,
          })
        }
        else if(jsonResults.message === 'Invalid token'){
          this.props.logout()
        }
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
        date: this.stringToTimestamp(dateString) / 1000,
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
            date: this.stringToTimestamp(dateString) / 1000,
            subject: subject,
            amount: amount
          }
          console.log(newOrder)
          this.createNewRecord(newOrder);
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
          id: id,
          type: type,
          date: date,
          subject: subject,
          amount: amount
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
            records: prevState.records.filter( record => {
              return record.id != id;
            })
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
  
  openEditor(id){
    let index = this.state.records.findIndex( record => {
      return record.id === id;
    })
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

  timestampToString(msTimestamp, format = 0){
    let date = new Date(msTimestamp);
    let year = date.getUTCFullYear()
    let month = ("0" + (date.getUTCMonth()+1)).slice(-2);
    let day = ("0" + (date.getUTCDate())).slice(-2);
    if(format == 0){
      return year + "-" + month + "-" + day;
    }
    else if(format == 1){
      return day + "-" + month + "-" + year;
    }
  }

  stringToTimestamp(dateString){
    return new Date(dateString).valueOf()
  }

  selectView(view){
    this.setState({
      view: view
    })
  }
  
  componentDidMount(){
    if(this.props.accessToken){
        this.downloadRecords()
    }
  }
  
  render(){
    
    let view = () => {
      switch(this.state.view){
        case 'Home':
          return(
            <Home records={this.state.records} itemsDisplayed={this.state.itemsdisplayed} totalIncome={this.state.totalIncome} totalExpense={this.state.totalExpense} timestampToString={this.timestampToString} onEdit={this.openEditor} onDelete={this.deleteRecord}/>
          )
          break;
        case 'List':
          return(
            <List records={this.state.records} timestampToString={this.timestampToString} onEdit={this.openEditor} onDelete={this.deleteRecord}/>
          )
      }
    }

    return(
      <div id="main">
        <header>
          <h1 id="site-name">Wallety</h1>
          <nav id="main-menu">
              <ul>
                  <li><a className="image-button" onClick={() => {this.selectView('Home')}}><img src="./assets/img/icons/casa.png" alt="home"/></a></li>
                  <li><a className="image-button" onClick={() => {this.selectView('List')}}><img src="./assets/img/icons/portapapeles.png" alt="records"/></a></li>
                  <li><a className="image-button" onClick={this.openNew}><img src="./assets/img/icons/mas.png" alt="new record"/></a></li>
                  <li><a className="image-button" onClick={this.openOptionsMenu}><img src="./assets/img/icons/settings.png" alt="options"/></a></li>
              </ul>
          </nav>
          <nav style={this.state.optionsMenu === 'closed'? {display: 'none'}:{}}>
            <ul id="options-menu">
              <li><a href="#" className="a-button block" onClick={this.props.logout}>Logout</a></li>
              <li><a href="#" className="a-button block" onClick={this.closeOptionsMenu}>x</a></li>
            </ul>
          </nav>
        </header>
        {
          view()
        }
        <Editor ref={this.editor} timestampToString={this.timestampToString} showEditor={this.state.showEditor} record={this.state.records[this.state.editedRecordIndex]} onSave={this.save} onCloseEditor={this.closeEditor} timestampToString={this.timestampToString}/>
        <New ref={this.new} showNew={this.state.showNew} stringToTimestamp={this.stringToTimestamp} timestampToString={this.timestampToString} uploadNewRecord={this.uploadNewRecord} onClose={this.closeNew}/>
        </div>
      )
  }
}

export default Main