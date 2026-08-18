# dsh-reply-top-align

一个 DSH / DeepSeek Harness Cordis Client 插件，用于改变 DSH Web 中 AI 回复的滚动对齐方式：让最新 assistant 回复的第一行可见正文对齐到会话视口顶部。

默认情况下，DSH Web 会跟随 streaming 回复的底部。本插件会改成：

- 将最新 assistant 回复的第一行可见 **正文文本** 对齐到会话视口顶部；
- 忽略 tool-call 工具调用行；
- 忽略 reasoning / think 思考行；
- 用户手动滚动后，停止强制对齐当前这条 assistant 回复；
- 下一条 assistant 回复出现时重新启用自动对齐。

## 状态

实验性社区插件。

当前版本：`0.1.0`。

本插件依赖 DSH Web 当前的 DOM 细节，例如 `data-chat-flow-kind="assistant-step"`、think 行标记，以及当前 markdown 正文的排版特征。若 DSH Web 后续调整会话 DOM 或样式，本插件可能需要同步更新。

## 安装

### 一键交给 AI 安装

复制下面这段提示词给你的 DSH coding agent：

```text
请安装这个 DSH Web 插件：https://github.com/zisen123/dsh-reply-top-align 。安装步骤请严格阅读并执行仓库中的 INSTALL.md。
```

详细安装步骤、校验清单和故障排查都在 [`INSTALL.md`](./INSTALL.md)。

## 开发

检查 JavaScript 语法：

```bash
npm run check
```

## 兼容性

当前版本基于以下 DSH Web 结构验证：

- `data-chat-flow-kind="assistant-step"` 表示 assistant 正文行；
- `data-variant="think"` 表示 reasoning / think 块；
- 存在名为 `conversation.input.dock` 的输入区 Slot。

## 已知限制

- 这是运行时 UI 增强插件，不是正式 DSH Web 滚动 API。
- 插件通过 DOM 检测实现，DSH Web 内部标记变化后可能失效。
- 当前正文目标检测使用了排版启发式规则：`font-size: 16px`、`line-height: 28px`。

## 建议测试场景

- 普通文本回复；
- 带 reasoning / think 内容的回复；
- 正文前有 tool-call 的回复；
- 长 streaming 回复；
- streaming 期间手动滚轮 / 触摸 / 键盘滚动；
- 切换会话。

## License

MIT
