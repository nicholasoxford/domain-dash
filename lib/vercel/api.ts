import { headers } from "next/headers";

const VERCEL_API_URL = "https://api.vercel.com";

// Add this to ensure these functions only run on the server
if (typeof window !== "undefined") {
  throw new Error("This module can only be used on the server");
}

export async function addDomainToVercel(projectId: string, domain: string) {
  // First add the www subdomain as the main target
  console.log({ projectId, domain });
  const wwwDomain = `www.${domain}`;

  const wwwResponse = await fetch(
    `${VERCEL_API_URL}/v10/projects/${projectId}/domains`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: wwwDomain,
      }),
    }
  );

  if (!wwwResponse.ok) {
    const error = await wwwResponse.statusText;
    throw new Error(
      `API Error: Failed to add www subdomain to Vercel: ${error}`
    );
  }

  // Then add the base domain with redirect to www
  const response = await fetch(
    `${VERCEL_API_URL}/v10/projects/${projectId}/domains`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: domain,
        redirect: wwwDomain,
        redirectStatusCode: 308, // Permanent redirect
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();

    // Handle domain conflict case
    if (response.status === 409) {
      try {
        await removeDomainFromVercel(domain);
        await removeDomainFromVercel(wwwDomain);

        // Try adding the domains again
        return await addDomainToVercel(projectId, domain);
      } catch (removeError: any) {
        throw new Error(
          `Domain is already in use and could not be reassigned: ${removeError.message}`
        );
      }
    }

    throw new Error(
      `API Error: Failed to add domain to Vercel: ${error.message}`
    );
  }

  return wwwResponse.json();
}

export async function removeDomainFromVercel(domain: string) {
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!projectId) {
    throw new Error("VERCEL_PROJECT_ID is not configured");
  }
  console.log("REMOVING DOMAIN: ", domain);

  // Try to remove the www subdomain
  try {
    const wwwDomain = `www.${domain}`;
    console.log("REMOVING WWW DOMAIN: ", wwwDomain);
    await fetch(
      `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${wwwDomain}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
        },
      }
    );
  } catch (error) {
    console.error("Error removing www subdomain:", error);
    // Continue since main domain was removed successfully
  }
  // Remove the main domain
  const response = await fetch(
    `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    const error = response.statusText;
    throw new Error(`Failed to remove domain from Vercel: ${error}`);
  }

  return true;
}

export async function checkDomainVerification(domain: string) {
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!projectId) {
    throw new Error("VERCEL_PROJECT_ID is not configured");
  }

  const wwwDomain = `www.${domain}`;

  // Run all API calls in parallel
  const [
    mainConfigResponse,
    mainDomainResponse,
    mainVerifyResponse,
    wwwConfigResponse,
    wwwDomainResponse,
    wwwVerifyResponse,
  ] = await Promise.all([
    // Main domain config
    fetch(`${VERCEL_API_URL}/v6/domains/${domain}/config`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_CONFIG_ACCESS_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .catch(() => null),

    // Main domain status
    fetch(`${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
      },
    }).then((res) => res.json()),

    // Main domain verify
    fetch(
      `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}/verify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
        },
      }
    )
      .then((res) => res.json())
      .catch(() => null),

    // WWW domain config
    fetch(`${VERCEL_API_URL}/v6/domains/${wwwDomain}/config`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_CONFIG_ACCESS_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .catch(() => null),

    // WWW domain status
    fetch(`${VERCEL_API_URL}/v9/projects/${projectId}/domains/${wwwDomain}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .catch(() => null),

    // WWW domain verify
    fetch(
      `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${wwwDomain}/verify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
        },
      }
    )
      .then((res) => res.json())
      .catch(() => null),
  ]);

  // If main domain check failed
  if (mainDomainResponse.error) {
    throw new Error(
      mainDomainResponse.error?.message || "Failed to check domain status"
    );
  }

  return {
    verified:
      mainDomainResponse.verified && (wwwDomainResponse?.verified ?? true),
    error:
      mainDomainResponse.verification?.[0]?.reason ||
      mainDomainResponse.error?.message,
    verification: {
      main: mainDomainResponse.verification,
      www: wwwDomainResponse?.verification || null,
    },
    configuration: {
      main: mainConfigResponse
        ? {
            configuredBy: mainConfigResponse.configuredBy,
            acceptedChallenges: mainConfigResponse.acceptedChallenges,
            misconfigured: mainConfigResponse.misconfigured,
          }
        : null,
      www: wwwConfigResponse
        ? {
            configuredBy: wwwConfigResponse.configuredBy,
            acceptedChallenges: wwwConfigResponse.acceptedChallenges,
            misconfigured: wwwConfigResponse.misconfigured,
          }
        : null,
    },
    verifyStatus: {
      main: mainVerifyResponse,
      www: wwwVerifyResponse,
    },
  };
}