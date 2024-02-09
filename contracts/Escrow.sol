// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC721 {
    function transferFrom(address _from, address _to, uint _ID) external;
}

contract Escrow {
    address public nftAddress;
    address payable public seller;
    address public lender;
    address public inspector;

    modifier onlySeller() {
        require(msg.sender == seller, "Only Seller Can Call");
        _;
    }
    modifier onlyBuyer(uint _nftID) {
        require (msg.sender == buyer[_nftID], 'Only buyer can call');
        _; 
    }

    modifier onlyInspector (){
        require (msg.sender == inspector, 'You are not Inspector'); 
        _;
    }

    mapping(uint => bool) public isListed;
    mapping(uint => uint) public purchasePrice;
    mapping(uint => uint) public escrowAmount;
    mapping(uint => address) public buyer;
    mapping (uint => bool) public inspectionPassed;
    mapping (uint => mapping (address => bool)) public saleApproval ;

    constructor(
        address _nftAddress,
        address payable _seller,
        address _lender,
        address _inspector
    ) {
        nftAddress = _nftAddress;
        seller = _seller;
        lender = _lender;
        inspector = _inspector;
    }

    // tranferring nft from seller to this contract
    function list(
        uint _nftID,
        address _buyer,
        uint _purchasePrice,
        uint _escrowAmount
    ) public payable onlySeller {
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;
    }

    // for inspection 

    function inspectionStatus(uint _nftID, bool _passed) public onlyInspector {
        inspectionPassed[_nftID] = _passed; 
    }
    
    // function for approval 
    function approveSale(uint _nftID) public {
        saleApproval[_nftID][msg.sender] = true; 
    }

    // function for Earnest Deposite 
    function depositEarnest(uint _nftID) public payable onlyBuyer(_nftID) {
        require (msg.value >= escrowAmount[_nftID]); 
    }

     receive() external payable {}
   
    
    function getBalance() public view returns (uint){
        return address(this).balance; 
    }

// deal will be finalized by the seller 
    function finalizeDeal(uint _nftID) public {
        require (inspectionPassed[_nftID]); 
        require (saleApproval[_nftID] [buyer[_nftID]]); 
        require (saleApproval[_nftID][seller]); 
        require (saleApproval[_nftID][lender]); 
        require ( address(this).balance >= purchasePrice[_nftID]); 

    }
}
