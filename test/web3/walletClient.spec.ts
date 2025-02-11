/* eslint-disable @typescript-eslint/no-var-requires */
import { IAccount } from '../../src/interfaces/IAccount';
import { ClientFactory } from '../../src/web3/ClientFactory';
import { WalletClient } from '../../src/web3/WalletClient';
import { Client } from '../../src/web3/Client';
import { IProvider, ProviderType } from '../../src/interfaces/IProvider';
import { expect, test, describe, beforeEach, afterEach } from '@jest/globals';
import * as ed from '@noble/ed25519';
import { ISignature } from '../../src/interfaces/ISignature';
import { ITransactionData } from '../../src/interfaces/ITransactionData';
import { OperationTypeId } from '../../src/interfaces/OperationTypes';
import { JSON_RPC_REQUEST_METHOD } from '../../src/interfaces/JsonRpcMethods';
import { mockNodeStatusInfo } from './mockData';

// TODO: Use env variables and say it in the CONTRIBUTING.md
const deployerPrivateKey =
  'S12XuWmm5jULpJGXBnkeBsuiNmsGi2F4rMiTvriCzENxBR4Ev7vd';
const receiverPrivateKey =
  'S1eK3SEXGDAWN6pZhdr4Q7WJv6UHss55EB14hPy4XqBpiktfPu6';

// for CI testing:
const publicApi = 'https://mock-public-api.com';
const privateApi = 'https://mock-private-api.com';

// // For local testing:
// const publicApi = 'http://127.0.0.1:33035';
// const privateApi = 'http://127.0.0.1:33034';

const MAX_WALLET_ACCOUNTS = 256;

export async function initializeClient() {
  const deployerAccount: IAccount = await WalletClient.getAccountFromSecretKey(
    deployerPrivateKey,
  );
  const web3Client: Client = await ClientFactory.createCustomClient(
    [
      { url: publicApi, type: ProviderType.PUBLIC } as IProvider,
      { url: privateApi, type: ProviderType.PRIVATE } as IProvider,
    ],
    true,
    deployerAccount, // setting deployer account as base account
  );
  return web3Client;
}

