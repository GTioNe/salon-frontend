import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Check, Save } from 'lucide-react';
import { Button } from '../components/ui';

export function ProfileSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    if (password && password !== confirmPassword) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 p-4 lg:p-8 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-light tracking-tight text-white">Minhas Configurações</h1>
          <p className="text-[#8a8f98] mt-1 text-sm">Atualize suas preferências de conta</p>
        </div>
        {saved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm"
          >
            <Check className="w-4 h-4" />
            Alterações salvas!
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Profile Image */}
        <div>
          <label className="block text-sm text-[#8a8f98] mb-2 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-zinc-400" />
            Foto de perfil
          </label>
          <input
            type="file"
            className="w-full bg-[#12122b] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none"
            accept="image/*"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm text-[#8a8f98] mb-1.5">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#12122b] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-stripe-primary outline-none"
            placeholder="Seu nome completo"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-[#8a8f98] mb-1.5">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#12122b] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-stripe-primary outline-none"
            placeholder="seu@email.com"
            readOnly
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-[#8a8f98] mb-1.5">Nova senha</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#12122b] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm pr-10 focus:border-stripe-primary outline-none"
              placeholder="Nova senha (opcional)"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-zinc-400 text-sm hover:text-white flex items-center gap-1.5"
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Deixe em branco para manter a senha atual</p>
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm text-[#8a8f98] mb-1.5">Confirmar senha</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#12122b] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm pr-10 focus:border-stripe-primary outline-none"
              placeholder="Confirmar nova senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-zinc-400 text-sm hover:text-white flex items-center gap-1.5"
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-rose-400 mt-1">As senhas não coincidem</p>
          )}
        </div>

      </div>

      <div className="pt-8 border-t border-white/[0.06]">
        <Button onClick={handleSave} className="w-full rounded-full bg-stripe-primary hover:bg-stripe-primary-deep text-white shadow-none px-6">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}