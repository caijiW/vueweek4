import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js';

import pagination from './pagination.js';
import productsModal from './productModal.js';
import delproductModal from './delProductModal.js';

let productModal = '';
let delProductModal = '';
const app = createApp( {
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/v2/',
            path: 'caiji_hexschool',
            products: [],
            tempProduct: {
                category: '',
                imagesUrl: []
            },
            isNew: true,
            pages:{},
            setcategory:true,
            allProducts:[]
        }
    },
    methods: {
        checkLogin() {
             //取出cookie
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)caijiToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        //放入axios headers裡 每次發請求都夾帶cookie一起送出
        axios.defaults.headers.common['Authorization'] = token;

            axios.post(`${this.url}api/user/check`)
                .then((res) => {
                    console.log(res);
                    this.getProductsList();
                })
                .catch((err) => {
                    console.log(err);
                    alert('驗證發生錯誤，請重新登入')
                    window.location = './login.html';
                })
        },
        getProductsList(page=1) {
            axios.get(`${this.url}api/${this.path}/admin/products?page=${page}`)
                .then((res) => {
                    console.log(res);   
                    this.pages = res.data.pagination;
                    console.log(this.pages);
                    this.products = res.data.products;
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        getAllProducts(){
            axios.get(`${this.url}api/${this.path}/admin/products/all`)
            .then((res) => {
                console.log(res); 
                this.allProducts = res.data.products;
            })
            .catch((err) => {
                console.log(err);
            })
        },
        closeModal() {
            productModal.hide(); 
        },
        closeProductModal(){
            delProductModal.hide();   
        },
        addTempProduct(status, product) {
            if (status === 'create') {
                this.isNew = true;
                this.tempProduct = {
                    category: '',
                    imagesUrl: []
                }
                document.querySelector('#inputFile').value=''; 
                this.setcategory=!this.setcategory;
                this.getAllProducts();
                productModal.show();
            } else if (status === 'edit') {
                this.isNew = false;
                //深層拷貝
                this.tempProduct = JSON.parse(JSON.stringify(product));
                this.getAllProducts();
                this.setcategory=!this.setcategory;
                if (!this.tempProduct.imagesUrl) {
                    this.tempProduct.imagesUrl = [];
                }
                productModal.show();
            }else{
                this.tempProduct = JSON.parse(JSON.stringify(product));
                delProductModal.show();
            }
        } 
    },
    mounted() {
        this.checkLogin();
        const modal = document.querySelector('#productModal');
         productModal = new bootstrap.Modal(modal);
        const delModal = document.querySelector('#delProductModal');
        delProductModal = new bootstrap.Modal(delModal);
    }
})

app.component('pagination',pagination);
app.component('productModal',productsModal);
app.component('delproductModal',delproductModal);

app.mount('#app');