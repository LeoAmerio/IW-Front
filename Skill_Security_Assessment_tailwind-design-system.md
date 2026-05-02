# Security Assessment: tailwind-design-system

## Executive Summary
- Overall Risk Level: SAFE
- Source: Website listing on FastMCP, upstream source on GitHub
- Evaluation Date: 2026-03-22
- Evaluator: Codex using Agent Skill Evaluator
- Critical Findings: No prompt-injection, data-exfiltration, privilege-escalation, or executable-script patterns were found in the upstream skill content reviewed. The upstream GitHub directory appears to contain only `SKILL.md`.
- Recommendation: USE. This appears to be a documentation-style skill with low security risk.

## Source & Provenance
FastMCP attributes the skill to `wshobson/agents` and links the source to the GitHub directory `plugins/frontend-mobile-development/skills/tailwind-design-system`. The linked repository is public and had approximately 31.6k stars and 3.5k forks at review time, which is a meaningful trust signal for source visibility and community scrutiny.

## Skill Structure Overview
The upstream GitHub directory listing showed a single file: `SKILL.md`. No `scripts/`, `references/`, or `assets/` folders were visible in the source directory reviewed.

## SKILL.md Analysis
### Prompt Injection Detection
No prompt-injection indicators were found. The skill content is domain-specific guidance for Tailwind CSS v4, including examples for tokens, components, and dark mode. It does not include phrases or constructs resembling:
- system prompt override attempts
- role reassignment
- hidden triggers
- instructions to conceal behavior

### Suspicious Behavioral Instructions
No suspicious directives were found. The content stays within normal instructional scope: CSS configuration, component examples, and best practices. It does not instruct the agent to bypass policies, ignore user intent, or take hidden actions.

### Over-Permissioned Requests
No over-permissioned behavior was found. The reviewed content does not request filesystem traversal, credential access, network access, command execution, or access to sensitive user context.

## Scripts Security Analysis
No scripts were present in the reviewed upstream directory, so there was no executable code to analyze.

## References & Assets Analysis
No bundled references or assets were present in the reviewed upstream directory.

## Community Feedback & External Research
Searches for the skill and source returned multiple mirrors and registries reproducing the same content. I did not find public warnings, exploit reports, or community complaints alleging malicious behavior for this skill. That is not proof of safety, but it is consistent with a low-risk documentation skill.

## Attack Pattern Analysis
No matches were found for the high-risk patterns from the evaluator reference:
- No system override or "ignore previous instructions" language
- No data exfiltration instructions or suspicious URLs
- No markdown or script execution payloads
- No encoded or obfuscated instruction blocks
- No privilege-escalation or stealth directives

## Risk Assessment

### Detailed Scoring
| Dimension | Score (0-100) | Justification |
|-----------|---------------|--------------|
| Prompt Injection | 94 | Content is procedural and topical, with no override/manipulation language detected. |
| Code Safety | 96 | No bundled scripts or executable payloads were found in the reviewed source directory. |
| Data Privacy | 97 | No credential access, data collection, or outbound transmission behavior was found. |
| Source Trust | 86 | Public upstream repo with strong visibility; still a third-party skill and not an official vendor source. |
| Functionality | 88 | Behavior matches description: Tailwind design-system guidance and examples. |
| **OVERALL RATING** | **92** | Low-risk instructional skill with transparent source and no malicious indicators found. |

### Threat Summary
- No concrete threats identified from the reviewed source.
- Residual risk: marketplace ZIP could theoretically diverge from the linked GitHub source, but no evidence of divergence was found in the reviewed listing.

### False Positive Analysis
Code-like blocks and URLs are normal examples for Tailwind, React, CVA, Radix, and documentation links. These are consistent with the skill's stated purpose and do not appear to be disguised malicious instructions.

## Final Verdict

**Recommendation**: USE

**Reasoning**: The reviewed skill is a plain instructional `SKILL.md` focused on Tailwind CSS v4 design-system patterns. I found no signs of prompt injection, hidden behavior, script execution, credential access, or exfiltration.

**Specific Concerns**: The only meaningful caveat is supply-chain trust: install from the linked upstream source when possible, and review the ZIP contents before enabling if you download from a marketplace mirror.

**Safe Use Cases**: Tailwind component libraries, tokens/theming, responsive UI patterns, accessibility guidance, and migration planning for Tailwind v4.

**Alternative Skills**: Not needed based on this review.

## Evaluation Limitations
I reviewed the FastMCP listing, the linked upstream GitHub directory, and the raw `SKILL.md`. I did not directly extract the FastMCP ZIP archive in this session, so the assessment assumes the downloadable archive matches the linked source.

## Evidence Appendix
- FastMCP lists the skill source as `https://github.com/wshobson/agents/tree/main/plugins/frontend-mobile-development/skills/tailwind-design-system`.
- The linked GitHub directory shows only `SKILL.md`.
- The raw `SKILL.md` contains Tailwind CSS v4 guidance and examples, including `@theme`, `@custom-variant dark`, CVA component patterns, and utility helpers, with no malicious directives observed.
