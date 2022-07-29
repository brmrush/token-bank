import './App.css';
import React, {Component , useState} from 'react';
import Web3 from 'web3';
import RushToken from './abis/RushToken.json';
// import RushBank from './abis/RushBank.json';
import RushStake from './abis/RushStake.json';

import Bank from './Bank.js';
import Navbar from './Navbar.js';
import Staking from './Staking.js';

class App extends Component {

  componentDidMount = async () => {
    const saved = window.localStorage.getItem("account");
    const initialValue = saved;
    if (initialValue) {
      await this.connectWallet()
    }
  }

  connectWallet = async () => {
    await this.loadWeb3()
    await this.loadRushTokenContract()
    await this.loadRushStakeContract()
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    window.localStorage.setItem("account", accounts[0])
    
    
    window.ethereum.on('accountsChanged', function (accounts) {
      const account = accounts[0]
      console.log(account)
      this.connectWallet()

    }.bind(this));

    await this.getRushTokenBalance()
  }

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      const web3 = window.web3
      this.setState({ web3 })
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  disconnect =  () => {
    window.localStorage.clear()
    this.setState( {
      account : null,
      web3 : null,
      posts : null,
      blogContract : null,
      loading : false,
      rushTokenContract : null,
      rushStakeContract : null
    })
  }

  loadRushTokenContract =  async () => {
    if (!this.state.web3) {
      console.log("Web3 is not defined")
      return
    }
    const abi = RushToken.abi
    const networkId = await this.state.web3.eth.net.getId()
    const rushTokenContractData = RushToken.networks[networkId]

    const rushTokenContract = new this.state.web3.eth.Contract(abi, rushTokenContractData.address)
        
    this.setState({ rushTokenContract })


  }

  loadRushStakeContract =  async () => {
    if (!this.state.web3) {
      console.log("Web3 is not defined")
      return
    }
    const abi = RushStake.abi
    const networkId = await this.state.web3.eth.net.getId()
    const rushStakeContractData = RushStake.networks[networkId]

    const rushStakeContract = new this.state.web3.eth.Contract(abi, rushStakeContractData.address)
        
    this.setState({ rushStakeContract })

  }

  getRushTokenBalance = async () => {
    if (!this.state.rushTokenContract) {
      console.log("No contract")
      return
    }

    const rushTokenBalance = await this.state.rushTokenContract.methods.balanceOf(this.state.account).call()
    this.setState({ rushTokenBalance })
    console.log("Balance is : " + rushTokenBalance)
  }

  mintToken = async () => {
    if (!this.state.rushTokenContract) {
      console.log("No contract")
      return
    }

    const isMinted = await this.state.rushStakeContract.methods.mintToken(this.state.account).send({from : this.state.account})
    .then(function(receipt){
      console.log("Transaction is mined with txHash : ")
      console.log(receipt.transactionHash)
      
    }).catch((e)=>{
        console.log("Canceled by user")
        console.log(e.code)
      })
    const rushTokenBalance = await this.state.rushTokenContract.methods.balanceOf(this.state.account).call()
    this.setState({rushTokenBalance})
    
  }

  constructor(props) {
    super(props)
    this.state = {
      account : null,
      web3 : null,
      loading : false,
      rushTokenContract : null,
      rushTokenBalance : null,
      rushStakeContract : null
    }


  }


  render() {
    
    return (
      <div className='container-fluid  bg-dark'>
        <Navbar disconnect={this.disconnect} account={this.state.account} rushTokenBalance={this.state.rushTokenBalance} connectWallet={this.connectWallet}></Navbar>
        {
          this.state.account ?
          <>
            <Bank mintToken={this.mintToken}></Bank>
            <Staking web3={this.state.web3} account={this.state.account} tokenContract={this.state.rushTokenContract} stakeContract={this.state.rushStakeContract}
            balance={this.state.rushTokenBalance}></Staking>
          </>
          :
            <p className='text-light pt-1'>no account</p>
        }
      </div>
    );
  }
}

export default App;
