import { openLawsClient } from './server/services/openlaws-client';

async function checkOpenLaws() {
  console.log('Checking OpenLaws API availability...');
  const availability = await openLawsClient.checkAvailability();
  console.log(availability);
  
  if (availability.available) {
    // The API returns jurisdiction codes when checking availability
    console.log('\nAttempting to fetch jurisdictions...');
  }
}

checkOpenLaws().catch(console.error);
