import Vue from 'vue'
import {toast} from "bulma-toast";


Vue.mixin({
    methods: {
        displayToast: function (text, type="is-success", duration=3000, dismissible=true) {
            toast({ message: `<p class = "has-text-weight-bold">${text}</p>`,
                type: type,
                dismissible: dismissible, position: "bottom-center",
                duration: duration, animate: { in: 'fadeIn', out: 'fadeOut' }})
        },
    } 
})


