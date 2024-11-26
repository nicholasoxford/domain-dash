"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  notes: string[];
}

interface VerificationState {
  status: "pending" | "verified" | "failed";
  verificationDetails: any;
  error: string | null;
}

export function DomainVerification({ domain }: { domain: string }) {
  const [state, setState] = useState<VerificationState>({
    status: "pending",
    verificationDetails: null,
    error: null,
  });
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  const getRequiredDNSRecords = (): DNSRecord[] => {
    const records = [
      {
        type: "A",
        name: "@",
        value: "76.76.21.21",
        notes: [
          "@ represents your base domain",
          "Points your base domain to Vercel's servers",
          "If using Cloudflare, set Proxy status to 'DNS only' (grey cloud)",
        ],
        required: true,
      },
      {
        type: "CNAME",
        name: "www",
        value: "cname.vercel-dns.com",
        notes: [
          "Points your www subdomain to Vercel",
          "If using Cloudflare, set Proxy status to 'DNS only' (grey cloud)",
        ],
        required: true,
      },
    ];

    // Add TXT records if verification is needed
    if (state.verificationDetails?.verification?.main?.[0]) {
      records.push({
        type: "TXT",
        name: state.verificationDetails.verification.main[0].domain,
        value: state.verificationDetails.verification.main[0].value,
        notes: ["Required for domain verification"],
        required: true,
      });
    }

    if (state.verificationDetails?.verification?.www?.[0]) {
      records.push({
        type: "TXT",
        name: state.verificationDetails.verification.www[0].domain,
        value: state.verificationDetails.verification.www[0].value,
        notes: ["Required for www subdomain verification"],
        required: true,
      });
    }

    return records;
  };

  const checkVerification = async () => {
    try {
      setState((prev) => ({ ...prev, status: "pending" }));
      const response = await fetch(`/api/domains/${domain}/verify`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to verify domain");
      }

      const isVerified =
        result.verifyStatus?.main?.verified &&
        result.verifyStatus?.www?.verified;
      const isConfigured =
        !result.configuration?.main?.misconfigured &&
        !result.configuration?.www?.misconfigured;

      setState({
        status: isVerified && isConfigured ? "verified" : "failed",
        verificationDetails: result,
        error: !isVerified
          ? "Domain verification pending"
          : !isConfigured
          ? "DNS records need to be configured"
          : null,
      });
    } catch (error: any) {
      setState({
        status: "failed",
        verificationDetails: null,
        error: error.message,
      });
    } finally {
      setCountdown(5);
    }
  };

  useEffect(() => {
    checkVerification();
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          checkVerification();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [domain]);

  const CopyButton = ({ value }: { value: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-slate-700/50 rounded transition-colors"
        title="Copy to clipboard"
      >
        {copied ? (
          <svg
            className="w-4 h-4 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-slate-400 hover:text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
        )}
      </button>
    );
  };

  const renderDNSRecord = (
    record: DNSRecord,
    isConfigured: boolean = false,
    isVerified: boolean = false
  ) => (
    <div key={record.type} className="bg-slate-900/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              record.type === "A" || record.type === "CNAME"
                ? isConfigured
                  ? "bg-green-500"
                  : "bg-yellow-500"
                : "bg-yellow-500"
            }`}
          />
          <span className="text-sm font-medium text-slate-300">Status:</span>
          <div
            className={`px-2 py-0.5 rounded text-xs ${
              record.type === "A" || record.type === "CNAME"
                ? isConfigured
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
            }`}
          >
            {record.type === "A" || record.type === "CNAME"
              ? isConfigured
                ? "Active"
                : "Pending"
              : "Pending Verification"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-slate-400 mb-1">Type</div>
          <div className="font-mono text-purple-400">{record.type}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Name</div>
          <div className="font-mono text-purple-400 break-all">
            {record.name}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Value</div>
          <div className="flex items-center gap-2">
            <div className="font-mono text-slate-300 break-all overflow-hidden">
              {record.value}
            </div>
            <CopyButton value={record.value} />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700/50 mt-3 pt-3">
        <div className="text-xs text-slate-400">
          {record.notes.map((note, i) => (
            <div key={i} className="flex items-center gap-2 mt-1">
              <span
                className={`${
                  note.includes("Cloudflare")
                    ? "text-blue-400"
                    : "text-purple-400"
                }`}
              >
                {note.includes("Cloudflare") ? "⚠️" : "•"}
              </span>
              <span
                className={note.includes("Cloudflare") ? "text-blue-300" : ""}
              >
                {note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const isFullyVerified =
    state.verificationDetails &&
    (!state.verificationDetails.verifyStatus?.main?.error ||
      state.verificationDetails.verifyStatus?.main?.verified) &&
    (!state.verificationDetails.verifyStatus?.www?.error ||
      state.verificationDetails.verifyStatus?.www?.verified) &&
    !state.verificationDetails.configuration?.main?.misconfigured &&
    !state.verificationDetails.configuration?.www?.misconfigured;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            DNS Configuration Status
          </h2>
          {isFullyVerified && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-700 text-white rounded-md transition-colors"
              >
                Back to Dashboard
              </button>
              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
              >
                Visit Site
              </a>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {getRequiredDNSRecords().map((record) => {
            const isBase = record.name === "@";
            const data = isBase
              ? state.verificationDetails?.verifyStatus?.main
              : state.verificationDetails?.verifyStatus?.www;
            const config = isBase
              ? state.verificationDetails?.configuration?.main
              : state.verificationDetails?.configuration?.www;

            const isConfigured =
              record.type === "A" || record.type === "CNAME"
                ? config && !config.misconfigured
                : false;

            const isVerified =
              record.type === "TXT"
                ? !data?.error
                : data?.verified || !data?.error;

            return renderDNSRecord(record, isConfigured, isVerified);
          })}

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Important Notes:
            </div>
            <ul className="space-y-1 ml-6 list-disc">
              <li>DNS changes may take up to 48 hours to propagate</li>
              <li>The base domain will redirect to www automatically</li>
              <li>Both records are required for proper setup</li>
            </ul>
          </div>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {state.error}
        </div>
      )}

      <div className="text-sm text-slate-400">
        Next check in {countdown} seconds...
      </div>
    </div>
  );
}
