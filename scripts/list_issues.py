#!/usr/bin/env python3
import requests

TOKEN = "GITHUB_PERSONAL_ACCESS_TOKEN"
REPO = "ahmedcharef/Agent-Powered-IDE"
URL = f"https://api.github.com/repos/{REPO}/issues?state=open&per_page=50"
HEADERS = {"Authorization": f"token {TOKEN}"}

r = requests.get(URL, headers=HEADERS)
issues = r.json()

print(f"\n{'='*80}")
print(f"OPEN ISSUES IN {REPO}")
print(f"{'='*80}\n")

backend = [i for i in issues if any(l['name'] == 'backend' for l in i['labels'])]
frontend = [i for i in issues if any(l['name'] == 'frontend' for l in i['labels'])]
testing = [i for i in issues if any(l['name'] == 'testing' for l in i['labels'])]

print(f"📦 BACKEND TASKS ({len(backend)} issues)")
print("-" * 80)
for issue in backend:
    labels = ', '.join([l['name'] for l in issue['labels']])
    print(f"  #{issue['number']}: {issue['title']}")
    print(f"    Labels: {labels}")
    print()

print(f"\n🎨 FRONTEND TASKS ({len(frontend)} issues)")
print("-" * 80)
for issue in frontend:
    labels = ', '.join([l['name'] for l in issue['labels']])
    print(f"  #{issue['number']}: {issue['title']}")
    print(f"    Labels: {labels}")
    print()

print(f"\n🧪 TESTING TASKS ({len(testing)} issues)")
print("-" * 80)
for issue in testing:
    labels = ', '.join([l['name'] for l in issue['labels']])
    print(f"  #{issue['number']}: {issue['title']}")
    print(f"    Labels: {labels}")
    print()

print(f"\n{'='*80}")
print(f"TOTAL: {len(issues)} open issues")
print(f"View all: https://github.com/{REPO}/issues")
print(f"{'='*80}\n")
