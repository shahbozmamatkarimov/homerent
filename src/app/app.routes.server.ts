import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static home page
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },

  // Dynamic routes (ID bilan)
  {
    path: ':id',
    renderMode: RenderMode.Server,
  },

  // Fallback
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
