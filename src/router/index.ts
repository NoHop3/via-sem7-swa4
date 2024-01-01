import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import Scores from '../views/Scores.vue';
import Board from '../views/Board.vue';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sign-up',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/play',
      name: 'board',
      component: Board,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/scores',
      name: 'scores',
      component: Scores,
    },
  ],
});

export default router;
