import './App.css';
import React, {Component , useState} from 'react';
import Web3 from 'web3';



class Bank extends Component {


  render() {
    
    return (
        <div className='d-flex flex-column align-items-center justify-content-center text-warning border-bottom border-3 border-secondary p-2 m-2'>
          <h1 className='fw-bold text-oswald m-1 pt-1'>RUSH TOKEN BANK</h1>
          {/* Div for text */}
          <div>
            <div className='d-md-flex flex-row'>
              <div className='col-2'></div>
                  <p className='text-oswald text-wrap text-light m-1 p-1'>To mint RushToken for yourself, please click mint button. You can mint 1,000,000,000 RushToken per click.
                  </p>

              <div className='col-2'></div>
            </div>
          </div>
          {/* End div for text */}
          <button className="btn btn-warning btn-md fw-bold text-dark text-oswald m-1 p-1" onClick={this.props.mintToken}>MINT TOKEN</button>
        </div>
    );
  }
}

export default Bank;
