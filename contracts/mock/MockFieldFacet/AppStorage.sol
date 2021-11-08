/*
 SPDX-License-Identifier: MIT
*/

pragma solidity ^0.8.6;
pragma experimental ABIEncoderV2;

/**
 * @author Publius
 * @title App Storage defines the state object for Beanstalk.
**/
contract Account {

    struct Field {
        mapping(uint256 => uint256) plots;
        mapping(address => uint256) podAllowances;
    }

    struct State {
        Field field;
    }
}

contract Storage {
    struct Contracts {
        address bean;
    }

    // Field

    struct Field {
        uint256 soil;
        uint256 pods;
        uint256 harvested;
        uint256 harvestable;
    }
}

struct AppStorage {
    Storage.Contracts c;
    Storage.Field f;
    mapping (address => Account.State) a;
}
