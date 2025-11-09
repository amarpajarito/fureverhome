import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { About } from './features/about/about';
import { Contact } from './features/contact/contact';
import { DogsPublic } from './features/dogs-public/dogs-public';
import { Dogs } from './features/dogs/dogs';
import { DogDetail } from './features/dog-detail/dog-detail';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Profile } from './features/profile/profile';
import { MyRequests } from './features/my-requests/my-requests';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { AdminDogs } from './features/admin/admin-dogs/admin-dogs';
import { AdminDogForm } from './features/admin/admin-dog-form/admin-dog-form';
import { AdminAdoptions } from './features/admin/admin-adoptions/admin-adoptions';

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
    path: 'dogs',
    component: Dogs,
    title: 'Available Dogs - FureverHome',
  },
  {
    path: 'dogs/:id',
    component: DogDetail,
    title: 'Dog Details - FureverHome',
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
  {
    path: 'profile',
    component: Profile,
    title: 'My Profile - FureverHome',
  },
  {
    path: 'my-requests',
    component: MyRequests,
    title: 'My Requests - FureverHome',
  },
  // Admin routes
  {
    path: 'admin',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: AdminDashboard,
        title: 'Dashboard - FureverHome Admin',
      },
      {
        path: 'dogs',
        component: AdminDogs,
        title: 'Manage Dogs - FureverHome Admin',
      },
      {
        path: 'dogs/new',
        component: AdminDogForm,
        title: 'Add Dog - FureverHome Admin',
      },
      {
        path: 'dogs/:id/edit',
        component: AdminDogForm,
        title: 'Edit Dog - FureverHome Admin',
      },
      {
        path: 'adoptions',
        component: AdminAdoptions,
        title: 'Manage Adoptions - FureverHome Admin',
      },
    ],
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
