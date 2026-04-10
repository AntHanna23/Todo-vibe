# Todo PRD

## Executive Summary

A full-stack todo application designed to be planned, implemented, and iterated on using AI-assisted development (specifically GitHub Copilot). The application will allow users to manage tasks efficiently while serving as a reference implementation for AI-driven software development workflows. The long-term goal is to tie this into my local Home Assistant, but for the sake of the independent study, it will currently exist as a simple full-stack todo app.

## Problem Statement

Currently, I face two problems: the todo app I use with my iPhone is too restrictive when it comes to integrations, and I want something more modular that I can edit and adapt to my needs as they arise. Additionally, having a simple API to update tasks would be convenient for automation and integration with Home Assistant.

## Goals and Non-Goals

### Goals

* Build a customizable app with the ability to track todos
* Todos should support due dates, adjustable reminders, priority levels, and user-defined tags
* Completed todos are hidden from the main view but remain accessible in a dedicated completed section
* Have a scalable architecture capable of running in Kubernetes (most likely k3s)
* Separate containers for different parts of the architecture
* Demonstrate an AI-assisted development and planning workflow

### Non-Goals

* No multi-tenant features
* No mobile components yet
* No over-engineered components or unnecessary optimizations
* No authentication for now
* No nested/sub-tasks

## Target Users

* Individuals who want an on-premise todo system
* Users who want to integrate the application with Home Assistant
* Users who want to write or add features themselves to the application

## User Stories

* As a user, I can create a new todo item
* As a user, I can edit an existing todo item
* As a user, I can delete a todo item
* As a user, I can mark a todo item as complete
* As a user, I can view all my incomplete todo items
* As a user, I can view all my completed todos in a separate completed section
* As a user, I can filter todos by status (complete/incomplete)
* As a user, I can filter todos by tag
* As a user, I can set a due date and time on a todo
* As a user, I can set a priority level (high, medium, low) on a todo
* As a user, I can create and manage my own tags and assign one tag per todo
* As a user, I can add one or more reminders to a todo, each with an adjustable offset before the due time
* As a user, I receive browser notifications when a reminder fires
* As a user, I can reorder my todos manually (if straightforward to implement, otherwise todos sort by creation date)

## Technology Stack

* Frontend: React
* Backend: Python API framework (FastAPI)
* Testing: Pytest
* Database: SQLite (local storage, no persistent volume needed)
* API Style: REST
* Containerization: k3s (single-node for now)
* TLS: cert-manager (internal cluster, not publicly exposed)
* Version Control: GitHub
* AI Development Assistant: GitHub Copilot

## System Architecture

```mermaid
flowchart TD
    A[User in Browser] --> B[React Frontend]
    B -->|HTTP Requests| C[FastAPI Backend]
    C -->|Create / Read / Update / Delete| D[(SQLite Database)]
    D --> C
    C -->|JSON Responses| B
    B --> E[Updated Todo UI]
    B -->|Browser Notification API| F[Reminder Notification]
```

### User Flow

* User opens the todo application in the browser
* User creates, edits, completes, reopens, or deletes a todo item from the frontend
* The frontend sends the requested action to the FastAPI backend through REST API calls
* The backend validates the request and applies business rules
* The backend reads from or writes to the SQLite database
* The backend returns a structured JSON response to the frontend
* The frontend updates the UI to reflect the latest todo state
* When a reminder time is reached, the frontend fires a browser notification

## Data Modeling

### Database Schema

#### todo

* id: primary key
* title: string, required
* description: text, optional
* status: string (complete/incomplete)
* priority: string (high/medium/low), optional
* due_at: datetime, optional
* tag_id: foreign key to tag, optional
* created_at: datetime, required
* updated_at: datetime, required

#### tag

* id: primary key
* name: string, required, unique
* created_at: datetime, required

#### reminder

* id: primary key
* todo_id: foreign key to todo, required
* remind_at: datetime, required
* offset_minutes: integer (minutes before due_at the reminder fires), required
* method: string (browser for now, home_assistant long-term)
* created_at: datetime, required

### API Endpoints

#### Todos
* POST /todos
* GET /todos
* GET /todos/{id}
* PUT /todos/{id}
* DELETE /todos/{id}

#### Tags
* GET /tags
* POST /tags
* DELETE /tags/{id}

#### Reminders
* GET /todos/{id}/reminders
* POST /todos/{id}/reminders
* PUT /todos/{id}/reminders/{reminder_id}
* DELETE /todos/{id}/reminders/{reminder_id}

### Home Assistant Integration (Long-Term)

Home Assistant can call the todo API using its [RESTful Command integration](https://www.home-assistant.io/integrations/rest_command/), which lets automations create or update todos via REST calls. In the other direction, the todo app can trigger [Home Assistant webhooks](https://developers.home-assistant.io/docs/api/rest/) when reminders fire or todos are completed. The exact payload format will be defined when this integration is scoped out.

### Acceptance Criteria

* User can create a todo with a required title and optional description, and it appears immediately in the UI.
* User can edit an existing todo and see updates reflected instantly.
* User can delete a todo and it is removed from both the UI and database.
* User can mark a todo as complete or incomplete, and the UI reflects the state clearly.
* Completed todos are hidden from the main list and accessible in a completed section.
* User can set a due date/time, priority, and tag on a todo.
* User can create, edit, and delete their own tags.
* User can add multiple reminders to a todo with configurable offsets before the due time.
* Browser notifications fire when a reminder time is reached.
* Todos persist across page reloads and application restarts.
* User can filter todos by complete/incomplete status and by tag.
* API returns valid JSON responses with appropriate HTTP status codes and handles invalid input gracefully.
* Application remains responsive, and core operations complete within acceptable time (<500ms locally).

### Testing Requirements

* Unit tests for backend using pytest
* Basic integration tests for API
