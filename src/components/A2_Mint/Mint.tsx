import React, { useEffect } from 'react';
import { Container } from "../Y_Common/Container/Container";
import style from "./Mint.module.scss";
import egg from "../../assets/png/mint.png";
import { svgIcons } from "../../assets/svg/svgIcons";
import { useState } from "react";
import { Bird } from "../Y_Common/Bird/Bird";
import { Sparkle } from "../Y_Common/Sparkle/Sparkle";
import BirbzNFTToken from "../../abis/BirbzNFTToken.json";
import { observer } from 'mobx-react-lite';
import { ethers } from "ethers";
import blockchainInfo from "../../services/blockchainInfo.json";
import { detectEthereumProvider, connect, checkChainId } from "../../services/connectWallet";

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

const Mint: React.FC = observer(() => {

    const [_walletAddress, setWalletAddress] = React.useState<string>("?");
    const [_provider, _setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
    const [_contract, _setContract] = React.useState<ethers.Contract | null>(null);
    const [_amount, _setAmount] = useState<number>(8);
    const [_isLoading, _setIsLoading] = React.useState<boolean>(false);
    const [_sendMintTxTime, _setSendMintTxTime] = React.useState<string>("");
    const [_lastMintTransactionHash, _setLastMintTransactionHash] = React.useState<string>("");

    useEffect(() => {
        if (window.ethereum) {
            const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract: ethers.Contract = new ethers.Contract(blockchainInfo.contractAddress, BirbzNFTToken.abi, provider.getSigner());

            _setProvider(provider);
            _setContract(contract);
        } else { console.warn("Please install MetaMask") }
    }, []);

    const mint = async (message: string) => {
        try {
            _setIsLoading(true);

            detectEthereumProvider();
            const wallet: string = await connect();
            setWalletAddress(wallet);
            await checkChainId();

            // Call mint function & and set state
            if (_contract !== null) {
                console.log(`Mint ${_amount} NFT to wallet '${wallet}' in contract ${_contract.address}`);
                const amountToPayInETH:any = await _contract.getAmountToPay(_amount);
                const options = { value: ethers.utils.parseEther(amountToPayInETH.toString()) };
                let transaction:any = await _contract.mintMultiple(wallet, _amount, "http://mintable.com/1.jpg", options);
                if (transaction.code !== 4001) {
                    // Set txTime, txHash, txConfirmations
                    await mintTransactionProcessing(transaction);
                }
                console.info(transaction);
                window.alert(`${_amount} has minted for ${wallet}!`)
            } else {
                console.error(message, "ERROR: Contract is not exist, is null reference")
            }

        } catch (error: any) {
            console.error(message, error);
            if(error.code && error.data && error.data.message) {
                if(error.data.message.startsWith("VM Exception while processing transaction: revert")) {
                    const solidityError:string = error.data.message.replace("VM Exception while processing transaction: revert", "");
                    window.alert(solidityError);
                } else {
                    window.alert(error.data.message);
                }
            } else if(error.message) {
                if(error.message.startsWith("MetaMask Tx Signature:")) {
                    const metamaskError:string = error.message.replace("MetaMask Tx Signature:", "");
                    window.alert(metamaskError);
                } else {
                    window.alert(error.message);
                }
            } else {
                window.alert(error);
            }
        } finally {
            _setIsLoading(false);
        }
    }

    // ! Processing part
    // Set tx state values and wait for confirmations 
    const mintTransactionProcessing = async (tx: any) => {
        _setSendMintTxTime(`Transaction was sent at: ${tx.timestamp ?? `Error`}`);
        _setLastMintTransactionHash(`Transaction hash: ${tx.hash ?? `Error`}`);
        return new Promise((resolve,) => {
            if (_provider !== null) {
                _provider.on(tx.hash, (transactionReceipt) => {

                    if (transactionReceipt.confirmations <= 12 && transactionReceipt.confirmations > 0) {
                        _setLastMintTransactionHash(`Your transaction confirmed confirmations: ${transactionReceipt.confirmations}`);
                    } else {
                        _provider.removeAllListeners();
                    }
                    resolve(null);
                });
            } else {
                console.log("mintTransactionProcessing", "ERROR: provider is not defined, is equal null")
            }
        });
    }

    return (
        <Container className={style.mint}>

            <Bird className={style.bird} />

            <div className={style.eggWrapper}>
                <img src={egg} alt="" className={style.egg} />

                <Sparkle className={style.sparkle1} />
                <Sparkle className={style.sparkle2} animationDelay={2} />
                <Sparkle className={style.sparkle3} animationDelay={4} />

            </div>


            <div className={style.countBlock}>
                <button className={style.btn}
                    onClick={() => _setAmount(amount => amount - 1)}
                    disabled={_amount === 1}
                >
                    {svgIcons.btnMinus}
                </button>

                <p className={style.count}>{_amount}</p>

                <button className={style.btn}
                    onClick={() => _setAmount(amount => amount + 1)}
                >
                    {svgIcons.btnPlus}
                </button>
            </div>

            <button className={style.btnMint} onClick={(event) => {
                event.preventDefault();
                const message = "Call mint...";
                mint(message);
            }}>
                <p>mint now</p>
            </button>

            <p className={style.max}>MAX 10 PER WALLET</p>

        </Container>
    )
});

export default Mint;