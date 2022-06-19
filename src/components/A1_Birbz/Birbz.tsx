import React, { useEffect, useState } from 'react';
import style from "./Birbz.module.scss";
import { Bird } from "../Y_Common/Bird/Bird";
import { Container } from "../Y_Common/Container/Container";
import { Button } from "../Y_Common/Button/Button";
import birbz from "../../assets/png/birbz.png"
import { SocialLinks } from "../Y_Common/SocialLinks/SocialLinks";
import { detectEthereumProvider, connect, checkChainId } from "../../services/connectWallet";
import blockchainInfo from "../../services/blockchainInfo.json";
import { observer } from 'mobx-react-lite';
import { ethers } from "ethers";
import BirbzNFTToken from "../../abis/BirbzNFTToken.json";
import { ConnectModal } from "../A5_ConnectModal/ConnectModal";
import { AccountModal } from "../A6_AccountModal/AccountModal";

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

const Birbz: React.FC = observer(() => {
    const [_walletAddress, setWalletAddress] = React.useState<string>("");
    const [, _setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
    const [, _setContract] = React.useState<ethers.Contract | null>(null);

    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showModalError, setModalError] = useState(false);
    const [showModalDescription, setModalDescription] = useState("");

    useEffect(() => {
        if (window.ethereum) {
            const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract: ethers.Contract = new ethers.Contract(blockchainInfo.contractAddress, BirbzNFTToken.abi, provider.getSigner());

            _setProvider(provider);
            _setContract(contract);
        } else {
            console.warn("Please install MetaMask")
        }
    }, []);

    const connectToWallet = async (message: string) => {
        try {
            console.debug(message);
            detectEthereumProvider();
            const wallet: string = await connect();
            setWalletAddress(wallet);
            await checkChainId();
            showAlertModal(false, `Wallet is connected successfull: ${hidePartWalletInButton(wallet, 10)}`);
        } catch (err: any) {
            console.error("Error in " + message, err);
            showAlertModal(true, err.toString());
        } finally {
            setShowConnectModal(true);
        }
    }

    const showAlertModal = (isError: boolean, message: string) => {
        setModalError(isError);
        setModalDescription(message);
        setShowConnectModal(true);
    }

    const hidePartWalletInButton = (wallet: string, charToShow: number) => {
        if (wallet && wallet.length > (charToShow * 2)) {
            const len = wallet.length;
            return wallet.substring(0, charToShow) + "..." + wallet.substring(wallet.length - charToShow);
        }
        return wallet;
    }

    return (
        <Container className={style.birbz}>
            <ConnectModal show={showConnectModal}
                error={showModalError}
                description={showModalDescription}
                onClose={() => setShowConnectModal(false)}
            />

            <header className={style.header}>
                <Bird />

                <div className={style.btnWrapper} id="connectWalletButton">
                    <Button label={_walletAddress == "" ? "connect wallet" : hidePartWalletInButton(_walletAddress, 4)}
                        onClick={(event: any) => {
                            if (_walletAddress !== "") {
                                setShowAccountModal(true);
                            } else {
                                try {
                                    event.preventDefault();
                                    connectToWallet("connectToWallet...");
                                } catch (err: any) {
                                    console.log("Error at connect wallet", err);
                                    showAlertModal(true, err.toString());
                                }
                            }
                        }}
                    />
                    <AccountModal show={showAccountModal}
                        walletAddress={_walletAddress}
                        onClose={() => setShowAccountModal(false)}
                        onDisconnect={() => setWalletAddress("")}
                    />
                </div>
            </header>

            <h1 className={style.title}>birbz</h1>
            <p className={style.subtitle}>5,555 NFT’s on the Ethereum Blockchain.</p>

            <div className={style.bottomRow}>
                <p className={style.text}>Stealth Launch coming soon. Mint for <span>$5</span> below.</p>

                <SocialLinks className={style.socialLinks} />
            </div>

            <img src={birbz} alt="" className={style.back} />

        </Container>
    );
});

export default Birbz;
