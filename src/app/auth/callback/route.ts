import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import {
  TEMPLATE_STRIPE_LINK,
  BASIC_DOMAIN_BRIDGE_SUBSCRIPTION_LINK,
  PRO_DOMAIN_BRIDGE_SUBSCRIPTION_LINK,
} from "@/utils/constants";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect = requestUrl.searchParams.get("redirect") || "/dashboard";
  console.log("HITTING AUTH");
  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Handle special redirect cases
  let finalRedirect = redirect;
  if (redirect === "/buy-template") {
    finalRedirect = TEMPLATE_STRIPE_LINK;
  }
  if (redirect === "/buy-basic-subscription") {
    finalRedirect = BASIC_DOMAIN_BRIDGE_SUBSCRIPTION_LINK;
  }
  if (redirect === "/buy-pro-subscription") {
    finalRedirect = PRO_DOMAIN_BRIDGE_SUBSCRIPTION_LINK;
  }

  // For external URLs (like Stripe), use the full URL
  if (finalRedirect.startsWith("http")) {
    return NextResponse.redirect(finalRedirect);
  }

  console.log({ finalRedirect });

  // For internal routes, use the origin + path
  return NextResponse.redirect(`${requestUrl.origin}${finalRedirect}`);
}
