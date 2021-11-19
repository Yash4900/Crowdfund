pragma solidity ^0.5.0;

contract Crowdfund {
    
    // To keep track of number of projects 
    uint public projectCount = 0;
    
    // Project definition
    struct Project {
        address owner;
        string title;
        string description;
        uint goalAmount;
        uint gatheredAmount;
        uint deadline;
        bool fundsClaimed;
        mapping (address => uint) contributions;
    }
    
    // Event to get past contributions
    event contribution (
        uint _pid, 
        string _title, 
        uint _amt, 
        address by
    );
    
    // Key - project number, Value - Project
    mapping (uint => Project) public projects;
    
    // Function to start a new fundraiser project
    function createProject (
        string memory _title, 
        string memory _description, 
        uint _mins, 
        uint _goalAmount
    ) public {
        projectCount ++;
        projects[projectCount] = Project(msg.sender, _title, _description, _goalAmount, 0, now + (_mins * 1 minutes), false);
    }
    
    // Function to contribute to a project
    function contribute (
        uint _pid, 
        uint _amt
    ) public payable {
        require(now <= projects[_pid].deadline, "Deadline is already passed");
        projects[_pid].gatheredAmount += _amt;
        projects[_pid].contributions[msg.sender] += _amt;
        emit contribution(_pid, projects[_pid].title, _amt, msg.sender);
    }
    
    // Function to claim the gathered funds if project is successful
    function claimFunds (
        uint _pid
    ) public {
        require(projects[_pid].fundsClaimed == false, "Funds already claimed");
        msg.sender.transfer(projects[_pid].gatheredAmount);
        projects[_pid].fundsClaimed = true;
    }
    
    // Function to get refund if project is not successful
    function getRefund (
        uint _pid
    ) public {
        require(projects[_pid].contributions[msg.sender] > 0, "You have not contributed to this project OR You have already received the refund");
        msg.sender.transfer(projects[_pid].contributions[msg.sender]);
        projects[_pid].contributions[msg.sender] = 0;
    }
}