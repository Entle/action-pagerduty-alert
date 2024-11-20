# PagerDuty Alert GitHub Action

Sends a critical PagerDuty alert, e.g. on action failure.

## Prerequisites

1. Create a service integration in PagerDuty:
    1. Go to PagerDuty > "Services" > Pick your service > "Integrations" > "Add a new integration"
    2. Choose a name (e.g. "Your GitHub CI/CD") and "Use our API directly" with "Events API v2"
    3. Copy the integration key
2. Set up a secret in your GitHub repo to store the integration key, e.g. "PAGERDUTY_INTEGRATION_KEY"

## Inputs

`pagerduty-integration-key`

**Required:** the integration key for your PagerDuty service

`pagerduty-dedup-key`

**Optional:** a `dedup_key` for your alert. This will enable PagerDuty to coalesce multiple alerts into one.

`resolve`

**Optional:** If set to true, will resolve any active alerts with `dedup_key`. This allows you to automatically resolve alerts for a job if a subsequent run is successful.

More documentation is available [here](https://developer.pagerduty.com/docs/events-api-v2/trigger-events/).

## Example usage

Adding this to your `steps` will page if the job fails:

```yaml
- name: Send PagerDuty alert on failure
  if: ${{ failure() }}
  uses: Entle/action-pagerduty-alert@0.3.0
  with:
    pagerduty-integration-key: '${{ secrets.PAGERDUTY_INTEGRATION_KEY }}'
    pagerduty-dedup-key: github_workflow_failed
```

This config will resolve the page if the job subsequently succeeds:

```yaml
- name: Resolve PagerDuty alert on success
  if: ${{ !failure() }}
  uses: Entle/action-pagerduty-alert@0.3.0
  with:
    pagerduty-integration-key: '${{ secrets.PAGERDUTY_INTEGRATION_KEY }}'
    pagerduty-dedup-key: github_workflow_failed
    resolve: true
```

Adding both steps to your job will create an alert when the job fails, and resolve the job when it succeeds. Using `${{ github.workflow }}` for `pagerduty-dedup-key` (or any other key that is unique per-workflow) allows multiple jobs that each trigger and resolve alerts independently, while customizing the logic within the `if` configs allows for more complex page and resolution behavior.
