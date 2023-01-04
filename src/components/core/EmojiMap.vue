<template>
  <div id="care">
    <UI />
    <CellInspect
      :name="cellInspect.name"
      :owner="cellInspect.owner"
      :cell-location="cellInspect.cellLocation"
      :emoji-location="cellInspect.emojiLocation"
    />
    <gmap-map
      ref="mapRef"
      class="map"
      id="g-map"
      :center="center"
      owner
      :zoom="minZoomLevel"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center = m.position"
      >
      </gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import api from '@/services/api/cell'
import axios from 'axios'

import MapStyleData from '../MapStyleData'
import UI from '../mapUI/UI.vue'
import CellInspect from '../appUI/CellInspect.vue'

import mercator from 'projections/mercator'
// import { it } from 'date-fns/esm/locale'

export default {
  components: {
    UI,
    CellInspect
  },
  props: ['reqEmojiLoc'],
  data() {
    return {
      cacheImgBuffer: new Uint8ClampedArray(841 * 841 * 4), // have enough bytes
      doubleClicked: false,
      touchStartTimeStamp: null,
      touchEndTimeStamp: null,
      cellInspect: {
        name: 'Not Found',
        owner: 'Not Found',
        cellLocation: 'Not Found',
        timeStamp: 'Not Found',
        emojiLocation: {}
      },
      googleGridLat: null,
      googleGridLng: null,
      googleLinesLat: [],
      googleLinesLng: [],
      cellRectangles: [],
      cellOpacity: 0.6,
      colorMap: {},
      lastFetchRegionTime: 0,
      reticleSize: 3,
      map: null,
      userPositionCircle: null,
      userPositionLatLng: {},
      emojiLocation: '',
      emojiToggle: 'Off',
      emojiIndexReference: {
        0: {
          0: '🌰',
          1: '🔀',
          2: '🐥',
          3: '🌼',
          4: '👙',
          5: '📹',
          6: '🎁',
          7: '🥊',
          8: '🎆',
          9: '👱',
          a: '😁',
          b: '🤞',
          c: '😜',
          d: '🍖',
          e: '🐕',
          f: '🛌',
          g: '🐰',
          h: '😨',
          i: '💿',
          j: '😽',
          k: '🚹',
          l: '🙏',
          m: '🦓',
          n: '👒',
          o: '🌔',
          p: '🐏',
          q: '🍼',
          r: '🎿',
          s: '🤎'
        },
        1: {
          0: '👃',
          1: '🛬',
          2: '🚮',
          3: '💠',
          4: '📨',
          5: '🐘',
          6: '🗽',
          7: '📿',
          8: '🍻',
          9: '🎫',
          a: '🤩',
          b: '💫',
          c: '🐐',
          d: '👥',
          e: '🌲',
          f: '💨',
          g: '😼',
          h: '🎎',
          i: '🚡',
          j: '😫',
          k: '👝',
          l: '🏃',
          m: '🛩',
          n: '🥜',
          o: '🙇',
          p: '🎇',
          q: '😏',
          r: '🥥',
          s: '🏤'
        },
        2: {
          0: '🎺',
          1: '🥈',
          2: '🖖',
          3: '🏏',
          4: '😤',
          5: '📩',
          6: '🦩',
          7: '🩱',
          8: '⏰',
          9: '💉',
          a: '👾',
          b: '🐒',
          c: '🦸',
          d: '🚢',
          e: '🎳',
          f: '🚘',
          g: '🧈',
          h: '🔪',
          i: '👘',
          j: '🥤',
          k: '🔌',
          l: '🎻',
          m: '🔫',
          n: '🍩',
          o: '👢',
          p: '🥇',
          q: '🎱',
          r: '🤿',
          s: '🤧'
        },
        3: {
          0: '😄',
          1: '👐',
          2: '💚',
          3: '🌚',
          4: '🌓',
          5: '👳',
          6: '🙁',
          7: '🤥',
          8: '📟',
          9: '🚏',
          a: '🌕',
          b: '🧡',
          c: '😒',
          d: '🚖',
          e: '🔨',
          f: '🎷',
          g: '🍲',
          h: '📊',
          i: '🍕',
          j: '🚅',
          k: '🌖',
          l: '🥡',
          m: '💈',
          n: '🍑',
          o: '🤺',
          p: '🏦',
          q: '🐗',
          r: '📐',
          s: '🍡'
        },
        4: {
          0: '🩹',
          1: '🕌',
          2: '👹',
          3: '🌐',
          4: '🐻',
          5: '🥅',
          6: '💖',
          7: '📇',
          8: '💑',
          9: '✊',
          a: '👿',
          b: '🎸',
          c: '🤍',
          d: '😭',
          e: '🍭',
          f: '🌻',
          g: '🦶',
          h: '🤬',
          i: '📗',
          j: '🍂',
          k: '🏈',
          l: '🤡',
          m: '👽',
          n: '🙅',
          o: '👯',
          p: '🤫',
          q: '🍬',
          r: '🥞',
          s: '🦃'
        },
        5: {
          0: '🐬',
          1: '😿',
          2: '🦈',
          3: '📱',
          4: '🌹',
          5: '😖',
          6: '🦧',
          7: '😋',
          8: '🥣',
          9: '🏨',
          a: '🍌',
          b: '🚶',
          c: '😍',
          d: '🎒',
          e: '👫',
          f: '🍹',
          g: '🤴',
          h: '🧢',
          i: '🐣',
          j: '🍈',
          k: '🎂',
          l: '🍾',
          m: '🪓',
          n: '🧏',
          o: '🎵',
          p: '🐧',
          q: '😳',
          r: '🎡',
          s: '🐶'
        },
        6: {
          0: '🪁',
          1: '🍫',
          2: '🔮',
          3: '🦺',
          4: '👷',
          5: '🥝',
          6: '🧀',
          7: '🖤',
          8: '🏣',
          9: '😧',
          a: '🎉',
          b: '💣',
          c: '👛',
          d: '💛',
          e: '🤰',
          f: '🦐',
          g: '😶',
          h: '🚔',
          i: '📆',
          j: '🐟',
          k: '🍨',
          l: '👊',
          m: '🚗',
          n: '😟',
          o: '📡',
          p: '🤏',
          q: '💢',
          r: '🎃',
          s: '🚬'
        },
        7: {
          0: '👗',
          1: '😣',
          2: '🚧',
          3: '🚕',
          4: '🏑',
          5: '👈',
          6: '😵',
          7: '🤨',
          8: '🌸',
          9: '🔏',
          a: '🔁',
          b: '👮',
          c: '🤕',
          d: '👅',
          e: '🤪',
          f: '💌',
          g: '💊',
          h: '🥕',
          i: '🤐',
          j: '🚪',
          k: '💞',
          l: '🌮',
          m: '🌵',
          n: '😢',
          o: '🍝',
          p: '🐀',
          q: '🐍',
          r: '🦔',
          s: '🚙'
        },
        8: {
          0: '🎬',
          1: '🤝',
          2: '👡',
          3: '🍗',
          4: '😛',
          5: '🚳',
          6: '💂',
          7: '🎲',
          8: '📛',
          9: '💁',
          a: '💅',
          b: '💝',
          c: '🛕',
          d: '😊',
          e: '💏',
          f: '🐋',
          g: '😞',
          h: '🔋',
          i: '🏥',
          j: '🚆',
          k: '💇',
          l: '🍳',
          m: '📔',
          n: '🎟',
          o: '📼',
          p: '🏢',
          q: '🚫',
          r: '🌿',
          s: '🌟'
        },
        9: {
          0: '😂',
          1: '🔥',
          2: '🐇',
          3: '🥗',
          4: '📁',
          5: '🦦',
          6: '🌒',
          7: '🍄',
          8: '💳',
          9: '🖕',
          a: '📦',
          b: '🍃',
          c: '🏒',
          d: '📬',
          e: '🛐',
          f: '🥪',
          g: '🎠',
          h: '🤜',
          i: '🦀',
          j: '🐆',
          k: '📌',
          l: '⏭',
          m: '🐮',
          n: '🪒',
          o: '🏩',
          p: '💙',
          q: '🐖',
          r: '😎',
          s: '🍧'
        },
        a: {
          0: '🐯',
          1: '💺',
          2: '🐂',
          3: '🎰',
          4: '🎦',
          5: '🤒',
          6: '😃',
          7: '🐢',
          8: '🍒',
          9: '🏬',
          a: '🎄',
          b: '🥖',
          c: '🧤',
          d: '🦹',
          e: '🧑',
          f: '🏅',
          g: '💐',
          h: '🛑',
          i: '👣',
          j: '🍰',
          k: '👀',
          l: '🛵',
          m: '💀',
          n: '📖',
          o: '🐛',
          p: '🚈',
          q: '🍛',
          r: '💸',
          s: '🙀'
        },
        b: {
          0: '😬',
          1: '📈',
          2: '🚺',
          3: '🚚',
          4: '🍵',
          5: '👴',
          6: '🧅',
          7: '📎',
          8: '🍥',
          9: '🧓',
          a: '🎾',
          b: '🐔',
          c: '🧐',
          d: '🏰',
          e: '🗯',
          f: '✨',
          g: '🥻',
          h: '👺',
          i: '🍤',
          j: '🦾',
          k: '🥾',
          l: '🧷',
          m: '🚝',
          n: '🐝',
          o: '🎼',
          p: '👎',
          q: '🍉',
          r: '🚛',
          s: '🐺'
        },
        c: {
          0: '🤗',
          1: '🥀',
          2: '🙉',
          3: '🚷',
          4: '🎈',
          5: '🌃',
          6: '🏓',
          7: '🦖',
          8: '⏮',
          9: '😈',
          a: '🥩',
          b: '🥓',
          c: '📍',
          d: '🦯',
          e: '😉',
          f: '⏪',
          g: '🌋',
          h: '📯',
          i: '📙',
          j: '💬',
          k: '🎧',
          l: '📉',
          m: '🚇',
          n: '🎍',
          o: '🦉',
          p: '🐫',
          q: '😪',
          r: '🙊',
          s: '🙈'
        },
        d: {
          0: '📅',
          1: '😥',
          2: '🧎',
          3: '🥺',
          4: '💪',
          5: '🙍',
          6: '😴',
          7: '🐾',
          8: '💮',
          9: '😠',
          a: '🌠',
          b: '🍔',
          c: '🤛',
          d: '📓',
          e: '👼',
          f: '🥧',
          g: '👰',
          h: '🐁',
          i: '➰',
          j: '🌺',
          k: '📵',
          l: '🌝',
          m: '🥨',
          n: '🛸',
          o: '😗',
          p: '😀',
          q: '🚍',
          r: '🦑',
          s: '🃏'
        },
        e: {
          0: '👋',
          1: '🏆',
          2: '🐲',
          3: '🥰',
          4: '👇',
          5: '🚁',
          6: '💜',
          7: '🙆',
          8: '🌌',
          9: '🌜',
          a: '🎌',
          b: '🍷',
          c: '👍',
          d: '🥟',
          e: '🦿',
          f: '🥋',
          g: '🥱',
          h: '🛒',
          i: '🛺',
          j: '🤑',
          k: '🚰',
          l: '🚓',
          m: '📷',
          n: '👪',
          o: '🤳',
          p: '😇',
          q: '👻',
          r: '🦂',
          s: '🧄'
        },
        f: {
          0: '🥶',
          1: '😑',
          2: '🛹',
          3: '🩳',
          4: '🧊',
          5: '💭',
          6: '📋',
          7: '📞',
          8: '🐊',
          9: '✋',
          a: '🤚',
          b: '🚭',
          c: '🎣',
          d: '🚋',
          e: '🙃',
          f: '🌉',
          g: '🤘',
          h: '🤯',
          i: '🦋',
          j: '🌅',
          k: '🦨',
          l: '📲',
          m: '🙎',
          n: '🎤',
          o: '🥐',
          p: '🤖',
          q: '😌',
          r: '🎭',
          s: '📒'
        },
        g: {
          0: '🍱',
          1: '🚨',
          2: '⚔',
          3: '🧼',
          4: '😺',
          5: '🌱',
          6: '⛓',
          7: '🍠',
          8: '💓',
          9: '⏩',
          a: '❎',
          b: '🚃',
          c: '📏',
          d: '🚻',
          e: '🥴',
          f: '🍯',
          g: '👓',
          h: '🎐',
          i: '😰',
          j: '🎽',
          k: '🦼',
          l: '⏹',
          m: '📕',
          n: '👭',
          o: '🕍',
          p: '😓',
          q: '🚵',
          r: '🌄',
          s: '😙'
        },
        h: {
          0: '🪑',
          1: '🐳',
          2: '🛫',
          3: '🥳',
          4: '🥂',
          5: '😯',
          6: '🚯',
          7: '📪',
          8: '📣',
          9: '🚌',
          a: '🧉',
          b: '🍜',
          c: '🪕',
          d: '👔',
          e: '🤭',
          f: '🐅',
          g: '🤮',
          h: '🤓',
          i: '📮',
          j: '🚐',
          k: '💒',
          l: '🐩',
          m: '🦅',
          n: '👸',
          o: '🎀',
          p: '🔱',
          q: '🌞',
          r: '🔖',
          s: '🥑'
        },
        i: {
          0: '👤',
          1: '🦊',
          2: '👲',
          3: '🎨',
          4: '🥵',
          5: '🔩',
          6: '🍸',
          7: '🔒',
          8: '🧍',
          9: '🍴',
          a: '👌',
          b: '🤱',
          c: '🌆',
          d: '😾',
          e: '🐵',
          f: '🦒',
          g: '😕',
          h: '😅',
          i: '🦕',
          j: '🚿',
          k: '😷',
          l: '🔄',
          m: '🧃',
          n: '😩',
          o: '🥠',
          p: '🚠',
          q: '🔧',
          r: '🎏',
          s: '📺'
        },
        j: {
          0: '🌯',
          1: '🧒',
          2: '🎑',
          3: '🐱',
          4: '⏺',
          5: '😐',
          6: '🚼',
          7: '🛀',
          8: '📜',
          9: '🦥',
          a: '🐷',
          b: '😔',
          c: '🍚',
          d: '🦏',
          e: '⏳',
          f: '📘',
          g: '🚣',
          h: '🍆',
          i: '⚓',
          j: '🏹',
          k: '🐡',
          l: '🐉',
          m: '💆',
          n: '🚱',
          o: '🍀',
          p: '🐄',
          q: '🥃',
          r: '👑',
          s: '🤣'
        },
        k: {
          0: '🏐',
          1: '🍢',
          2: '📚',
          3: '🏀',
          4: '🔎',
          5: '🍊',
          6: '🪀',
          7: '🦎',
          8: '👨',
          9: '🚥',
          a: '🗻',
          b: '😘',
          c: '🏮',
          d: '📥',
          e: '🙂',
          f: '🏁',
          g: '🎊',
          h: '🛷',
          i: '🚀',
          j: '🎶',
          k: '🚸',
          l: '🎅',
          m: '🩰',
          n: '💔',
          o: '🥙',
          p: '🐽',
          q: '📫',
          r: '🚟',
          s: '🐸'
        },
        l: {
          0: '🪐',
          1: '🍙',
          2: '⏸',
          3: '❌',
          4: '🧥',
          5: '🚽',
          6: '👦',
          7: '💩',
          8: '💘',
          9: '🏪',
          a: '🔦',
          b: '🦌',
          c: '🏴',
          d: '🍟',
          e: '🧦',
          f: '📠',
          g: '🎴',
          h: '🩸',
          i: '🌛',
          j: '🔗',
          k: '🎩',
          l: '💡',
          m: '🍋',
          n: '🥔',
          o: '🔓',
          p: '🗿',
          q: '⚡',
          r: '😡',
          s: '🎹'
        },
        m: {
          0: '🐜',
          1: '🙋',
          2: '👏',
          3: '⏯',
          4: '😲',
          5: '💃',
          6: '🐙',
          7: '🩲',
          8: '🪂',
          9: '🏯',
          a: '🌈',
          b: '💘',
          c: '💋',
          d: '🥫',
          e: '🖐',
          f: '🐌',
          g: '🚊',
          h: '🛶',
          i: '🕴',
          j: '🍓',
          k: '👟',
          l: '🧣',
          m: '🐑',
          n: '🥄',
          o: '👆',
          p: '🚴',
          q: '🐓',
          r: '😻',
          s: '🦄'
        },
        n: {
          0: '🏉',
          1: '🍁',
          2: '🔬',
          3: '🧆',
          4: '🚄',
          5: '🚦',
          6: '🌗',
          7: '🐦',
          8: '👉',
          9: '🍐',
          a: '🌇',
          b: '😦',
          c: '🍶',
          d: '🐠',
          e: '🌳',
          f: '👚',
          g: '📄',
          h: '🐹',
          i: '👂',
          j: '🥚',
          k: '👶',
          l: '🤟',
          m: '🦗',
          n: '🌁',
          o: '🦍',
          p: '🤢',
          q: '🚉',
          r: '🦮',
          s: '🌙'
        },
        o: {
          0: '👠',
          1: '🚜',
          2: '🐈',
          3: '🩺',
          4: '🏺',
          5: '📸',
          6: '🔳',
          7: '🏊',
          8: '🦻',
          9: '🐤',
          a: '✅',
          b: '🔑',
          c: '👬',
          d: '🏠',
          e: '🚒',
          f: '💯',
          g: '🌀',
          h: '🏭',
          i: '🤤',
          j: '🌷',
          k: '🍍',
          l: '🚑',
          m: '💧',
          n: '🏡',
          o: '🎮',
          p: '📝',
          q: '💦',
          r: '🚎',
          s: '🦁'
        },
        p: {
          0: '🤔',
          1: '🌭',
          2: '💾',
          3: '📧',
          4: '🎯',
          5: '😆',
          6: '🌂',
          7: '🌑',
          8: '🔐',
          9: '🐨',
          a: '🤵',
          b: '💄',
          c: '🥉',
          d: '🍿',
          e: '😝',
          f: '👞',
          g: '🍇',
          h: '🏄',
          i: '🧕',
          j: '📭',
          k: '🍞',
          l: '🔲',
          m: '🙌',
          n: '🌴',
          o: '🍎',
          p: '💼',
          q: '🍏',
          r: '👄',
          s: '🍺'
        },
        q: {
          0: '💻',
          1: '🦪',
          2: '🔰',
          3: '🎋',
          4: '🛴',
          5: '🦆',
          6: '💎',
          7: '🌘',
          8: '🍅',
          9: '📂',
          a: '🎢',
          b: '💟',
          c: '🐎',
          d: '🕺',
          e: '📀',
          f: '💥',
          g: '👵',
          h: '🦽',
          i: '🥒',
          j: '🐪',
          k: '♻',
          l: '🚂',
          m: '🤠',
          n: '🔭',
          o: '🏫',
          p: '🐞',
          q: '🎪',
          r: '🥁',
          s: '📢'
        },
        r: {
          0: '🏛',
          1: '🎥',
          2: '🚤',
          3: '🍣',
          4: '🐴',
          5: '🥛',
          6: '🔍',
          7: '🧔',
          8: '😱',
          9: '🍪',
          a: '🤙',
          b: '🕰',
          c: '📑',
          d: '🥌',
          e: '🤶',
          f: '🥢',
          g: '😸',
          h: '📻',
          i: '🙄',
          j: '📃',
          k: '🐃',
          l: '👩',
          m: '🐭',
          n: '👧',
          o: '💗',
          p: '🧇',
          q: '😚',
          r: '🐼',
          s: '🚞'
        },
        s: {
          0: '🍘',
          1: '🐚',
          2: '🌊',
          3: '👖',
          4: '👕',
          5: '🎓',
          6: '🪔',
          7: '📰',
          8: '🚲',
          9: '🍮',
          a: '🛁',
          b: '👜',
          c: '🍦',
          d: '🦇',
          e: '💕',
          f: '💵',
          g: '😹',
          h: '🤲',
          i: '🗼',
          j: '🏂',
          k: '🌾',
          l: '🦵',
          m: '♠',
          n: '💽',
          o: '😮',
          p: '🌽',
          q: '🥘',
          r: '🏸',
          s: '📤'
        }
      },
      numberOfEmojis: null,
      disableZoom: true,
      minZoomLevel: 3,
      zoom: null,
      currentScale: 0,
      scale: [],
      center: { lat: 45, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null,
      // rectOptions: null,
      tileSize: 256,
      cellBounds: {
        ne: {
          x: null,
          y: null
        },
        sw: {
          x: null,
          y: null
        }
      },
      percentBounds: {
        ne: {
          x: null,
          y: null
        },
        sw: {
          x: null,
          y: null
        }
      },
      geoBounds: {
        ne: {
          lat: null,
          lng: null
        },
        sw: {
          lat: null,
          lng: null
        }
      },
      bounds: {
        ne: {
          lat: null,
          lng: null
        },
        sw: {
          lat: null,
          lng: null
        }
      },
      mouse: {
        down: false,
        dir: -1,
        oldX: 0
      },
      ui: {
        satelliteView: false,
        colorView: true,
        gridView: true
      },
      userPositionCircleSizeScale: 600,
      meterScaleAtZoomLevel: {
        19: 1128.49722,
        18: 2256.99444,
        17: 4513.98888,
        16: 9027.977761,
        15: 18055.95552,
        14: 36111.91104,
        13: 72223.82209,
        12: 144447.6442,
        11: 288895.2884,
        10: 577790.5767,
        9: 1155581.153,
        8: 2311162.307,
        7: 4622324.614,
        6: 9244649.227,
        5: 18489298.45,
        4: 36978596.91,
        3: 73957193.82,
        2: 147914387.6,
        1: 295828775.3,
        0: 591657550.5
      }
    }
  },
  mounted() {
    this.initVerticalResizeForPhones()
    this.vueInit()
    this.init()
  },
  methods: {
    // ANCHOR ⁡⁣⁣⁢𝗜𝗡𝗜𝗧𝗜𝗔𝗟𝗜𝗭𝗔𝗧𝗜𝗢𝗡 𝗠𝗘𝗧𝗛𝗢𝗗𝗦 ----------------------------------------------------⁡
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    initVerticalResizeForPhones() {
      // resize vertical region for phones
      const resizer = () => {
        document.getElementById('care').style.height = `${window.innerHeight}px`
        console.log('Phone vertical resize')
      }
      window.addEventListener('resize', () => resizer())
      if (document.readyState !== 'loading') {
        resizer()
      } else {
        document.addEventListener('DOMContentLoaded', () => resizer())
      }
    },
    vueInit() {
      // manually run calculations
      this.numberOfEmojis = Object.keys(this.emojiIndexReference).length

      this.scale.splice(0, 1, 256 / this.numberOfEmojis)
      this.scale.splice(1, 1, 256 / Math.pow(this.numberOfEmojis, 2))
      this.scale.splice(2, 1, 256 / Math.pow(this.numberOfEmojis, 3))
      this.scale.splice(3, 1, 256 / Math.pow(this.numberOfEmojis, 4))
    },
    init() {
      // eslint-disable-next-line max-statements
      this.$refs.mapRef.$mapPromise.then((map) => {
        this.map = map

        // Rectangle tool
        // const drawingManager = new this.google.maps.drawing.DrawingManager({
        //   drawingMode: this.google.maps.drawing.OverlayType.MARKER,
        //   drawingControl: true,
        //   drawingControlOptions: {
        //     position: this.google.maps.ControlPosition.TOP_CENTER,
        //     drawingModes: this.google.maps.drawing.OverlayType.RECTANGLE
        //   }
        // })
        // drawingManager.setMap(map)

        // Set map style properties
        map.setOptions({ styles: MapStyleData.blankPaper })
        // Set map type from roadmap -> terrain
        map.setMapTypeId('terrain')
        // Two-finger-touch
        map.set('gestureHandling', 'greedy')
        map.set('disableDefaultUI', true)
        map.set('disableDoubleClickZoom', true)
        map.set('minZoom', 3)
        map.set('maxZoom', 19)

        const drawingManager = new this.google.maps.drawing.DrawingManager()

        // this.map = new this.google.maps.Map(
        //   document.getElementById('map-canvas')
        // )

        // Setting options for the Drawing Tool. In our case, enabling Polygon shape.
        drawingManager.setOptions({
          // drawingMode: this.google.maps.drawing.OverlayType.RECTANGLE,
          drawingControl: true,
          drawingControlOptions: {
            position: this.google.maps.ControlPosition.TOP_RIGHT,
            drawingModes: [this.google.maps.drawing.OverlayType.RECTANGLE]
          },
          rectangleOptions: {
            strokeColor: '#6c6c6c',
            strokeWeight: 1,
            strokeStyle: 'dashed',
            fillColor: '#926239',
            fillOpacity: 0.6,
            editable: true
            // draggable: true
          }
        })
        // Loading the drawing Tool in the Map.
        drawingManager.setMap(this.map)

        // FIXME - Check for newly colored cells
        window.setInterval(() => {
          this.updateColorMap()
        }, 1000)

        this.listenerHandler(map)

        this.emitHandler(map)
      })
    },
    listenerHandler(map) {
      const googleMapElement = document.getElementById('g-map')
      // Map init - do something only the first time the map is loaded
      this.google.maps.event.addListenerOnce(map, 'idle', () => {
        // this.map.setZoom(this.minZoomLevel)
        this.drawGoogleGridsIntoRegion()
        this.geolocation()
        this.center = { lat: 7, lng: 76 }
        if (this.map.getZoom() > 3) {
          this.map.setZoom(3)
        }
        this.initColorMap()
      })

      // MOVE THIS TO INIT MAP EVENT -----------------------------
      // Run once after map is fully loaded with mercator projection
      this.google.maps.event.addListenerOnce(map, 'projection_changed', () => {
        // If an emojiCode exists in URL then handle with this.convertEmojiInput
        if (this.$route.params.emojiCode) {
          setTimeout(() => {
            this.emojiInputZoomCenter(
              this.convertEmojiInput(this.$route.params.emojiCode)
            )
            console.log(
              `   converted emoji input: ${map.getCenter().lat()}`,
              map.getCenter().lng()
            )
          }, 2000)
        } else {
          this.disableZoom = false
        }
      })

      googleMapElement.addEventListener('mousemove', (event) => {
        this.calcEmojiReadout(event)
      })

      googleMapElement.addEventListener('click', (event) => {
        // for mobile devices to render emoji position
        this.calcEmojiReadout(event)
        // document.getElementById('cell-inspect').style.visibility = 'hidden'

        // Hacked handling for dblclick for both mobile and desktop browsers
        if (this.doubleClicked) {
          // do what you want to do on double click here
          this.colorCell()
        }
        this.doubleClicked = true
        setTimeout(() => {
          this.doubleClicked = false
        }, 300)
      })

      googleMapElement.addEventListener('dblclick', () => {
        // this.calcEmojiReadout(event)
        // this.colorCell()
      })

      // Right click event
      googleMapElement.addEventListener('contextmenu', (event) => {
        this.inspectCell(event)
      })

      googleMapElement.addEventListener('touchmove', (event) => {
        event.preventDefault()
        // document.getElementById('cell-inspect').style.visibility = 'hidden'
      })

      // Right click event for mobile [touch and hold for 1sec]
      googleMapElement.addEventListener('touchstart', (event) => {
        event.preventDefault()
        console.log('touchstart - ', event)
        if (!this.holdTouch) {
          this.holdTouch = setTimeout(() => {
            // SUCCESS fire event
            this.inspectCell(event.touches[0])
          }, 750)
        }
      })
      googleMapElement.addEventListener('touchend', (event) => {
        event.preventDefault()
        // stops short touches from firing the event
        if (this.holdTouch) {
          clearTimeout(this.holdTouch)
          this.holdTouch = null
        }
      })

      map.addListener('zoom_changed', () => {
        this.zoom = this.map.getZoom()
        console.log(`zoom @: ${this.zoom}`)
        // Hide cell-inspect (right-click) window when zoom is changed
        document.getElementById('cell-inspect').style.visibility = 'hidden'

        // when zoom breaks up the grid unload old grid scale and load up the new grid scale
        if (this.breakLayer() !== this.currentScale) {
          console.log(this.breakLayer(), this.currentScale)
          // If user goes from layer 1 -> 2 or 2 -> 1 unload cells to prep for
          // next layer (1/3) rendering
          if (
            (this.currentScale === 1 && this.breakLayer() === 2) ||
            (this.currentScale === 2 && this.breakLayer() === 1)
          ) {
            this.unloadCellGrid()
          }
        }
        // Change userPositionCircle size based on zoom changes
        this.redrawUserPositionCircle(
          this.meterScaleAtZoomLevel[this.map.getZoom()] /
            this.userPositionCircleSizeScale
        )
      })

      map.addListener('bounds_changed', () => {
        // Sets bounds to world coordinates
        // this.mercCoords()
        // console.log('huh? setbounds()')
        this.setAllBounds()

        try {
          this.drawGoogleGridsIntoRegion()
        } catch (e) {
          console.log(`drawGoogleGridsIntoRegion failed: ${e.message}`)
        }
      })
    },
    emitHandler(map) {
      // $root.$emit from UI.NestedHideMenu for satelliteView button event
      this.$root.$on('satellite-view', (ret) => {
        if (ret) {
          map.setMapTypeId('satellite')
        } else {
          map.setMapTypeId('terrain')
        }
      })
      // $root.$emit from UI.NestedHideMenu for emojiGrid button event
      this.$root.$on('emoji-grid', (ret) => {
        if (ret) {
          this.ui.gridView = true
          this.loadGoogleGrid()
          document.getElementById('tdCursor').style.visibility = 'visible'
        } else {
          this.ui.gridView = false
          this.unloadGoogleGrid()
          // hide emoji cursor selector at top
          document.getElementById('tdCursor').style.visibility = 'hidden'
        }
      })
      // $root.$emit from UI.NestedHideMenu for colorGrid button event
      this.$root.$on('color-grid', (ret) => {
        if (ret) {
          // this.loadCellGrid()
          // Object.values(this.cellRectangles).forEach((val) => {
          // val.setOptions({ visible: true })
          // })
          this.loadCellGrid()
        } else {
          // this.unloadCellGrid()
          // Object.values(this.cellRectangles).forEach((val) => {
          // val.setOptions({ visible: false })
          // })
          this.unloadCellGrid()
        }
      })
      // $root.$emit from UI.NestedHideMenu for opaqueColorGrid event
      this.$root.$on('opaque-color-grid', (ret) => {
        if (ret) {
          this.cellOpacity = 1.0
        } else {
          this.cellOpacity = 0.6
        }
        Object.values(this.cellRectangles).forEach((val) => {
          val.setOptions({ fillOpacity: this.cellOpacity })
        })
      })
      // $root.$emit from UI.NestedHideMenu for GPS center button event
      this.$root.$on('GPS-center', () => {
        navigator.geolocation.getCurrentPosition((position) => {
          this.userPositionLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          map.panTo(this.userPositionLatLng)
        })
      })
    },

    // ANCHOR ⁡⁣⁣⁢𝗔𝗣𝗜 𝗠𝗘𝗧𝗛𝗢𝗗𝗦 -----------------------------------------------------------------------⁡
    /** API call for coloring in a cell, made when dblclicking  */
    colorCell() {
      if (this.currentScale !== 1) {
        console.log('WHOOPS! try it at 2nd grid layer <3')
      } else {
        const payload = {
          location: [this.mouseCellPosX, this.mouseCellPosY],
          color: this.$store.getters.selectedSwatch
        }
        api
          .colorCell(payload)
          .then((apires) => {
            this.drawCell(
              apires.data.location[0],
              apires.data.location[1],
              apires.data.cellData
            )
            // this.colorMap[apires.data.location] = {
            //   data: apires.data.cellData,
            //   time: apires.data.updatedAt
            // }
          })
          .catch((e) => {
            this.$vToastify.error({
              body: e,
              title: 'Error',
              callback: () => {
                console.log('toastify callback fired off!')
              }
            })
          })
      }
    },
    // eslint-disable-next-line max-statements
    inspectCell(event) {
      const position = []
      // update emoji position on holdTouch
      this.calcEmojiReadout(event)
      if (
        document.getElementById('cell-inspect').style.visibility !== 'visible'
      ) {
        if (this.currentScale === 0) {
          position[0] = this.mouseCellPosXNext
          position[1] = this.mouseCellPosYNext
        } else {
          position[0] = this.mouseCellPosX
          position[1] = this.mouseCellPosY
        }
        console.log(position)
        api
          .inspectCell(position)
          .then((apires) => {
            console.log(apires)
            document.getElementById('card-header').style.background =
              apires.data.cellData.color
            // this.cellInspect.timeStamp = apires.data.updatedAt
            this.cellInspect.cellLocation = position
            this.cellInspect.emojiLocation = this.emojiLocation
            this.cellInspect.owner = apires.data.cellData.owner
            console.log('log dog: ', this.cellInspect)
          })
          .catch((e) => {
            console.log(e)
            // document.getElementById('card-header').style.background = '#EEEEEE'
            // this.cellInspect.owner = 'Not Found'
            // // this.cellInspect.timeStamp = 'Not Found'
            // this.cellInspect.cellLocation = `${this.mouseCellPosX}, ${this.mouseCellPosY}`
            // this.cellInspect.emojiLocation = this.emojiLocation
          })
        const pos = {
          x: event.pageX,
          y: event.pageY
        }
        if (pos.x > window.innerWidth - 350) {
          pos.x = window.innerWidth - 350
        }
        if (pos.y > window.innerHeight - 300) {
          pos.y = window.innerHeight - 300
        }
        document.getElementById('cell-inspect').style.left = `${pos.x}px`
        document.getElementById('cell-inspect').style.top = `${pos.y}px`
        document.getElementById('cell-inspect').style.visibility = 'visible'
      }
    },
    /** Initial fetch of all cells at rez of 2 [0-841, 0-841] */
    initColorMap() {
      // Use a Mercator Projection to cast this.bounds values to google
      // maps' equivalent "World Coordinates" values
      // sets this.bounds
      // !! WHICH IS NEEDED FOR payload region
      this.setAllBounds()
      // this.mercCoords()
      // fetch all colored cells at rez 2
      const payload = {
        firstCell: {
          x: 0,
          y: 0
          // x: this.findSqIDByWorldCoordsRezOf2(this.bounds.sw.x),
          // y: this.findSqIDByWorldCoordsRezOf2(this.bounds.ne.y)
        },
        lastCell: {
          x: 841,
          y: 841
          // x: this.findSqIDByWorldCoordsRezOf2(this.bounds.ne.x),
          // y: this.findSqIDByWorldCoordsRezOf2(this.bounds.sw.y)
        },
        lastFetchRegionTime: this.lastFetchRegionTime
      }
      this.lastFetchRegionTime = new Date().getTime()
      // console.table(payload)

      axios
        .post(`${process.env.VUE_APP_API_URL}/cell/fetchRegion`, payload)
        .then((res) => {
          if (res.data.length !== 0) {
            Promise.all(this.drawRegionOfCells(res)).then(() => {
              console.log('mapped: ', res)
              // this.createCachedImage()
              if (
                document.defaultView
                  .getComputedStyle(
                    document.getElementById('loading-element'),
                    null
                  )
                  .getPropertyValue('visibility') === 'visible'
              ) {
                // document.getElementById('loading-element').style.visibility =
                //   'hidden'
                document
                  .getElementById('loading-element')
                  .classList.toggle('fade-out', true)
                console.log('loaded!')
              }
            })
          } else {
            document.getElementById('loading-element').style.visibility =
              'hidden'
            console.error('No cells on init!')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /** Fetch all new cells at rez of 2 */
    updateColorMap() {
      // Use a Mercator Projection to cast this.bounds values to google
      // maps' equivalent "World Coordinates" values
      // sets this.bounds
      // !! WHICH IS NEEDED FOR payload region
      this.setAllBounds()
      // this.mercCoords()
      // fetch all colored cells at rez 2
      const payload = {
        firstCell: {
          x: 0,
          y: 0
          // x: this.findSqIDByWorldCoordsRezOf2(this.bounds.sw.x),
          // y: this.findSqIDByWorldCoordsRezOf2(this.bounds.ne.y)
        },
        lastCell: {
          x: 841,
          y: 841
          // x: this.findSqIDByWorldCoordsRezOf2(this.bounds.ne.x),
          // y: this.findSqIDByWorldCoordsRezOf2(this.bounds.sw.y)
        },
        lastFetchRegionTime: this.lastFetchRegionTime
      }
      this.lastFetchRegionTime = new Date().getTime()
      // console.table(payload)

      axios
        .post(`${process.env.VUE_APP_API_URL}/cell/fetchRegion`, payload)
        .then((res) => {
          if (res.data.length !== 0) {
            Promise.all(this.drawRegionOfCells(res)).then(() => {
              console.log('map updated: ', res)
              // this.createCachedImage()
            })
          } else {
            console.log('No new cells.')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /** Uses region param and maps over it with drawCell()
     *  @param {object[]} region Uses data to fill this.colorMap then calls this.drawCell() for each entry.
     *  @return {promise} region for .then() call used for loading screen termination
     */
    drawRegionOfCells(region) {
      console.log('mapping...')
      const ret = region.data.map((val) => {
        // this.colorMap[val.location] = {
        //   data: val.cellData,
        //   time: val.updatedAt
        // }
        // console.log('valllllllllllllllllllllllll: ', val)
        this.drawCell(val.location[0], val.location[1], val.cellData)
        // this.createCachedPixel(
        //   val.location[0],
        //   val.location[1],
        //   val.cellData.color
        // )
        // console.log(JSON.stringify(val))
        // console.log('dog: ', val.location[0], val.location[1], val.cellData)
      })
      // new Promise(this.createCachedImage()).then(() => {})
      // this.createCachedImage()
      // resolve('hidden')
      return ret
    },

    // ANCHOR ⁡⁣⁣⁢𝗘𝗠𝗢𝗝𝗜 𝗠𝗘𝗧𝗛𝗢𝗗𝗦 -----------------------------------------------------------------⁡
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // Take latlng of cursor position and get percent using mercator,
    // then convert it to grid coords at current scale
    // eslint-disable-next-line max-statements
    calcEmojiReadout(event) {
      const cursor = this.mousePositionToLatLng(event.pageX, event.pageY)
      const mercCursor = {
        lon: cursor.lng(),
        lat: cursor.lat()
      }

      // console.log(`mercCursor: ${JSON.stringify(mercCursor)}`)

      const coordsLabel = document.getElementById('tdCursor')

      const percentWorld = mercator(mercCursor)

      const percentWorldX = (cursor.lng() + 180) / 360
      const percentWorldY = percentWorld.y
      const absoluteGridScaleAtZoom = Math.pow(29, this.currentScale + 1)
      const absoluteGridScaleAtZoomNext = Math.pow(29, this.currentScale + 2)

      this.mouseCellPosX = parseInt(percentWorldX * absoluteGridScaleAtZoom)
      this.mouseCellPosY = parseInt(percentWorldY * absoluteGridScaleAtZoom)
      this.mouseCellPosXNext = parseInt(
        percentWorldX * absoluteGridScaleAtZoomNext
      )
      this.mouseCellPosYNext = parseInt(
        percentWorldY * absoluteGridScaleAtZoomNext
      )

      this.getEmojiLocation()

      // console.log(cursor.lat(), cursor.lng())
      // console.log(this.mouseCellPosX, this.mouseCellPosY)
      // console.log('emojis: ', this.getEmojiLocation())

      coordsLabel.innerHTML = ` ${this.emojiLocation}`
      const elinkArea = document.getElementById('link-area')
      elinkArea.innerHTML = `http://www.w4a.care/${this.emojiLocation}`
    },
    /** Set this.emojiLocation based on user position and return it
     * @param {number} x some x shit
     * @param {number} y idk y or some shit?
     * @return {emojiLocation}
     */
    // eslint-disable-next-line max-statements
    getEmojiLocation() {
      this.emojiLocation = ''
      // Each layer stored as numerical IDs absolute value
      const emojiAbsoluteLocationNumericalId = {
        x: [],
        y: []
      }
      // Each layer stored as numerical IDs relative value
      const emojiLocationNumericalId = {
        x: [],
        y: []
      }
      // const xEmojiLoc = Math.floor(
      //   this.mouseCellPosX / this.gridSizeUpOne()
      // ).toString(this.numberOfEmojis)
      // const yEmojiLoc = Math.floor(
      //   this.mouseCellPosY / this.gridSizeUpOne()
      // ).toString(this.numberOfEmojis)

      // emojiAbsoluteLocationNumericalId.push(0)
      for (let i = this.breakLayer(); i >= 0; i--) {
        // console.log(
        //   `breaklayer(): ${this.breakLayer()}`,
        //   this.mouseCellPosX,
        //   this.mouseCellPosY
        // )

        emojiAbsoluteLocationNumericalId.x.push(
          Math.floor(this.mouseCellPosX / Math.pow(this.numberOfEmojis, i))
        )
        emojiAbsoluteLocationNumericalId.y.push(
          Math.floor(this.mouseCellPosY / Math.pow(this.numberOfEmojis, i))
        )
      }

      // emojiLocationNumericalId.x.push(emojiAbsoluteLocationNumericalId.x[0])
      // emojiLocationNumericalId.y.push(emojiAbsoluteLocationNumericalId.y[0])

      for (let i = 0; i <= this.breakLayer(); i++) {
        // emojiLocationNumericalId.x.[i]
        const nextEmoji = {
          x: emojiAbsoluteLocationNumericalId.x[i] / Math.pow(29, i),
          y: emojiAbsoluteLocationNumericalId.y[i] / Math.pow(29, i)
        }
        for (let j = i; j > 0; j--) {
          nextEmoji.x -= emojiLocationNumericalId.x[i - j]
          nextEmoji.x *= 29
          nextEmoji.y -= emojiLocationNumericalId.y[i - j]
          nextEmoji.y *= 29
        }
        // !! SKETCHY ROUND! shouldnt be necessary
        nextEmoji.x = Math.round(nextEmoji.x)
        nextEmoji.y = Math.round(nextEmoji.y)
        // console.log(
        //   JSON.stringify(emojiAbsoluteLocationNumericalId),
        //   JSON.stringify(nextEmoji)
        // )

        emojiLocationNumericalId.x.push(nextEmoji.x)
        emojiLocationNumericalId.y.push(nextEmoji.y)

        this.emojiLocation += `${
          this.emojiIndexReference[
            emojiLocationNumericalId.x[i].toString(this.numberOfEmojis)
          ][emojiLocationNumericalId.y[i].toString(this.numberOfEmojis)]
        }`
      }

      return this.emojiLocation
    },
    gridSizeUpOne() {
      return Math.pow(this.numberOfEmojis, this.currentScale)
    },

    // ANCHOR ⁡⁣⁣⁢𝗚𝗥𝗜𝗗 𝗠𝗘𝗧𝗛𝗢𝗗𝗦 -------------------------------------------------------------------⁡
    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------
    // eslint-disable-next-line max-statements
    drawGoogleGridsIntoRegion() {
      this.unloadGoogleGrid()
      this.currentScale = this.breakLayer()
      // !! create drawLine(percent) method
      const test = { x: 0, y: 0 }
      let alternateSign = false

      this.googleLinesLat = []
      this.googleLinesLng = []
      this.googleGridLat = []
      this.googleGridLng = []
      const gridSizeAtScale = 1 / Math.pow(29, this.currentScale + 1)
      const swCorner = mercator({
        lat: this.geoBounds.sw.lat(),
        lon: this.geoBounds.sw.lng()
      })
      const neCorner = mercator({
        lat: this.geoBounds.ne.lat(),
        lon: this.geoBounds.ne.lng()
      })
      const screenBounds = {
        bottom: swCorner.y + gridSizeAtScale - (swCorner.y % gridSizeAtScale),
        top: neCorner.y + gridSizeAtScale - (neCorner.y % gridSizeAtScale),
        left: swCorner.x + gridSizeAtScale - (swCorner.x % gridSizeAtScale),
        right: neCorner.x + gridSizeAtScale - (neCorner.x % gridSizeAtScale)
      }
      for (
        let y = screenBounds.top;
        y <= screenBounds.bottom;
        y += gridSizeAtScale
      ) {
        test.y = y
        const ret = mercator(test)

        this.googleLinesLat.push({
          lat: ret.lat,
          lng: -180
        })
        this.googleLinesLat.push({ lat: ret.lat, lng: 0 })
        this.googleLinesLat.push({
          lat: ret.lat,
          lng: 180
        })
      }

      for (
        let x = screenBounds.left;
        screenBounds.left > screenBounds.right
          ? x <= screenBounds.right || x >= screenBounds.left
          : x <= screenBounds.right;
        x += gridSizeAtScale
      ) {
        // Flip over the EVIL LINE
        if (x >= 1) {
          x -= 1
        }
        // console.log('X: ', x)

        test.x = x
        const ret = mercator(test)

        // NOTE ⁡⁢⁣⁣-⁡ ⁡⁢⁣⁣removed currentscale array and add try catch ⁡⁢⁣⁣to bounds change⁡⁡

        // Alternate draw directions to avoid cross threading issues
        this.googleLinesLng.push({
          lat: alternateSign ? -90 : 90,
          lng: ret.lon
        })
        this.googleLinesLng.push({
          lat: alternateSign ? 90 : -90,
          lng: ret.lon
        })
        alternateSign = !alternateSign
      }
      this.googleGridLat = new this.google.maps.Polyline({
        path: this.googleLinesLat,
        geodesic: false,
        strokeColor: '#504515',
        strokeOpacity: 1.0,
        strokeWeight: 1,
        zIndex: 2
      })
      this.googleGridLng = new this.google.maps.Polyline({
        path: this.googleLinesLng,
        geodesic: false,
        strokeColor: '#504515',
        strokeOpacity: 1.0,
        strokeWeight: 1,
        zIndex: 2
      })
      // }
      // Draw Grid (now that loaded above) at current scale
      this.googleGridLng.setMap(this.map)
      this.googleGridLat.setMap(this.map)

      console.table(
        'ARRAY LENGTHS: ',
        this.googleGridLng.length,
        this.googleGridLat.length,
        this.googleLinesLat.length,
        this.googleLinesLng.length
      )
      // this.googleGridLat[this.currentScale].setMap(null)
    },
    /** Remove Drawn grid by setting previous scale index of this.googleGridLat[] and this.googleGridLng[] arrays in this.map to null */
    unloadGoogleGrid() {
      if (this.googleGridLat) {
        // console.log('console map set null')
        this.googleGridLat.setMap(null)
      }
      if (this.googleGridLng) {
        this.googleGridLng.setMap(null)
      }

      // !! HACK FIX for loading from zoom out scale 2 -> 1 load scale 1 cells
      if (this.breakLayer() === 1) {
        this.loadCellGrid()
      }
    },
    /** Draw grid from arrays this.googleGridLat[] and this.googleGridLng[] */
    loadGoogleGrid() {
      console.log('Load Google Grid...', this.currentScale)
      // Object.entries(
      //   this.googleGridLng.getPath().getArray()
      // ).forEach(([key, value]) => {
      //   // const cellX = Number.parseInt(key.split(',')[0])
      //   // const cellY = Number.parseInt(key.split(',')[1])
      //   // console.log('value.lng(): ', value.lng())
      //   if (
      //     value.lng() >= this.geoBounds.sw.lng() &&
      //     value.lng() <= this.geoBounds.ne.lng()
      //   ) {
      //     console.log(
      //       'value.l(): ',
      //       this.googleGridLng.getPath()
      //     )

      //     const lngLines = new this.google.maps.Polyline({
      //       path: value,
      //       geodesic: false,
      //       strokeColor: '#504515',
      //       strokeOpacity: 1.0,
      //       strokeWeight: 1,
      //       zIndex: 2
      //     })
      //     lngLines.setMap(this.map)
      //   }
      //   // cellY >= this.cellBounds.sw.y &&
      //   // cellY <= this.cellBounds.ne.y
      // })
      // console.log(
      //   'gridkey: ',
      //   this.googleGridLng.getPath().getArray().toString()
      // )
      this.googleGridLng.setMap(this.map)
      this.googleGridLat.setMap(this.map)
      console.log('load finished!')
      // !! HACK FIX for loading from zoom in scale 1 -> 2 unload scale 1 cells
      if (this.currentScale >= 2) {
        this.unloadCellGrid()
      }
    },
    // -- DEPRECATED --
    // eslint-disable-next-line max-statements
    drawGoogleGridsIntoMemory() {
      // !! create drawLine(percent) method
      const test = { x: 0, y: 0 }
      let alternateSign = false

      console.log(Math.pow(29, this.currentScale + 1))
      for (let i = 0; i < 3; i++) {
        this.googleLinesLat[i] = []
        this.googleLinesLng[i] = []
        for (let y = 0; y <= 1; y += 1 / Math.pow(29, i + 1)) {
          test.x = y
          test.y = y
          const ret = mercator(test)
          this.googleLinesLat[i].push({
            lat: ret.lat,
            lng: -180
          })
          this.googleLinesLat[i].push({ lat: ret.lat, lng: 0 })
          this.googleLinesLat[i].push({ lat: ret.lat, lng: 180 })
          // Alternate draw directions to avoid cross threading issues
          this.googleLinesLng[i].push({
            lat: alternateSign ? -90 : 90,
            lng: ret.lon
          })
          this.googleLinesLng[i].push({
            lat: alternateSign ? 90 : -90,
            lng: ret.lon
          })
          alternateSign = !alternateSign
          // googleGridLat.setMap(null)
        }
        this.googleGridLat[i] = new this.google.maps.Polyline({
          path: this.googleLinesLat[i],
          geodesic: false,
          strokeColor: '#504515',
          strokeOpacity: 1.0,
          strokeWeight: 1,
          zIndex: 2
        })
        this.googleGridLng[i] = new this.google.maps.Polyline({
          path: this.googleLinesLng[i],
          geodesic: false,
          strokeColor: '#504515',
          strokeOpacity: 1.0,
          strokeWeight: 1,
          zIndex: 2
        })
      }
      // Draw Grid (now that loaded above) at current scale
      this.googleGridLng.setMap(this.map)
      this.googleGridLat.setMap(this.map)
      // this.googleGridLat.setMap(null)
    },

    // ANCHOR ⁡⁢⁣⁢⁡⁣⁣⁢𝗖𝗘𝗟𝗟 𝗠𝗘𝗧𝗛𝗢𝗗𝗦 -------------------------------------------------------------------⁡
    /** Draw single cell at x,y care's grid coordinates scale of 2 by adding it to this.cellRectangles['x,y'] setting that to this.map
     * @param {number} x grid coordinate
     * @param {number} y grid coordinate
     */
    drawCell(x, y, data) {
      // Remove any old colored cell if exists
      // if (this.cellRectangles[`${x},${y}`]) {
      if (this.cellRectangles[`${x},${y}`]) {
        this.cellRectangles[`${x},${y}`].setMap(null)
        // }
      } // else {
      const currentCell = {}
      const cellsAtCurrentScale = Math.pow(29, 1 + 1)
      currentCell.x = x / cellsAtCurrentScale
      currentCell.y = y / cellsAtCurrentScale

      const merc = mercator(currentCell)
      // const mY = mercator(currentCellY)

      // const cellWidth = 360 / cellsAtCurrentScale
      const cellWidthInDegrees = 360 / Math.pow(29, 1 + 1)
      const cellSizeInPercent = 1 / Math.pow(29, 1 + 1)
      currentCell.x += cellSizeInPercent
      currentCell.y += cellSizeInPercent
      const mercCellSizeInDegrees = mercator(currentCell)

      // console.log(
      //   'CELLLLLLS FINAL FOAM!!: ',
      //   cellWidthInDegrees,
      //   merc,
      //   mercCellSizeInDegrees
      // )

      this.cellRectangles[`${x},${y}`] = new this.google.maps.Rectangle({
        // const cell = new this.google.maps.Rectangle({
        // strokeColor: '#000000',
        // strokeOpacity: 1,
        strokeWeight: 0,
        fillColor: data.color,
        fillOpacity: this.cellOpacity,
        bounds: {
          north: merc.lat,
          south: mercCellSizeInDegrees.lat,
          east: merc.lon + cellWidthInDegrees,
          west: merc.lon
        },
        zIndex: 1
      })
      this.cellRectangles[`${x},${y}`].setMap(this.map)
      // console.log(`${x},${y}`)
      // cell.setMap(this.map)
      // }
    },
    unloadCellGrid() {
      Object.entries(this.cellRectangles).forEach(([key]) => {
        this.cellRectangles[key].setMap(null)
      })
    },
    loadCellGrid() {
      Object.entries(this.cellRectangles).forEach(([key]) => {
        this.cellRectangles[key].setMap(this.map)
      })
    },

    // ANCHOR ⁡⁣⁣⁢𝗜𝗠𝗔𝗚𝗘 𝗠𝗘𝗧𝗛𝗢𝗗𝗦 --------------------------------------------------------------------⁡
    applyColorMapOverlay(image) {
      const imageBounds = {
        north: 90,
        south: -90,
        east: 180,
        west: -180
      }

      const historicalOverlay = new this.google.maps.GroundOverlay(
        image,
        imageBounds
      )
      historicalOverlay.setMap(this.map)
    },
    // eslint-disable-next-line max-statements
    createCachedImage() {
      const width = 841
      const height = 841
      // const buffer = new Uint8ClampedArray(width * height * 4) // have enough bytes

      // for (let y = 0 y < height y++) {
      // for (let x = 0 x < width x++) {
      // const pos = (y * width + x) * 4 // position in buffer based on x and y
      // this.cacheImgBuffer[pos] = this.hexToRgb(color).r // some R value [0, 255]
      // this.cacheImgBuffer[pos + 1] = this.hexToRgb(color).g // some G value
      // this.cacheImgBuffer[pos + 2] = this.hexToRgb(color).b // some B value
      // this.cacheImgBuffer[pos + 3] = 255 // set alpha channel
      // }
      // }

      // create off-screen canvas element
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = width
      canvas.height = height

      // create imageData object
      const idata = ctx.createImageData(width, height)

      // set our buffer as source
      idata.data.set(this.cacheImgBuffer)

      // update canvas with new data
      ctx.putImageData(idata, 0, 0)

      const dataUri = canvas.toDataURL() // produces a PNG file

      this.applyColorMapOverlay(dataUri)

      // return dataUri

      // const image = document.getElementById('imgm')
      // image.onload = imageLoaded // optional callback function
      // image.src = dataUri
    },
    createCachedPixel(x, y, color) {
      const width = 841
      // const height = 841
      // const buffer = new Uint8ClampedArray(width * height * 4) // have enough bytes

      // for (let y = 0 y < height y++) {
      // for (let x = 0 x < width x++) {
      const pos = (y * width + x) * 4 // position in buffer based on x and y
      this.cacheImgBuffer[pos] = this.hexToRgb(color).r // some R value [0, 255]
      this.cacheImgBuffer[pos + 1] = this.hexToRgb(color).g // some G value
      this.cacheImgBuffer[pos + 2] = this.hexToRgb(color).b // some B value
      this.cacheImgBuffer[pos + 3] = 255 // set alpha channel
    },

    // ANCHOR ⁡⁣⁣⁢𝗠𝗜𝗦𝗖 𝗠𝗘𝗧𝗛𝗢𝗗𝗦 --------------------------------------------------------------------⁡
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null
    },
    /** Set current real world GPS location to this.center*/
    geolocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userPositionLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        // this.center = this.userPositionLatLng

        const rad =
          this.meterScaleAtZoomLevel[this.map.getZoom()] /
          this.userPositionCircleSizeScale

        this.userPositionCircle = new this.google.maps.Circle({
          center: this.userPositionLatLng,
          radius: rad,
          strokeColor: '#000000',
          strokeOpacity: 0.3,
          strokeWeight: 2,
          fillColor: '#66CCFF',
          fillOpacity: 1
        })
        this.userPositionCircle.setOptions({ zIndex: 10 })
        this.userPositionCircle.setMap(this.map)
      })
    },
    /** Remove old userPositionCircle from the map and draw new one with radius
     * @param {number} radius number (or equation) for the circle radius
     */
    redrawUserPositionCircle(radius) {
      if (JSON.stringify(this.userPositionLatLng) !== '{}') {
        // if (this.userPositionCircle !== null) {
        //   this.userPositionCircle.setMap(null)
        // }
        // this.userPositionCircle = new this.google.maps.Circle({
        //   center: this.userPositionLatLng,
        //   radius,
        //   strokeColor: '#55AADD',
        //   strokeOpacity: 0.7,
        //   strokeWeight: 3,
        //   fillColor: '#66BBFF',
        //   fillOpacity: 0.7
        // })
        // this.userPositionCircle.setOptions({ zIndex: 10 })
        // this.userPositionCircle.setMap(this.map)
        this.userPositionCircle.set('radius', radius)
      }
    },
    /** Converts pixel x and y to { lat() lng() }
     * @param {number} x Mouse position
     * @param {number} y Mouse position
     * @returns {Object} Object containing lat() and lng()
     */
    mousePositionToLatLng(x, y) {
      // console.log('dog', x, y)
      if (this.map.getBounds()) {
        const currentBounds = this.map.getBounds()
        const topLeftLatLng = new this.google.maps.LatLng(
          currentBounds.getNorthEast().lat(),
          currentBounds.getSouthWest().lng()
        )
        const point = this.map.getProjection().fromLatLngToPoint(topLeftLatLng)
        // eslint-disable-next-line no-bitwise
        point.x += x / (1 << this.map.getZoom())
        // eslint-disable-next-line no-bitwise
        point.y += y / (1 << this.map.getZoom())

        return this.map.getProjection().fromPointToLatLng(point)
      }
      return null
    },
    /** Called on map bounds change
     * Set all bounds - cell, percent, geo, and world [with this.mercCoords()]
     */
    setAllBounds() {
      // Set world coordinate bounds into this.bounds
      this.mercCoords()

      this.cellBounds.ne.x = this.findSqIDByWorldCoords(this.bounds.ne.x)
      this.cellBounds.ne.y = this.findSqIDByWorldCoords(this.bounds.ne.y)
      this.cellBounds.sw.x = this.findSqIDByWorldCoords(this.bounds.sw.x)
      this.cellBounds.sw.y = this.findSqIDByWorldCoords(this.bounds.sw.y)

      this.percentBounds.ne.x =
        this.cellBounds.ne.x / Math.pow(29, this.currentScale + 1)
      this.percentBounds.ne.y =
        this.cellBounds.ne.y / Math.pow(29, this.currentScale + 1)
      this.percentBounds.sw.x =
        this.cellBounds.sw.x / Math.pow(29, this.currentScale + 1)
      this.percentBounds.sw.y =
        this.cellBounds.sw.y / Math.pow(29, this.currentScale + 1)

      this.geoBounds.ne = this.map.getBounds().getNorthEast()
      this.geoBounds.sw = this.map.getBounds().getSouthWest()
    },
    /** Returns users grid scale value as [0,1,2,3]
     * @returns {number} returns 0,1,2,3
     */
    breakLayer() {
      if (this.map.getZoom() < 6) {
        return 0
      } else if (this.map.getZoom() < 12) {
        return 1
      } else if (this.map.getZoom() < 18) {
        return 2
      }
      return 3
    },
    findSqIDByWorldCoordsRezOf2(wCoords) {
      return Math.floor(wCoords / this.scale[1])
    },
    findSqIDByWorldCoords(wCoords) {
      wCoords = parseFloat(wCoords)
      if (wCoords < 0) {
        wCoords += 840
      }
      return Math.floor(wCoords / this.scale[this.currentScale])
    },
    slowZoom(levels) {
      if (levels > 0) {
        // console.log(this.zoom)
        console.log(`levels: ${levels}`)
        this.map.setZoom(this.map.getZoom() + 1)
        // this.zoomIn()
        setTimeout(() => {
          this.slowZoom((levels -= 1))
        }, 750)
      } else if (levels < 0) {
        this.map.setZoom(this.map.getZoom() - 1)
        // console.log(this.zoom)
        console.log(`levels: ${levels}`)
        // this.zoomOut()
        setTimeout(() => {
          this.slowZoom((levels += 1))
        }, 750)
      } else {
        // this.zoom = this.map.getZoom()
        this.disableZoom = false
        console.log(`disable zoom: ${this.disableZoom}`)
      }
    },
    setZoomByEmojiLength(len) {
      this.currentScale = len - 1
      console.log(`length: ${this.currentScale}`)
      if (this.currentScale === 0) {
        this.slowZoom(3 - this.map.getZoom())
      } else if (this.currentScale === 1) {
        this.slowZoom(7 - this.map.getZoom())
      } else if (this.currentScale === 2) {
        this.slowZoom(12 - this.map.getZoom())
      } else if (this.currentScale === 3) {
        this.slowZoom(18 - this.map.getZoom())
      }
    },
    /** Use an Emoji String to return a valid "World Coordinate" location
     *  @param {string} emojiLoc
     *  @return {LatLng} return latLng object of position at emojiLoc
     */
    convertEmojiInput(emojiInput) {
      let one
      let two
      const reqLocation = {
        lat: 0,
        lng: 0
      }

      // console.log('DOGE!: ' + [...emojiInput].length)
      // Find [0-z][0-z] keys for matching emoji in the this.emojiIndexReference
      for (let i = 0; i < [...emojiInput].length; i++) {
        for (const key in this.emojiIndexReference) {
          for (const secondKey in this.emojiIndexReference[key]) {
            if (
              this.emojiIndexReference[key][secondKey].match([...emojiInput][i])
            ) {
              one = key
              two = secondKey
            }
          }
        }
        // Use associated emoji x/y keys with a ~Mercator Projection based equation~
        // to find each emojis' associated square location and increase desired values by each
        // approx
        reqLocation.lng +=
          this.scale[i] * (360 / 256) * parseInt(one, this.numberOfEmojis)
        reqLocation.lat += this.scale[i] * parseInt(two, this.numberOfEmojis)
      }

      return reqLocation

      // return reqLocation
    },
    /** Set this.map's zoom and this.currentScale using length of emoji input
     * Convert loc argument from lat/lng to "World Coordinates"
     * Set this.center to loc AND this.map.setCenter to this.center
     *  @param {object} latLng
     */
    emojiInputZoomCenter(loc) {
      loc.lng -= 180
      loc.lat = this.map
        .getProjection()
        .fromPointToLatLng(new this.google.maps.Point(loc.lng, loc.lat))
        .lat()
      // const bounds = new this.google.maps.LatLngBounds()
      // bounds.extend(this.center)
      this.center = loc
      // bounds.extend(loc)
      // this.map.fitBounds(bounds)
      // this.zoom = 1
      this.map.panTo(this.center)
      setTimeout(() => {
        console.log('World!')
        this.setZoomByEmojiLength([...this.$route.params.emojiCode].length)
      }, 1000)
    },
    /** The mapping from lat, lng to googles "World Coordinates" system
     * is defined by a mercator projection. This method converts them.
     * @param {object} latLng lat() lng() object to convert
     * @returns {Point} googles "World Coordinates" as x, y
     */
    mercatorProject(latLng) {
      let siny = Math.sin((latLng.lat() * Math.PI) / 180)
      // Truncating to 0.9999 effectively limits latitude to 89.189. This is
      // about a third of a tile past the edge of the world tile.
      siny = Math.min(Math.max(siny, -0.9999), 0.9999)
      return new this.google.maps.Point(
        this.tileSize * (0.5 + latLng.lng() / 360),
        this.tileSize *
          (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
      )
    },
    /** Set this.bounds corner coords to equivalent "World Coordinate" values
     * by translating their original (lat, lng) coordinates using a Mercator Projection */
    mercCoords() {
      this.bounds.ne = this.mercatorProject(this.map.getBounds().getNorthEast())
      this.bounds.sw = this.mercatorProject(this.map.getBounds().getSouthWest())
      // console.log('boundo!: ', this.bounds.ne)
    },
    addMarker() {
      if (this.currentPlace) {
        let marker
        try {
          marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          }
        } catch (e) {
          console.log(e)
          marker = this.currentPlace
        }
        this.markers.push({ position: marker })
        this.places.push(this.currentPlace)
        console.log(`NEW "place" added for: ${this.currentPlace}`)
        console.log(
          `NEW "marker" added @: ${this.markers[this.markers.length - 1]}`
        )
        this.center = marker
        this.currentPlace = null
      }
    },
    /** Add any needed remote libraries using js in place of hardcoded html */
    addRemoteLibraries() {
      const plugin = document.createElement('script')
      plugin.setAttribute(
        'src',
        `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GMAPS_API_KEY}&libraries=drawing&callback=init&v=weekly`
      )
      plugin.async = true
      document.head.appendChild(plugin)
    }
  },
  watch: {
    // Logic to tie google maps' zoom to this.zoom and correct
    // against any desired zoom level restrictions
    // zoom(val) {
    // if (val < this.minZoomLevel) {
    //   this.map.setZoom(this.minZoomLevel)
    //   console.log('zooombini: ' + this.zoom)
    //   this.zoom = this.minZoomLevel
    // } else {
    // this.fixedZooms(val)
    // console.log(`Zoom @: ${this.zoom}`)
    // }
    // }
  },
  computed: {
    google: gmapApi
  }
}
</script>

<style>
html {
  scrollbar-width: none; /* Firefox */
}

html::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari and Opera */
}

#care {
  /* height: 100%; */
  position: relative;
  overflow: hidden;
  /* height: -webkit-fill-available; */
}

.zindex11 {
  /* position: absolute; */
  margin: auto;
  background-color: black;
  height: 100vh;
  width: 100vw;
  z-index: 111;
  /* pointer-events: none; */
}

#zindex1 {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.map {
  position: relative;
  top: 0px;
  left: 0px;
  height: calc(100vh + 24px);
  width: 100vw;
}

#emoji-map {
  border-top: 4px groove #272727;
  border-bottom: 4px groove #272727;
  color: white;
  pointer-events: none;
}

#vert {
  display: flex;
  position: relative;
  left: 0px;
  margin: 10px;
  flex-direction: column;
}

.ui-component {
  text-shadow: 2px 2px #121212;
  position: relative;
  min-width: 36px !important;
  padding: 0px !important;
  position: relative;
  background: rgba(180, 180, 180, 0.5);
  border: 2px inset rgba(202, 202, 200, 0.5);
  /* border-radius: 250px; */
}

.zoom {
  height: 18px !important;
}

#emoji-button {
  height: 36px;
}

.v-navigation-drawer--absolute {
  z-index: 10 !important;
}

.container {
  padding: 0 !important;
}

.row {
  flex-direction: row;
}

.flex-center {
  justify-content: center;
}

.flex-end {
  justify-content: flex-end;
}

.flex-fill {
  flex-basis: 100%;
}

.bottom {
  position: absolute;
  bottom: 0px;
}

.clickable {
  pointer-events: initial;
}

.paddingleft90 {
  padding-left: 90px;
}
</style>
