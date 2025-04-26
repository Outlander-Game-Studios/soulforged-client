import Login from './Login.vue'

export default {
  title: 'Game UI/Login',
}

export const base = () => ({
  components: {
    Login,
  },

  template: '<Login />',
})

export const accepted = () => ({
  components: {
    Login,
  },

  mounted() {
    this.$el.querySelector('input[type=checkbox]').click()
  },

  template: '<Login />',
})
