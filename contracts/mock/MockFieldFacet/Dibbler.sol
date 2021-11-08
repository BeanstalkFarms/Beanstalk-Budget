/**
 * SPDX-License-Identifier: MIT
**/

pragma solidity ^0.8.6;

import "./AppStorage.sol";
import "../../mock/MockToken.sol";

/**
 * @author Publius
 * @title Dibbler
**/
contract Dibbler {

    AppStorage internal s;
    uint32 private constant MAX_UINT32 = 2**32-1;

    event Sow(address indexed account, uint256 index, uint256 beans, uint256 pods);

    /**
     * Getters
    **/

    function totalPods() public view returns (uint256) {
        return s.f.pods - s.f.harvested;
    }

    function podIndex() public view returns (uint256) {
        return s.f.pods;
    }

    function harvestableIndex() public view returns (uint256) {
        return s.f.harvestable;
    }

    function harvestedIndex() public view returns (uint256) {
        return s.f.harvested;
    }

    function totalHarvestable() public view returns (uint256) {
        return s.f.harvestable - s.f.harvested;
    }

    function totalUnripenedPods() public view returns (uint256) {
        return s.f.pods - s.f.harvestable;
    }

    function plot(address account, uint256 plotId) public view returns (uint256) {
        return s.a[account].field.plots[plotId];
    }

    /**
     * Internal
    **/

    function _sowBeans(uint256 amount) internal returns (uint256) {
        require(amount > 0, "Field: Must purchase non-zero amount.");
        burn(amount);
        sowPlot(msg.sender, amount, amount);
        incrementTotalPods(amount);

        return amount;
    }

    function incrementTotalPods(uint256 amount) internal {
        s.f.pods = s.f.pods + amount;
    }

    function sowPlot(address account, uint256 beans, uint256 pods) internal {
        s.a[account].field.plots[podIndex()] = pods;
        emit Sow(msg.sender, podIndex(), beans, pods);
    }

    function burn(uint256 amount) private {
        MockToken(s.c.bean).burn(address(this), amount);
    }

    /**
     * Shed
    **/


}
