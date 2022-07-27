import './App.css';
import React, {Component , useState} from 'react';
import Identicon from 'react-identicons';

class Navbar extends Component {


  handleDisconnectClick = (event) => {
    event.preventDefault()
    this.props.disconnect()
  }


  render() {
    
    return (
          <nav className="navbar">
            <div className="container-fluid ">
              <a className="d-flex navbar-brand text-light align-items-center justify-content-center" href="#">
                {/* <img src={Chain} alt="" width="30" height="24" className="d-inline-block align-text-top m-1 p-1"></img> */}
                <h1 className='m-1 p-1'><i className='bi bi-bank'></i></h1>
                <p className='d-none d-md-block m-1 p-1 '>RushToken Bank</p>
              </a>
                {this.props.account ?
                <div className='d-md-flex align-items-center justify-content-center text-center'>
                  <p className='m-1 fw-bold text-oswald text-danger'>{this.props.rushTokenBalance}<span className='text-danger'> $RST</span></p>
                  <Identicon className="m-1 d-none d-md-block" string={this.props.account} size={25}></Identicon>
                  <button className='btn btn-sm m-1  btn-primary' onClick={this.handleDisconnectClick}>DISCONNECT</button>
                </div>
                :
                  <button className='btn btn-sm m-1  btn-primary' onClick={this.props.connectWallet}>CONNECT WALLET</button>
                }
            </div>
          </nav>
    );
  }
}

export default Navbar;
