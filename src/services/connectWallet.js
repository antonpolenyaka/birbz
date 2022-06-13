import blockchainInfo from "./blockchainInfo.json";

const UserRejectedTxCode = 4001;
const UserDoesntHaveThisNetwork = 4902;

export function detectEthereumProvider({ mustBeMetaMask = false, silent = false, timeout = 3000, } = {}) {
    _validateInputs();
    let handled = false;
    return new Promise((resolve) => {
        if (window.ethereum) {
            handleEthereum();
        }
        else {
            window.addEventListener('ethereum#initialized', handleEthereum, { once: true });
            setTimeout(() => {
                handleEthereum();
            }, timeout);
        }

        function handleEthereum() {
            if (handled) {
                return;
            }
            handled = true;
            window.removeEventListener("ethereum#initialized", handleEthereum);
            const { ethereum } = window;
            if (ethereum && (!mustBeMetaMask || ethereum.isMetaMask)) {
                resolve(ethereum);
            } else {
                const message =
                    mustBeMetaMask && ethereum
                        ? "Non-MetaMask window.ethereum detected."
                        : "Unable to detect window.ethereum.";
                !silent && console.error("@metamask/detect-provider:", message);
                resolve(null);
            }
        }
    });

    function _validateInputs() {
        if (typeof mustBeMetaMask !== 'boolean') {
            throw new Error(`Expected option 'mustBeMetaMask' to be a boolean.`);
        }
        if (typeof silent !== 'boolean') {
            throw new Error(`Expected option 'silent' to be a boolean.`);
        }
        if (typeof timeout !== 'number') {
            throw new Error(`Expected option 'timeout' to be a number.`);
        }
    }
}


export async function connect() {
    if (window.ethereum) {
        const accounts = await window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .catch((err) => {
                if (err.code === UserRejectedTxCode) {
                    console.log('Please connect to MetaMask.');
                } else {
                    console.error(err);
                }
            });
        await checkChainId();
        return accounts[0];
    }
}


// Check which chain we are currently connected to, if not the one we need -
// try to swap to ours, if it doesn't exist, try to add it to the user.
export async function checkChainId() {
    try {
        let chainId = await window.ethereum.request({ method: "net_version" });
        if (chainId !==  blockchainInfo.networkIdHex) {
            await switchChain();
        } else {
            console.log("Correct network are choosed");
        }
    } catch (error) {
        console.warn(`An error occurred while checking the network. please change it manually, error code: ${error.code}`);
    }

}

export async function switchChain() {
    await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: blockchainInfo.networkIdHex }]
    }).catch((erorr) => {
        if (erorr.code === UserDoesntHaveThisNetwork) {
            addChain();
        } else if (erorr.code === UserRejectedTxCode) {
            console.warn(`We tryed to change network to BSC but user reject this`);
        }
    });
}

export async function addChain() {
    await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: blockchainInfo.networkIdHex,
                chainName: blockchainInfo.chainName,
                nativeCurrency: {
                    name: blockchainInfo.nativeCurrency.name,
                    symbol: blockchainInfo.nativeCurrency.symbol,
                    decimals: blockchainInfo.nativeCurrency.decimals
                },
                rpcUrls: [blockchainInfo.nativeCurrency.rpcUrls],
                blockExplorerUrls: [blockchainInfo.nativeCurrency.blockExplorerUrls],
            }
        ],
    }).catch((addErorr) => {
        console.log(`We tryed to add BSC network but it was unsuccessfule :( 
            Erorr text: ${addErorr}`)
    });
}