import productModal from './productModal.js';

VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const baseUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'wrightyu';

const app = Vue.createApp({
  data() {
    return {
      products: [],
      pointedProductId: '',
      cart: {},
      loadingItemId:'',
      productLoadingClassObject: {
        fas : true, 
        'fa-spinner' : true,
        'fa-pulse' : true,
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      }
    };
  }, 
  methods: {
    getProducts() {
      axios.get(`${baseUrl}/v2/api/${apiPath}/products/all`)
      .then(res => {
        console.log('產品列表' ,res.data.products);
        this.products = res.data.products;
      })
      .catch(err => {
        console.log(err.data.message);
      });
    },
    showModal(id) {
      this.pointedProductId = id;
      console.log('外層帶入pointedProductId', id);
    },
    addToCart(product_id, qty = 1) {
      const data = {
        product_id,
        qty,
      };
      this.loadingItemId = product_id;
      axios.post(`${baseUrl}/v2/api/${apiPath}/cart`, {data})
      .then(res =>{
        console.log('加入購物車', res.data);
        this.$refs.productModal.hide();
        this.getCarts();
        this.loadingItemId = '';
      })
      .catch(err => {
        console.log(err.data.message);
      })
    },
    getCarts() {
      axios.get(`${baseUrl}/v2/api/${apiPath}/cart`)
      .then(res => {
        console.log('購物車', res.data.data);
        this.cart = res.data.data;
      })
      .catch(err => {
        console.log(err.data.message);

      });
    },
    updateCartItem(item) {
      const data = {
        product_id: item.product.id,
        qty: item.qty,
      };
      this.loadingItemId = item.id;
      axios.put(`${baseUrl}/v2/api/${apiPath}/cart/${item.id}`, {data})
      .then(res => {
        console.log('更新購物車', res.data);
        this.getCarts();
        this.loadingItemId = '';
      })
      .catch(err => {
        console.log(err);
      });
    },
    deleteItem(item) {
      this.loadingItemId = item.id;
      axios.delete(`${baseUrl}/v2/api/${apiPath}/cart/${item.id}`)
      .then(res => {
        console.log('刪除購物車', res.data);
        this.getCarts();
        this.loadingItemId = '';
      })
      .catch(err => {
        console.log(err.data.message);
      });
    },
    deleteAll() {
      axios.delete(`${baseUrl}/v2/api/${apiPath}/carts`)
      .then(res => {
        alert('成功清空購物車');
      })
      .catch(err => {
        console.log(err.data.message);
      });
    },
    createOrder() {
      axios.post(`${baseUrl}/v2/api/${apiPath}/order`, {data: this.form})
      .then(res => {
        alert(res.data.message);
        this.$refs.form.resetForm();
        this.getCarts();
      })
      .catch(err => {
        console.log(err);
      });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    },
  },
  components: {
    productModal,
  },
  mounted() {
    this.getProducts();
    this.getCarts();
  }
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');