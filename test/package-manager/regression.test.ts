import { deployMonitor, removeMonitor } from '../setup';
import * as tap from 'tap';
import { testPackageManagerWorkloads } from './fixture-reader';

let integrationId: string;

/**
 * This one is set in package.json as part of the package manager tests.
 */
const packageManager = process.env.PACKAGE_MANAGER;
if (!packageManager) {
  throw new Error(
    'Missing package manager, have you set the PACKAGE_MANAGER environment varuable?',
  );
}

async function tearDown() {
  console.log('Begin removing the snyk-monitor...');
  await removeMonitor();
  console.log('Removed the snyk-monitor!');
}

tap.tearDown(tearDown);

// Make sure this runs first -- deploying the monitor for the next tests
tap.test('deploy snyk-monitor', async (t) => {
  t.plan(1);

  const isStaticAnalysis = true;
  integrationId = await deployMonitor(isStaticAnalysis);

  t.pass('successfully deployed the snyk-monitor');
});

tap.test(
  `static analysis package manager test with ${packageManager} package manager`,
  async (t) => {
    await testPackageManagerWorkloads(t, integrationId, packageManager);
  },
);