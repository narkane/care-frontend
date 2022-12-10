export default [
  {
    path: '/:emojiCode',
    name: 'goto-emoji',
    // meta: {
    //   requiresAuth: false
    // },
    component: () =>
      import(/* webpackChunkName: "landing" */ '@/components/Landing.vue')
  }
]
