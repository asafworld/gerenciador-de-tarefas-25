import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/inertia-vue3';
import { InertiaProgress } from '@inertiajs/progress';
import { createPinia } from 'pinia';

InertiaProgress.init({ showSpinner: true });

createInertiaApp({
    resolve: name => import(`./pages/${name}.vue`),
    setup({ el, App, props, plugin }) {
        const vueApp = createApp({ render: () => h(App, props) });
        vueApp.use(plugin).use(createPinia()).mount(el);
    },
});
