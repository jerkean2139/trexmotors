import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'client', // Specify the directory where your index.html is located
  plugins: [react()],
});