---
description: Enforce code style guidelines before completing a task or notifying the user.
---

This workflow must be run before `notify_user` or marking a task as complete.

1. **Read Guidelines**: Review `CODE_STYLE.md` to refresh memory on current rules.
2. **Scan Active Files**: Check all files modified in the current session.
   - [ ] No `//` or `/* */` comments (unless explicitly allowed exceptions).
   - [ ] No `console.log` or debug code.
   - [ ] No unused imports.
   - [ ] Consistent formatting.
3. **Verify Build**: Run `npm run build` to ensure no lint errors or type failures.
4. **Auto-Correct**: If issues are found, fix them immediately without asking.
