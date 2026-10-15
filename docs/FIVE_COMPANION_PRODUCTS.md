# Five Companion Products — Build-Ready Briefs

These concepts are approved candidates for preparation, not claims that the apps already exist. InvoiceForge launch blockers remain the top priority. Each product should be built only after the current site and Sandbox payment-to-delivery path pass their release checks.

## Shared product principles

- Browser-first, responsive, usable without an account where practical.
- Reuse the same Micro Tools Studio form, validation, navigation, print/PDF, accessible controls, and analytics patterns.
- Do not store personal or sensitive data unnecessarily; explain what is processed and where.
- Every app must provide a useful result, clear limitations, and error states.
- No subscriptions until ongoing value is proven; no claims of legal, HR, tax, or accessibility compliance.
- Proposed prices are hypotheses and must be tested. Do not sell a feature until it works.
- Each product gets a niche landing page, an honest feature list, a free sample where useful, and a bundle only after the included products work.

## 1. Client Website QA & Accessibility Report Builder

**Audience:** Freelance web designers and small digital agencies.

**Core promise:** Turn a repeatable website review into a prioritized, client-ready report.

**MVP inputs**
- Project/client name, site URL, review date, reviewer.
- Checklist areas: keyboard navigation, headings/structure, forms and labels, links, image alternatives, contrast review, mobile layout, focus visibility.
- Finding title, category, severity, status, notes, and recommended next step.

**MVP outputs**
- Summary counts by severity/status.
- Prioritized action list.
- Print-friendly/PDF client report.
- Save/export and re-open a local project file where feasible.

**Must not claim:** Full automated accessibility audit, certification, or legal compliance. Clearly label this as a guided/manual QA report and encourage specialist review for complex issues.

**Acceptance checks**
- Every checklist item can be marked not checked / pass / needs review / not applicable.
- Report includes date, site URL, findings, severity, and limitations.
- Keyboard operation, readable focus, mobile layout, and print output tested.
- No website crawling or third-party scan integration in the MVP.

**Bundle:** Website Launch & Accessibility Toolkit.

## 2. AI & Software Subscription Cost Optimizer

**Audience:** Freelancers and small businesses paying for several software or AI tools.

**Core promise:** See monthly/annual software spend and compare user-entered alternatives.

**MVP inputs**
- Tool name, category, price, billing interval, renewal date, usage status, optional notes.
- Proposed replacement plan and estimated cost entered by the user.

**MVP outputs**
- Monthly equivalent and annualized totals.
- User-identified unused/overlapping tools list.
- Current-versus-proposed comparison and clearly labeled estimated difference.
- Renewal review checklist and exportable summary.

**Must not claim:** Verified savings, live provider prices, or automatic cancellation. Keep all assumptions editable and label the date of any manually entered prices.

**Acceptance checks**
- Correct monthly/annual conversion for common billing intervals.
- Empty/invalid prices handled safely.
- Totals update after edits and exclude items explicitly marked excluded.
- Results explain that savings are estimates based on user-entered data.

**Bundle:** Small Business AI & Software Efficiency Kit.

## 3. Tutor Lesson Follow-Up & Progress Report Builder

**Audience:** Independent tutors and small tutoring businesses.

**Core promise:** Turn one lesson record into a lesson summary, next-session plan, and parent/client update.

**MVP inputs**
- Subject, lesson date, learning goals, work completed, strengths, areas to practice, next steps.
- Optional first name or initials only; discourage sensitive personal data.

**MVP outputs**
- Structured lesson note.
- Suggested follow-up activities/homework editable by tutor.
- Next-session agenda.
- Parent/client update draft for human review.

**Must not do:** Automatically send messages, make high-stakes student assessments, or require identifiable child data.

**Acceptance checks**
- All generated text remains editable before printing/copying.
- Clear separation between tutor-entered observations and suggested wording.
- No unsupported claims that a student has a diagnosis or fixed ability.
- Privacy notice reminds users to avoid sensitive information.

**Bundle:** Tutor & Learning Business Toolkit.

## 4. New-Hire Onboarding Plan Builder

**Audience:** Small businesses without dedicated HR software or staff.

**Core promise:** Generate a practical first-day, first-week, and first-90-days onboarding checklist for a role.

**MVP inputs**
- Role/title, start date, work arrangement, team/manager, optional business type.
- Selectable tasks and deadlines.

**MVP outputs**
- Editable timeline.
- Manager checklist and new-hire checklist.
- Training and check-in milestones.
- Printable/exportable plan.

**Must not do:** Collect sensitive candidate data, make hiring decisions, run background checks, or represent the plan as legal HR advice.

**Acceptance checks**
- Deadlines are calculated correctly from the start date.
- Tasks can be edited, removed, and marked complete.
- Output distinguishes suggested tasks from employer-specific requirements.
- Mobile and print layouts tested.

**Bundle:** Small-Team Hiring Toolkit.

## 5. Rental Turnover & Inspection Report Builder

**Audience:** Independent landlords and small rental-property owners.

**Core promise:** Organize room-by-room inspection observations and produce a dated report with repair priorities.

**MVP inputs**
- Property nickname/address (optional), inspection type, date, inspector.
- Room/area, condition, notes, issue severity, estimated repair cost, optional photo.
- Use a clear warning before including personally identifying tenant details.

**MVP outputs**
- Room-by-room inspection report.
- Summary of items requiring attention and user-entered estimated costs.
- Print/PDF report and optional local export.

**Must not do:** Generate jurisdiction-specific legal conclusions, determine deposit deductions automatically, screen tenants, or claim the report satisfies local law.

**Acceptance checks**
- Room/area entries remain grouped and editable.
- Totals correctly sum entered estimates without inventing costs.
- Photo inclusion is optional and print output remains legible.
- Clear limitations note states that local rules vary.

**Bundle:** Landlord Operations Toolkit.

## Delivery sequence after InvoiceForge launch gates

1. **Website QA & Accessibility Report Builder** — strongest direct overlap with the existing freelancer audience.
2. **AI & Software Subscription Cost Optimizer** — mostly calculations and structured comparisons; low integration burden.
3. **Tutor Lesson Follow-Up & Progress Report Builder** — reusable document generation with extra privacy care.
4. **New-Hire Onboarding Plan Builder** — reusable timeline and checklist logic.
5. **Rental Turnover & Inspection Report Builder** — useful but introduces more specialized records and optional photos.

This is a proposed sequence based on build reuse and scope, not a market-size or revenue forecast.

## Per-product release gate

- [ ] Core workflow works from start to finish.
- [ ] Calculation/date logic covered by tests where applicable.
- [ ] Keyboard, screen-size, empty-state, invalid-input, and print checks passed.
- [ ] Product description matches actual behavior and limitations.
- [ ] Privacy, terms, and support links work.
- [ ] No secrets in client code or repository.
- [ ] Price and bundle contents are explicit.
- [ ] Analytics measure starts, completions, export, and bundle interest without collecting unnecessary form content.
- [ ] User feedback and demand evidence justify the next development step.
