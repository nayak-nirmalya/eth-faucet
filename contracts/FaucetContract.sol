// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    uint public numOfFunders;
    mapping(address => bool) private funders;

    receive() external payable {}

    function addFunds() external payable {
        address _funder = msg.sender;

        if (!funders[_funder]) {
            funders[_funder] = true;
            numOfFunders++;
        }
    }

    function withdraw(uint amount) external {
        if(amount < 1000000000000000000) {
            payable(msg.sender).transfer(amount);
        }
    }

    // function getFundersAtIndex(uint _index) external view returns(address) {
    //     return funders[_index];
    // }

    // function getAllFunders() external view returns(address[] memory) {
    //     address[] memory _address = new address[](numOfFunders);

    //     for (uint8 i = 0; i < numOfFunders; i++) {
    //         _address[i] = funders[i];
    //     }

    //     return _address;
    // }
}

// truffle console
// const instance = await Faucet.deployed()
// instance.addFunds({value: "2000000000000", from: accounts[1]})