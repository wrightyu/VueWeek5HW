const baseUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'wrightyu';
export default {
  props: ['id', 'addToCart', 'showModal'],
  data() {
    return {
      tempProduct: {},
      modal:{},
      qty: 1,
    }
  },
  template: '#userProductModal',
  methods: {
    hide() {
      this.modal.hide();
    },
  },
  watch: {
    id() {
      console.log('productModal', this.id);
      if(this.id !== '') {

        axios.get(`${baseUrl}/v2/api/${apiPath}/product/${this.id}`)
        .then(res => {
          console.log('單一產品：',res.data.product);
          this.tempProduct = res.data.product;
          this.modal.show();
        })
        .catch(err => {
          console.log(err.data.message);
        });
      }
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    this.$refs.modal.addEventListener('hidden.bs.modal', e => {
      this.showModal('');
    });
  },
};