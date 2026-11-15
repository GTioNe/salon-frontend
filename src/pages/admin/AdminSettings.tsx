import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Bell, Shield, Palette, Moon, User, Settings } from 'lucide-react';
import { Card, Button, Input, Tabs } from '../../components/ui';
import { useSalonStore } from '../../store/salonStore';

export function AdminSettings() {
  const { isDarkMode, toggleDarkMode } = useSalonStore();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-champagne-500 to-roseGold-500 flex items-center justify-center">
          <Settings className="w-6 h-6 text-luxury-950" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl gradient-text">Configurações</h1>
          <p className="text-zinc-400 mt-1">Personalize seu salão</p>
        </div>
      </motion.div>

      <Tabs defaultValue="geral" className="space-y-6">
        <Tabs.List>
          <Tabs.Trigger value="geral"><User className="w-4 h-4 mr-2" />Geral</Tabs.Trigger>
          <Tabs.Trigger value="aparencia"><Palette className="w-4 h-4 mr-2" />Aparência</Tabs.Trigger>
          <Tabs.Trigger value="notificacoes"><Bell className="w-4 h-4 mr-2" />Notificações</Tabs.Trigger>
          <Tabs.Trigger value="seguranca"><Shield className="w-4 h-4 mr-2" />Segurança</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="geral">
          <Card className="glass-card p-6 space-y-6 max-w-2xl">
            <h3 className="font-display font-semibold text-xl gradient-text">Informações do Salão</h3>
            <div className="space-y-4">
              <Input label="Nome do Salão" placeholder="Nateliê Hair" defaultValue="Nateliê Hair" />
              <Input label="E-mail de Contato" type="email" placeholder="contato@seusalao.com" />
              <Input label="Telefone" type="tel" placeholder="(00) 00000-0000" />
              <Input label="Endereço" placeholder="Endereço do salão" />
              <div>
                <label className="label-field">Horário de Funcionamento</label>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
                    <div key={day} className="glass-card p-3 text-center">
                      <p className="text-xs text-zinc-500 mb-1">{day}</p>
                      <div className="flex gap-1 justify-center">
                        <Input type="time" defaultValue="09:00" className="w-20 text-xs" />
                        <span className="text-zinc-500 self-center">às</span>
                        <Input type="time" defaultValue="20:00" className="w-20 text-xs" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button><Save className="w-4 h-4 mr-2" />Salvar Alterações</Button>
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="aparencia">
          <Card className="glass-card p-6 space-y-6 max-w-2xl">
            <h3 className="font-display font-semibold text-xl gradient-text">Tema e Aparência</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-champagne-500 to-roseGold-500 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-luxury-950" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-100">Modo Escuro</p>
                    <p className="text-zinc-400 text-sm">Tema padrão do sistema</p>
                  </div>
                </div>
                <Button variant={isDarkMode ? 'primary' : 'secondary'} onClick={toggleDarkMode}>
                  {isDarkMode ? 'Ativo' : 'Inativo'}
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-champagne-500 to-roseGold-500 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-luxury-950" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-100">Cor Primária</p>
                    <p className="text-zinc-400 text-sm">Champagne Gold</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-champagne-500 to-champagne-300 border-2 border-champagne-500" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-roseGold-500 to-roseGold-300 border border-white/10" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 border border-white/10" />
                </div>
              </div>
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="notificacoes">
          <Card className="glass-card p-6 space-y-4 max-w-2xl">
            <h3 className="font-display font-semibold text-xl gradient-text">Notificações</h3>
            <NotificationToggle label="Lembretes de agendamento (24h antes)" defaultChecked />
            <NotificationToggle label="Confirmação de novos agendamentos" defaultChecked />
            <NotificationToggle label="Cancelamentos e alterações" defaultChecked />
            <NotificationToggle label="Relatórios semanais por e-mail" />
            <NotificationToggle label="Alertas de estoque baixo" />
          </Card>
        </Tabs.Content>

        <Tabs.Content value="seguranca">
          <Card className="glass-card p-6 space-y-6 max-w-2xl">
            <h3 className="font-display font-semibold text-xl gradient-text">Segurança</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-zinc-100">Autenticação de dois fatores</p>
                  <p className="text-zinc-400 text-sm">Adicione uma camada extra de segurança</p>
                </div>
                <Button variant="secondary">Ativar</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-zinc-100">Alterar senha</p>
                  <p className="text-zinc-400 text-sm">Última alteração: 15 dias atrás</p>
                </div>
                <Button variant="secondary">Alterar</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-zinc-100">Sessões ativas</p>
                  <p className="text-zinc-400 text-sm">3 dispositivos conectados</p>
                </div>
                <Button variant="ghost">Gerenciar</Button>
              </div>
            </div>
          </Card>
        </Tabs.Content>
      </Tabs>
    </div>
  );
}

function NotificationToggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
      <p className="font-medium text-zinc-100">{label}</p>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-champagne-500' : 'bg-white/10'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span className={`absolute top-0.5 transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-0.5'
        }`}>
          <span className="w-5 h-5 rounded-full bg-white shadow" />
        </span>
      </button>
    </div>
  );
}