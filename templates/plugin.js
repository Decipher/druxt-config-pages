const get = (page) => (state) => {
  const data = Object.fromEntries(
    Object.entries({
      ...(state[page].attributes || {}),
      ...(state[page].relationships || {}),
    })
    .filter(([key]) => key.startsWith('field_'))
    .map(([key, value]) => ([key.replace('field_', ''), value]))
  )
  return data
}

export default ({ app, store }, inject) => {
  const namespace = 'druxtConfigPages'

  const module = {
    namespaced: true,

    state: () => (<%= JSON.stringify(options.configPages) %>),

    getters: {
<% for (page of Object.keys(options.configPages)) { %>
      <%= page %>: get('<%= page %>')
<% } %>
    }
  }

  store.registerModule(namespace, module, {
    preserveState: Boolean(store.state[namespace])
  })

  inject('druxtConfigPages', {
    get: (page) => page.indexOf('.') > 0
      ? store.getters[`druxtConfigPages/${page.split('.')[0]}`][page.split('.')[1]]
      : store.getters[`druxtConfigPages/${page}`]
  })
}
