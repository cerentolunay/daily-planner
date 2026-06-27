# DailyPlanner - Codex Task 01

## Project Goal

Build the first MVP foundation for a modern AI-powered daily planner app.

The app will help users collect tasks coming from WhatsApp, messages, emails, or manual input, then organize them into a simple daily planner, task list, and calendar-like view.

Repository name: `dailyplanner`

This first task is NOT about building the full product.  
The goal is to create a clean, scalable project foundation with a modern UI and working basic screens.

---

## Product Summary

DailyPlanner is a personal productivity app.

Core idea:

Users receive tasks from many places, especially WhatsApp. They often lose deadlines because work messages are mixed with normal chat. DailyPlanner turns scattered messages into structured tasks.

MVP flow:

1. User manually creates a task or pastes a WhatsApp message.
2. App extracts or lets user enter:
   - task title
   - description
   - deadline
   - project/company
   - priority
   - status
3. User sees tasks in:
   - Today view
   - Upcoming view
   - Calendar-like view
   - Project-based view

Future versions will include AI extraction, WhatsApp share-to-app, Google Calendar sync, notifications, and team features.

---

## Tech Stack

Use this stack:

- Frontend: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- Backend: FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy
- Migrations: Alembic
- Container: Docker Compose

Create the project as a monorepo.

---

## Repository Structure

Create this structure:

