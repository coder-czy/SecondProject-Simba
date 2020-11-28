import {
    Button,
    Popup,
    Field,
    Form,
    Toast,
    NavBar,
    Tabbar,
    TabbarItem,
    Search,
    Swipe,
    SwipeItem,
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton,
    Stepper,
    Empty,
    Checkbox,
    SubmitBar,
    SwipeCell,
    List,
    AddressEdit,
    AddressList,
    Uploader,
    Tabs,
    Tab,
    Cell,
    Icon
} from 'vant'

let vants = [Button, Popup, Field, Form, Toast, NavBar, Tabbar, TabbarItem, Search, Swipe, SwipeItem, GoodsAction, GoodsActionIcon, GoodsActionButton, Stepper, Empty, Checkbox,
    SubmitBar,
    SwipeCell,
    List,
    AddressEdit,
    AddressList,
    Uploader,
    Tabs,
    Tab,
    Cell,
    Icon
]

export default {
    install(Vue) {
        vants.forEach(v => {
            Vue.use(v)
        })
    }

}