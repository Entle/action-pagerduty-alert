import core from '@actions/core';
import { context } from '@actions/github';
import sendAlert from './lib/send-alert';

try {
  const integrationKey = core.getInput('pagerduty-integration-key');

  const dedupKey = core.getInput('pagerduty-dedup-key'); // Optional
  const shouldResolve = core.getInput('resolve'); // Optional

  const alert = {
    payload: {
      summary: `${context.repo.repo}: Error in "${context.workflow}" run by @${context.actor}`,
      timestamp: new Date().toISOString(),
      source: 'GitHub Actions',
      severity: 'critical',
      custom_details: {
        run_details: `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`,
        related_commits: context.payload.commits
          ? context.payload.commits.map((commit) => `${commit.message}: ${commit.url}`).join(', ')
          : 'No related commits',
      },
    },
    routing_key: integrationKey,
    event_action: 'trigger',
    ...(dedupKey ? { dedup_key: dedupKey } : {}),
    ...(shouldResolve ? { event_action: 'resolve' } : {}),
  };

  await sendAlert(alert);
} catch (error) {
  core.setFailed(error.message);
}
