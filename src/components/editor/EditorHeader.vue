<template>
  <div class='editor-header'>
    <el-menu mode='horizontal'>
      <el-submenu index='1' popper-class='logo-submenu'>
        <template slot='title'>
          <img class='kp-logo' src='@/assets/img/logo.svg' alt='Menu'>
        </template>
        <el-submenu index='1-1'>
          <template slot='title'>{{$t('editor.system')}}</template>
          <el-menu-item index='1-1-1' @click="openNewWebsiteDialog">{{$t('editor.newWebsite')}}</el-menu-item>
          <el-menu-item index='1-1-2' :disabled='isActivePageSaved' @click='save'>{{$t('editor.save')}}</el-menu-item>
          <el-menu-item index='1-1-3'>
            <a href="/wiki/user_center?userCenterContentType=websiteManager" target="_blank">{{$t('editor.siteSettings')}}</a>
          </el-menu-item>
          <!-- <el-menu-item index='1-1-4'>网站备份</el-menu-item>
          <el-menu-item index='1-1-5'>版本管理</el-menu-item> -->
        </el-submenu>
        <el-submenu index='1-2'>
          <template slot='title'>{{$t('editor.page')}}</template>
          <el-menu-item index='1-2-1'>
            <a href="/wiki/user_center?userCenterContentType=userProfile&userCenterSubContentType=dataSource" target="_blank">{{$t('editor.dataSource')}}</a>
          </el-menu-item>
        </el-submenu>
        <el-submenu index='1-3'>
          <template slot='title'>{{$t('editor.edit')}}</template>
          <el-menu-item index='1-3-1' @click='undo' :disabled='!canUndo'>{{$t('editor.revoke')}}</el-menu-item>
          <el-menu-item index='1-3-2' @click='redo' :disabled='!canRedo'>{{$t('editor.redo')}}</el-menu-item>
          <!-- <el-menu-item index='1-3-3'>搜索</el-menu-item>
          <el-menu-item index='1-3-4'>替换</el-menu-item> -->
        </el-submenu>
        <el-submenu index='1-4'>
          <template slot='title'>{{$t('editor.insert')}}</template>
          <el-menu-item index='1-4-1' @click="changeView('ModsList')">{{$t('editor.module')}}</el-menu-item>
          <!-- <el-menu-item index='1-4-2'>网盘</el-menu-item> -->
        </el-submenu>
        <!-- <el-submenu index='1-5'>
          <template slot='title'>显示</template>
          <el-menu-item index='1-5-1'>预览</el-menu-item>
          <el-menu-item index='1-5-2'>代码</el-menu-item>
          <el-menu-item index='1-5-3'>分屏</el-menu-item>
          <el-menu-item index='1-5-4'>全屏</el-menu-item>
          <el-submenu index='1-5-5'>
            <template slot='title'>页面模式</template>
            <el-menu-item index='1-5-5-1'>电脑</el-menu-item>
            <el-menu-item index='1-5-5-2'>手机</el-menu-item>
          </el-submenu>
        </el-submenu> -->
        <el-menu-item index='1-6'>
          <a href="/official/help/index" target="_blank">{{$t('editor.help')}}</a>
        </el-menu-item>
        <el-menu-item index='1-7'>
          <a href='/'>{{$t('editor.backHomePage')}}</a>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index='3' class='li-btn' :disabled='isActivePageSaved'>
        <span v-loading='savePending' class='iconfont icon-baocun' :title='$t("editor.save")' @click='save'></span>
      </el-menu-item>
      <el-menu-item index='4' class='li-btn' @click='undo' :disabled='!canUndo'>
        <span class='iconfont icon-fanhui' :title='$t("editor.revoke")'></span>
      </el-menu-item>
      <el-menu-item index='5' class='li-btn' @click='redo' :disabled='!canRedo'>
        <span class='iconfont icon-chongzuo' :title='$t("editor.redo")'></span>
      </el-menu-item>
      <!-- <el-menu-item index=' 8 ' class='li-btn'>
        <el-dropdown @command='changeViewType '>
          <el-button class='dropdown-btn'>
            {{showingType}}
            <i class='el-icon-arrow-down el-icon--right dropdown-arrow'></i>
          </el-button>
          <el-dropdown-menu slot='dropdown'>
            <el-dropdown-item :command='{isCodeShow: false, isPreviewShow: true} '>{{ $t('editor.preview') }}</el-dropdown-item>
            <el-dropdown-item :command='{isCodeShow: true, isPreviewShow: false} '>{{ $t('editor.code') }}</el-dropdown-item>
            <el-dropdown-item :command='{isCodeShow: true, isPreviewShow: true} '>{{ $t('editor.splitScreen') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item> -->
      <el-menu-item index='2' class="link-box">
        <i class="iconfont icon-fuzhi1" @click='doCopyLink'></i>
        <a :href='activePageUrl' target='_blank'>{{nowOrigin + activePageUrl}}</a>
      </el-menu-item>
      <el-menu-item index='7 ' class='pull-right user-profile-box'>
        <img class='user-profile' :src='userProfile.portrait' alt=''>
      </el-menu-item>
    </el-menu>
    <NewWebsiteDialog :show='isNewWebsiteDialogShow' @close='closeNewWebsiteDialog' />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Mousetrap from 'mousetrap'
import NewWebsiteDialog from '@/components/common/NewWebsiteDialog'

export default {
  name: 'EditorHeader',
  data: function() {
    return {
      savePending: false,
      isNewWebsiteDialogShow: false,
      nowOrigin: document.location.origin
    }
  },
  mounted() {
    Mousetrap.unbind('mod+s')
    Mousetrap.bind('mod+s', () => {
      this.save()
      return false
    })
  },
  computed: {
    ...mapGetters({
      showingCol: 'showingCol',
      activePageUrl: 'activePageUrl',
      canUndo: 'canUndo',
      canRedo: 'canRedo',
      openedFiles: 'openedFiles',
      activePageInfo: 'activePageInfo',
      openedFiles: 'openedFiles',
      userProfile: 'user/profile'
    }),
    showingType() {
      if (
        this.showingCol.isCodeShow === false &&
        this.showingCol.isPreviewShow === true
      ) {
        return this.$t('editor.preview')
      }
      if (
        this.showingCol.isCodeShow === true &&
        this.showingCol.isPreviewShow === false
      ) {
        return this.$t('editor.code')
      }
      if (
        this.showingCol.isCodeShow === true &&
        this.showingCol.isPreviewShow === true
      ) {
        return this.$t('editor.splitScreen')
      }
    },
    isActivePageSaved() {
      let { saved } = this.activePageInfo
      return saved
    }
  },
  methods: {
    ...mapActions(['saveActivePage', 'undo', 'redo', 'setActiveWinType']),
    async save() {
      let self = this

      if (this.isActivePageSaved) {
        return
      }
      this.savePending = true
      await this.saveActivePage()
        .then(() => {
          this.$message({
            showClose: true,
            message: self.$t('editor.saveSuccess'),
            type: 'success'
          })
        })
        .catch(e => {
          console.log(e)
          this.$message({
            showClose: true,
            message: self.$t('editor.saveFail'),
            type: 'error'
          })
        })
      this.savePending = false
    },
    openNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = true
    },
    closeNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = false
    },
    doCopyLink() {
      let that = this
      let toCopyLink = this.nowOrigin + this.activePageUrl
      this.$copyText(toCopyLink).then(
        function(e) {
          that.$message({
            showClose: true,
            message: that.$t('editor.copySuccess'),
            type: 'success'
          })
        },
        function(e) {
          console.log(e)
          that.$message({
            showClose: true,
            message: that.$t('editor.copyFail'),
            type: 'error'
          })
        }
      )
    },
    changeView(type) {
      this.setActiveWinType(type)
    }
  },
  components: {
    NewWebsiteDialog
  }
}
</script>

