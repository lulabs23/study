import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Chemins relatifs : l'application fonctionne quel que soit le nom du dépôt GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
});
