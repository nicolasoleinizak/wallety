import React from "react";

class Main extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            records: []
        }
        this.downloadRecords = this.downloadRecords.bind(this);
        this.updateRecords = this.updateRecords.bind(this);
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
          response.json().then(jsonData => {
            console.log(jsonData)
            this.setState({
              records: jsonData.data
            })
          })
        })
        .catch(err => console.log(err))
      }
    
      async updateRecords(){
        let headers = new Headers({
          'access-token': this.props.accessToken,
          'Content-Type': 'application/json'
        })
        fetch('http://localhost:3001/update_records', {
          method: 'POST',
          headers: headers,
          body: {
            data: this.state.records
          }
        })
        .then((response) => {
          response.json().then(jsonResponse => {
            if(response.status === 200){
              this.setState({
                saved: true
              })
            }
            else{
              alert("The data couldn't be saved")
            }
          })
        })
      }

      timestampToDate(timestamp){
          let date = new Date(timestamp * 1000)
          return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDay()
      }

      componentDidMount(){
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
                            <li><a className="image-button"><img src="./assets/img/icons/mas.png" alt="new record"/></a></li>
                            <li><a className="image-button"><img src="./assets/img/icons/settings.png" alt="options"/></a></li>
                        </ul>
                    </nav>
                  </header>
                  <div className="content">

                    <div className="records-list">
                        <h2>Records</h2>
                        {
                            this.state.records.map( record => {
                                return(
                                    <div className={`record record-type-${record.type}`} key={`record-id-${record.id}`}>
                                        <div>{this.timestampToDate(record.date)}</div>
                                        <div>{record.subject}</div>
                                        <div>{record.amount}</div>
                                        <a className="image-button"><img src="./assets/img/icons/remove.png" alt="remove"/></a>
                                    </div>
                                )
                            })
                        }
                    </div>
                  </div>
              </div>
          )
      }

}

export default Main