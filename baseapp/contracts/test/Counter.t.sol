// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {RaceBase} from "../src/Counter.sol";

contract RaceBaseTest is Test {
    RaceBase public rb;
    address player1 = address(0x1);

    function setUp() public {
        vm.warp(1700000000);
        rb = new RaceBase();
    }

    function test_Race() public {
        vm.prank(player1);
        rb.race();
        (,uint256 races,,) = rb.getPlayer(player1);
        assertEq(races, 1);
        assertEq(rb.totalRaces(), 1);
    }

    function test_CheckIn() public {
        vm.prank(player1);
        rb.checkIn();
        (uint256 checkIns,,,uint256 streak) = rb.getPlayer(player1);
        assertEq(checkIns, 1);
        assertEq(streak, 1);
    }

    function test_CheckInOncePerDay() public {
        vm.prank(player1);
        rb.checkIn();
        vm.prank(player1);
        vm.expectRevert("Already checked in today");
        rb.checkIn();
    }

    function test_CanCheckInNextDay() public {
        vm.prank(player1);
        rb.checkIn();
        vm.warp(block.timestamp + 86400);
        vm.prank(player1);
        rb.checkIn();
        (uint256 checkIns,,,uint256 streak) = rb.getPlayer(player1);
        assertEq(checkIns, 2);
        assertEq(streak, 2);
    }
}
