export const ADDRESS = "0x901640EE7b44e8F1C902147e9Bee00A3CeaA10FE";

export const ABI = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "projects",
		"outputs": [
			{
				"name": "owner",
				"type": "address"
			},
			{
				"name": "title",
				"type": "string"
			},
			{
				"name": "description",
				"type": "string"
			},
			{
				"name": "goalAmount",
				"type": "uint256"
			},
			{
				"name": "gatheredAmount",
				"type": "uint256"
			},
			{
				"name": "deadline",
				"type": "uint256"
			},
			{
				"name": "fundsClaimed",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_pid",
				"type": "uint256"
			}
		],
		"name": "claimFunds",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "projectCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_pid",
				"type": "uint256"
			},
			{
				"name": "_amt",
				"type": "uint256"
			}
		],
		"name": "contribute",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_title",
				"type": "string"
			},
			{
				"name": "_description",
				"type": "string"
			},
			{
				"name": "_mins",
				"type": "uint256"
			},
			{
				"name": "_goalAmount",
				"type": "uint256"
			}
		],
		"name": "createProject",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_pid",
				"type": "uint256"
			}
		],
		"name": "getRefund",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_pid",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_title",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_amt",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "by",
				"type": "address"
			}
		],
		"name": "contribution",
		"type": "event"
	}
];