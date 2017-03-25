const socket = io(location.origin ? location.origin : 'localhost:3030')

const app = new Vue({
  el: '#app',
  data() {
    return {
      messages: null,
      user: '',
      text: ''
    }
  },
  methods: {
    enter() {
      if (!this.user) {
        this.$messages.user.focus()
        return
      }

      this.messages = []

      socket.emit('messages::find', { $sort: { createdAt: -1 } }, (error, page) => {
        page.data.reverse()
        this.messages = page.data

        setTimeout(() => this.scroll(), 1000)
      })

      socket.on('messages created', m => {
        if (m.createdBy !== this.user) this.messages.push(m)
        this.scroll()
      })
    },
    leave() {
      this.user = this.messages = null
      setTimeout(() => this.scroll(), 1000)
    },
    send() {
      if (this.text) {
        const m = { text: this.text, createdBy: this.user }
        socket.emit('messages::create', m)
        this.messages.push(m)
        this.$refs.text.focus()
        this.text = ''
      }
    },
    scroll() {
      Vue.nextTick(() => {
        if (this.$refs.list) {
          this.$refs.list.scrollTop = this.$refs.list.scrollHeight
          this.$refs.text.focus()
        } else {
          this.$refs.user.focus()
        }
      })
    }
  },
  mounted() {
    this.$refs.user.focus()
  }
})
