/**
 * SPDX-License-Identifier: MIT
**/

pragma solidity ^0.8.6;

import "./PodTransfer.sol";

/**
 * @author Publius
 * @title Field sows Beans and transfers Pods.
**/
contract FieldFacet is PodTransfer {

    uint256 constant UINT256_MAX = 2**255+1;

    event PlotTransfer(address indexed from, address indexed to, uint256 indexed id, uint256 pods);
    event PodApproval(address indexed owner, address indexed spender, uint256 pods);

    constructor(address bean) public {  
        s.c.bean = bean;
    }

    function sowBeans(uint256 amount) external returns (uint256) {
        MockToken(s.c.bean).transferFrom(msg.sender, address(this), amount);
        return _sowBeans(amount);
    }

    /**
     * Transfer
    **/

    function transferPlot(address sender, address recipient, uint256 id, uint256 start, uint256 end)
        external
    {
        require(sender != address(0), "Field: Transfer from 0 address.");
        require(recipient != address(0), "Field: Transfer to 0 address.");
        require(end > start, "Field: Pod range invalid.");
        uint256 amount = plot(sender, id);
        require(amount > 0, "Field: Plot not owned by user.");
        require(amount >= end, "Field: Pod range too long.");
        amount = end - start;
        insertPlot(recipient,id + start,amount);
        removePlot(sender,id,start,end);
        if (msg.sender != sender && allowancePods(sender, msg.sender) != UINT256_MAX) {
                decrementAllowancePods(sender, msg.sender, amount);
        }
        emit PlotTransfer(sender, recipient, id + start, amount);
    }

    function approvePods(address spender, uint256 amount) external {
        require(spender != address(0), "Field: Pod Approve to 0 address.");
        setAllowancePods(msg.sender, spender, amount);
        emit PodApproval(msg.sender, spender, amount);
    }
}
