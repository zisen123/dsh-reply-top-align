# AI install guide for dsh-reply-top-align

This document is written for an AI coding agent running inside a DSH / DeepSeek Harness environment. Follow it to install this plugin into the user's local DSH Web profile.

## Objective

Install `dsh-reply-top-align` so DSH Web aligns the first visible assistant reply text line to the top of the conversation viewport.

## Guardrails

- Treat this as a DSH Cordis composition edit.
- If your environment has an `editing-cordis-compositions` skill, load it before changing composition files.
- Do not edit shipped presets or files under the DSH installation checkout.
- Prefer user-local files under `${DSH_HOME:-$HOME/.dsh}`.
- Before modifying files, explain the exact changes and get user confirmation if the active instructions require it.
- Use the exact paths discovered in the environment; do not assume `DSH_HOME` unless you have checked it.

## Installation steps

### 1. Locate DSH home

Run:

```bash
printf 'DSH_HOME=%s\n' "${DSH_HOME:-$HOME/.dsh}"
```

Set:

```bash
DSH_HOME="${DSH_HOME:-$HOME/.dsh}"
```

Completion criterion: you know the absolute DSH home directory.

### 2. Clone or update the plugin source

Use this default location unless the user asks for another:

```bash
mkdir -p "$DSH_HOME/local-plugins"
if [ -d "$DSH_HOME/local-plugins/dsh-reply-top-align/.git" ]; then
  git -C "$DSH_HOME/local-plugins/dsh-reply-top-align" fetch origin
  git -C "$DSH_HOME/local-plugins/dsh-reply-top-align" rebase origin/main
else
  git clone https://github.com/zisen123/dsh-reply-top-align.git "$DSH_HOME/local-plugins/dsh-reply-top-align"
fi
```

Completion criterion: `$DSH_HOME/local-plugins/dsh-reply-top-align/package.json` exists.

### 3. Check the plugin source

Run:

```bash
cd "$DSH_HOME/local-plugins/dsh-reply-top-align"
npm run check
```

Completion criterion: `node --check` passes for `lib/index.js` and `lib/client.js`.

### 4. Locate the Web profile patch

The common path is:

```text
$DSH_HOME/profiles/web/cordis.patch.yml
```

If that file does not exist, inspect `$DSH_HOME/profiles/` and the current DSH profile configuration to find the active Web profile patch.

Completion criterion: you have the absolute path to the active Web profile patch file.

### 5. Add the Cordis row

Add this row under the top-level `insert:` list, preserving YAML indentation:

```yaml
  - id: reply-top-align
    name: /ABSOLUTE/PATH/TO/.dsh/local-plugins/dsh-reply-top-align
```

Use the real absolute path from step 1. Example:

```yaml
  - id: reply-top-align
    name: /home/you/.dsh/local-plugins/dsh-reply-top-align
```

If a row with `id: reply-top-align` already exists, update its `name` only if it points to the wrong location.

Completion criterion: the Web profile patch contains exactly one `id: reply-top-align` row pointing at the cloned plugin directory.

### 6. Validate hot reload and refresh

At minimum, re-read the edited YAML and confirm the row is under `insert:`. If the environment provides a Cordis composition validation command or service, run it.

DSH supports hot reloading for this profile/composition change. Tell the user:

1. Wait for the DSH Web profile/composition hot reload to settle.
2. Refresh the DSH Web page.
3. Test a long assistant response.

Completion criterion: after hot reload and page refresh, new assistant responses align their first visible text line to the top, and manual user scrolling disables forced alignment for the current response.

## Verification checklist

Ask the user to test:

- Plain text response.
- Response with reasoning / think content.
- Response with tool calls before text.
- Long streaming response.
- Manual scroll during streaming.
- Next response after manual scroll.

## Troubleshooting

### The plugin does not load

Check:

- The `name:` path in `cordis.patch.yml` is absolute.
- The path contains `package.json`.
- `package.json` exports `./client`.
- `package.json` has a `dsh.client` block.
- The DSH Web profile/composition hot reload completed after editing the profile.

### The page still follows the bottom

Check whether the browser loaded the client plugin after hot reload and page refresh. If a dynamic old plugin was previously running, stop that dynamic plugin or open a fresh session to distinguish the persisted plugin from the old runtime plugin.

### Manual scroll still gets pulled back

The plugin currently detects manual scrolling through `scroll` events and ignores its own programmatic scrolls for a short time window. If needed, update the plugin to listen for `wheel`, `touchstart`, and keyboard scrolling inputs before setting `manualDisabledForKey`.

### DSH Web changed its DOM

This plugin depends on DSH Web conversation DOM details. If selectors stop matching, inspect the current conversation DOM and update `lib/client.js` selectors and text-target detection.
