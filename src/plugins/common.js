import Vue from 'vue'
import EmojiMap from '@/components/core/EmojiMap.vue'
import LeafletMap from '@/components/core/LeafletMap.vue'
import Heading from '@/components/common/Heading.vue'
import Description from '@/components/common/Description.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import SuccessMessage from '@/components/common/SuccessMessage.vue'
import SubmitButton from '@/components/common/SubmitButton.vue'

Vue.component('EmojiMap', EmojiMap)
Vue.component('LeafletMap', LeafletMap)
Vue.component('Heading', Heading)
Vue.component('Description', Description)
Vue.component('ErrorMessage', ErrorMessage)
Vue.component('SuccessMessage', SuccessMessage)
Vue.component('SubmitButton', SubmitButton)
