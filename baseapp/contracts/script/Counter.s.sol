// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {RaceBase} from "../src/Counter.sol";

contract RaceBaseScript is Script {
    function run() external returns (RaceBase) {
        vm.startBroadcast();
        RaceBase rb = new RaceBase();
        vm.stopBroadcast();
        return rb;
    }
}
