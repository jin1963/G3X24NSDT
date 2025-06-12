let web3;
let contract;
const contractAddress = "0x18d9d27fbf87306aefe2a4a9c1d9e62ccb3635f0"; // Ultra Contract Address
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039"; // G3X Token Address
let user;

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            user = accounts[0];
            contract = new web3.eth.Contract(stakingABI, contractAddress);
            document.getElementById("status").innerText = "✅ Connected: " + user;
        } catch (err) {
            document.getElementById("status").innerText = "❌ Wallet connection failed.";
        }
    } else {
        alert("⚠️ MetaMask not detected.");
    }
});

document.getElementById("connectWallet").onclick = async () => {
    if (window.ethereum) {
        await ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        user = accounts[0];
        document.getElementById("status").innerText = "✅ Connected: " + user;
    }
};

document.getElementById("approveBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    const tokenContract = new web3.eth.Contract([
        {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"}
    ], tokenAddress);

    await tokenContract.methods.approve(contractAddress, web3.utils.toWei(amount, "ether")).send({ from: user });
    document.getElementById("status").innerText = "✅ Token approved.";
};

document.getElementById("stakeBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    const tier = document.getElementById("stakeTier").value;
    await contract.methods.stake(web3.utils.toWei(amount, "ether"), tier).send({ from: user });
    document.getElementById("status").innerText = "✅ Stake successful.";
};

document.getElementById("claimBtn").onclick = async () => {
    const index = document.getElementById("claimIndex").value;
    await contract.methods.claim(index).send({ from: user });
    document.getElementById("status").innerText = "✅ Claim successful.";
};

document.getElementById("unstakeBtn").onclick = async () => {
    const index = document.getElementById("claimIndex").value;
    await contract.methods.unstake(index).send({ from: user });
    document.getElementById("status").innerText = "✅ Unstake successful.";
};
