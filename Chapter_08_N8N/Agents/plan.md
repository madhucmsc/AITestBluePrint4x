# Plan: Screenshot → Bug Reporter n8n Agent

## Goal

Build a single n8n workflow that accepts an uploaded UI screenshot (plus optional error-log text),
analyzes it with a **cheap vision model**, drafts a complete, structured bug report, and **automatically
creates a GitHub Issue** in the target repo.

Deliverables (both under `Chapter_08_N8N/Agents/`):

1. `08_Screenshot_To_Bugreport_AIAgent.json` — the importable n8n workflow.
2. `plan.md` — this plan, committed alongside the workflow as project documentation.

Decisions locked in: destination = **GitHub Issue**, vision model = **Gemini 2.5 Flash-Lite**.

---

## Model research — what is actually cheapest for vision

Per-image cost is driven mostly by how many tokens each provider burns on a single image. For the same
1024×1024 screenshot the spread is ~5x in tokens and ~13x in dollars.

| Model | Vision accuracy | Input cost / M tokens | Tokens per 1024×1024 img | ~Cost per image | n8n support | Notes |
|---|---|---|---|---|---|---|
| **Gemini 2.5 Flash-Lite** | Good | ~$0.10 | ~258 | ~$0.0001–0.0005 | Native `lmChatGoogleGemini` | **Chosen.** Cheapest credible vision + free tier + efficient tokenizer |
| Qwen2.5-VL (OpenRouter) | Basic | ~$0.50 | ~600 | ~$0.0003 | Native `lmChatOpenRouter` (needs OpenRouter cred) | Cheapest raw $/image, lower accuracy, weaker on dense text |
| OpenAI gpt-5-mini / gpt-4o-mini | Very good | ~$0.25 | ~765 | ~$0.0019 | Native `lmChatOpenAi` | Already-have credential fallback; ~4x Gemini cost/image |
| Claude Haiku | Very good | ~$3.00 | ~1,334 | ~$0.0040 | Native `lmChatAnthropic` | Best for document/OCR, most expensive per image |
| Ollama qwen2.5-vl / llava | Basic–good | $0 | n/a | $0 | Native `lmChatOllama` | Only truly free; needs a GPU host reachable from n8n |

**Recommendation: Gemini 2.5 Flash-Lite.** It is the cheapest hosted option with reliable screenshot
understanding, has the most efficient image tokenizer (~258 tokens vs ~765 for OpenAI), ships a native
n8n node, and has a free tier for low-volume QA use. Fallback in the same workflow: swap the chat-model
sub-node to `lmChatOpenAi` (`gpt-5-mini`) reusing the existing `n8n free OpenAI API credits` credential —
no other node changes needed.

*Sources:* [Vision API Comparison 2026 (TokenMix)](https://tokenmix.ai/blog/vision-api-comparison),
[Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing).

---

## Architecture

```
Webhook (POST, binary image)  ──main──▶  AI Agent (vision passthrough + output parser)
                                             ▲                ▲
                     ai_languageModel ───────┘                │
                     Google Gemini Chat Model (gemini-2.5-flash-lite)
                                                              │
                     ai_outputParser ─────────────────────────┘
                     Structured Output Parser
                                             │ main
                                             ▼
                                     Code: Build Bug Report  (JSON → markdown title/body/labels)
                                             │ main
                                             ▼
                                     GitHub: Create Issue  (owner/repo from payload)
```

Why the **AI Agent** node: it is the n8n node that supports `options.passthroughBinaryImages: true`,
which lets a vision-capable chat model *see* the uploaded screenshot, while also accepting a
`Structured Output Parser` on its `ai_outputParser` port. That gives us one model call that both sees
the image and returns schema-validated JSON — no fragile "please reply in JSON" prompt.

---

## Node-by-node spec

1. **Webhook** (`n8n-nodes-base.webhook`)
   - Method `POST`, path `screenshot-bug-reporter`, response mode `lastNode`, binary property `data`.
   - Expects a multipart file field named `data` + optional fields `error_log`, `repo_owner`,
     `repo_name`, `environment`.

2. **AI Agent** (`@n8n/n8n-nodes-langchain.agent`, typeVersion 3.1)
   - `promptType: "define"`; `text` injects the optional error log + environment metadata.
   - `options.passthroughBinaryImages: true` → image reaches the vision model.
   - `options.systemMessage` — QA bug-report prompt (facts only, numbered steps, severity rubric).
   - `hasOutputParser: true`.

3. **Google Gemini Chat Model** (`@n8n/n8n-nodes-langchain.lmChatGoogleGemini`)
   - Model `models/gemini-2.5-flash-lite`, temperature `0.2`, wired `ai_languageModel` → Agent.
   - Credential: **Google Gemini (PaLM) API** (`googlePalmApi`) — user supplies the API key.
   - Fallback: replace with `lmChatOpenAi` / `gpt-5-mini` (no other wiring changes).

4. **Structured Output Parser** (`@n8n/n8n-nodes-langchain.outputParserStructured`)
   - Manual JSON schema (below), wired `ai_outputParser` → Agent.

5. **Code — "Build Bug Report"** (`n8n-nodes-base.code`, Run Once for All Items)
   - Reads the parser JSON (handles both direct object and `output` variants), builds `issue_title`,
     markdown `issue_body`, `labels` (`bug` + `severity:<level>`), and reads `repo_owner`/`repo_name`
     straight from the Webhook node so metadata survives the Agent.

6. **GitHub — Create Issue** (`n8n-nodes-base.github`)
   - `resource: issue`, `operation: create`, `owner`/`repository`/`title`/`body`/`labels` expressions.
   - Credential: `githubApi` (PAT with `repo` / `issues:write`).

---

## Structured output schema

```json
{
  "bug_title": "string",
  "severity": "Critical | High | Medium | Low",
  "summary": "string",
  "steps_to_reproduce": ["string"],
  "expected_result": "string",
  "actual_result": "string",
  "visual_details": "string",
  "environment": "string",
  "labels": ["string"]
}
```

---

## Testing

1. Import `08_Screenshot_To_Bugreport_AIAgent.json` into n8n.
2. Attach Google Gemini + GitHub credentials (no keys are hardcoded in the JSON).
3. `POST` a real screenshot to the webhook (curl example lives in the workflow's setup sticky note).
4. Verify: Agent returns schema-valid JSON → Code node produces a well-formatted body → a GitHub issue
   appears in the target repo with the `bug` label.
5. Failure paths: non-image upload, missing optional fields, invalid GitHub repo → confirm the Code
   node defaults keep the run from hard-failing.

## Fallback / follow-ups (only if vision passthrough misbehaves)

- Two-step variant: `Webhook → Google Gemini (Image: Analyze) → Basic LLM Chain (text) + Structured
  Output Parser → GitHub`. Slightly more expensive (two calls) but decouples vision from parsing.
- Optional later: dedupe existing GitHub issues by title, attach the screenshot to the issue body,
  or mirror to Jira.
