# PagerDuty Alert GitHub Action

Sends a PagerDuty alert, e.g. on action failure. Optionally, resolves on success.

## Prerequisites

1. Create a service integration in PagerDuty:
   1. Go to PagerDuty > "Services" > Pick your service > "Integrations" > "Add a new integration";
   2. Choose a name (e.g. "Your GitHub CI/CD") and "Use our API directly" with "Events API v2";
   3. Copy the integration key.
2. Set up a secret in your GitHub repo to store the integration key, e.g. "PAGERDUTY_INTEGRATION_KEY".

## Inputs

`pagerduty-integration-key`

**Required:** the integration key for your PagerDuty service. See instructions above for how to obtain.

`pagerduty-dedup-key`

**Optional:** a `dedup_key` for your alert. This will enable PagerDuty to coalesce multiple alerts into one.\
**Default:** None

`runbook-url`

**Optional:** A URL to a runbook for the alert. This will be included in the alert. Useful for providing instructions on how to troubleshoot/resolve the issue. \
**Default:** None

`resolve`

**Optional:** If set to true, will resolve any active alerts with the `dedup_key`. This allows you to automatically resolve active alerts for a job once it succeeds. Requires a separate step in your GitHub Actions process; see below. \
**Default:** `false`

More documentation on the above parameters is available [here](https://developer.pagerduty.com/docs/events-api-v2/trigger-events/).

## Example usage

Adding this to your `steps` will send a PagerDuty alert if the job fails. It is recommended to add this step at the end of your job to cover all possible failures.

```yaml
- name: Send PagerDuty alert on failure
  if: ${{ failure() }}
  uses: Entle/action-pagerduty-alert@1.0.5
  with:
    pagerduty-integration-key: '${{ secrets.PAGERDUTY_INTEGRATION_KEY }}'
    pagerduty-dedup-key: github_workflow_failed
    runbook-url: 'https://example.com/runbook'
```

Optionally, add the below step after the one above to resolve the alert if a subsequent job succeeds.

```yaml
- name: Resolve PagerDuty alert on success
  if: ${{ !failure() && !cancelled() }}
  uses: Entle/action-pagerduty-alert@1.0.5
  with:
    pagerduty-integration-key: '${{ secrets.PAGERDUTY_INTEGRATION_KEY }}'
    pagerduty-dedup-key: github_workflow_failed
    resolve: true
```

Adding both steps to your job will create an alert when the job fails, and resolve the alert when the job succeeds. Using `${{ github.workflow }}` for `pagerduty-dedup-key` (or any other key that is unique per-workflow) allows multiple jobs that each trigger and resolve alerts independently, while customizing the logic within the `if` configs allows for more complex page and resolution behavior.
