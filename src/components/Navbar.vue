<script setup>
import {computed} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';

const store = useStore();
const router = useRouter();

const userInfo = computed(() => store.state.userInfo);
const isAdmin = computed(() => store.getters.isAdmin);

const handleCommand = (command) => {
  if (command === 'logout') {
    store.dispatch('logout').then(() => {
      router.push('/login');
    });
  } else if (command === 'profile') {
    router.push('/profile');
  }
}
</script>

<template>
  <div class="navbar">
    <div class="logo">用户管理系统</div>
    <div class="menu">
      <router-link to="/dashboard" class="menu-item">首页</router-link>
      <router-link to="/profile" class="menu-item">个人信息</router-link>
      <router-link v-if="isAdmin" to="/users" class="menu-item">用户列表</router-link>
    </div>
    <div class="user-info">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="user-name">
          {{ userInfo?.realName || '用户' }} <i class="el-icon-arrow-down"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>

</style>