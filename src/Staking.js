import './App.css';
import React, {Component , useState} from 'react';
import Web3 from 'web3';



class Staking extends Component {

    constructor(props) {
        super(props)
        this.state = {
            stakeAmount : 0
        }
    
    
      }
    
    setMaxToken = async () => {
        let userBalance = await this.props.tokenContract.methods.balanceOf(this.props.account).call()
        this.setState({stakeAmount : userBalance})
    }    
  
    
    stakeToken = async () => {
        if (!this.props.tokenContract) {
          console.log("No token contract")
          return
        }
        if (!this.props.stakeContract) {
            console.log("No stake contract")
            return
        }
        if (!this.state.stakeAmount) {
            console.log("Stake amount must be bigger than zero.")
            return
        }
        let userBalance = await this.props.tokenContract.methods.balanceOf(this.props.account).call()

        console.log(userBalance)
        let stakeContractAddress = this.props.stakeContract.options.address

        let allowanceAmount = await this.props.tokenContract.methods.allowance(this.props.account, stakeContractAddress).call()       
        if (allowanceAmount < this.state.stakeAmount) {
            await this.props.tokenContract.methods.approve(stakeContractAddress, this.state.stakeAmount).send({from : this.props.account})        
            .then(function(receipt){
                console.log("Transaction is mined with txHash : ")
                console.log(receipt.transactionHash)
                
              }).catch((e)=>{
                  console.log("Canceleld by usred")
                  console.log(e)
                })
        }


        await this.props.stakeContract.methods.stake(this.state.stakeAmount).send({from : this.props.account})
        .then(function(receipt){
          console.log("Transaction is mined with txHash : ")
          console.log(receipt.transactionHash)
          
        }).catch((e)=>{
            console.log("Canceleld by usred")
            console.log(e)
          })


        this.props.balance = await this.props.tokenContract.methods.balanceOf(this.props.account).call()


        // console.log(userBalance)
    
        // await this.props.stakeContract.methods.mintToken(this.state.account).send({from : this.state.account})
        // .then(function(receipt){
        //   console.log("Transaction is mined with txHash : ")
        //   console.log(receipt.transactionHash)
          
        // }).catch((e)=>{
        //     console.log("Canceleld by usred")
        //     console.log(e.code)
        //   })
        // const rushTokenBalance = await this.state.rushTokenContract.methods.balanceOf(this.state.account).call()
        // this.setState({rushTokenBalance})
        
      }    

render() {
    

    return (
        <div className='d-flex flex-column align-items-center justify-content-center text-warning'>
            <h1 className='fw-bold text-oswald m-1 pt-1'>STAKING</h1>
            <div className='d-flex flex-column pb-md-5 pb-2'>
                <div className='d-sm-flex flex-row justify-content-center align-items-center'>
                    <input className='bg-dark text-light m-1 p-1 border border-warning rounded' type="number"
                        onChange={(e) => this.setState({stakeAmount : e.target.value})} value={this.state.stakeAmount}
                        >
                    </input>
                    <button className='btn btn-primary btn-sm m-2' onClick={this.setMaxToken}>
                        MAX
                    </button>
                </div>
                <button className='btn btn-danger btn-md' onClick={this.stakeToken}>STAKE TOKEN</button>
            </div>

            {/* My Stakes */}
            <div className='d-flex flex-column align-items-center justify-content-center'>
                
            </div>

        </div>
    );
  }
}

export default Staking;
