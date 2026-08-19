// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract GenesisBadge {
    string public constant name = "HTL Genesis Badge";
    string public constant symbol = "HTL-GEN";
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public totalSupply;
    address public owner;
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public badgeOf;
    event BadgeMinted(address indexed to, uint256 indexed id);
    constructor() { owner = msg.sender; }
    function mint(address to) external {
        require(msg.sender == owner, "HTL: forge only");
        require(badgeOf[to] == 0, "HTL: already human");
        require(totalSupply < MAX_SUPPLY, "HTL: genesis full");
        totalSupply += 1;
        ownerOf[totalSupply] = to;
        badgeOf[to] = totalSupply;
        emit BadgeMinted(to, totalSupply);
    }
    function transferFrom(address, address, uint256) external pure { revert("HTL: soulbound"); }
    function approve(address, uint256) external pure { revert("HTL: soulbound"); }
    function setApprovalForAll(address, bool) external pure { revert("HTL: soulbound"); }
}
