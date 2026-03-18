// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract RaceBase {
    struct Player {
        uint256 totalCheckIns;
        uint256 totalRaces;
        uint256 lastCheckIn;
        uint256 streak;
    }

    mapping(address => Player) public players;
    uint256 public totalCheckIns;
    uint256 public totalRaces;
    uint256 public totalPlayers;

    event CheckIn(address indexed player, uint256 streak, uint256 timestamp);
    event Race(address indexed player, uint256 totalRaces, uint256 timestamp);

    function _toDay(uint256 ts) internal pure returns (uint256) {
        if (ts < 3600) return 0;
        return (ts - 3600) / 86400;
    }

    function checkIn() external {
        Player storage p = players[msg.sender];
        uint256 today = _toDay(block.timestamp);
        uint256 lastDay = p.lastCheckIn == 0 ? 0 : _toDay(p.lastCheckIn);

        require(p.lastCheckIn == 0 || today > lastDay, "Already checked in today");

        if (p.totalCheckIns == 0) {
            totalPlayers++;
        }

        if (today == lastDay + 1) {
            p.streak++;
        } else {
            p.streak = 1;
        }

        p.lastCheckIn = block.timestamp;
        p.totalCheckIns++;
        totalCheckIns++;

        emit CheckIn(msg.sender, p.streak, block.timestamp);
    }

    function race() external {
        Player storage p = players[msg.sender];

        if (p.totalCheckIns == 0 && p.totalRaces == 0) {
            totalPlayers++;
        }

        p.totalRaces++;
        totalRaces++;

        emit Race(msg.sender, p.totalRaces, block.timestamp);
    }

    function canCheckIn(address user) external view returns (bool) {
        Player storage p = players[user];
        if (p.lastCheckIn == 0) return true;
        return _toDay(block.timestamp) > _toDay(p.lastCheckIn);
    }

    function getPlayer(address user) external view returns (
        uint256 checkIns,
        uint256 races,
        uint256 lastCheckIn,
        uint256 streak
    ) {
        Player storage p = players[user];
        return (p.totalCheckIns, p.totalRaces, p.lastCheckIn, p.streak);
    }
}
