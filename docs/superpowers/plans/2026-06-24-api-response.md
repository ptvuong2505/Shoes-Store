# API Response Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable `ApiResponse<T>` contract with factory methods for success, failure, and validation responses.

**Architecture:** Place transport-neutral response models in `Application/Common/Responses`. Keep HTTP status constants out of Application by using numeric status values in the model, while factory names provide the common 200, 201, and 400 cases.

**Tech Stack:** .NET 9, C#, xUnit

---

### Task 1: Add contract tests

**Files:**
- Create: `ShoesStore_Backend/Application.Tests/Application.Tests.csproj`
- Create: `ShoesStore_Backend/Application.Tests/Common/Responses/ApiResponseTests.cs`
- Modify: `ShoesStore_Backend/ShoesStore_Backend.sln`

- [ ] Create an xUnit test project referencing Application.
- [ ] Add tests for `Ok`, `Created`, custom success, `Fail`, and `Validation`.
- [ ] Run the tests and verify they fail because the response types do not exist.

### Task 2: Implement response models

**Files:**
- Create: `ShoesStore_Backend/Application/Common/Responses/ApiError.cs`
- Create: `ShoesStore_Backend/Application/Common/Responses/ApiResponse.cs`

- [ ] Add `ApiError` with `Code` and optional field details.
- [ ] Add `ApiResponse<T>` properties and factory methods.
- [ ] Run the response tests and verify they pass.
- [ ] Build the full backend solution.

