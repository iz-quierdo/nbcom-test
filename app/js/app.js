import Vue from 'vue/dist/vue.min';
import axios from 'axios/dist/axios.min';

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

Vue.component('option-block', {
  props: ['title', 'code', 'config'],
  template: `
	<div>
		<h3>{{ title }}</h3>
		<fieldset :id="code">
			<config-block
				v-for="configItem in config"
				v-bind:code="code"
				v-bind:id="configItem.id"
				v-bind:text="configItem.text"
				v-bind:extend="configItem.extend"
				v-bind:bundle="configItem.bundle"
				v-bind:add="configItem.add"
			></config-block>
		</fieldset>
	</div>
	`,
});

new Vue({
  el: '#app',
  data: {
    options: [],
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
  },
});