describe('WalletClient', () => {
  let web3Client: Client;
  // let walletClient: WalletClient;
  let baseAccount: IAccount = {
    address: 'AU1QRRX6o2igWogY8qbBtqLYsNzYNHwvnpMC48Y6CLCv4cXe9gmK',
    secretKey: 'S12XuWmm5jULpJGXBnkeBsuiNmsGi2F4rMiTvriCzENxBR4Ev7vd',
    publicKey: 'P129tbNd4oVMRsnFvQcgSq4PUAZYYDA1pvqtef2ER6W7JqgY1Bfg',
    createdInThread: 6,
  };

  beforeEach(async () => {
    web3Client = await initializeClient();
  });

  afterEach(async () => {
    await web3Client.wallet().cleanWallet();
  });

  describe('setBaseAccount', () => {
    test('should set base account', async () => {
      const account = await WalletClient.getAccountFromSecretKey(
        receiverPrivateKey,
      );
      await web3Client.wallet().setBaseAccount(account);
      const baseAccount = await web3Client.wallet().getBaseAccount();
      expect(baseAccount).not.toBeNull();
      expect(baseAccount?.address).toEqual(account.address);
    });

    test('should throw error if account is not valid', async () => {
      await web3Client.wallet().cleanWallet();
      await expect(
        web3Client.wallet().setBaseAccount({} as IAccount),
      ).rejects.toThrow();
      const incorrectAccount = {
        address: 'AU12Set6aygzt1k7ZkDwrkStYovVBzeGs8VgaZogy11s7fQzaytv3',
        secretKey: 's1eK3SEXGDAWN6pZhdr4Q7WJv6UHss55EB14hPy4XqBpiktfPu6', // prefix is incorrect
        publicKey: 'P121uDTpo58d3SxQTENXKqSJTpB21ueSAy8RqQ2virGVeWs339ub',
        createdInThread: 23,
      } as IAccount;
      await expect(
        web3Client.wallet().setBaseAccount(incorrectAccount),
      ).rejects.toThrow();
    });

    test('should change base account if already set', async () => {
      const firstAccount = await WalletClient.getAccountFromSecretKey(
        receiverPrivateKey,
      );
      await web3Client.wallet().setBaseAccount(firstAccount);

      const secondAccount = await WalletClient.getAccountFromSecretKey(
        deployerPrivateKey,
      );
      await web3Client.wallet().setBaseAccount(secondAccount);

      const baseAccount = await web3Client.wallet().getBaseAccount();
      expect(baseAccount).not.toBeNull();
      expect(baseAccount?.address).toEqual(secondAccount.address);
    });
  });

  describe('getBaseAccount', () => {
    test('should return the base account', async () => {
      const fetchedBaseAccount = await web3Client.wallet().getBaseAccount();
      expect(fetchedBaseAccount).not.toBeNull();
      expect(fetchedBaseAccount?.address).toEqual(baseAccount.address);
    });

    test('should return null if base account is not set', async () => {
      await web3Client.wallet().cleanWallet();
      const fetchedBaseAccount = await web3Client.wallet().getBaseAccount();
      expect(fetchedBaseAccount).toBeNull();
    });
  });

  describe('getWalletAccountByAddress', () => {
    test('should return the account for a valid address', async () => {
      const accounts = [
        await WalletClient.walletGenerateNewAccount(),
        await WalletClient.walletGenerateNewAccount(),
        await WalletClient.walletGenerateNewAccount(),
      ];

      await web3Client.wallet().addAccountsToWallet(accounts);

      const targetAccount = accounts[1]; // Assume we want to find the second account
      const fetchedAccount = web3Client
        .wallet()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .getWalletAccountByAddress(targetAccount.address!);

      expect(fetchedAccount).not.toBeNull();
      expect(fetchedAccount?.address).toEqual(targetAccount.address);
    });

    test('should return undefined for a non-existent address', async () => {
      const nonexistentAddress =
        'AU12Set6aygzt1k7ZkDwrkStYovVBzeGs8VgaZogy11s7fQzaytv3'; // This address doesn't exist in the wallet
      const fetchedAccount = web3Client
        .wallet()
        .getWalletAccountByAddress(nonexistentAddress);
      expect(fetchedAccount).toBeUndefined();
    });

    test('should return the account regardless of address case', async () => {
      const accounts = [await WalletClient.walletGenerateNewAccount()];

      await web3Client.wallet().addAccountsToWallet(accounts);

      const targetAccount = accounts[0]; // Assume we want to find the first account
      const upperCaseAddress = targetAccount.address?.toUpperCase();
      const fetchedAccount = web3Client
        .wallet()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .getWalletAccountByAddress(upperCaseAddress!);

      expect(fetchedAccount).not.toBeNull();
      expect(fetchedAccount?.address).toEqual(targetAccount.address);
    });
  });
  describe('addSecretKeysToWallet', () => {
    test('should throw an error when the number of accounts exceeds the maximum limit', async () => {
      const secretKeys = new Array(MAX_WALLET_ACCOUNTS + 1).fill(
        receiverPrivateKey,
      );

      await expect(
        web3Client.wallet().addSecretKeysToWallet(secretKeys),
      ).rejects.toThrow(
        new RegExp(
          `Maximum number of allowed wallet accounts exceeded ${MAX_WALLET_ACCOUNTS}`,
        ),
      );
    });

    test('should not add duplicate accounts to the wallet (duplicate in arguments)', async () => {
      // Add receiverPrivateKey's secret key twice
      const secretKeys: string[] = [receiverPrivateKey, receiverPrivateKey];

      const addedAccounts = await web3Client
        .wallet()
        .addSecretKeysToWallet(secretKeys);
      const walletAccounts = await web3Client.wallet().getWalletAccounts();
      expect([baseAccount, addedAccounts[0]]).toStrictEqual(walletAccounts);
      expect(addedAccounts.length).toBe(1); // only one unique account should be added
      expect(web3Client.wallet().getWalletAccounts().length).toBe(2); // only one unique account should be added
    });

    test('should not add duplicate accounts to the wallet (account already in wallet)', async () => {
      const addedAccounts = await web3Client
        .wallet()
        .addSecretKeysToWallet([deployerPrivateKey, receiverPrivateKey]);
      const walletAccounts = await web3Client.wallet().getWalletAccounts();

      // only receiver account should be added
      expect(addedAccounts[0].secretKey).toBe(receiverPrivateKey);
      expect([baseAccount, addedAccounts[0]]).toStrictEqual(walletAccounts);
      expect(addedAccounts.length).toBe(1);
      expect(web3Client.wallet().getWalletAccounts().length).toBe(2);
    });

    test('should correctly create and add accounts to the wallet', async () => {
      const accounts = [
        await WalletClient.walletGenerateNewAccount(),
        await WalletClient.walletGenerateNewAccount(),
      ];
      const secretKeys: string[] = [
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        accounts[0].secretKey!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        accounts[1].secretKey!,
      ];

      const addedAccounts = await web3Client
        .wallet()
        .addSecretKeysToWallet(secretKeys);

      expect(addedAccounts.length).toBe(2);

      // Check that both accounts have been added
      expect(addedAccounts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ address: accounts[0].address }),
          expect.objectContaining({
            address: accounts[1].address,
          }),
        ]),
      );
    });
  });

  describe('getWalletAccounts', () => {
    test('should return all accounts in the wallet', async () => {
      const accounts = [
        await WalletClient.walletGenerateNewAccount(),
        await WalletClient.walletGenerateNewAccount(),
        await WalletClient.walletGenerateNewAccount(),
      ];

      await web3Client.wallet().addAccountsToWallet(accounts);
      const walletAccounts = await web3Client.wallet().getWalletAccounts();
      expect(walletAccounts.length).toBe(4); // 3 generated + 1 base account
    });

    test('should return different accounts for different secret keys', async () => {
      const secretKey1 = 'S12XuWmm5jULpJGXBnkeBsuiNmsGi2F4rMiTvriCzENxBR4Ev7vd';
      const secretKey2 = 'S1eK3SEXGDAWN6pZhdr4Q7WJv6UHss55EB14hPy4XqBpiktfPu6';

      const accountFromPrivateKey1 = await WalletClient.getAccountFromSecretKey(
        secretKey1,
      );
      const accountFromPrivateKey2 = await WalletClient.getAccountFromSecretKey(
        secretKey2,
      );

      expect(accountFromPrivateKey1.address).not.toEqual(
        accountFromPrivateKey2.address,
      );
      expect(accountFromPrivateKey1.publicKey).not.toEqual(
        accountFromPrivateKey2.publicKey,
      );
    });
  });

  describe('walletInfo', () => {
    test.skip('should return information for each address in the wallet', async () => {
      const walletAccounts = await web3Client.wallet().getWalletAccounts();
      const walletInfo = await web3Client.wallet().walletInfo();

      expect(walletInfo.length).toBe(walletAccounts.length);

      walletInfo.forEach((info, index) => {
        expect(info.publicKey).toBe(walletAccounts[index].publicKey);
        expect(info.secretKey).toBe(walletAccounts[index].secretKey);
      });
    });
  });

  describe('removeAddressesFromWallet', () => {
    test('should remove specified addresses from the wallet', async () => {
      const accountsToRemove = await web3Client
        .wallet()
        .addSecretKeysToWallet([
          receiverPrivateKey,
          'S1USr9AFUaH7taTKeWt94qGTgaS9XkpnH1SPpctRDoK3sSJkYWk',
          'S16cS2QnKmyxxiU68Bw9Lnmt2Yttva42nahDG68awziextJgBze',
        ]);
      let addressesToRemove = accountsToRemove.map(
        (account) => account.address,
      );

      expect(addressesToRemove.length).toBe(3);
      expect(addressesToRemove).not.toContain(null);
      await web3Client
        .wallet()
        .removeAddressesFromWallet(addressesToRemove as string[]);

      const walletAccounts = await web3Client.wallet().getWalletAccounts();
      addressesToRemove.forEach((address) => {
        expect(walletAccounts).not.toContainEqual(
          expect.objectContaining({ address }),
        );
      });
    });
  });

  describe('cleanWallet', () => {
    test('remove all accounts from the wallet', async () => {
      await web3Client.wallet().cleanWallet();
      const walletAccounts = await web3Client.wallet().getWalletAccounts();
      expect(walletAccounts.length).toBe(0); // only base account should be left
    });
  });

  describe('walletSignMessage', () => {
    test('should sign a message with a valid signer', async () => {
      const data = 'Test message';
      const signer = baseAccount;
      const modelSignedMessage =
        '1TXucC8nai7BYpAnMPYrotVcKCZ5oxkfWHb2ykKj2tXmaGMDL1XTU5AbC6Z13RH3q59F8QtbzKq4gzBphGPWpiDonownxE';

      const signedMessage = await WalletClient.walletSignMessage(data, signer);

      expect(signedMessage).toHaveProperty('base58Encoded');
      expect(typeof signedMessage.base58Encoded).toBe('string');
      expect(signedMessage.base58Encoded).toEqual(modelSignedMessage);
    });

    test('should throw an error when no private key is available', async () => {
      const data = 'Test message';
      const signer = { ...baseAccount, secretKey: null };

      await expect(
        WalletClient.walletSignMessage(data, signer),
      ).rejects.toThrow('No private key to sign the message with');
    });

    test('should throw an error when no public key is available', async () => {
      const data = 'Test message';
      const signer = { ...baseAccount, publicKey: null };

      await expect(
        WalletClient.walletSignMessage(data, signer),
      ).rejects.toThrow('No public key to verify the signed message with');
    });

    test('should throw an error when signature length is invalid', async () => {
      const data = 'Test message';
      const signer = baseAccount;

      // Create a spy on the 'sign' function to provide an incorrect mock implementation for this test
      const signSpy = jest.spyOn(ed, 'sign');
      signSpy.mockImplementation(() => Promise.resolve(Buffer.alloc(63))); // 63 instead of 64

      await expect(
        WalletClient.walletSignMessage(data, signer),
      ).rejects.toThrow(/Invalid signature length. Expected 64, got/);

      // Restore the original 'sign' function after the test
      signSpy.mockRestore();
    });

    test('should correctly process Buffer data', async () => {
      const data = Buffer.from('Test message');
      const modelSignedMessage =
        '1TXucC8nai7BYpAnMPYrotVcKCZ5oxkfWHb2ykKj2tXmaGMDL1XTU5AbC6Z13RH3q59F8QtbzKq4gzBphGPWpiDonownxE';
      const signer = baseAccount;

      const signedMessage = await WalletClient.walletSignMessage(data, signer);

      expect(signedMessage).toHaveProperty('base58Encoded');
      expect(typeof signedMessage.base58Encoded).toBe('string');
      expect(signedMessage.base58Encoded).toEqual(modelSignedMessage);
    });
  });

  describe('signMessage', () => {
    test('should sign a message with a valid account', async () => {
      const data = 'Test message';
      const modelSignedMessage =
        '1TXucC8nai7BYpAnMPYrotVcKCZ5oxkfWHb2ykKj2tXmaGMDL1XTU5AbC6Z13RH3q59F8QtbzKq4gzBphGPWpiDonownxE';

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const accountSignerAddress: string = baseAccount.address!;

      const signedMessage = await web3Client
        .wallet()
        .signMessage(data, accountSignerAddress);

      expect(signedMessage).toHaveProperty('base58Encoded');
      expect(typeof signedMessage.base58Encoded).toBe('string');
      expect(signedMessage.base58Encoded).toEqual(modelSignedMessage);
    });

    test('should throw an error when the account is not found', async () => {
      const data = 'Test message';
      const nonExistentSignerAddress = 'nonExistentSignerAddress';

      await expect(
        web3Client.wallet().signMessage(data, nonExistentSignerAddress),
      ).rejects.toThrow(
        `No signer account ${nonExistentSignerAddress} found in wallet`,
      );
    });

    test('should correctly process Buffer data', async () => {
      const data = Buffer.from('Test message');
      const modelSignedMessage =
        '1TXucC8nai7BYpAnMPYrotVcKCZ5oxkfWHb2ykKj2tXmaGMDL1XTU5AbC6Z13RH3q59F8QtbzKq4gzBphGPWpiDonownxE';

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const accountSignerAddress = baseAccount.address!;

      const signedMessage = await web3Client
        .wallet()
        .signMessage(data, accountSignerAddress);

      expect(signedMessage).toHaveProperty('base58Encoded');
      expect(typeof signedMessage.base58Encoded).toBe('string');
      expect(signedMessage.base58Encoded).toEqual(modelSignedMessage);
    });
  });

  describe('walletGenerateNewAccount', () => {
    test('should generate a new account', async () => {
      const newAccount = await WalletClient.walletGenerateNewAccount();
      // Check that the newAccount object has all necessary properties
      expect(newAccount).toHaveProperty('address');
      expect(newAccount).toHaveProperty('secretKey');
      expect(newAccount).toHaveProperty('publicKey');
      expect(newAccount).toHaveProperty('createdInThread');

      // Check that the properties are of correct type
      expect(typeof newAccount.address).toBe('string');
      expect(typeof newAccount.secretKey).toBe('string');
      expect(typeof newAccount.publicKey).toBe('string');
      expect(typeof newAccount.createdInThread).toBe('number');

      // Check that the properties are not empty or null
      expect(newAccount.address).not.toBeNull();
      expect(newAccount.address).not.toBe('');
      expect(newAccount.secretKey).not.toBeNull();
      expect(newAccount.secretKey).not.toBe('');
      expect(newAccount.publicKey).not.toBeNull();
      expect(newAccount.publicKey).not.toBe('');

      // Check that keys and address have the correct length
      expect(newAccount.address?.length).toBeGreaterThanOrEqual(50);
      expect(newAccount.secretKey?.length).toBeGreaterThanOrEqual(50);
      expect(newAccount.publicKey?.length).toBeGreaterThanOrEqual(50);
    });

    test('should generate unique accounts each time', async () => {
      const newAccount1 = await WalletClient.walletGenerateNewAccount();
      const newAccount2 = await WalletClient.walletGenerateNewAccount();
      expect(newAccount1).not.toEqual(newAccount2);
    });
  });

  describe('getAccountFromSecretKey', () => {
    test('should generate an account from a secret key', async () => {
      const secretKey = 'S12syP5uCVEwaJwvXLqJyD1a2GqZjsup13UnhY6uzbtyu7ExXWZS';
      const addressModel =
        'AU12KgrLq2vhMgi8aAwbxytiC4wXBDGgvTtqGTM5R7wEB9En8WBHB';
      const publicKeyModel =
        'P12c2wsKxEyAhPC4ouNsgywzM41VsNSuwH9JdMbRt9bM8ZsMLPQA';
      const createdInThreadModel = 21;
      const accountFromSecretKey = await WalletClient.getAccountFromSecretKey(
        secretKey,
      );
      // Check that the accountFromSecretKey object has all necessary properties
      expect(accountFromSecretKey).toHaveProperty('address');
      expect(accountFromSecretKey).toHaveProperty('secretKey');
      expect(accountFromSecretKey).toHaveProperty('publicKey');
      expect(accountFromSecretKey).toHaveProperty('createdInThread');
      // Check that the secretKey matches the models
      expect(accountFromSecretKey.address).toEqual(addressModel);
      expect(accountFromSecretKey.publicKey).toEqual(publicKeyModel);
      expect(accountFromSecretKey.secretKey).toEqual(secretKey);
      expect(accountFromSecretKey.createdInThread).toEqual(
        createdInThreadModel,
      );
    });

    test('should throw error if invalid secret key is provided', async () => {
      const invalidSecretKey = 'invalidSecretKey';
      await expect(
        WalletClient.getAccountFromSecretKey(invalidSecretKey),
      ).rejects.toThrow();

      const emptySecretKey = '';
      await expect(
        WalletClient.getAccountFromSecretKey(emptySecretKey),
      ).rejects.toThrow();

      const nullSecretKey = null;
      await expect(
        WalletClient.getAccountFromSecretKey(nullSecretKey as never),
      ).rejects.toThrow();
    });
  });

  describe('verifySignature', () => {
    test('should return true for a valid signature', async () => {
      const message = 'Test message';

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const signerPublicKey = baseAccount.publicKey!;
      const validSignature: ISignature = {
        base58Encoded:
          '1TXucC8nai7BYpAnMPYrotVcKCZ5oxkfWHb2ykKj2tXmaGMDL1XTU5AbC6Z13RH3q59F8QtbzKq4gzBphGPWpiDonownxE',
      };
      const result = await web3Client
        .wallet()
        .verifySignature(message, validSignature, signerPublicKey);

      expect(result).toBe(true);
    });

    test('should return false for an invalid signature', async () => {
      const consoleSpy = jest.spyOn(console, 'error');
      consoleSpy.mockImplementation(() => null);

      const data = 'Test message';

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const signerPublicKey = baseAccount.publicKey!;
      const invalidSignature: ISignature = {
        base58Encoded:
          '2TXucC8nai7BYpAnMPYrotVcKCZ5oxkfWHb2ykKj2tXmaGMDL1XTU5AbC6Z13RH3q59F8QtbzKq4gzBphGPWpiDonownxE', // starts with 2 and not 1
      };
      const result = await web3Client
        .wallet()
        .verifySignature(data, invalidSignature, signerPublicKey);

      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe.skip('getAccountBalance', () => {
    test('should return balance for a valid address', async () => {
      const ACCOUNT_ADDRESS =
        'AU1ELsdabgHd7qqYdHLPW4eN6jnaxF6egNZVpyx5B4MYjR7XiUVZ';
      const expectedBalance = 500000000000n;

      const balance = await web3Client
        .wallet()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .getAccountBalance(ACCOUNT_ADDRESS!);

      expect(balance).not.toBeNull();
      expect(balance).toHaveProperty('candidate');
      expect(balance).toHaveProperty('final');
      expect(balance?.candidate).toEqual(expectedBalance);
      expect(balance?.final).toEqual(expectedBalance);
    });

    test('should return 0 balance for a fresh account', async () => {
      const consoleSpy = jest.spyOn(console, 'error');
      consoleSpy.mockImplementation(() => null);

      const freshAccount = await WalletClient.walletGenerateNewAccount();

      const balance = await web3Client
        .wallet()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .getAccountBalance(freshAccount.address!);

      expect(balance).not.toBeNull();
      expect(balance).toHaveProperty('candidate');
      expect(balance).toHaveProperty('final');
      expect(balance?.candidate).toEqual(0n);
      expect(balance?.final).toEqual(0n);

      consoleSpy.mockRestore();
    });

    test('should return null for an invalid address', async () => {
      const invalidAddress = 'invalid address';

      const balance = await web3Client
        .wallet()
        .getAccountBalance(invalidAddress);

      expect(balance).toBeNull();
    });
  });

  describe('sendTransaction', () => {
    let receiverAccount: IAccount;
    let mockTxData: ITransactionData;

    beforeEach(async () => {
      receiverAccount = await WalletClient.walletGenerateNewAccount();
      mockTxData = {
        fee: 1n,
        amount: 100n,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        recipientAddress: receiverAccount.address!,
      };

      // mock functions to not interact with the node directly
      const spyGetNodeStatus = jest.spyOn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (web3Client.wallet() as any).publicApiClient,
        'getNodeStatus',
      );
      spyGetNodeStatus.mockReturnValue(mockNodeStatusInfo);

      const mockOpIds = ['op1', 'op2', 'op3'];
      jest
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .spyOn(web3Client.wallet() as any, 'sendJsonRPCRequest')
        .mockResolvedValue(mockOpIds);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test('should throw an error if no sender account is available for the transaction', async () => {
      jest.spyOn(web3Client.wallet(), 'getBaseAccount').mockReturnValue(null);

      await expect(
        web3Client.wallet().sendTransaction(mockTxData),
      ).rejects.toThrow('No tx sender available');
    });

    test('should call compactBytesForOperation with correct arguments', async () => {
      const spy = jest.spyOn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        web3Client.wallet() as any,
        'compactBytesForOperation',
      );

      await web3Client.wallet().sendTransaction(mockTxData);

      expect(spy).toHaveBeenCalledWith(
        mockTxData,
        OperationTypeId.Transaction,
        expect.any(Number), // expiryPeriod
      );
    });

    test('should call walletSignMessage with correct arguments', async () => {
      const spy = jest.spyOn(WalletClient, 'walletSignMessage');

      await web3Client.wallet().sendTransaction(mockTxData);

      expect(spy).toHaveBeenCalledWith(
        expect.any(Buffer), // Buffer.concat([bytesPublicKey, bytesCompact])
        expect.any(Object), // sender
      );
    });

    test('should call sendJsonRPCRequest with correct arguments', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = jest.spyOn(web3Client.wallet() as any, 'sendJsonRPCRequest');

      await web3Client.wallet().sendTransaction(mockTxData);

      expect(spy).toHaveBeenCalledWith(
        JSON_RPC_REQUEST_METHOD.SEND_OPERATIONS,
        expect.any(Array), // [[data]]
      );
    });

    test('should return an array of operation ids', async () => {
      const mockOpIds = ['op1', 'op2', 'op3'];

      jest
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .spyOn(web3Client.wallet() as any, 'sendJsonRPCRequest')
        .mockResolvedValue(mockOpIds);

      const opIds = await web3Client.wallet().sendTransaction(mockTxData);

      expect(opIds).toEqual(mockOpIds);
    });
  });
});
