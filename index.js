import core from '@actions/core';
import sendAlert from './lib/send-alert.js';
import prepareAlert from './lib/prepare-alert.js';

try {
  const pagerDutyintegrationKey = core.getInput('pagerduty-integration-key'); // Required
  const pagerDutyDedupKey = core.getInput('pagerduty-dedup-key'); // Optional
  const runbookUrl = core.getInput('runbook-url'); // Optional
  const resolve = core.getInput('resolve'); // Optional

  const alert = prepareAlert(pagerDutyintegrationKey, pagerDutyDedupKey, runbookUrl, resolve);
  await sendAlert(alert);
} catch (error) {
  core.setFailed(error.message);
}
