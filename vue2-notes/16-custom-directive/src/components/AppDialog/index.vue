<template>
  <div class="modal fade in" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document" style="margin-top: 200px;">
      <div class="modal-content" >
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel">{{data.title || '请确认'}}</h4>
        </div>
        <div class="modal-body">
          <!-- 多行文字需要 -->
            <p v-for="content in data.contents" :key="content">{{content}}</p>
        </div>
        <div class="modal-footer" v-if="data.buttons && data.buttons.length">
            <!-- 多个按钮需要 -->
            <button v-for="(btn, index) in data.buttons" :key="index" type="button" class="btn" :class="btn.class" @click="clickButton(index)">{{btn.text}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dialogStore from "./dialogStore";
export default {
  name: "app-dialog",
  computed: {
    data() {
      return dialogStore.state.data;
    }
  },
  methods: {
    clickButton(index) {
      dialogStore.commit("click", index);
    },
    close() {
      dialogStore.commit("close");
    }
  }
};
</script>

