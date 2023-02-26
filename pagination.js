export default {
    props:['pages','getProductsList'],
    emits:['getProductsList'],
    template:`<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{disabled:!pages.has_pre}">
        <a class="page-link"  @click="$emit('getProductsList',pages.current_page-1)"  href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>  
        </a>
      </li>
      <li v-for="page in pages.total_pages" :key="page+1"
      :class="{active:page===pages.current_page}" class="page-item ">
        <a class="page-link" href="#" @click="$emit('getProductsList',page)">{{page}}</a>
      </li>
      <li class="page-item" :class="{disabled:!pages.has_next}">
        <a class="page-link" href="#" aria-label="Next" @click="$emit('getProductsList',pages.current_page+1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`
}