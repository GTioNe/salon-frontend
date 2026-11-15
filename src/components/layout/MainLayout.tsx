import { Outlet } from 'react-router-dom';
import { Header, Footer } from './index';
import { motion } from 'framer-motion';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="section-container py-8 lg:py-12"
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}