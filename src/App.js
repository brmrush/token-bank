import './App.css';
import React, {Component , useState} from 'react';
import Web3 from 'web3';
import RushToken from './abis/RushToken.json';
import RushBank from './abis/RushBank.json';

import Bank from './Bank.js';
import Navbar from './Navbar.js';


class App extends Component {

  // componentDidMount = async () => {
  //   const saved = window.localStorage.getItem("account");
  //   const initialValue = saved;
  //   if (initialValue) {
  //     await this.connectWallet()
  //     await this.loadBlogContract()
  //   }
  // }

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
    await this.loadRushBankContract()
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    window.localStorage.setItem("account", accounts[0])
    // window.localStorage.setItem("web3", JSON.stringify(web3))
    
    
    window.ethereum.on('accountsChanged', function (accounts) {
      const account = accounts[0]
      console.log(account)
      this.connectWallet()

    }.bind(this));

    await this.getRushTokenBalance()
    // console.log(window.web3)
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
      loading : false
    })
  }

  getTimeStamp = async () => {
    var z = 1658836704
    var x = await this.state.web3.eth.getBlock("latest")
    // console.log(x)
    var t = x.timestamp - z
    console.log(x.timestamp - z)
    var d = new Date(t * 1000).toISOString()
    console.log(d)
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
    
    // window.localStorage.setItem("blogContract", JSON.stringify(blogContract))
    
    this.setState({ rushTokenContract })


  }

  loadRushBankContract =  async () => {
    if (!this.state.web3) {
      console.log("Web3 is not defined")
      return
    }
    const abi = RushBank.abi
    const networkId = await this.state.web3.eth.net.getId()
    const rushBankContractData = RushBank.networks[networkId]

    const rushBankContract = new this.state.web3.eth.Contract(abi, rushBankContractData.address)
    
    // window.localStorage.setItem("blogContract", JSON.stringify(blogContract))
    
    this.setState({ rushBankContract })

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
    if (!this.state.rushBankContract) {
      console.log("No contract")
      return
    }

    const isMinted = await this.state.rushBankContract.methods.mintToken(this.state.account).send({from : this.state.account})
    .then(function(receipt){
      console.log("Transaction is mined with txHash : ")
      console.log(receipt.transactionHash)
      
    }).catch((e)=>{
        console.log("Canceleld by usred")
        console.log(e.code)
      })
    const rushTokenBalance = await this.state.rushTokenContract.methods.balanceOf(this.state.account).call()
    this.setState({rushTokenBalance})
    
  }


  // loadBlogContract =  async () => {
  //   if (!this.state.web3) {
  //     console.log("Web3 is not defined")
  //     return
  //   }
  //   const abi = Blog.abi
  //   const networkId = await this.state.web3.eth.net.getId()
  //   const blogContractData = Blog.networks[networkId]

  //   const blogContract = new this.state.web3.eth.Contract(abi, blogContractData.address)
    
  //   // window.localStorage.setItem("blogContract", JSON.stringify(blogContract))
    
  //   this.setState({ blogContract })

  // }



  // getAllPosts = async () => {
  //   if (!this.state.blogContract) {
  //     console.log("No contract")
  //     return
  //   }
  //   const posts = await this.state.blogContract.methods.getPosts().call()
  //   this.setState({ posts })
  //   // window.localStorage.setItem("posts", JSON.stringify(posts))
  //   console.log(this.state.posts)
  // }

  // addPost = async (text) => {
  //   if (!this.state.blogContract) {
  //     console.log("No contract")
  //     return
  //   }
  //   if (!text) {
  //     alert("You can't post an empty string.")
  //     return
  //   }

  //   console.log(text)
  //   this.setState( {loading : true})
  //   const cont = "qwerty"
  //   const tx = await this.state.blogContract.methods.postNewPost(text, this.state.account).send({from : this.state.account}).then(function(receipt){
  //     console.log("Transaction is mined with txHash : ")
  //     console.log(receipt.transactionHash)
      
  //   }).catch((e)=>{
  //       console.log("Canceleld by usred")
  //       console.log(e.code)
  //     })
  //     await this.getAllPosts()
  //     this.setState( {loading : false})
  // }

  // sendDonation = async (amount, toAddr) => {
  //   if (!this.state.web3) {
  //     console.log("No web3")
  //     return
  //   }
  //   if (amount <= 0) {
  //     alert("Amount can't be less than or equal to zero.")
  //     return
  //   }

  //   const amountToSend = this.state.web3.utils.toWei(amount, "ether"); // Convert to wei value
  //   var send = await this.state.web3.eth.sendTransaction({ from: this.state.account, to: toAddr, value: amountToSend }).then(function(receipt){
  //     console.log("Transaction is mined with txHash : ")
  //     console.log(receipt.transactionHash)
      
  //   }).catch((e)=>{
  //       console.log("Canceleld by usred")
  //       console.log(e.code)
  //     })
    
  // }

  // getCurrentUsersPosts = async (argument) => {
  //   if (!this.state.blogContract) {
  //     console.log("No contract")
  //     return
  //   }

  //   const posts = await this.state.blogContract.methods.getPostsForCurrentUser().call({from : argument ? argument : this.state.account})
  //   this.setState({ posts })
  //   console.log(posts)
  //   console.log(this.state.posts)
  // }

  constructor(props) {
    super(props)
    this.state = {
      account : null,
      web3 : null,
      loading : false,
      rushTokenContract : null,
      rushTokenBalance : null,
      rushBankContract : null
    }


  }


  render() {
    
    return (
      <div className='container-fluid  bg-dark'>
        <Navbar disconnect={this.disconnect} account={this.state.account} rushTokenBalance={this.state.rushTokenBalance} connectWallet={this.connectWallet}></Navbar>
        {
          this.state.account ?
          <Bank mintToken={this.mintToken}></Bank>
          :
          <p className='text-light pt-1'>no account</p>
        }
      </div>
    );
  }
}

export default App;

{/* <button onClick={this.getTimeStamp}>GET TIMESTAMP</button>
<button onClick={this.getRushTokenBalance}>GET BALANCE</button>
<button onClick={this.mintToken}>MINT RUSH TOKEN</button>
<h1>{this.state.rushTokenBalance ? this.state.rushTokenBalance : <p>no rush token in wallet</p>}</h1>
<h3>{this.state.account ? this.state.account : <p>no account selected</p>}</h3> */}