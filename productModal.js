//let productModal = '';

export default {
  props: ['tempProduct', 'products','isNew','allProducts','setcategory'],
  emits:['updateItem','closeModal'],
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2/',
      path: 'caiji_hexschool',
     categoryType: 'categoryOld', 
      file: null,
    }
  },
  template: ` <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span>{{isNew?'新增':'編輯'}}產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-2">
              <div class="mb-3">
                <h3>主圖</h3>
                <input type="file" class="file mb-3 form-control" id="inputFile" @change="uploadImage">
                
                <label for="imageUrl" class="form-label">輸入圖片網址</label>
                <input type="text" class="form-control" placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
              </div>
              <img class="img-fluid" :src="tempProduct.imageUrl" :alt="tempProduct.title">
            </div>
            <div v-if="tempProduct.imageUrl">
              <!-- 有主圖才出現 -->  
              <div v-if="Array.isArray(tempProduct.imagesUrl)">
                <h3>多圖新增</h3>
                <template v-for="(img,key) in tempProduct.imagesUrl">
                  <input type="text" class="form-control" placeholder="請輸入圖片連結" v-model="tempProduct.imagesUrl[key]">
                  <img :src="tempProduct.imagesUrl[key]" alt="" class="img-fluid mb-2">
                </template>
                <button v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length-1]"
                  class="btn btn-outline-primary btn-sm d-block w-100" @click="tempProduct.imagesUrl.push('')">
                  新增圖片
                </button>
                <button class="btn btn-outline-danger btn-sm d-block w-100"
                  v-if="tempProduct.imagesUrl[tempProduct.imagesUrl.length-1]" @click="tempProduct.imagesUrl.pop()">
                  刪除圖片
                </button>
              </div>
            </div>

          </div>
          <div class="col-sm-8">
            <div class="mb-3">
              <label for="title" class="form-label">標題</label>
              <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="tempProduct.title">
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="category" class="form-label me-4">分類</label>
                
                  <input type="radio" id="categoryOld" v-model="categoryType" value="categoryOld">
                  <label for="categoryOld" class="me-4">原有分類</label>
                  <input type="radio" id="categoryNew" v-model="categoryType" value="categoryNew">
                  <label for="categoryNew">新增分類</label>
                
                <select v-if="categoryType==='categoryOld'" id="oldCategory" class="form-control" v-model="tempProduct.category">
                  <option value="">請選擇</option>
                  <option v-for="category in sortOldCategory" :value="category">{{category}}</option>
                </select>
                <input v-else id="newCategory" type="text" class="form-control" placeholder="請輸入分類"
                  v-model="tempProduct.category">
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">單位</label>
                <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="tempProduct.unit">
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="origin_price" class="form-label">原價</label>
                <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價"
                  v-model="tempProduct.origin_price">
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">售價</label>
                <input id="price" type="number" min="0" class="form-control" placeholder="請輸入售價"
                  v-model="tempProduct.price">
              </div>
            </div>
            <hr>

            <div class="mb-3">
              <label for="description" class="form-label">產品描述</label>
              <textarea id="description" type="text" class="form-control" placeholder="請輸入產品描述"
                v-model="tempProduct.description">
                  </textarea>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">說明內容</label>
              <textarea id="description" type="text" class="form-control" placeholder="請輸入說明內容"
                v-model="tempProduct.content">
                  </textarea>
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input id="is_enabled" class="form-check-input" type="checkbox" :true-value="1" :false-value="0"
                  v-model="tempProduct.is_enabled">
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click="updateItem">
          確認
        </button>
      </div>
    </div>
  </div>`,
  methods: {
    closeModal(){
      this.$emit('closeModal')
    },
    updateItem() {
      let method = 'post';
      let site = `${this.url}api/${this.path}/admin/product`;
      if (!this.isNew) {
        method = 'put';
        site = `${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`;
      }
      axios[method](site, { data: this.tempProduct })
        .then((res) => {
          console.log(res);
          this.closeModal();
          this.file = null;
          // ↓用外部方法：this.getProductsList();
          this.$emit('updateItem');
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    uploadImage(e) {
      // const file = fileBtn.files[0];
      console.dir(e.target.files[0]);
      this.file = e.target.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', this.file);
      axios.post(`${this.url}api/${this.path}/admin/upload`, formData)
        .then((res) => {
          console.log(res);
          this.tempProduct.imageUrl = res.data.imageUrl; 
         
        })
        .catch((err) => {
          console.dir(err.response);
        })
    }
  },
  watch: {
    categoryType() {
      this.tempProduct.category = '';
    },
    setcategory(){
      this.categoryType='categoryOld';
    }
  },
  computed: {
    sortOldCategory() {
      const categoryArr = Object.values(this.allProducts);
      let newCategoryArr = {};
      newCategoryArr = new Set(categoryArr.map(item => item.category));
      return newCategoryArr;
    }
  },
 mounted() {
  //this.categoryType= 'categoryOld';
  // const modal = document.querySelector('#productModal');
  //  productModal = new bootstrap.Modal(modal);
   
 }
}