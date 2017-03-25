if (!window.location.origin) window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')

var socket = io(window.location.origin + '/')

var app = new Vue({
  el: '#app',
  data: function() {
    return {
      messages: null,
      user: '',
      text: ''
    }
  },
  methods: {
    enter: function() {
      if (!app.user) {
        app.$messages.user.focus()
        return
      }

      app.messages = []

      socket.emit('messages::find', { $sort: { createdAt: -1 } }, function (error, page) {
        page.data.reverse()
        app.messages = page.data
        setTimeout(app.scroll, 1000)
      })

      socket.on('messages created', function(message) {
        if (message.createdBy !== app.user) app.messages.push(message)
        app.scroll()
      })
    },
    leave: function() {
      app.user = app.messages = null
      setTimeout(app.scroll, 1000)
    },
    send: function() {
      if (app.text) {
        var message = { text: app.text, createdBy: app.user }
        socket.emit('messages::create', message)
        app.messages.push(message)
        app.$refs.text.focus()
        app.text = ''
      }
    },
    scroll: function(delay) {
      var doScroll = function() {
        if (app.$refs.list) {
          app.$refs.list.scrollTop = app.$refs.list.scrollHeight
          app.$refs.text.focus()
        } else {
          app.$refs.user.focus()
        }
      }

      if (delay)
        setTimeout(function() {
          Vue.nextTick(doScroll)
        }, delay)
      else
        Vue.nextTick(doScroll)
    }
  },
  mounted: function() {
    this.$refs.user.focus()
  }
})
