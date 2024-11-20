/**
 * Trigger a PagerDuty alert with the given alert object
 *
 * @param {Object} alert - Alert object to send to PagerDuty
 * @param {Object} alert.payload - Alert payload
 * @param {string} alert.payload.summary - Incident summary
 * @param {string} alert.payload.timestamp - Incident timestamp
 * @param {string} alert.payload.source - Incident source
 * @param {string} alert.payload.severity - Incident severity
 * @param {Object} alert.payload.custom_details - Used to provide context
 * @param {string} alert.routing_key - PagerDuty integration key
 * @param {string} alert.event_action - PagerDuty event action
 * @param {string} alert.dedup_key - PagerDuty deduplication key
 * @returns {Promise<void>} - Promise that resolves when the alert is sent
 */
export default async function sendAlert(alert) {
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
