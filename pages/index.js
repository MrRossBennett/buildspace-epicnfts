import Head from 'next/head'
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from '../utils/MyEpicNFT.json';

const CONTRACT_ADDRESS = "0x924E4d37d0E64881F71b63e36D78476eC794C62A";

export default function Home() {
  // Constants
  const OPENSEA_LINK = `https://testnets.opensea.io/collection/squarenft-4ta5vtmkmr`;
  const TOTAL_MINT_COUNT = 50;

  /*
   * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
   */
  const [currentAccount, setCurrentAccount] = useState("");

  /*
  * Gotta make sure this is async.
  */
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    /*
    * Check if we're authorized to access the user's wallet
    */
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    /*
    * User can have multiple authorized accounts, we grab the first one if its there!
    */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }

  /*
* Implement your connectWallet method here
*/
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("💼 Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("🔨 Mining...please wait.")
        await nftTxn.wait();

        console.log(`🚀 Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="w-full bg-gradient-to-t from-gray-800 to-indigo-900 min-h-screen antialiased">
      <Head>
        <title>Epic Mints</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Press+Start+2P&display=swap" rel="stylesheet" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full max-w-screen-xl mx-auto text-white flex flex-col justify-center py-24 px-6 font-body relative">
        <header className="text-center mb-20 flex flex-col">
          <h1 className="text-4xl font-display mb-6">Epic Mints</h1>
          <p className="text-xl tracking-wide mb-8">Get ready!</p>

          {currentAccount === "" ? (
            <button onClick={connectWallet} className="w-full sm:w-auto flex-none bg-pink-500 hover:bg-pink-600 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-pink-600 focus:outline-none transition-colors duration-200 inline-flex items-center justify-center">
              Connect to Wallet
            </button>
          ) : (
            <button onClick={askContractToMintNft} className="w-full sm:w-auto flex-none bg-pink-500 hover:bg-pink-600 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-pink-600 focus:outline-none transition-colors duration-200 inline-flex items-center justify-center">
              Mint NFT
            </button>
          )}
          <a href="https://testnets.opensea.io/collection/squarenft-4ta5vtmkmr" className="mt-8 w-full sm:w-auto flex-none bg-pink-500 hover:bg-pink-600 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-pink-600 focus:outline-none transition-colors duration-200 inline-flex items-center justify-center">
            View collection on OpenSea
          </a>
        </header>
      </main>
    </div>
  )
}
