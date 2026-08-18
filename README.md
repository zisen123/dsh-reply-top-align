# dsh-reply-top-align

A small DSH / DeepSeek Harness Cordis client plugin that aligns the first visible assistant reply text line to the top of the conversation viewport.

By default, DSH Web follows the bottom of a streaming assistant response. This plugin changes that behavior for the latest assistant response:

- align the first visible assistant **text** line to the top of the conversation viewport;
- ignore tool-call rows;
- ignore reasoning / think rows;
- stop forcing alignment for the current assistant response after the user manually scrolls;
- re-enable alignment for the next assistant response.

## Status

Experimental community plugin.

This plugin currently relies on DSH Web DOM details such as `data-chat-flow-kind="assistant-step"`, think row markers, and the current markdown text typography. It may need updates when DSH Web changes its conversation DOM or styling.

## Installation

### One-shot AI install prompt

Copy this prompt into your DSH coding agent:

```text
Install the DSH Web plugin from https://github.com/zisen123/dsh-reply-top-align. Read its INSTALL.md and follow it exactly. Install it into my user-local DSH home under local-plugins, add the plugin row to my active Web profile cordis.patch.yml, avoid shipped presets and DSH installation files, run the plugin syntax check, and tell me what to restart or refresh. Before editing files, explain the exact changes and ask for confirmation if my session rules require it.
```

### Manual install

Clone or install this package somewhere accessible to your DSH profile, then add it to your host composition / web profile patch.

Example `cordis.patch.yml` entry:

```yaml
- insert:
  - id: reply-top-align
    name: /absolute/path/to/dsh-reply-top-align
```

For a local DSH profile, one possible layout is:

```yaml
- insert:
  - id: reply-top-align
    name: /home/you/.dsh/local-plugins/dsh-reply-top-align
```

After changing the composition, restart `dsh web` and refresh the DSH Web page.

## Development

Check JavaScript syntax:

```bash
npm run check
```

## Compatibility

Tested against a DSH Web build where assistant reply rows expose:

- `data-chat-flow-kind="assistant-step"` for assistant text rows;
- `data-variant="think"` for reasoning / think blocks;
- a conversation input dock slot named `conversation.input.dock`.

## Known limitations

- This is a runtime UI enhancement, not a formal DSH Web scrolling API.
- It uses DOM inspection and may break when DSH Web changes internal markup.
- The text target detection currently uses typography heuristics (`font-size: 16px`, `line-height: 28px`) to distinguish the main markdown text container.

## Suggested test cases

- Plain text assistant response.
- Assistant response with reasoning / think content.
- Assistant response with tool calls before text.
- Long streaming response.
- Manual wheel / touch / keyboard scrolling during streaming.
- Switching between conversations.

## License

MIT
