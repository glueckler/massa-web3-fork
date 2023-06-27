/*
    This file contains mock data for testing purposes.
*/

import { ClientConfig } from '../../src/interfaces/ClientConfig';
import { ProviderType, Provider } from '../../src/interfaces/Provider';
import { PERIOD_OFFSET } from '../../src/web3/BaseClient';
import { Account } from '../../src/interfaces/Account';
import { ContractData } from '../../src/interfaces/ContractData';
import { CallData } from '../../src/interfaces/CallData';
import { GetGraphInterval } from '../../src/interfaces/GetGraphInterval';
import { ReadData } from '../../src/interfaces/ReadData';
import { ContractReadOperationData } from '../../src/interfaces/ContractReadOperationData';
import { ContractReadOperationResponse } from '../../src/interfaces/ContractReadOperationResponse';
import { Event } from '../../src/interfaces/Event';
import { Slot } from '../../src/interfaces/Slot';
import { EventFilter } from '../../src/interfaces/EventFilter';
import { EventRegexFilter } from '../../src/interfaces/EventRegexFilter';
import { ExecuteReadOnlyResponse } from '../../src/interfaces/ExecuteReadOnlyResponse';
import { Signature } from '../../src/interfaces/Signature';
import { OperationData } from '../../src/interfaces/OperationData';
import { NodeStatus } from '../../src/interfaces/NodeStatus';
import { Endorsement } from '../../src/interfaces/Endorsement';

// util function to create an event, only for that test file to avoid code duplication
function createEvent(
  id: string,
  data: string,
  slot: Slot,
  callStack: string[],
): Event {
  return {
    id,
    data: JSON.stringify(data),
    context: {
      slot,
      block: null,
      read_only: false,
      call_stack: callStack,
      index_in_slot: 0,
      origin_operation_id: null,
      is_final: true,
      is_error: false,
    },
  };
}

export const mockNodeStatusInfo: NodeStatus = {
  node_id: 'N129tbNd4oVMRsnFvQcgSq4PUAZYYDA1pvqtef2ER6W7JqgY1Bfg',
  node_ip: null,
  version: 'SAND.23.0',
  current_time: 1687275917301,
  current_cycle: 6,
  connected_nodes: {},
  last_slot: { period: 830, thread: 1 },
  next_slot: { period: 830, thread: 2 },
  consensus_stats: {
    start_timestamp: 1687275857301,
    end_timestamp: 1687275917301,
    final_block_count: 120,
    final_operation_count: 1296,
    staker_count: 1,
    stale_block_count: 0,
    clique_count: 1,
  },
  pool_stats: { endorsement_count: 0, operation_count: 1296 },
  network_stats: {
    in_connection_count: 0,
    out_connection_count: 0,
    known_peer_count: 0,
    banned_peer_count: 0,
    active_node_count: 0,
  },
  config: {
    genesis_timestamp: 1687262636363,
    end_timestamp: null,
    thread_count: 32,
    t0: 16000,
    delta_f0: 1088,
    operation_validity_periods: 10,
    periods_per_cycle: 128,
    block_reward: '0.30',
    roll_price: '100',
    max_block_size: 1000000,
    pos_lock_cycles: 64,
    pos_lookback_cycles: 64,
  },
};

export const mockGraphInterval: GetGraphInterval = {
  start: 1624153200000,
  end: 1624156800000,
};

export const mockBlock = {
  header: {
    content: {
      slot: { period: 830, thread: 1 },
      parents: ['0x000'],
      operation_merkle_root: '0x000',
      endorsements: [],
    },
    signature: '0x000',
    creator_public_key: '0x000',
    creator_address: '0x000',
    id: '0x000',
  },
};

export const mockAddresses: string[] = [
  'AU1qx8SWRBX3EaLLWmcviYiQqS7zb4jV4QykHt2TskjTPJbQAHF7',
  'AU1mTRrw6vVY2ehJTpL2PzHewP5iS1kGV2jhh3P9gNtLRxj4Z2fp',
  'AU12WVAJoH2giHAjSxk9R1XK3YhpCw2QxmkCbtXxcr4T3XCUG55nr',
];

