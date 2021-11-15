pragma solidity ^0.5.0;

contract Crowdfund {
    uint public projectCount = 0;
    
    struct Project {
        address owner;
        string name;
        string description;
        uint goalAmount;
        uint gatheredAmount;
        uint deadline;
        bool fundsClaimed;
        mapping (address => uint) contributions;
    }
    
    mapping (uint => Project) public projects;
    
    function createProject(string memory _name, string memory _description, uint _mins, uint _goalAmount) public {
        projectCount ++;
        projects[projectCount] = Project(msg.sender, _name, _description, _goalAmount, 0, now + (_mins * 1 minutes), false);
    }
    
    function contribute(uint _pid, uint _amt) public payable {
        require(now <= projects[_pid].deadline, "Deadline is already passed");
        projects[_pid].gatheredAmount += _amt;
        projects[_pid].contributions[msg.sender] += _amt;
    }
    
    function claimFunds(uint _pid) public {
        require(projects[_pid].fundsClaimed == false, "Funds already claimed");
        msg.sender.transfer(projects[_pid].gatheredAmount * 1e18);
        projects[_pid].fundsClaimed = true;
    }
    
    function getRefund(uint _pid) public {
        require(projects[_pid].contributions[msg.sender] > 0, "You have not contributed to this project");
        msg.sender.transfer(projects[_pid].contributions[msg.sender]);
        projects[_pid].contributions[msg.sender] = 0;
    }
}