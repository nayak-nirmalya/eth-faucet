import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  })

  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [shouldReload, reload] = useState(false)

  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])

  const setAccountListener = provider => {
    provider.on("accountChanged", accounts => setAccount(accounts[0]))
  }

  useEffect(() => {
    // debugger
    const loadProvider = async () => {
      let provider = await detectEthereumProvider()
      const contract = await loadContract("Faucet", provider)

      if (provider) {
        // provider.request({ method: "eth_requestAccounts" })
        setAccountListener(provider)
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        })
      } else {
        alert("Please Install METAMASK!")
      }
      
    }
    loadProvider()
  }, [])

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3Api.web3.utils.fromWei(balance, 'ether'))
    }

    web3Api.contract && loadBalance()
  }, [web3Api, shouldReload])

  // console.log(web3Api.web3);
  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }

    web3Api.web3 && getAccounts()
  }, [web3Api.web3])

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    })

    // window.location.reload()
    reloadEffect()
  }, [web3Api, account, reloadEffect])

  const withdraw = useCallback(async () => {
    const { contract, web3 } = web3Api
    const withdrawAmount = web3.utils.toWei("0.1", "ether")
    await contract.withdraw(withdrawAmount, {
      from: account
    })

    // window.location.reload()
    reloadEffect()
  }, [web3Api, account, reloadEffect])

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-align-items-center">
          <span>
            <strong>Account: </strong>
          </span>
            { account ? 
              <div> {account} </div> : 
              <button 
                className="button is-info is-light" 
                onClick={() =>
                  web3Api.provider.request({method: "eth_requestAccounts"})
                }>
                  Connect to Metamask!
              </button> }
          </div>
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          
          <button 
            className="button is-primary mr-2"
            disabled={!account}
            onClick={addFunds}>Donate 1ETH</button>
          <button 
            className="button is-link mr-2"
            disabled={!account}
            onClick={withdraw}>Withdraw 0.1 ETH</button>
        </div>
      </div>
    </>
  );
}

export default App;
