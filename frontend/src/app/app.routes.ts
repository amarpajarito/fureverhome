import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { About } from './features/about/about';
import { Contact } from './features/contact/contact';
import { DogsPublic } from './features/dogs-public/dogs-public';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    title: 'Home - FureverHome',
  },
  {
    path: 'about',
    component: About,
    title: 'About Us - FureverHome',
  },
  {
    path: 'contact',
    component: Contact,
    title: 'Contact Us - FureverHome',
  },
  {
    path: 'dogs-public',
    component: DogsPublic,
    title: 'Browse Dogs - FureverHome',
  },
  {
    path: 'login',
    component: Login,
    title: 'Login - FureverHome',
  },
  {
    path: 'register',
    component: Register,
    title: 'Sign Up - FureverHome',
  },
  // TODO: Add protected routes with AuthGuard
  // {
  //   path: 'dogs',
  //   component: DogList,
  //   canActivate: [AuthGuard],
  //   title: 'Browse Dogs - FureverHome'
  // },
  // {
  //   path: 'dogs/:id',
  //   component: DogDetail,
  //   canActivate: [AuthGuard],
  //   title: 'Dog Details - FureverHome'
  // },
  // {
  //   path: 'my-requests',
  //   component: MyRequests,
  //   canActivate: [AuthGuard],
  //   title: 'My Requests - FureverHome'
  // },
  // {
  //   path: 'profile',
  //   component: Profile,
  //   canActivate: [AuthGuard],
  //   title: 'Profile - FureverHome'
  // },
  // {
  //   path: 'login',
  //   component: Login,
  //   title: 'Login - FureverHome'
  // },
  // {
  //   path: 'register',
  //   component: Register,
  //   title: 'Sign Up - FureverHome'
  // },
  // Admin routes
  // {
  //   path: 'admin',
  //   canActivate: [AuthGuard, AdminGuard],
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: AdminDashboard,
  //       title: 'Dashboard - FureverHome Admin'
  //     },
  //     {
  //       path: 'dogs',
  //       component: AdminDogList,
  //       title: 'Manage Dogs - FureverHome Admin'
  //     },
  //     {
  //       path: 'dogs/new',
  //       component: AdminDogForm,
  //       title: 'Add Dog - FureverHome Admin'
  //     },
  //     {
  //       path: 'dogs/:id/edit',
  //       component: AdminDogForm,
  //       title: 'Edit Dog - FureverHome Admin'
  //     },
  //     {
  //       path: 'adoptions',
  //       component: AdminAdoptions,
  //       title: 'Manage Adoptions - FureverHome Admin'
  //     }
  //   ]
  // },
  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
