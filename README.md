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

## Example usage

In your `steps`:

```yaml
- name: Send PagerDuty alert on failure
  if: ${{ failure() }}
  uses: Entle/action-pagerduty-alert@0.1.0
  with:
    pagerduty-integration-key: '${{ secrets.PAGERDUTY_INTEGRATION_KEY }}'
```

### Setting a dedup_key

You can optionally specify a `dedup_key` for your alert. This will enable PagerDuty to coalesce multiple alerts into one.
More documentation is available [here](https://developer.pagerduty.com/docs/events-api-v2/trigger-events/).

```yaml
- name: Send PagerDuty alert on failure
  if: ${{ failure() }}
  uses: Entle/action-pagerduty-alert@0.1.0
  with:
    pagerduty-integration-key: '${{ secrets.PAGERDUTY_INTEGRATION_KEY }}'
    dedup_key: github_workflow_failed
```