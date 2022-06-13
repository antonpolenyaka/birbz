import React, { useEffect } from 'react';
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

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

const Birbz: React.FC = observer(() => {

    const [_walletAddress, setWalletAddress] = React.useState<string>("?");
    const [, _setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
    const [, _setContract] = React.useState<ethers.Contract | null>(null);

    useEffect(() => {
        if (window.ethereum) {
            const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract: ethers.Contract = new ethers.Contract(blockchainInfo.contractAddress, BirbzNFTToken.abi, provider.getSigner());

            _setProvider(provider);
            _setContract(contract);
        } else { console.warn("Please install MetaMask") }
    }, []);

    const connectToWallet = async (message: string) => {
        try {
            console.debug(message);
            detectEthereumProvider();
            const wallet: string = await connect();
            setWalletAddress(wallet);
            await checkChainId();
        } catch (err) {
            console.error("Error in " + message, err);
        }
    }

    return (
        <Container className={style.birbz}>
            <header className={style.header}>
                <Bird />
                <Button label="connect wallet" onClick={(event: any) => {
                    try {
                        event.preventDefault();
                        connectToWallet("connectToWallet...");
                    } catch (err) {
                        alert(err);
                    }
                }} />
            </header>
            <div className={style.bottomRow}>
                <p className={style.text}>Wallet: <span>{_walletAddress}</span></p>
            </div>

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
