import { App } from 'vue';
import LuckySheet from './LuckySheet/index.vue';

export default {
  install(app: App) {
    app.component('LuckySheet', LuckySheet);
  }
};
