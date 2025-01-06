import { context } from '@actions/github';

/**
 * Prepare a PagerDuty alert object
 *
 * @param {string} pagerDutyintegrationKey The PagerDuty integration key (required)
 * @param {string} pagerDutyDedupKey The PagerDuty deduplication key (optional)
 * @param {string} runbookUrl The runbook URL (optional)
 * @param {boolean} resolve Whether to resolve the alert (optional)
 * @param {string} severity Severity label for notification
 * @returns {Object} The alert object
 */
export default function prepareAlert(
  pagerDutyintegrationKey,
  pagerDutyDedupKey,
  runbookUrl,
  resolve,
  severity
) {
  if (!pagerDutyintegrationKey) {
    throw new Error('PagerDuty integration key is required');
  }

  return {
    payload: {
      summary: `${context.repo.repo}: Error in "${context.workflow}" run by @${context.actor}`,
      timestamp: new Date().toISOString(),
      source: 'GitHub Actions',
      severity: severity || 'critical',
      custom_details: {
        run_details: `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`,
        related_commits: context.payload.commits
          ? context.payload.commits.map((commit) => `${commit.message}: ${commit.url}`).join(', ')
          : 'No related commits',
        ...(runbookUrl ? { runbook: runbookUrl } : {}),
      },
    },
    routing_key: pagerDutyintegrationKey,
    event_action: resolve ? 'resolve' : 'trigger',
    ...(pagerDutyDedupKey ? { dedup_key: pagerDutyDedupKey } : {}),
  };
}