```txt
dailyplanner/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── features/
│       │   │   ├── tasks/
│       │   │   ├── projects/
│       │   │   ├── inbox/
│       │   │   └── calendar/
│       │   ├── lib/
│       │   ├── types/
│       │   └── constants/
│       ├── public/
│       ├── package.json
│       └── README.md
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── tasks.py
│   │   │   │   ├── projects.py
│   │   │   │   ├── inbox.py
│   │   │   │   └── health.py
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── task.py
│   │   │   ├── project.py
│   │   │   └── inbox_item.py
│   │   ├── schemas/
│   │   │   ├── task.py
│   │   │   ├── project.py
│   │   │   └── inbox_item.py
│   │   ├── services/
│   │   │   ├── task_service.py
│   │   │   ├── project_service.py
│   │   │   └── inbox_service.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
├── docs/
│   ├── product.md
│   ├── architecture.md
│   ├── roadmap.md
│   └── ui-guidelines.md
│
├── infra/
│   └── caddy/
│       └── Caddyfile
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
UI Theme

Use a modern, clean, slightly premium dark UI.

Use these colors as the main design palette:

Burnt Orange: #FE7E3C
Lust Red:     #E4201B
Copper:       #6D413C
Blue Lagoon:  #0E6873
Black Pearl:  #1A2C30
White:        #FFFFFF

Primary background:

#1A2C30

Primary accent:

#FE7E3C

Secondary accent:

#0E6873

Danger / urgent:

#E4201B

Muted card / warm neutral:

#6D413C

Text:

#FFFFFF

Design rules:

UI must look modern and simple.
Avoid crowded screens.
Use rounded cards.
Use soft borders.
Use spacious layouts.
Use clear typography.
Use white text on dark background.
Use orange only for important CTAs.
Use red only for urgent/overdue tasks.
Use blue lagoon for calm secondary actions.
Do not create a childish or overly colorful UI.
First Frontend Screens

Create these pages in the Next.js app.

1. Dashboard / Today Page

Route:

/

Content:

Greeting section
Today’s focus card
Today task list
Overdue tasks section
Quick add task button
Mini calendar preview

Example sections:

Good morning, Mathis
You have 5 tasks today.

Today Focus
- Prepare Codesight presentation

Today
- Finish DailyPlanner repo setup
- Review Cyber-Quanta notes
- Send event form update

Overdue
- Complete DMS documentation

Use mock data for now.

2. Tasks Page

Route:

/tasks

Content:

Task list
Filters:
Today
Upcoming
Overdue
Completed
Task cards with:
title
project
deadline
priority
status
3. Inbox Page

Route:

/inbox

Purpose:

This page represents raw messages pasted from WhatsApp or other sources.

Content:

Textarea: “Paste a WhatsApp message”
Button: “Extract Task”
For now, extraction can be mocked.
Show a preview card:
Original message:
"Abi cuma gününe kadar Codesight sunumunu hazırlar mısın?"

Detected task:
Title: Prepare Codesight presentation
Project: Cyber-Quanta
Deadline: Friday
Priority: High

No real AI integration yet.

4. Calendar Page

Route:

/calendar

Content:

Simple weekly layout
Show task cards under days
No full calendar package needed yet unless easy
5. Projects Page

Route:

/projects

Content:

Project cards:
Heptapus
Cyber-Quanta
University
Personal
Each card shows:
active tasks
overdue tasks
next deadline
Components to Create

Create reusable components:

AppShell
Sidebar
Topbar
TaskCard
ProjectCard
PriorityBadge
StatusBadge
Button
Input
Textarea
Card
CalendarPreview
QuickAddTask

The sidebar should contain:

Today
Tasks
Inbox
Calendar
Projects
Settings
Backend Requirements

Create a basic FastAPI backend.

Health endpoint
GET /health

Returns:

{
  "status": "ok"
}
Task endpoints
GET /tasks
POST /tasks
GET /tasks/{task_id}
PATCH /tasks/{task_id}
DELETE /tasks/{task_id}

Task fields:

id
title
description
project_id
deadline
priority
status
source_type
source_text
created_at
updated_at

Priority values:

low
medium
high
urgent

Status values:

todo
in_progress
waiting
done
cancelled
Project endpoints
GET /projects
POST /projects
GET /projects/{project_id}
PATCH /projects/{project_id}
DELETE /projects/{project_id}

Project fields:

id
name
description
color
created_at
updated_at
Inbox endpoints
GET /inbox
POST /inbox
PATCH /inbox/{inbox_item_id}
DELETE /inbox/{inbox_item_id}

Inbox item fields:

id
source_type
raw_text
detected_title
detected_deadline
detected_project
detected_priority
status
created_at

Source type examples:

manual
whatsapp_paste
email_paste
slack_paste

Inbox status values:

pending
converted
dismissed
Database

Use PostgreSQL.

Create SQLAlchemy models for:

Project
Task
InboxItem

For now, skip authentication.

Each model should use UUID primary keys.

Docker Compose

Create a working docker-compose.yml with:

postgres
backend
web

The project should run with:

docker compose up --build

Backend should run on:

http://localhost:8000

Frontend should run on:

http://localhost:3000
Environment Variables

Create .env.example:

DATABASE_URL=postgresql+psycopg://dailyplanner:dailyplanner@postgres:5432/dailyplanner
POSTGRES_USER=dailyplanner
POSTGRES_PASSWORD=dailyplanner
POSTGRES_DB=dailyplanner

NEXT_PUBLIC_API_URL=http://localhost:8000
Documentation

Create the following docs.

docs/product.md

Explain:

what DailyPlanner is
target users
core problem
MVP scope
future features
docs/architecture.md

Explain:

monorepo structure
frontend architecture
backend architecture
database structure
Docker setup
docs/roadmap.md

Roadmap:

V0.1 - Static UI + CRUD backend
V0.2 - Task creation from pasted messages
V0.3 - AI extraction
V0.4 - Notifications
V0.5 - Google Calendar sync
V0.6 - WhatsApp share-to-app
V1.0 - Public beta
docs/ui-guidelines.md

Include:

color palette
typography rules
component rules
spacing rules
dark theme rules
Important Product Decisions

Do NOT implement these in Task 01:

Authentication
Real WhatsApp API
OpenAI API
Google Calendar API
Push notifications
Team management
Payment system
Native mobile app

Only prepare the architecture so these can be added later.

Expected Output

At the end of this task, the repo should have:

Working Next.js frontend
Working FastAPI backend
PostgreSQL connected
Docker Compose setup
Modern UI using the provided color palette
Mock dashboard data
Basic backend CRUD structure
Product and technical docs
Coding Style
Keep code clean and readable.
Use TypeScript types properly.
Use Pydantic schemas in FastAPI.
Use service files instead of putting business logic directly into routes.
Use reusable UI components.
Avoid overengineering.
Avoid unnecessary libraries.
Keep the first version simple but scalable.
Final Note

The goal is to create a clean foundation for a real product.

Focus on:

simple
modern
usable
extendable

Do not build unnecessary features yet.


Bunu Codex’e ilk task olarak ver abi. İlk hedef **repo iskeleti + çalışan modern web MVP + backend temel CRUD** olsun.



## Language Requirement

The application UI must be in Turkish.

Use Turkish for:

- page titles
- buttons
- labels
- empty states
- task statuses
- priority labels
- navigation menu
- error messages
- placeholder texts

Examples:

```txt
Today        → Bugün
Tasks        → Görevler
Inbox        → Gelen Kutusu
Calendar     → Takvim
Projects     → Projeler
Settings     → Ayarlar

Add Task     → Görev Ekle
Quick Add    → Hızlı Ekle
Overdue      → Gecikenler
Upcoming     → Yaklaşanlar
Completed    → Tamamlananlar

Low          → Düşük
Medium       → Orta
High         → Yüksek
Urgent       → Acil

Todo         → Yapılacak
In Progress  → Devam Ediyor
Waiting      → Beklemede
Done         → Tamamlandı
Cancelled    → İptal Edildi

Backend field names can stay English.

Frontend visible text must be Turkish.


Bir de `Dashboard` örneğini şöyle değiştir:

```txt
Günaydın, Cerem
Bugün 5 görevin var.

Bugünün Odağı
- Codesight sunumunu hazırla

Bugün
- DailyPlanner repo kurulumunu tamamla
- Cyber-Quanta notlarını incele
- Etkinlik formu güncellemesini gönder

Gecikenler
- DMS dokümantasyonunu tamamla