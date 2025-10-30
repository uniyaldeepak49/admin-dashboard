import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/analytics.component').then((m) => m.AnalyticsComponent),
      },
      {
        path: 'revenue',
        loadComponent: () =>
          import('./features/revenue/revenue.component').then((m) => m.RevenueComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders.component').then((m) => m.OrdersComponent),
      },
      {
        path: 'conversion',
        loadComponent: () =>
          import('./features/conversion/conversion.component').then((m) => m.ConversionComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: 'components/forms',
        loadComponent: () =>
          import('./features/components/forms/forms.component').then((m) => m.FormsComponent),
      },
      {
        path: 'components/alerts',
        loadComponent: () =>
          import('./features/components/alerts/alerts.component').then((m) => m.AlertsComponent),
      },
      {
        path: 'components/cards',
        loadComponent: () =>
          import('./features/components/cards/cards.component').then((m) => m.CardsComponent),
      },
      {
        path: 'components/tables',
        loadComponent: () =>
          import('./features/components/tables/tables.component').then((m) => m.TablesComponent),
      },
      {
        path: 'components/buttons',
        loadComponent: () =>
          import('./features/components/buttons/buttons.component').then((m) => m.ButtonsComponent),
      },
      {
        path: 'components/loaders',
        loadComponent: () =>
          import('./features/components/loaders/loaders.component').then((m) => m.LoadersComponent),
      },
      {
        path: 'components/accordion',
        loadComponent: () =>
          import('./features/components/accordion/accordion.component').then(
            (m) => m.AccordionComponent,
          ),
      },
      {
        path: 'components/autocomplete',
        loadComponent: () =>
          import('./features/components/autocomplete/autocomplete.component').then(
            (m) => m.AutocompleteComponent,
          ),
      },
      {
        path: 'components/chips',
        loadComponent: () =>
          import('./features/components/chips/chips.component').then((m) => m.ChipsComponent),
      },
      {
        path: 'components/select',
        loadComponent: () =>
          import('./features/components/select/select.component').then((m) => m.SelectComponent),
      },
      {
        path: 'components/multiselect-tree',
        loadComponent: () =>
          import('./features/components/multiselect-tree/multiselect-tree.component').then(
            (m) => m.MultiselectTreeComponent,
          ),
      },
      {
        path: 'components/calendar',
        loadComponent: () =>
          import('./features/components/calendar/calendar.component').then(
            (m) => m.CalendarComponent,
          ),
      },
      {
        path: 'components/file-uploads',
        loadComponent: () =>
          import('./features/components/file-uploads/file-uploads.component').then(
            (m) => m.FileUploadsComponent,
          ),
      },
      {
        path: 'components/drag-drop',
        loadComponent: () =>
          import('./features/components/drag-drop/drag-drop.component').then(
            (m) => m.DragDropComponent,
          ),
      },
      {
        path: 'components/grids',
        loadComponent: () =>
          import('./features/components/grids/grids.component').then((m) => m.GridsComponent),
      },
      {
        path: 'components/modal-popup',
        loadComponent: () =>
          import('./features/components/modal-popup/modal-popup.component').then(
            (m) => m.ModalPopupComponent,
          ),
      },
      {
        path: 'components/headers',
        loadComponent: () =>
          import('./features/components/headers/headers.component').then((m) => m.HeadersComponent),
      },
      {
        path: 'components/footers',
        loadComponent: () =>
          import('./features/components/footers/footers.component').then((m) => m.FootersComponent),
      },
      {
        path: 'components/sliders',
        loadComponent: () =>
          import('./features/components/sliders/sliders.component').then((m) => m.SlidersComponent),
      },
      {
        path: 'components/carousel-sliders',
        loadComponent: () =>
          import('./features/components/carousel-sliders/carousel-sliders.component').then(
            (m) => m.CarouselSlidersComponent,
          ),
      },
      {
        path: 'components/gallery',
        loadComponent: () =>
          import('./features/components/gallery/gallery.component').then((m) => m.GalleryComponent),
      },
      {
        path: 'components/portfolio',
        loadComponent: () =>
          import('./features/components/portfolio/portfolio.component').then(
            (m) => m.PortfolioComponent,
          ),
      },
      {
        path: 'components/editors',
        loadComponent: () =>
          import('./features/components/editors/editors.component').then((m) => m.EditorsComponent),
      },

      {
        path: 'pages/not-found',
        loadComponent: () =>
          import('./features/pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
      },
      {
        path: 'pages/signin',
        loadComponent: () =>
          import('./features/pages/signin/signin.component').then((m) => m.SigninComponent),
      },
      {
        path: 'pages/change-password',
        loadComponent: () =>
          import('./features/pages/change-password/change-password.component').then(
            (m) => m.ChangePasswordComponent,
          ),
      },
      {
        path: 'pages/forgot-password',
        loadComponent: () =>
          import('./features/pages/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent,
          ),
      },
      {
        path: 'pages/user-profile',
        loadComponent: () =>
          import('./features/pages/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent,
          ),
      },
      {
        path: 'pages/timeline',
        loadComponent: () =>
          import('./features/components/timeline/timeline.component').then(
            (m) => m.TimelineComponent,
          ),
      },
      {
        path: 'pages/email-inbox',
        loadComponent: () =>
          import('./features/pages/email-inbox/email-inbox.component').then(
            (m) => m.EmailInboxComponent,
          ),
      },
      {
        path: 'pages/notifications',
        loadComponent: () =>
          import('./features/pages/notifications/notifications.component').then(
            (m) => m.NotificationsComponent,
          ),
      },
      {
        path: 'file-manager',
        loadComponent: () =>
          import('./features/pages/file-manager/file-manager.component').then(
            (m) => m.FileManagerComponent,
          ),
      },
      {
        path: 'crm',
        loadComponent: () =>
          import('./features/pages/crm/crm.component').then((m) => m.CrmComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component').then((m) => m.ReportsComponent),
        canActivate: [roleGuard(['admin', 'editor'])],
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/products.component').then((m) => m.ProductsComponent),
        canActivate: [roleGuard(['admin', 'editor'])],
      },
      {
        path: 'system-logs',
        loadComponent: () =>
          import('./features/system-logs/system-logs.component').then((m) => m.SystemLogsComponent),
        canActivate: [roleGuard(['admin'])],
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
];