export const mockAddressesInfo = [
  {
    address: 'AU1qx8SWRBX3EaLLWmcviYiQqS7zb4jV4QykHt2TskjTPJbQAHF7',
    candidate_balance: '0',
    final_balance: '0',
    thread: 1,
  },
  {
    address: 'AU1mTRrw6vVY2ehJTpL2PzHewP5iS1kGV2jhh3P9gNtLRxj4Z2fp',
    candidate_balance: '1',
    final_balance: '1',
    thread: 2,
  },
  {
    address: 'AU12WVAJoH2giHAjSxk9R1XK3YhpCw2QxmkCbtXxcr4T3XCUG55nr',
    candidate_balance: '50',
    final_balance: '50',
    thread: 3,
  },
];

export const mockBlockIds = ['0x000', '0x001'];

export const mockBlockData = [
  {
    id: mockBlockIds[0],
    content: null,
    is_final: false,
    is_in_blockclique: false,
    is_stale: false,
  },
  {
    id: mockBlockIds[1],
    content: null,
    is_final: true,
    is_in_blockclique: false,
    is_stale: false,
  },
];

export const mockEndorsementIds = ['0x000', '0x001'];

export const mockEndorsementData: Array<Endorsement> = [
  {
    id: mockEndorsementIds[0],
    in_pool: false,
    in_blocks: ['0x000'],
    is_final: false,
    endorsement: {
      content: {
        sender_public_key: '0x000',
        slot: { period: 830, thread: 1 },
        index: 0,
        endorsed_block: '0x000',
      },
      signature: '0x000',
    },
  },
  {
    id: mockEndorsementIds[1],
    in_pool: false,
    in_blocks: ['0x001'],
    is_final: true,
    endorsement: {
      content: {
        sender_public_key: '0x000',
        slot: { period: 830, thread: 1 },
        index: 0,
        endorsed_block: '0x000',
      },
      signature: '0x000',
    },
  },
];

export const mockOpIds: Array<string> = [
  'O1z2xVtwFsKP3po3vkPmpEtZiJvwEd4v1hpK7iT8P3rk9zCEs9f',
  'O1s1xVtwFsKP3po3vkPmpELsiJvwEdk0yhpK7iT8P3rk9zCEs9g',
  'O1b4xVtwFsKP3po3vkPmpEjZiJvwEdk6yhpK7iT8P3rk9zCEs9h',
  'O1t2xVtwFsKP3po3vkPmpELZiJvwEd2vy3pK7iT8P3rk9zCEs9i',
];

export const mockOperationData = [
  {
    id: mockOpIds[0],
    in_blocks: ['0x000'],
    in_pool: false,
    is_operation_final: false,
    thread: 1,
    operation: {},
  },
  {
    id: mockOpIds[1],
    in_blocks: ['0x001'],
    in_pool: false,
    is_operation_final: true,
    thread: 2,
    operation: {},
  },
  {
    id: mockOpIds[2],
    in_blocks: ['0x002'],
    in_pool: true,
    is_operation_final: false,
    thread: 3,
    operation: {},
  },
  {
    id: mockOpIds[3],
    in_blocks: ['0x003'],
    in_pool: false,
    is_operation_final: false,
    thread: 4,
    operation: {},
  },
];

