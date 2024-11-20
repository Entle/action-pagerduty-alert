import core from '@actions/core';
import { context } from '@actions/github';

// Trigger the PagerDuty webhook with a given alert
async function sendAlert(alert) {
  const response = await fetch('https://events.pagerduty.com/v2/enqueue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alert),
  });

  if (response.status === 202) {
    console.log(`Successfully sent PagerDuty alert. Response: ${JSON.stringify(response.data)}`);
  } else {
    core.setFailed(
      `PagerDuty API returned status code ${response.status} - ${JSON.stringify(response.data)}`
    );
  }
}

// Run the action
try {
  const integrationKey = core.getInput('pagerduty-integration-key');

  let alert = {
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
  };
  const dedupKey = core.getInput('pagerduty-dedup-key');
  if (dedupKey != '') {
    alert.dedup_key = dedupKey;
  }
  const shouldResolve = core.getInput('resolve');
  if (shouldResolve == 'true') {
    alert.event_action = 'resolve';
  }
  sendAlert(alert);
} catch (error) {
  core.setFailed(error.message);
}
