import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Bell, Shield, Palette, User, Check } from 'lucide-react';
import { Card, Button, Tabs } from '../../components/ui';
import { useSalonStore } from '../../store/salonStore';

export function AdminSettings() {
  const { isDarkMode, toggleDarkMode } = useSalonStore();
  const [saved, setSaved] = useState(false);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  const [salonInfo, setSalonInfo] = useState({
    name: 'Nateliê Hair',
    email: 'contato@nateliehair.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Tranças, 123 - São Paulo, SP',
  });

  const [hours, setHours] = useState([
    { day: 'Seg', open: '09:00', close: '20:00', active: true },
    { day: 'Ter', open: '09:00', close: '20:00', active: true },
    { day: 'Qua', open: '09:00', close: '20:00', active: true },
    { day: 'Qui', open: '09:00', close: '20:00', active: true },
    { day: 'Sex', open: '09:00', close: '20:00', active: true },
    { day: 'Sáb', open: '09:00', close: '18:00', active: true },
    { day: 'Dom', open: '09:00', close: '14:00', active: false },
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 p-4 lg:p-8 max-w-[1200px] mx-auto font-stripe">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white">Configurações</h1>
          <p className="text-[#8a8f98] mt-1 text-sm">Gerencie as preferências e horários do salão</p>
        </div>
        {saved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm"
          >
            <Check className="w-4 h-4" />
            Alterações salvas com sucesso!
          </motion.div>
        )}
      </motion.div>

      <Tabs defaultValue="geral" className="space-y-6">
        <Tabs.List className="bg-[#1c1e54] p-1.5 rounded-xl border border-white/[0.06] inline-flex gap-2">
          <Tabs.Trigger value="geral" className="rounded-lg px-4 py-2 text-sm font-medium">
            <User className="w-4 h-4 mr-2 inline" />Geral
          </Tabs.Trigger>
          <Tabs.Trigger value="aparencia" className="rounded-lg px-4 py-2 text-sm font-medium">
            <Palette className="w-4 h-4 mr-2 inline" />Aparência
          </Tabs.Trigger>
          <Tabs.Trigger value="notificacoes" className="rounded-lg px-4 py-2 text-sm font-medium">
            <Bell className="w-4 h-4 mr-2 inline" />Notificações
          </Tabs.Trigger>
          <Tabs.Trigger value="seguranca" className="rounded-lg px-4 py-2 text-sm font-medium">
            <Shield className="w-4 h-4 mr-2 inline" />Segurança
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="geral">
          <Card className="bg-[#1c1e54] border border-white/[0.06] p-6 lg:p-8 rounded-2xl space-y-6 max-w-4xl">
            <h3 className="text-xl font-light text-white border-b border-white/[0.06] pb-4">Informações do Salão</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#8a8f98] mb-1.5">Nome do Salão</label>
                <input
                  type="text"
                  value={salonInfo.name}
                  onChange={(e) => setSalonInfo({ ...salonInfo, name: e.target.value })}
                  className="w-full bg-[#12122b] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-stripe-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8a8f98] mb-1.5">E-mail de Contato</label>
                <input
                  type="email"
                  value={salonInfo.email}
                  onChange={(e) => setSalonInfo({ ...salonInfo, email: e.target.value })}
                  className="w-full bg-[#12122b] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-stripe-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8a8f98] mb-1.5">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={salonInfo.phone}
                  onChange={(e) => setSalonInfo({ ...salonInfo, phone: e.target.value })}
                  className="w-full bg-[#12122b] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-stripe-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8a8f98] mb-1.5">Endereço Completo</label>
                <input
                  type="text"
                  value={salonInfo.address}
                  onChange={(e) => setSalonInfo({ ...salonInfo, address: e.target.value })}
                  className="w-full bg-[#12122b] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-stripe-primary outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <label className="block text-sm text-[#8a8f98] mb-3">Horário de Funcionamento</label>
              <div className="space-y-3">
                {hours.map((item, idx) => (
                  <div key={item.day} className="flex items-center justify-between bg-[#12122b] p-3 rounded-xl border border-white/[0.04]">
                    <div className="flex items-center gap-3 w-28">
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={(e) => {
                          const updated = [...hours];
                          updated[idx].active = e.target.checked;
                          setHours(updated);
                        }}
                        className="w-4 h-4 accent-stripe-primary rounded"
                      />
                      <span className={`font-medium text-sm ${item.active ? 'text-white' : 'text-zinc-500'}`}>{item.day}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <input
                        type="time"
                        value={item.open}
                        disabled={!item.active}
                        onChange={(e) => {
                          const updated = [...hours];
                          updated[idx].open = e.target.value;
                          setHours(updated);
                        }}
                        className="bg-[#1c1e54] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white disabled:opacity-40"
                      />
                      <span className="text-[#8a8f98] text-xs">às</span>
                      <input
                        type="time"
                        value={item.close}
                        disabled={!item.active}
                        onChange={(e) => {
                          const updated = [...hours];
                          updated[idx].close = e.target.value;
                          setHours(updated);
                        }}
                        className="bg-[#1c1e54] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white disabled:opacity-40"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex justify-end">
              <Button
                onClick={handleSave}
                className="rounded-full bg-stripe-primary hover:bg-stripe-primary-deep text-white shadow-none px-6"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="aparencia">
          <Card className="bg-[#1c1e54] border border-white/[0.06] p-6 lg:p-8 rounded-2xl space-y-6 max-w-4xl">
            <h3 className="text-xl font-light text-white border-b border-white/[0.06] pb-4">Tema e Aparência</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#12122b] rounded-xl border border-white/[0.04]">
                <div>
                  <p className="font-medium text-white text-sm">Modo Escuro (Stripe Dark Theme)</p>
                  <p className="text-[#8a8f98] text-xs mt-0.5">Ativado por padrão para o painel admin</p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-stripe-primary' : 'bg-white/15'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#12122b] rounded-xl border border-white/[0.04]">
                <div>
                  <p className="font-medium text-white text-sm">Cor do Sistema (Accent)</p>
                  <p className="text-[#8a8f98] text-xs mt-0.5">Indigo Stripe (`#533afd`)</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#533afd] ring-2 ring-white" />
                  <div className="w-6 h-6 rounded-full bg-[#ea2261]" />
                  <div className="w-6 h-6 rounded-full bg-[#0070f3]" />
                </div>
              </div>
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="notificacoes">
          <Card className="bg-[#1c1e54] border border-white/[0.06] p-6 lg:p-8 rounded-2xl space-y-4 max-w-4xl">
            <h3 className="text-xl font-light text-white border-b border-white/[0.06] pb-4">Preferências de Notificação</h3>
            <NotificationToggle label="Lembretes de agendamento via WhatsApp (24h antes)" defaultChecked />
            <NotificationToggle label="Confirmação automática de novos agendamentos" defaultChecked />
            <NotificationToggle label="Avisos de cancelamento de clientes" defaultChecked />
            <NotificationToggle label="Relatório financeiro semanal por e-mail" defaultChecked={false} />
          </Card>
        </Tabs.Content>

        <Tabs.Content value="seguranca">
          <Card className="bg-[#1c1e54] border border-white/[0.06] p-6 lg:p-8 rounded-2xl space-y-6 max-w-4xl">
            <h3 className="text-xl font-light text-white border-b border-white/[0.06] pb-4">Segurança da Conta</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#12122b] rounded-xl border border-white/[0.04]">
                <div>
                  <p className="font-medium text-white text-sm">Autenticação em Dois Fatores (2FA)</p>
                  <p className="text-[#8a8f98] text-sm mt-0.5">Proteja o acesso administrativo do salão</p>
                </div>
                <Button variant="secondary" className="rounded-full text-xs py-1.5 bg-transparent border-white/20 text-white hover:bg-white/5">Ativar</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#12122b] rounded-xl border border-white/[0.04]">
                <div>
                  <p className="font-medium text-white text-sm">Senha de Acesso</p>
                  <p className="text-[#8a8f98] text-sm mt-0.5">Última alteração há 30 dias</p>
                </div>
                <Button variant="secondary" className="rounded-full text-xs py-1.5 bg-transparent border-white/20 text-white hover:bg-white/5" onClick={() => setSecurityMessage('Tela de alteração de senha em desenvolvimento aberto')}>Alterar</Button>
              </div>
              {securityMessage && (
                <div className="p-3 rounded-lg bg-[#12122b] border border-[#ea2261]/30 text-[#ffb3c7] text-xs mb-3">
                  {securityMessage}
                </div>
              )}
              <div className="flex items-center justify-between p-4 bg-[#12122b] rounded-xl border border-white/[0.04]">
                <div>
                  <p className="font-medium text-white text-sm">Sessões ativas</p>
                  <p className="text-[#8a8f98] text-sm mt-0.5">3 dispositivos conectados</p>
                </div>
                <Button variant="ghost" className="rounded-full text-xs py-1.5 bg-transparent border-white/20 text-white hover:bg-white/5" onClick={() => setSecurityMessage('Sessões: dispositivo A encerrado')}>Gerenciar</Button>
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
    <div className="flex items-center justify-between p-4 bg-[#12122b] rounded-xl border border-white/[0.04]">
      <p className="text-white text-sm font-medium">{label}</p>
      <button
        onClick={() => setChecked(!checked)}
        className={`w-12 h-6 rounded-full transition-colors ${checked ? 'bg-stripe-primary' : 'bg-white/15'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}