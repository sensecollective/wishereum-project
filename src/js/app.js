

//app.js
import VueMaterial from 'vue-material';
import router from './router';
import Theme from './theme';

import utils from './web3-utils';

import wishJSON from '../../build/contracts/Wish.json';
//import deployer from './tests/deploy-wish';

const network = {
  4: '0x6fD022CfF6d7512B6E662014662DCd467BBA9BcA'
};

Vue.use(VueRouter);
Vue.use(VueMaterial);
Theme.init();

const APP = window.APP = {};

const VueApp = new Vue({
  el: '#app',
  router,
  data: {
    menu: []
  },
  created() {
    setTimeout(() => this.init(), 250);
  },
  mounted() {
    this.$refs.loader.classList.add('hidden');
    this.$refs.content.classList.remove('hidden');
  },
  methods: {
    //jshint ignore:start
    async init() {
      console.log('init');
      
      const ethInfo = fetch('https://coinmarketcap-nexuist.rhcloud.com/api/eth').then((res) => res.json());
      
      utils.getWeb3('https://rinkeby.infura.io/');
      //get network
      APP.network = await utils.getNetwork();
      if (APP.network.id !== 4) utils.setWeb3('https://rinkeby.infura.io/');
      try {
        APP.accounts = await utils.getAccounts();
      } catch(e) {
        APP.accounts = ['0x'];
      }
      //check user
      let user = APP.user = await localforage.getItem('wishereum-user');
      if (user !== APP.accounts[0]) {
        console.log('user changed');
        user = APP.user = APP.accounts[0];
        await localforage.setItem('wishereum-user', user);
        await localforage.setItem('wishereum-userwishes', {});
      }
      
      try {
        APP.contract = await utils.getContract(wishJSON, network[APP.network.id]);
      } catch(e) {
        console.log('wrong network');
      }
      //window.deployWish = () => deployer.deploy(wishJSON, APP.accounts[0], 4000000);
      
      this.$emit('update');
      APP.ethusd = (await ethInfo).price.usd;
      this.$emit('updateCost');
    },
    //jshint ignore:end
    update() {
      this.$emit('update');
      this.$emit('updateCost');
    },
    updateRoute() {
      this.update();
      setTimeout(() => this.$refs.leftSidenav.close(), 150);
    },
    toggleLeftSidenav() {
      this.$refs.leftSidenav.toggle();
    },
  }
});