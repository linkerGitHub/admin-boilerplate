<template>
  <div>
    <editor
      v-model="fullText"
      :init="editorInit"
    />
  </div>
</template>

<script>

import Editor from '@tinymce/tinymce-vue'


export default {
  name: 'TinyMce',
  components: {
    editor: Editor
  },
  model: {
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      editorInit: {
        height: 500,
        menubar: true, // 上方menu菜单
        // toolbar: true, // false禁用工具栏（隐藏工具栏）
        browser_spellcheck: true, // 拼写检查
        branding: false, // 去水印
        statusbar: false, // 隐藏编辑器底部的状态栏
        elementpath: false, // 禁用下角的当前标签路径
        paste_data_images: false, // 允许粘贴图像
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif',
        plugins: 'lists image media table wordcount fullscreen help autosave nonbreaking ' +
          'insertdatetime visualchars visualblocks searchreplace pagebreak link charmap paste print ' +
          'preview hr anchor',
        toolbar: [
          'newdocument undo redo | formatselect fontselect fontsizeselect|cut copy paste selectall| bold italic underline' +
            ' strikethrough |codeformat blockformats| superscript subscript  | forecolor backcolor | alignleft' +
            ' aligncenter alignright alignjustify | outdent indent |  removeformat ',
          ' bullist numlist | lists image media table link |fullscreen help restoredraft ' +
            'nonbreaking insertdatetime visualchars visualblocks searchreplace pagebreak anchor ' +
            'charmap  pastetext print preview hr'
        ]
      },
      fullText: this.value
    }
  },
  watch: {
    value: function (val) {
      this.fullText = val
    },
    fullText: function (val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style scoped>

</style>
