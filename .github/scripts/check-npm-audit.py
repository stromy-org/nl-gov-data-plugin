#!/usr/bin/env python3
"""Run npm audit, filter via .audit-allowlist.json, enforce review_by dates.

Allowlist schema (.audit-allowlist.json at repo root):
  {
    "version": 1,
    "advisories": [
      {
        "ghsa": "GHSA-xxxx-xxxx-xxxx",
        "package": "lodash-es",
        "reason": "Upstream chevrotain bundles vulnerable lodash-es — no fix available.",
        "review_by": "2026-08-20"
      }
    ]
  }

Behavior:
- If allowlist contains entries whose review_by is in the past → FAIL (forces re-evaluation).
- Run npm audit; for every high/critical advisory not in allowlist → FAIL.
- All clean or all-allowlisted → PASS.
"""
import datetime
import json
import pathlib
import re
import subprocess
import sys

if not pathlib.Path("package.json").exists():
    print("No package.json — skipping npm audit.")
    sys.exit(0)

ALLOWLIST_PATH = pathlib.Path(".audit-allowlist.json")
TODAY = datetime.date.today().isoformat()

allowed = set()
if ALLOWLIST_PATH.exists():
    data = json.loads(ALLOWLIST_PATH.read_text())
    advisories = data.get("advisories", [])
    expired = [a for a in advisories if a.get("review_by", "9999-12-31") < TODAY]
    if expired:
        print(f"❌ Allowlist entries past review date (today={TODAY}):")
        for a in expired:
            print(f"  {a['ghsa']} ({a.get('package', '?')}) — review_by: {a['review_by']}")
        print()
        print("Re-evaluate these advisories — extend review_by, remove the entry if upstream fixed, or document the decision.")
        sys.exit(1)
    allowed = {a["ghsa"] for a in advisories}

result = subprocess.run(
    ["npm", "audit", "--json"],
    capture_output=True,
    text=True,
    check=False,
)
try:
    audit = json.loads(result.stdout or "{}")
except json.JSONDecodeError:
    print("❌ Could not parse npm audit output:")
    print(result.stdout[:500])
    sys.exit(1)

ghsa_re = re.compile(r"GHSA-[a-z0-9-]+", re.I)
unresolved = []
for pkg_name, vuln in audit.get("vulnerabilities", {}).items():
    severity = vuln.get("severity", "")
    if severity not in ("high", "critical"):
        continue
    for via in vuln.get("via", []):
        if not isinstance(via, dict):
            continue
        url = via.get("url", "")
        m = ghsa_re.search(url)
        if not m:
            continue
        ghsa = m.group(0)
        if ghsa not in allowed:
            unresolved.append((severity, ghsa, pkg_name, via.get("title", "")))

if unresolved:
    print(f"❌ Unresolved high/critical advisories (today={TODAY}, {len(allowed)} allowlisted):")
    for severity, ghsa, pkg, title in sorted(set(unresolved)):
        print(f"  [{severity}] {ghsa}  {pkg}  —  {title[:80]}")
    print()
    print("Resolve by either:")
    print("  1. Bumping the affected dep (or running `npm audit fix`),")
    print("  2. If upstream has no fix, add to .audit-allowlist.json with a review_by date (≤6 months out).")
    sys.exit(1)

print(f"✅ npm audit clean ({len(allowed)} advisories allowlisted, all review_by dates valid).")