export const mockOperationDataDetailed: Array<OperationData> = [
  {
    id: mockOperationData[0].id,
    in_blocks: ['0x000'],
    in_pool: false,
    is_operation_final: false,
    thread: 1,
    operation: {
      content: {
        expire_period: 0,
        fee: '0',
        op: {
          Transaction: {
            amount: '1000',
            recipient_address:
              'AU1QRRX6o2igWogY8qbBtqLYsNzYNHwvnpMC48Y6CLCv4cXe9gmK',
          },
        },
        sender_public_key: 'public_key',
      },
      signature: 'signature',
      content_creator_pub_key: 'pub_key',
      content_creator_address:
        'AU1fMUjzAR6Big9Woz3P3vTjAywLbb9KwSyC8btfK3KMDj8ffAHu',
      id: 'id',
    },
    op_exec_status: true,
  },
  {
    id: mockOperationData[1].id,
    in_blocks: ['2'],
    in_pool: false,
    is_operation_final: true,
    thread: 2,
    operation: {
      content: {
        expire_period: 0,
        fee: '0',
        op: {
          Transaction: {
            amount: '1000',
            recipient_address:
              'AU1QRRX6o2igWogY8qbBtqLYsNzYNHwvnpMC48Y6CLCv4cXe9gmK',
          },
        },
        sender_public_key: 'public_key',
      },
      signature: 'signature',
      content_creator_pub_key: 'pub_key',
      content_creator_address:
        'AU1fMUjzAR6Big9Woz3P3vTjAywLbb9KwSyC8btfK3KMDj8ffAHu',
      id: 'id',
    },
    op_exec_status: false,
  },
  {
    id: mockOperationData[2].id,
    in_blocks: [],
    in_pool: true,
    is_operation_final: false,
    thread: 3,
    operation: {
      content: {
        expire_period: 0,
        fee: '0',
        op: {
          Transaction: {
            amount: '1000',
            recipient_address:
              'AU1fMUjzAR6Big9Woz3P3vTjAywLbb9KwSyC8btfK3KMDj8ffAHu',
          },
        },
        sender_public_key: 'public_key',
      },
      signature: 'signature',
      content_creator_pub_key: 'pub_key',
      content_creator_address:
        'AU12Set6aygzt1k7ZkDwrkStYovVBzeGs8VgaZogy11s7fQzaytv3',
      id: 'id',
    },
    op_exec_status: true,
  },
  {
    id: mockOperationData[3].id,
    in_blocks: [],
    in_pool: false,
    is_operation_final: false,
    thread: 4,
    operation: {
      content: {
        expire_period: 0,
        fee: '0',
        op: {
          Transaction: {
            amount: '1000',
            recipient_address:
              'AU1fMUjzAR6Big9Woz3P3vTjAywLbb9KwSyC8btfK3KMDj8ffAHu',
          },
        },
        sender_public_key: 'public_key',
      },
      signature: 'signature',
      content_creator_pub_key: 'pub_key',
      content_creator_address:
        'AU12Set6aygzt1k7ZkDwrkStYovVBzeGs8VgaZogy11s7fQzaytv3',
      id: 'id',
    },
    op_exec_status: true,
  },
];

export const mockStackersData = [
  {
    AU1qx8SWRBX3EaLLWmcviYiQqS7zb4jV4QykHt2TskjTPJbQAHF7: 1,
    AU1mTRrw6vVY2ehJTpL2PzHewP5iS1kGV2jhh3P9gNtLRxj4Z2fp: 2,
    AU12WVAJoH2giHAjSxk9R1XK3YhpCw2QxmkCbtXxcr4T3XCUG55nr: 3,
  },
];

export const mockDatastoreEntryInput = [
  {
    address: 'AU1qx8SWRBX3EaLLWmcviYiQqS7zb4jV4QykHt2TskjTPJbQAHF7',
    key: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]),
  },
  {
    address: 'AU1mTRrw6vVY2ehJTpL2PzHewP5iS1kGV2jhh3P9gNtLRxj4Z2fp',
    key: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]),
  },
];

export const mockDatastoreEntries = [
  {
    final_value: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]),
    candidate_value: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]),
  },
  {
    final_value: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]),
    candidate_value: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]),
  },
];

export const mockClientConfig: ClientConfig = {
  providers: [
    {
      url: 'https://mock-public-api.com',
      type: ProviderType.PUBLIC,
    } as Provider,
    {
      url: 'https://mock-private-api.com',
      type: ProviderType.PRIVATE,
    } as Provider,
  ],
  periodOffset: PERIOD_OFFSET,
};

export const mockDeployerAccount: Account = {
  address: 'AU1QRRX6o2igWogY8qbBtqLYsNzYNHwvnpMC48Y6CLCv4cXe9gmK',
  publicKey: 'P129tbNd4oVMRsnFvQcgSq4PUAZYYDA1pvqtef2ER6W7JqgY1Bfg',
  secretKey: 'S12XuWmm5jULpJGXBnkeBsuiNmsGi2F4rMiTvriCzENxBR4Ev7vd',
  createdInThread: 0,
};