<style scoped>
.el-menu-item.is-active {
  border-bottom: none;
}
.kp-logo {
  width: 127px;
}
.li-btn {
  padding: 0 8px;
}
.btn {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
}
.pull-right {
  float: right !important;
}
.user-profile-box {
  padding-right: 0;
}
.user-profile {
  width: 46px;
  height: 46px;
  border-radius: 50%;
}
.input-link-copy-box {
  display: inline-block;
  width: 367px;
  border: 1px solid #dcdfe6;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  padding: 0 16px;
}
.input-link-copy-box a {
  color: #288ce9;
  text-decoration: none;
}
.dropdown-btn {
  font-size: 16px;
  padding: 10px;
}
.dropdown-arrow {
  font-size: 12px;
  margin: 0 6px 0 10px;
  width: auto;
  margin-left: 0px;
}
.iconfont {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 21px;
  color: #666;
}
.link-box .iconfont {
  border: none;
}
.link-box a {
  text-decoration: none;
}
.link-box .iconfont:hover,
.link-box a:hover {
  color: #429efd;
}
</style>
<style lang="scss">
.logo-submenu {
  .el-menu .el-submenu__title,
  a {
    color: #909399;
  }
  a {
    text-decoration: none;
  }
  .el-menu .el-submenu__title:hover,
  a:hover {
    color: #303133;
  }
}
</style>

