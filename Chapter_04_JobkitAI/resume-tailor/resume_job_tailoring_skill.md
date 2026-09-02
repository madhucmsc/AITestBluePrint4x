# Skill: Job-Specific Resume Tailoring

## Purpose
Use this skill whenever the user provides:
1. An older/master resume, and
2. A job description (JD), either pasted as text, provided as a simple list, or uploaded as an Excel/Word/PDF file.

The goal is to create a job-specific, ATS-friendly resume that is faithful to the user's real experience and can be copied directly into Google Docs.

## Source-of-truth rule
Treat the user's master/older resume as the source of truth for employment history, responsibilities, tools, certifications, education, and other factual claims.

Treat the JD as the source of truth for:
- Required skills
- Preferred skills
- Responsibilities
- Domain terminology
- Seniority expectations
- Keywords and ATS phrases

Never invent experience, projects, employers, certifications, tools, metrics, titles, dates, or achievements that are not supported by the user's resume or information explicitly provided by the user.

If a JD asks for something not supported by the resume:
- Do not claim it as experience.
- If it is genuinely adjacent, use careful wording such as "exposure to" only when the source supports that exposure.
- Otherwise leave it out or identify it as a gap.

## Standard workflow

### Step 1 — Read the master resume
Extract and organize:
- Current/target professional title
- Total experience
- Employers and dates
- Job titles
- Key responsibilities
- Functional testing experience
- Automation experience
- Tools/frameworks
- Programming/database skills
- Domains and applications
- Certifications
- Education
- Leadership/client-facing experience
- Agile/Scrum experience
- Integration/API experience

For the current master resume, known source-supported experience includes:
- 10+ years of professional experience
- Accenture India Private Limited: QA Test Lead, Jun 2021–Present
- Accenture India Private Limited: Application Developer Senior Analyst, Dec 2019–May 2021
- Accenture India Private Limited: Application Developer Analyst, Apr 2017–Nov 2019
- Rolta India Pvt. Ltd.: Software Engineer, Oct 2014–Mar 2017
- Veeva CRM, Veeva Align, and Veeva Vault testing
- Worksoft Certify automation
- Salesforce Classic to Salesforce Lightning automation migration
- Selenium WebDriver with Java/TestNG and a Hybrid Framework
- REST and SOAP UI testing
- SQL and database validation
- HP ALM and Jira
- Team leadership/mentoring and client-facing demos
- Salesforce Administrator (ADM 201), Veeva CRM, and Salesforce AI Associate certifications
- B.Tech in CSE from JNTUA University, 2012

These facts are examples from the supplied master resume; always re-check the actual source before finalizing.

### Step 2 — Read and normalize the JD
Convert the JD into a requirement matrix:
- Must-have skills
- Nice-to-have skills
- Primary responsibilities
- Tools/technologies
- Domain knowledge
- Leadership/stakeholder expectations
- Certifications
- Education
- Keywords/phrases likely to matter for ATS

If the JD is in Excel, inspect all relevant sheets/columns. If it is in Word/PDF, read the complete relevant content.

### Step 3 — Match the JD against the resume
Create three internal buckets:
1. Strong match — directly supported by the resume.
2. Transferable/adjacent match — related experience exists but wording should remain accurate.
3. Gap — requested by the JD but not supported by the resume.

Prioritize strong matches first.

### Step 4 — Tailor the resume
Produce a polished resume with this preferred structure:

1. Name and contact information
2. Targeted professional headline
3. Professional summary
4. Core skills / technical skills
5. Professional experience
6. Education
7. Certifications

Use the JD's terminology naturally where it accurately describes the user's experience.

### Step 5 — Optimize for ATS without keyword stuffing
- Put the most relevant JD keywords in the summary, skills, and applicable experience bullets.
- Prefer standard job-title and technology names.
- Use clear section headings.
- Avoid tables, text boxes, graphics, icons, excessive columns, headers/footers, and decorative formatting when the goal is ATS compatibility.
- Do not repeat the same keyword unnaturally.
- Keep bullets concise and achievement-oriented where the source supports achievements.

### Step 6 — Create multiple resume versions when useful
Unless the user asks for only one version, create up to three differentiated versions when the JD supports it:

**Version 1 — ATS / Best Match**
- Maximum alignment to the JD while remaining factual.
- Best default version.

**Version 2 — Leadership / Senior Profile**
- Emphasize QA leadership, ownership, stakeholder/client interaction, mentoring, planning, estimation, and delivery.

**Version 3 — Technical / Automation Profile**
- Emphasize automation, Worksoft Certify, Selenium, Java, API testing, integration testing, frameworks, regression, and technical depth.

Do not create three versions merely by changing a few words. Each should have a distinct positioning strategy.

## Resume writing rules
- Use strong action verbs.
- Prefer concise bullets.
- Combine duplicate responsibilities.
- Remove outdated objective statements when a professional summary is more effective.
- Do not add percentages, savings, team sizes, or other metrics unless supported by the source.
- Preserve employment dates and factual chronology.
- Avoid first-person language.
- Avoid vague claims such as "hardworking" unless specifically relevant.
- Keep the resume normally within 2–3 pages for a 10+ year profile unless the JD requires more detail.
- Keep terminology consistent throughout the resume.

## JD-to-resume mapping
Before writing the final resume, internally map important JD requirements to exact resume evidence.

Example format:
- JD: "Veeva CRM testing" → Resume evidence: Veeva CRM end-to-end testing.
- JD: "Worksoft Certify" → Resume evidence: automation script development/execution and reusable components.
- JD: "Salesforce Lightning" → Resume evidence: migration of automation scripts from Salesforce Classic to Lightning.
- JD: "API testing" → Resume evidence: REST and SOAP UI testing.
- JD: "Leadership" → Resume evidence: led 3 QA resources, task assignment, progress tracking, mentoring.

If there is no evidence, do not fabricate it.

## Handling missing JD information
If the user gives only a simple list of requirements, treat that list as the JD.

If the user provides an Excel file:
- Read the relevant worksheet(s).
- Extract the JD without changing its meaning.
- Use the same tailoring workflow.

If the JD is incomplete, still produce the best supported resume and clearly state which areas could not be validated.

## Final response format
When the user asks for a tailored resume:
1. Briefly state the positioning used.
2. Provide the finished resume in a clean Google-Docs-friendly format.
3. If multiple versions are requested or useful, provide up to three versions.
4. Optionally provide a short "JD Match Highlights" section listing the strongest matches and any important gaps.
5. Do not claim a skill is present merely because it appears in the JD.

## Repeatable command
For future applications, the user can simply provide:
"Use my master resume + this JD and create the best ATS resume, plus leadership and technical versions if appropriate."

Then apply this skill from start to finish.