export const mockContractData: ContractData = {
  fee: 100000000000000000n,
  maxGas: 100000000000000000n,
  maxCoins: 100000000000000000n,
  address: 'AU1fMUjzAR6Big9Woz3P3vTjAywLbb9KwSyC8btfK3KMDj8ffAHu',
  contractDataText: 'Hello World!',
  contractDataBinary: new Uint8Array([0x00, 0x01, 0x02, 0x03]),
  datastore: new Map<Uint8Array, Uint8Array>([
    [
      new Uint8Array([0x00, 0x01, 0x02, 0x03]),
      new Uint8Array([0x00, 0x01, 0x02, 0x03]),
    ],
    [
      new Uint8Array([0x04, 0x05, 0x06, 0x07]),
      new Uint8Array([0x04, 0x05, 0x06, 0x07]),
    ],
    [
      new Uint8Array([0x08, 0x09, 0x0a, 0x0b]),
      new Uint8Array([0x08, 0x09, 0x0a, 0x0b]),
    ],
    [
      new Uint8Array([0x0c, 0x0d, 0x0e, 0x0f]),
      new Uint8Array([0x0c, 0x0d, 0x0e, 0x0f]),
    ],
  ]),
};

export const mockCallData: CallData = {
  fee: 100000000000000000n,
  maxGas: 100000000000000000n,
  coins: 100000000000000000n,
  targetAddress: 'AS12sRd6E6zKdBx3PGeZpCUUM8sE5oSA5mTa3VV4AoDCoqpoxwkmu',
  functionName: 'test',
  parameter: [1, 2, 3, 4],
};

export const mockedEvents: Event[] = [
  createEvent('event1', 'value1', { period: 1, thread: 1 }, ['address1']), // n°1
  createEvent('event2', 'value2', { period: 2, thread: 1 }, ['address2']), // n°3
  createEvent('event3', 'value3', { period: 1, thread: 2 }, ['address3']), // n°2
  createEvent('event5', 'value5', { period: 2, thread: 2 }, ['address4']), // n°4
  createEvent('event4', 'value4', { period: 1, thread: 2 }, ['address4']), // n°2
  createEvent('event6', 'value6', { period: 3, thread: 2 }, ['address4']), // n°5
];

export const mockEventFilter: EventFilter | EventRegexFilter = {
  start: { period: 2, thread: 1 },
  end: { period: 3, thread: 2 },
  emitter_address: 'address4',
  original_caller_address: null,
  original_operation_id: null,
  is_final: null,
};
export const mockReadData: ReadData = {
  maxGas: 100000n,
  targetAddress: 'AS12sRd6E6zKdBx3PGeZpCUUM8sE5oSA5mTa3VV4AoDCoqpoxwkmu',
  targetFunction: 'test',
  parameter: [1, 2, 3, 4],
  callerAddress: 'AU1QRRX6o2igWogY8qbBtqLYsNzYNHwvnpMC48Y6CLCv4cXe9gmK',
};

export const mockContractReadOperationData: Array<ContractReadOperationData> = [
  {
    executed_at: {
      period: 1,
      thread: 0,
    },
    result: {
      Ok: new Uint8Array([0x00, 0x01, 0x02, 0x03]),
    },
    output_events: [
      {
        id: 'O1z2xVtwFsKP3po3vkPmpELZiJvwEdkvyhpK7iT8P3rk9zCEs9f',
        data: 'Hello World!',
        context: {
          slot: {
            period: 1,
            thread: 0,
          },
          block: null,
          read_only: true,
          call_stack: [],
          index_in_slot: 0,
          origin_operation_id: null,
          is_final: true,
          is_error: false,
        },
      },
    ],
    gas_cost: 1000000,
  },
];

export const mockContractReadOperationResponse: ContractReadOperationResponse =
  {
    returnValue: new Uint8Array([0x00, 0x01, 0x02, 0x03]),
    info: mockContractReadOperationData[0],
  };

export const mockContractReadOnlyOperationResponse: ExecuteReadOnlyResponse = {
  returnValue: new Uint8Array([0x00, 0x01, 0x02, 0x03]),
  info: mockContractReadOperationData[0],
};

export const validSignature: Signature = {
  base58Encoded:
    '1TXucC8nai7BYpAnMPYrotVcKCZ5oxkfWHb2ykKj2tXmaGMDL1XTU5AbC6Z13RH3q59F8QtbzKq4gzBphGPWpiDonownxE',
};

export const mockContractReadOperationDataWithError = [
  {
    result: {
      Error: 'Some error message. Inspect smart contract for more details',
    },
  },
];
