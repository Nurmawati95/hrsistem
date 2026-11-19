# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Multi-role HR application: HR admins manage employees, attendance, leave, shifts, and payroll; managers approve leave and monitor teams; employees self-serve attendance and leave requests.

## Product Purpose

Streamline daily HR operations (attendance, leave, shifts, payroll, organization structure) in one integrated web app, reducing manual errors and making data easy to audit.

## Positioning

An integrated, self-contained HR system for small-to-mid teams that keeps attendance, leave, payroll, and organization data in one place with role-based access.

## Operating Context

Used in office/remote work environments via browser. Daily workflows include check-in/out, leave requests and approvals, shift assignment, and payroll period processing. Data must remain auditable and consistent across roles.

## Capabilities and Constraints

- Modules: dashboard, employees, departments, positions, organization, shifts, attendance, leave types/requests, payroll periods.
- Stack: Laravel 13 + Inertia React 19 + Tailwind CSS 4 + Fortify auth.
- Auth via Laravel Fortify; role-based access expected.
- Web-only SPA via Inertia; no SSR.

## Brand Commitments

None established yet (no logo/brand guidelines provided).

## Evidence on Hand

Existing UI lives in resources/js/pages and resources/js/components. No design tokens or DESIGN.md yet.

## Product Principles

- Prioritize clarity and task completion over decoration.
- Keep data accurate and auditable across roles.
- Make self-service flows simple for employees.
- Maintain consistency across modules.

## Accessibility & Inclusion

Follow WCAG 2.2 AA where feasible; support keyboard navigation and readable contrast.
