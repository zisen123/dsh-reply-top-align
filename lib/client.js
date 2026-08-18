window.__ModuleLoader__.load({
  id: 'dsh-reply-top-align',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const React = require('react')

    function apply(ctx) {
      const slots = ctx.get('slots')
      if (slots === undefined) return

      const state = {
        scrollport: null,
        disposeScroll: undefined,
        ignoreScrollUntil: 0,
        manualDisabledForKey: null,
        activeKey: null,
        lastProgramTop: null,
      }

      function nowMs() {
        return Date.now()
      }

      function nearestScrollport(row) {
        let node = row.parentElement
        while (node !== null) {
          if (node.hasAttribute('data-conversation-scroll')) return node
          const style = window.getComputedStyle(node)
          if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight) return node
          node = node.parentElement
        }
        return null
      }

      function findLatestAssistantRow() {
        const rows = document.querySelectorAll('[data-chat-flow-kind="assistant-step"]')
        if (rows.length === 0) return null
        const row = rows[rows.length - 1]
        if (!(row instanceof HTMLElement)) return null
        return row
      }

      function findFirstReplyText(row) {
        const candidates = row.querySelectorAll('div')
        for (let i = 0; i < candidates.length; i++) {
          const el = candidates[i]
          if (!(el instanceof HTMLElement)) continue
          if (el.closest('[data-variant="think"]') !== null) continue
          if (el.querySelector('[data-variant="think"]') !== null && el.children.length <= 2) continue
          const text = el.textContent
          if (text === null || text.trim() === '') continue
          const style = window.getComputedStyle(el)
          if (style.display === 'none' || style.visibility === 'hidden') continue
          const rect = el.getBoundingClientRect()
          if (rect.width <= 0 || rect.height <= 0) continue
          if (style.fontSize === '16px' && style.lineHeight === '28px') return el
        }
        return null
      }

      function currentKey(row) {
        return row.dataset.chatFlowKey || row.dataset.chatAnchorKey || ''
      }

      function attachManualScrollListener(scrollport) {
        if (state.scrollport === scrollport) return
        if (state.disposeScroll !== undefined) state.disposeScroll()
        state.scrollport = scrollport
        const onScroll = function () {
          if (nowMs() < state.ignoreScrollUntil) return
          const row = findLatestAssistantRow()
          if (row === null) return
          const key = currentKey(row)
          if (key === '') return
          state.manualDisabledForKey = key
        }
        scrollport.addEventListener('scroll', onScroll, { passive: true })
        state.disposeScroll = function () {
          scrollport.removeEventListener('scroll', onScroll)
        }
      }

      function alignLatestAssistantText() {
        const row = findLatestAssistantRow()
        if (row === null) return
        const key = currentKey(row)
        if (key === '') return
        if (state.activeKey !== key) {
          state.activeKey = key
          state.manualDisabledForKey = null
          state.lastProgramTop = null
        }
        if (state.manualDisabledForKey === key) return
        const target = findFirstReplyText(row)
        if (target === null) return
        const scrollport = nearestScrollport(row)
        if (scrollport === null) return
        attachManualScrollListener(scrollport)
        const portRect = scrollport.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()
        const nextTop = Math.max(0, scrollport.scrollTop + targetRect.top - portRect.top)
        if (Math.abs(scrollport.scrollTop - nextTop) > 1) {
          state.ignoreScrollUntil = nowMs() + 160
          state.lastProgramTop = nextTop
          scrollport.scrollTop = nextTop
        }
      }

      function ReplyTopAligner(props) {
        props.useSession(function (s) {
          const order = s.chat.order
          const lastKey = order.length === 0 ? '' : order[order.length - 1]
          return String(s.running) + ':' + String(order.length) + ':' + String(lastKey)
        })

        React.useEffect(function () {
          let disposed = false
          function run() {
            if (!disposed) alignLatestAssistantText()
          }
          run()
          const d1 = ctx.timeout(run, 0)
          const d2 = ctx.timeout(run, 60)
          const d3 = ctx.timeout(run, 180)
          const interval = ctx.interval(run, 350)
          return function () {
            disposed = true
            d1()
            d2()
            d3()
            interval()
          }
        })
        return null
      }

      ctx.effect(function () {
        return function () {
          if (state.disposeScroll !== undefined) state.disposeScroll()
        }
      })

      slots.inject('conversation.input.dock', function () {
        return slots.register(
          { name: 'conversation.input.dock', id: 'reply-top-align', order: -1000, label: 'Reply top align' },
          function (props) { return React.createElement(ReplyTopAligner, props) }
        )
      })
    }

    exports.apply = apply
    return module.exports
  },
})
