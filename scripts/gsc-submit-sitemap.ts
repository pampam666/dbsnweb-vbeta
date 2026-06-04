import crypto from 'crypto';

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

// Target domains and their respective sitemaps
const SUBMISSIONS = [
  // 1. Domain Property Submission (covers all subdomains)
  {
    siteUrl: 'sc-domain:sentradaya.com',
    sitemaps: [
      'https://sentradaya.com/sitemap.xml',
      'https://pju.sentradaya.com/sitemap.xml',
      'https://solarcell.sentradaya.com/sitemap.xml',
      'https://alatpetir.sentradaya.com/sitemap.xml',
      'https://baterai.sentradaya.com/sitemap.xml'
    ]
  },
  // 2. Individual URL-prefix fallbacks for granular control
  {
    siteUrl: 'https://sentradaya.com/',
    sitemaps: ['https://sentradaya.com/sitemap.xml']
  },
  {
    siteUrl: 'https://pju.sentradaya.com/',
    sitemaps: ['https://pju.sentradaya.com/sitemap.xml']
  },
  {
    siteUrl: 'https://solarcell.sentradaya.com/',
    sitemaps: ['https://solarcell.sentradaya.com/sitemap.xml']
  },
  {
    siteUrl: 'https://alatpetir.sentradaya.com/',
    sitemaps: ['https://alatpetir.sentradaya.com/sitemap.xml']
  },
  {
    siteUrl: 'https://baterai.sentradaya.com/',
    sitemaps: ['https://baterai.sentradaya.com/sitemap.xml']
  }
];

// Helper to convert buffers or strings to base64url format
function base64url(str: string | Buffer): string {
  const base64 = typeof str === 'string' ? Buffer.from(str).toString('base64') : str.toString('base64');
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Signs a JWT assertion and exchanges it for a Google OAuth2 access token
 */
async function getAccessToken(serviceAccount: ServiceAccount): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const claimSet = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud: serviceAccount.token_uri || 'https://oauth2.googleapis.com/token',
    exp,
    iat
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedClaimSet = base64url(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  // Sign using Node's native crypto module
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(serviceAccount.private_key);
  const encodedSignature = base64url(signature);

  const jwt = `${signatureInput}.${encodedSignature}`;

  const response = await fetch(serviceAccount.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }).toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to obtain Google access token: ${response.statusText} - ${errorText}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

/**
 * Submits a sitemap URL to the Google Search Console API for a specific property
 */
async function submitSitemap(siteUrl: string, sitemapUrl: string, accessToken: string): Promise<boolean> {
  const apiEndpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

  const response = await fetch(apiEndpoint, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Length': '0' // Endpoint expects a PUT request with no body, but Content-Length header is good practice
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Failed to submit sitemap "${sitemapUrl}" to site "${siteUrl}": ${response.status} ${response.statusText}`);
    console.error(`   Error details: ${errorText}`);
    return false;
  }

  console.log(`✅ Successfully submitted sitemap "${sitemapUrl}" to site "${siteUrl}"`);
  return true;
}

/**
 * Main script execution
 */
async function main() {
  const credentialsJson = process.env.GSC_SERVICE_ACCOUNT_JSON;
  const isForceDryRun = process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true';

  let serviceAccount: ServiceAccount | null = null;
  let isDryRun = isForceDryRun;

  console.log('==================================================');
  console.log('🚀 Google Search Console Sitemap Submitter');
  console.log('==================================================\n');

  if (!credentialsJson) {
    console.log('⚠️  No GSC_SERVICE_ACCOUNT_JSON found in environment.');
    console.log('👉 Running in DRY-RUN mode. To execute live, set GSC_SERVICE_ACCOUNT_JSON in your environment.');
    isDryRun = true;
  } else {
    try {
      serviceAccount = JSON.parse(credentialsJson) as ServiceAccount;
      
      // Basic checks to detect mock credentials
      if (
        !serviceAccount.client_email || 
        !serviceAccount.private_key || 
        serviceAccount.client_email.includes('your_') || 
        serviceAccount.private_key.includes('mock') || 
        serviceAccount.private_key === 'mock'
      ) {
        console.log('⚠️  Detected mock or incomplete service account credentials.');
        console.log('👉 Running in DRY-RUN mode.');
        isDryRun = true;
      }
    } catch (e) {
      console.error('❌ Failed to parse GSC_SERVICE_ACCOUNT_JSON environment variable.');
      console.log('👉 Running in DRY-RUN mode.');
      isDryRun = true;
    }
  }

  if (isDryRun) {
    console.log('\n--- 📝 DRY-RUN SUBMISSION SUMMARY ---');
    console.log(`Email (Service Account): ${serviceAccount?.client_email || 'mock-service-account@gserviceaccount.com'}`);
    console.log('Target properties & sitemaps to submit:');
    
    for (const item of SUBMISSIONS) {
      console.log(`\nSite Property: "${item.siteUrl}"`);
      for (const sitemap of item.sitemaps) {
        const mockApiUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(item.siteUrl)}/sitemaps/${encodeURIComponent(sitemap)}`;
        console.log(`  - Sitemap: ${sitemap}`);
        console.log(`    API URL: PUT ${mockApiUrl}`);
      }
    }
    console.log('\n==================================================');
    console.log('📝 Dry run completed. No real API requests were sent.');
    console.log('==================================================');
    return;
  }

  if (!serviceAccount) {
    console.error('❌ Service account configuration is unexpectedly null. Aborting.');
    process.exit(1);
  }

  try {
    console.log(`🔑 Authenticating service account: ${serviceAccount.client_email}...`);
    const accessToken = await getAccessToken(serviceAccount);
    console.log('🔑 Authentication successful! Beginning sitemap submissions...\n');

    let successCount = 0;
    let failCount = 0;

    for (const item of SUBMISSIONS) {
      console.log(`\nProcessing Site Property: "${item.siteUrl}"`);
      for (const sitemap of item.sitemaps) {
        const success = await submitSitemap(item.siteUrl, sitemap, accessToken);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      }
    }

    console.log('\n==================================================');
    console.log(`🎉 Sitemap submission completed.`);
    console.log(`   Successes: ${successCount}`);
    console.log(`   Failures:  ${failCount}`);
    console.log('==================================================');

    if (failCount > 0) {
      console.log('💡 Note: Failures are common if GSC properties are not verified yet or permissions are missing.');
    }
  } catch (error) {
    console.error('\n❌ Fatal error during sitemap submission process:');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

main();
