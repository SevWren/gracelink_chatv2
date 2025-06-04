# Contributing to Gemini Chatbot

First off, thank you for considering contributing to the Gemini Chatbot project! We welcome any contributions that can help improve the application. Whether it's bug fixes, feature enhancements, or documentation improvements, your help is appreciated.

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Fork & Clone](#fork--clone)
  - [Install Dependencies](#install-dependencies)
  - [Set Up API Key](#set-up-api-key)
  - [Run the Development Server](#run-the-development-server)
- [Making Changes](#making-changes)
  - [Create a Branch](#create-a-branch)
  - [Coding Standards](#coding-standards)
  - [Testing](#testing)
- [Commit Messages](#commit-messages)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code of Conduct](#code-of-conduct)
- [Reporting Bugs or Requesting Features](#reporting-bugs-or-requesting-features)
- [Questions?](#questions)

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
-   [Git](https://git-scm.com/)
-   A Google Gemini API Key (see [API Key Configuration in README.md](project_documentation_prompt_response.md#api-key-configuration))

### Fork & Clone

1.  **Fork the repository** on GitHub (from `https://github.com/sevwren/gracelink_chatv2`).
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/gracelink_chatv2.git
    cd gracelink_chatv2
    ```
    (Replace `YOUR_USERNAME` with your actual GitHub username)

### Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
npm install
# or
# yarn install
```

### Set Up API Key

This application requires a Google Gemini API key to function. You will be prompted to enter this key in the application's UI after starting it. Refer to the [README.md](project_documentation_prompt_response.md#api-key-configuration) for more details on obtaining and using an API key.

### Run the Development Server

To start the Vite development server:

```bash
npm run dev
# or
# yarn dev
```

This will usually open the application in your default browser at `http://localhost:5173`.

## Making Changes

### Create a Branch

Create a new branch for your changes. Use a descriptive name, for example:

```bash
git checkout -b feat/add-cool-new-feature
# or
# git checkout -b fix/resolve-sidebar-bug
```

### Coding Standards

Please adhere to the coding standards and architectural practices outlined in the [CODING_CONVENTIONS.md](doc/CODING_CONVENTIONS.md) file. This includes:

-   Following the established TypeScript and React best practices.
-   Maintaining the existing code style and structure.
-   Writing clear, readable, and maintainable code.
-   Ensuring proper type safety with TypeScript.
-   Using descriptive names for variables, functions, components, and hooks.
-   Adding JSDoc comments for new functions, hooks, or components.

### Testing

-   Thoroughly test your changes locally in a browser.
-   Ensure that your changes do not introduce any regressions.
-   Check for console errors and warnings.

## Commit Messages

We encourage using conventional commit messages to make the commit history clear and easy to understand. A common format is:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

**Examples:**

-   `feat: Add theme toggle button to sidebar`
-   `fix: Correct API key validation logic in RightSidebar`
-   `docs: Update README with deployment instructions`
-   `refactor: Simplify message parsing in useChatFiles hook`

Common types include: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style` (formatting, styling), `refactor`, `test`, `chore` (build changes, etc.).

## Submitting a Pull Request

1.  **Commit your changes** with clear and descriptive commit messages.
2.  **Push your branch** to your forked repository on GitHub:
    ```bash
    git push origin feat/add-cool-new-feature
    ```
3.  **Open a Pull Request (PR)** from your branch in your fork to the `main` branch (or the designated development branch) of the `sevwren/gracelink_chatv2` repository.
4.  **Provide a clear title and description** for your PR:
    -   Explain the purpose of your changes.
    -   Summarize the modifications made.
    -   Link to any relevant GitHub issues (e.g., "Closes #123").
5.  **Be prepared for feedback and discussion.** Your PR will be reviewed, and you may be asked to make further changes.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms. (Currently, a formal Code of Conduct file is not present, but we expect all contributors to interact respectfully and professionally.)

## Reporting Bugs or Requesting Features

If you find a bug or have an idea for a new feature, please check the existing [GitHub Issues](https://github.com/sevwren/gracelink_chatv2/issues) to see if it has already been reported or discussed. If not, feel free to open a new issue.

When reporting a bug, please include:
-   A clear and descriptive title.
-   Steps to reproduce the bug.
-   Expected behavior.
-   Actual behavior.
-   Screenshots or console logs, if applicable.
-   Your environment (browser, OS).

## Questions?

If you have any questions about contributing, feel free to open an issue or reach out to the project maintainers.

Thank you for contributing!
