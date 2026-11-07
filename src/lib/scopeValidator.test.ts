import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTargetScope, isIpInCidr } from './scopeValidator';

test('isIpInCidr correctly calculates subnet membership', () => {
  assert.equal(isIpInCidr('10.0.12.45', '10.0.12.0/24'), true);
  assert.equal(isIpInCidr('10.0.13.1', '10.0.12.0/24'), false);
  assert.equal(isIpInCidr('10.0.15.10', '10.0.15.0/24'), true);
});

test('validateTargetScope permits registered lab hostnames', () => {
  const result = validateTargetScope('lab.dataops-sandbox.internal');
  assert.equal(result.isAuthorized, true);
  assert.ok(result.reason.includes('authorized'));
});

test('validateTargetScope permits registered lab IP addresses in CIDR', () => {
  const result = validateTargetScope('10.0.12.50');
  assert.equal(result.isAuthorized, true);
  assert.ok(result.reason.includes('authorized lab subnet'));
});

test('validateTargetScope blocks explicit exclusions', () => {
  const result = validateTargetScope('10.0.12.1');
  assert.equal(result.isAuthorized, false);
  assert.ok(result.reason.includes('EXCLUSION LIST TRIGGERED'));
});

test('validateTargetScope blocks public domains like google.com', () => {
  const result = validateTargetScope('https://google.com/test');
  assert.equal(result.isAuthorized, false);
  assert.ok(result.reason.includes('CRITICAL SCOPE VIOLATION'));
});

test('validateTargetScope blocks public IP addresses like 8.8.8.8', () => {
  const result = validateTargetScope('8.8.8.8');
  assert.equal(result.isAuthorized, false);
  assert.ok(result.reason.includes('public routable address'));
});

test('validateTargetScope blocks unregistered internal addresses', () => {
  const result = validateTargetScope('192.168.1.99');
  assert.equal(result.isAuthorized, false);
  assert.ok(result.reason.includes('UNREGISTERED TARGET'));
});
