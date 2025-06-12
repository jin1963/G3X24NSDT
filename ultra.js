const contractAddress = "0x18d9d27fbf87306aefe2a4a9c1d9e62ccb3635f0";
let web3;
let contract;
let userAddress;

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(stakingABI, contractAddress);

        document.getElementById("connectButton").onclick = connectWallet;
        document.getElementById("approveButton").onclick = approve;
        document.getElementById("stakeButton").onclick = stake;
        document.getElementById("claimButton").onclick = claimRewards;
        document.getElementById("unstakeButton").onclick = unstake;
    } else {
        alert("MetaMask not detected.");
    }
}

async function connectWallet() {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    userAddress = accounts[0];
    document.getElementById("walletAddress").innerText = userAddress;
}

async function approve() {
    const amount = document.getElementById("amountInput").value;
    const tokenAddress = await contract.methods.g3xToken().call();
    const token = new web3.eth.Contract([
        { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
    ], tokenAddress);
    await token.methods.approve(contractAddress, web3.utils.toWei(amount, "ether")).send({ from: userAddress });
    alert("Approved");
}

async function stake() {
    const amount = document.getElementById("amountInput").value;
    const tier = parseInt(document.getElementById("tierSelect").value);
    await contract.methods.stake(web3.utils.toWei(amount, "ether"), tier).send({ from: userAddress });
    alert("Staked");
}

async function claimRewards() {
    const index = document.getElementById("stakeIndexInput").value;
    await contract.methods.claim(index).send({ from: userAddress });
    alert("Rewards Claimed");
}

async function unstake() {
    const index = document.getElementById("stakeIndexInput").value;
    await contract.methods.claim(index).send({ from: userAddress }); // เรียก claim ก่อนเสมอ
    await contract.methods.unstake(index).send({ from: userAddress });
    alert("Unstaked");
}
