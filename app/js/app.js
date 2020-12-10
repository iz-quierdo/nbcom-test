import Vue from 'vue/dist/vue.min';
import axios from 'axios/dist/axios.min';

Vue.component('tabs', {
  template: `
      <div>
          <div class="tabs">
            <ul>
              <li v-for="tab in tabs" :class="{ 'is-active': tab.isActive }">
                  <a :href="tab.href" @click="selectTab(tab)">{{ tab.name }}</a>
              </li>
            </ul>
          </div>

          <div class="tabs-details">
              <slot></slot>
          </div>
      </div>
  `,

  data() {
    return { tabs: [] };
  },

  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach((tab) => {
        tab.isActive = tab.name == selectedTab.name;
      });
    },
  },
});

Vue.component('tab', {
  template: `
      <div v-show="isActive"><slot></slot></div>
  `,

  props: {
    name: { required: true },
    selected: { default: false },
  },

  data() {
    return {
      isActive: false,
    };
  },

  computed: {
    href() {
      return '#' + this.name.toLowerCase().replace(/ /g, '-');
    },
  },

  mounted() {
    this.isActive = this.selected;
  },
});

Vue.component('option-block', {
  props: ['title', 'code', 'config'],
  template: `
  <div class="option-block" :class="{ active: isActive }">
    <h3 @click="toggle"><span>{{ title }}</span></h3>
      <div class="config-block" v-for="configItem in config">
        <input v-on:change="emitSelectEvent" class="config-block__input" :disabled="configItem.add === false" :value="configItem.text" type="radio" :name="code" :id="code + configItem.id">
        <label class="config-block__label" :disabled="configItem.add === false" :for="code + configItem.id">{{ configItem.text }}</label>
        <p class="config-block__extend" v-if="configItem.extend">{{ configItem.extend }}</p>
      </div>
  </div>
  `,

  data() {
    return {
      isActive: false,
    };
  },

  methods: {
    toggle() {
      this.isActive = !this.isActive;
    },
    emitSelectEvent() {
      this.$emit('selected');
    },
  },
});

Vue.component('option-result', {
  props: ['text'],
  template: `
  <div class="option-result">
    {{ getText }}
  </div>
  `,

  computed: {
    getText() {
      return this.text;
    },
  },
});

new Vue({
  el: '#app',
  data() {
    return {
      options: [],
      resultBlock: '',
    };
  },
  mounted() {
    axios.get('http://localhost:3000/data.json').then((response) => {
      this.options = response.data;
    });
  },
  methods: {
    onSelect() {
      const typeHeader = document.querySelector('#type-block h3').textContent;

      const typeRadiosEl = document.querySelector(
        '#type-block input[type=radio]:checked'
      );

      let typeRadios = 'Не выбрана';

      if (typeRadiosEl !== null) {
        typeRadios = typeRadiosEl.value;
      }

      const featureResultBlock = [];
      const featureBlock = document.querySelectorAll(
        '#feature-block .option-block input[type=radio]:checked'
      );

      if (featureBlock !== null) {
        featureBlock.forEach((block) => {
          featureResultBlock.push(block.value);
        });
      }
      const featureResultBlockText = featureResultBlock.join(', ');

      const bundleResultBlock = [];
      const bundleBlock = document.querySelectorAll(
        '#bundle-block .option-block input[type=radio]:checked'
      );

      let bundleResultBlockText = '';

      if (bundleBlock.length > 0) {
        bundleBlock.forEach((block) => {
          bundleResultBlock.push(block.value);
        });
        bundleResultBlockText = bundleResultBlock.join(', ');
        bundleResultBlockText = 'В комплекте: ' + bundleResultBlockText;
      }

      this.resultBlock = `
        <h2>${typeHeader}: ${typeRadios}</h2>
        <p class="small">${featureResultBlockText}</p>
        <p class="small">${bundleResultBlockText}</p>
      `;
    },
  },
  computed: {
    typeOptions() {
      return this.options.slice(0, 1);
    },
    featureOptions() {
      return this.options
        .filter((option) => option.config[0].bundle === undefined)
        .slice(1);
    },
    bundleOptions() {
      return this.options.filter(
        (option) => option.config[0].bundle !== undefined
      );
    },
  },
});
