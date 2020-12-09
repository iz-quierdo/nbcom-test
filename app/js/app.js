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
    <h3 @click="toggleMe"><span>{{ title }}</span></h3>
      <config-block
        v-for="configItem in config"
        v-bind:code="code"
        v-bind:id="configItem.id"
        v-bind:text="configItem.text"
        v-bind:extend="configItem.extend"
        v-bind:bundle="configItem.bundle"
        v-bind:add="configItem.add"
      ></config-block>
  </div>
  `,

  data() {
    return {
      isActive: false,
    };
  },

  methods: {
    toggleMe() {
      this.isActive = !this.isActive;
    },
  },
});

Vue.component('config-block', {
  props: ['code', 'id', 'text', 'extend', 'bundle', 'add'],
  template: `
  <div class="config-block">
    <input class="config-block__input" :disabled="isDisabled" type="radio" :name="code" :id="code + id">
    <label class="config-block__label" :disabled="isDisabled" :for="code + id">{{ text }}</label>
    <p class="config-block__extend" v-if="extend">{{ extend }}</p>
  </div>
  `,
  computed: {
    isDisabled() {
      if (this.add === undefined) {
        return false;
      } else {
        return !this.add;
      }
    },
  },
});

Vue.component('option-result', {
  props: ['title'],
  template: `
  <div class="option-result">
    <h3>Выбранный тип устройства</h3>
    {{ getTitle }}
  </div>
  `,
  computed: {
    getTitle() {
      return this.title;
    },
  },
});

new Vue({
  el: '#app',
  data() {
    return {
      options: [],
    };
  },
  mounted() {
    axios.get('http://localhost:3000/data.json').then((response) => {
      this.options = response.data;
    });
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
    typeOptionsTitle() {
      return 'test';
    },
  },
});
