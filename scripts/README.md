# Project Scripts

This directory contains utility scripts used for project setup and management.

## Files

### `create_issues.py`
Python script that creates all GitHub issues for the e-commerce SaaS project.

**Usage:**
```bash
python3 create_issues.py
```

**What it does:**
- Creates 31 GitHub issues (14 backend, 14 frontend, 3 testing)
- Adds appropriate labels (task, backend/frontend, priority, mvp)
- Links to specification sections
- Includes acceptance criteria

### `list_issues.py`
Python script to list and organize all open GitHub issues.

**Usage:**
```bash
python3 list_issues.py
```

**Output:**
- Lists all open issues grouped by category (backend, frontend, testing)
- Shows issue numbers, titles, and labels
- Provides summary statistics

### `create_issues.sh`
Bash script template for creating GitHub issues using curl (not used in final implementation).

### `github_issues.json`
JSON file with sample issue data (used for initial planning).

## Requirements

- Python 3.x
- `requests` library: `pip install requests`
- GitHub Personal Access Token (already configured in `.kiro/settings/mcp.json`)

## Notes

These scripts were used during project setup. Issues have already been created in the repository:
https://github.com/ahmedcharef/Agent-Powered-IDE/issues

You can re-run `list_issues.py` anytime to see the current state of issues.
