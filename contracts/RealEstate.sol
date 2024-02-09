// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; 

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; 
import {ERC721} from  "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RealEstate is ERC721URIStorage {

    uint private _tokenIds; 

    constructor () ERC721 ("RealEstate", "RE") {} 
    function mint (string memory tokenURI) public returns (uint){
        
        uint newItemId = ++ _tokenIds; 
        _mint(msg.sender, newItemId); 
        _setTokenURI (newItemId, tokenURI); 
        return newItemId ; 
    }

    function totalSupply () public view returns (uint){ 
        return _tokenIds; 
    }

}


