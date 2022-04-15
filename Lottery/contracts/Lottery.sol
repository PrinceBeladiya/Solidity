pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    address public winner;
    bool public isWinnerDeclared = false;

    function Lottery() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        
        players.push(msg.sender);
    }

    function random() private view returns(uint) {
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public restricted{
        uint index = random() % players.length; 
        players[index].transfer(this.balance);

        winner = players[index];
        isWinnerDeclared = true;
        players = new address[](0);
    }

    function getWinner() public view returns(address) {
        require(isWinnerDeclared);

        return winner;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function allPlayers() public view returns(address[]) {
        return players;
    }
}