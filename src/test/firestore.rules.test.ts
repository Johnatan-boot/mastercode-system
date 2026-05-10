import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { setDoc, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let testEnv: RulesTestEnvironment;

describe('Firestore Security Rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'mastercode-test',
      firestore: {
        rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'),
        host: 'localhost',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it('should deny access to unauthorized users', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(unauthedDb, 'users/some-user')));
  });

  it('should allow users to read their own profile', async () => {
    const aliceDb = testEnv.authenticatedContext('alice', { email: 'alice@example.com', email_verified: true }).firestore();
    await assertSucceeds(getDoc(doc(aliceDb, 'users/alice')));
  });

  it('should deny writing to posts without auth', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(addDoc(collection(unauthedDb, 'posts'), { title: 'Hacked' }));
  });

  it('should deny users changing their own role', async () => {
    const aliceDb = testEnv.authenticatedContext('alice', { email: 'alice@example.com', email_verified: true }).firestore();
    // Assuming 'role' is projected by hasOnly in update rules
    await assertFails(setDoc(doc(aliceDb, 'users/alice'), { role: 'Admin' }, { merge: true }));
  });
});
