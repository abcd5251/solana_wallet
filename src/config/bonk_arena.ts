export type BonkArena = {
  "version": "0.1.0",
  "name": "bonk_arena",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ownerTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "entryFee",
          "type": "u64"
        },
        {
          "name": "prizeRatio",
          "type": "u8"
        },
        {
          "name": "commissionRatio",
          "type": "u8"
        },
        {
          "name": "prizeDistribution",
          "type": {
            "array": [
              "u8",
              3
            ]
          }
        }
      ]
    },
    {
      "name": "startGame",
      "accounts": [
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameSession",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "endGame",
      "accounts": [
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameSession",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "score",
          "type": "u32"
        },
        {
          "name": "submittedGameKey",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "claimPrize",
      "accounts": [
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addPrizePool",
      "accounts": [
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contributorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contributor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "leaderboard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "entryFee",
            "type": "u64"
          },
          {
            "name": "prizeRatio",
            "type": "u8"
          },
          {
            "name": "commissionRatio",
            "type": "u8"
          },
          {
            "name": "prizePool",
            "type": "u64"
          },
          {
            "name": "commissionPool",
            "type": "u64"
          },
          {
            "name": "prizeDistribution",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "players",
            "type": {
              "vec": {
                "defined": "Player"
              }
            }
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenPool",
            "type": "publicKey"
          },
          {
            "name": "ownerTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "gameSession",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerAddress",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "gameCompleted",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "publicKey"
          },
          {
            "name": "score",
            "type": "u32"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "claimed",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "GameAlreadyStarted",
      "msg": "Game already started for this player."
    },
    {
      "code": 6001,
      "name": "GameNotStarted",
      "msg": "Game not started."
    },
    {
      "code": 6002,
      "name": "GameExpired",
      "msg": "Game session expired."
    },
    {
      "code": 6003,
      "name": "InvalidGameKey",
      "msg": "Invalid game key."
    },
    {
      "code": 6004,
      "name": "ScoreAlreadyLogged",
      "msg": "Score already logged."
    },
    {
      "code": 6005,
      "name": "NameTooLong",
      "msg": "Name too long."
    },
    {
      "code": 6006,
      "name": "InvalidPrizeDistribution",
      "msg": "Invalid prize distribution."
    },
    {
      "code": 6007,
      "name": "InvalidEntryFee",
      "msg": "Invalid entry fee."
    },
    {
      "code": 6008,
      "name": "Unauthorized",
      "msg": "Unauthorized. Only owner can perform this action."
    },
    {
      "code": 6009,
      "name": "PlayerNotInLeaderboard",
      "msg": "Player not found in leaderboard."
    },
    {
      "code": 6010,
      "name": "NotEligibleForPrize",
      "msg": "Not eligible for prize."
    }
  ]
};

export const IDL: BonkArena = {
  "version": "0.1.0",
  "name": "bonk_arena",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ownerTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "entryFee",
          "type": "u64"
        },
        {
          "name": "prizeRatio",
          "type": "u8"
        },
        {
          "name": "commissionRatio",
          "type": "u8"
        },
        {
          "name": "prizeDistribution",
          "type": {
            "array": [
              "u8",
              3
            ]
          }
        }
      ]
    },
    {
      "name": "startGame",
      "accounts": [
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameSession",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "endGame",
      "accounts": [
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameSession",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "score",
          "type": "u32"
        },
        {
          "name": "submittedGameKey",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "claimPrize",
      "accounts": [
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addPrizePool",
      "accounts": [
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contributorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contributor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "leaderboard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "entryFee",
            "type": "u64"
          },
          {
            "name": "prizeRatio",
            "type": "u8"
          },
          {
            "name": "commissionRatio",
            "type": "u8"
          },
          {
            "name": "prizePool",
            "type": "u64"
          },
          {
            "name": "commissionPool",
            "type": "u64"
          },
          {
            "name": "prizeDistribution",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "players",
            "type": {
              "vec": {
                "defined": "Player"
              }
            }
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenPool",
            "type": "publicKey"
          },
          {
            "name": "ownerTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "gameSession",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerAddress",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "gameCompleted",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "publicKey"
          },
          {
            "name": "score",
            "type": "u32"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "claimed",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "GameAlreadyStarted",
      "msg": "Game already started for this player."
    },
    {
      "code": 6001,
      "name": "GameNotStarted",
      "msg": "Game not started."
    },
    {
      "code": 6002,
      "name": "GameExpired",
      "msg": "Game session expired."
    },
    {
      "code": 6003,
      "name": "InvalidGameKey",
      "msg": "Invalid game key."
    },
    {
      "code": 6004,
      "name": "ScoreAlreadyLogged",
      "msg": "Score already logged."
    },
    {
      "code": 6005,
      "name": "NameTooLong",
      "msg": "Name too long."
    },
    {
      "code": 6006,
      "name": "InvalidPrizeDistribution",
      "msg": "Invalid prize distribution."
    },
    {
      "code": 6007,
      "name": "InvalidEntryFee",
      "msg": "Invalid entry fee."
    },
    {
      "code": 6008,
      "name": "Unauthorized",
      "msg": "Unauthorized. Only owner can perform this action."
    },
    {
      "code": 6009,
      "name": "PlayerNotInLeaderboard",
      "msg": "Player not found in leaderboard."
    },
    {
      "code": 6010,
      "name": "NotEligibleForPrize",
      "msg": "Not eligible for prize."
    }
  ]
};
