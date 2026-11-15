import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Check, ChevronLeft, ChevronRight, MessageCircle, Sparkles, MapPin } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { formatCurrency, formatDate } from '../lib/utils';
import { MOCK_SERVICES } from '../data/mockData';
import { useSalonStore } from '../store/salonStore';
import { CATEGORIES, type Service } from '../types';

const STEPS = [
  { id: 1, title: 'Serviços', icon: '✂️' },
  { id: 2, title: 'Data & Hora', icon: '📅' },
  { id: 3, title: 'Seus Dados', icon: '📝' },
  { id: 4, title: 'Confirmado', icon: '✅' },
];

interface ClientData {
  name: string;
  phone: string;
  email: string;
  notes: string;
  location_type: 'espaco' | 'domicilio';
  has_220v?: boolean;
  has_wash_place?: boolean;
  agrees_to_fee?: boolean;
  cep: string;
  address: string;
  addressNumber: string;
  neighborhood: string;
  city: string;
}

interface ConfirmationData {
  code: string;
  date: string;
  time: string;
  services: string[];
  professional: string;
  total: number;
}

export function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    phone: '',
    email: '',
    notes: '',
    location_type: 'espaco',
    has_220v: false,
    has_wash_place: false,
    agrees_to_fee: false,
    cep: '',
    address: '',
    addressNumber: '',
    neighborhood: '',
    city: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const { getAvailableSlots: storeGetAvailableSlots, addAppointment } = useSalonStore();

  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate) {
        setAvailableSlots([]);
        return;
      }
      setLoadingSlots(true);
      try {
        const totalDuration = selectedServices.reduce((sum: number, id: string) => {
          const s = MOCK_SERVICES.find((svc) => svc.id === id);
          return sum + (s?.duration || 0);
        }, 0);
        const slots = await storeGetAvailableSlots(selectedDate, undefined, totalDuration);
        setAvailableSlots(slots);
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate, selectedServices, storeGetAvailableSlots]);

  const selectedServicesData = selectedServices.map((id) => MOCK_SERVICES.find((s) => s.id === id)).filter(Boolean) as Service[];
  const totalPrice = selectedServicesData.reduce((sum: number, s: Service) => sum + s.price, 0);
  const totalDuration = selectedServicesData.reduce((sum: number, s: Service) => sum + s.duration, 0);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case 1:
        if (selectedServices.length === 0) newErrors.services = 'Selecione pelo menos um serviço';
        break;
      case 2:
        if (!selectedDate) newErrors.date = 'Selecione uma data';
        if (!selectedTime) newErrors.time = 'Selecione um horário';
        break;
      case 3:
        if (!clientData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!clientData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        if (clientData.location_type === 'domicilio' && !clientData.cep.trim()) newErrors.cep = 'CEP é obrigatório para atendimento domiciliar';
        else if (clientData.location_type === 'domicilio' && clientData.cep.replace(/\D/g, '').length !== 8) newErrors.cep = 'Digite um CEP válido com 8 números';
        if (clientData.location_type === 'domicilio' && !clientData.addressNumber.trim()) newErrors.addressNumber = 'Número da residência é obrigatório';
        if (clientData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) newErrors.email = 'E-mail inválido';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setSubmitError('');
    
    let backendCode = '';
    try {
      const response = await fetch('http://localhost:3001/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedServices[0] || 'nago-fem',
          date: selectedDate,
          time: selectedTime,
          onde: clientData.location_type,
          client: {
            nome: clientData.name,
            zap: clientData.phone.replace(/\D/g, ''),
            email: clientData.email,
            obs: clientData.notes,
            cep: clientData.cep.replace(/\D/g, ''),
            endereco: { rua: clientData.address, numero: clientData.addressNumber, bairro: clientData.neighborhood, cidade: clientData.city },
            location_details: {
              tipo: clientData.location_type === 'domicilio' ? 'domicilio' : 'espaco',
              possui_220v: clientData.location_type === 'domicilio' ? clientData.has_220v : null,
              possui_toalho: clientData.location_type === 'domicilio' ? clientData.has_wash_place : null,
              ciente_taxa: clientData.location_type === 'domicilio' ? clientData.agrees_to_fee : null
            }
          },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        backendCode = data.reservationCode;
      } else if (response.status === 409) {
        const data = await response.json();
        setSubmitError(data.error || 'Este horário já foi reservado. Escolha outro.');
        return;
      } else {
        throw new Error('Não foi possível confirmar o agendamento');
      }
    } catch (err) {
      console.error('Erro ao confirmar agendamento:', err);
      setSubmitError('Não foi possível confirmar o agendamento. Verifique se o sistema está online e tente novamente.');
      return;
    }
    
    const appointment = addAppointment({
      clientId: `client-${Date.now()}`,
      clientName: clientData.name,
      clientPhone: clientData.phone,
      clientEmail: clientData.email,
      serviceIds: selectedServices,
      serviceNames: selectedServicesData.map((s) => s.name),
      professionalName: 'Naty Nascimento',
      date: selectedDate,
      time: selectedTime,
      duration: totalDuration,
      totalPrice,
      status: 'confirmed',
      notes: clientData.notes,
    });

    setConfirmationData({
      code: backendCode || appointment.confirmationCode,
      date: selectedDate,
      time: selectedTime,
      services: selectedServicesData.map((s) => s.name),
      professional: 'Naty Nascimento',
      total: totalPrice,
    });
    
    setCurrentStep(4);
  };

  const sendWhatsApp = () => {
    if (!confirmationData) return;
    const date = formatDate(confirmationData.date);
    const services = confirmationData.services.join(', ');
    const message = `Olá Naty! ✨ Fiz um agendamento pelo site da Nateliê Hair!\n\n📋 *Código:* ${confirmationData.code}\n👤 *Cliente:* ${clientData.name}\n📱 *WhatsApp:* ${clientData.phone}\n📅 *Data:* ${date} às ${confirmationData.time}\n💇 *Serviço:* ${services}\n💰 *Total:* ${formatCurrency(confirmationData.total)}
🏠 *Endereço:* ${clientData.address}${clientData.addressNumber ? `, ${clientData.addressNumber}` : ''} - ${clientData.neighborhood}, ${clientData.city}
📌 *Local:* ${clientData.location_type === 'domicilio' ? 'Domicílio' : 'Espaço Nateliê'}
🔌 *Tomada 220V:* ${clientData.location_type === 'domicilio' ? (clientData.has_220v ? 'Sim' : 'Não') : 'Não se aplica'}
🚿 *Local para lavar o cabelo:* ${clientData.location_type === 'domicilio' ? (clientData.has_wash_place ? 'Sim' : 'Não') : 'Não se aplica'}
💳 *Ciente da taxa de deslocamento:* ${clientData.location_type === 'domicilio' ? (clientData.agrees_to_fee ? 'Sim' : 'Não') : 'Não se aplica'}
📝 *Mais informações:* ${clientData.notes.trim() || 'Nenhuma'}

✅ *Agendamento realizado com sucesso!*
✅ Declaro estar ciente das informações, regras e possíveis taxas informadas no site.`;
    window.open(`https://wa.me/5511947609116?text=${encodeURIComponent(message)}`, '_blank');
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedServices([]);
    setSelectedDate('');
    setSelectedTime('');
    setClientData({ name: '', phone: '', email: '', notes: '', location_type: 'espaco', has_220v: false, has_wash_place: false, agrees_to_fee: false, cep: '', address: '', addressNumber: '', neighborhood: '', city: '' });
    setErrors({});
    setConfirmationData(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-8">
      {/* Progress Bar */}
      <div className="hidden md:flex items-center justify-between mb-8">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all ${
              currentStep > step.id 
                ? 'bg-emerald-500 text-white' 
                : currentStep === step.id 
                ? 'bg-amber-500 text-white ring-4 ring-amber-500/30' 
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
            }`}>
              {currentStep > step.id ? <Check className="w-5 h-5" /> : <span>{step.icon}</span>}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 h-1 ml-2 mr-2 transition-colors ${
                currentStep > i + 1 ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
        {/* Mobile Step Indicator */}
        <div className="md:hidden mb-6 flex items-center justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">Passo {currentStep} de 4</span>
          <span className="font-medium text-amber-500">{STEPS[currentStep - 1].title}</span>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <Step1Services 
              selectedServices={selectedServices}
              onSelectServices={setSelectedServices}
              onNext={nextStep}
            />
          )}
          
          {currentStep === 2 && (
            <Step2DateTime
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              availableSlots={availableSlots}
              loadingSlots={loadingSlots}
              onNext={nextStep}
            />
          )}
          
          {currentStep === 3 && (
            <Step3ClientData
              clientData={clientData}
              onChange={setClientData}
              errors={errors}
              submitError={submitError}
              onNext={handleSubmit}
            />
          )}
          
          {currentStep === 4 && (
            <Step4Confirmation
              confirmationData={confirmationData}
              clientData={clientData}
              totalPrice={totalPrice}
              totalDuration={totalDuration}
              onWhatsApp={sendWhatsApp}
              onRestart={resetWizard}
            />
          )}
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between">
            <Button 
              variant="secondary" 
              onClick={prevStep} 
              disabled={currentStep === 1}
              className="min-w-[140px]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              onClick={currentStep === 3 ? handleSubmit : nextStep} 
              className="min-w-[140px] bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold"
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* WhatsApp Quick Link */}
      <a 
        href="https://wa.me/5511947609116" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-lg transition-all hover:shadow-xl font-medium"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Falar com a Naty</span>
      </a>
    </div>
  );
}

function Step1Services({ selectedServices, onSelectServices, onNext }: { 
  selectedServices: string[];
  onSelectServices: (services: string[]) => void;
  onNext: () => void;
}) {
  const categoriesWithServices = CATEGORIES.map((cat) => ({
    ...cat,
    services: MOCK_SERVICES.filter((s) => s.category === cat.id),
  }));

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Escolha seus serviços</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Selecione os serviços que deseja agendar abaixo.</p>
      </div>

      {/* Aviso Importante sobre Cabelo Lavado & Atendimento Domiciliar */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span>Informações Importantes para o seu Atendimento</span>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        <p>
          💕 <strong>Amore, um lembrete:</strong> para as tranças, venha com o cabelo lavado e seco. Assim evitamos a taxa de lavagem e o atendimento fica mais rápido e confortável para você.
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        <div className="flex items-center gap-2 font-bold text-amber-400">
          <MapPin className="w-4 h-4" />
          <span>Atendimento Domiciliar:</span>
        </div>
        <p>
          👉 <strong>Espaço Nateliê:</strong> Atendimento no meu Local.
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        <p>
          👉 <strong>Domicílio:</strong> Atendimento em sua residência, mediante disponibilidade de <strong>Tomada 220V</strong> e local para lavar o cabelo. Taxa de deslocamento adicional aplicável se solicitada.
        </p>
      </div>

      <div className="space-y-8">
        {categoriesWithServices.map((cat) => (
          <div key={cat.id}>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2 text-lg">
              {cat.icon.startsWith('/') ? <img src={cat.icon} alt="" className="h-16 w-16 rounded-lg object-contain" /> : <span className="text-2xl">{cat.icon}</span>}
              {cat.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cat.services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => { const nextServices = selectedServices.includes(service.id) ? selectedServices.filter((id) => id !== service.id) : [...selectedServices, service.id]; onSelectServices(nextServices); if (nextServices.length === 1) onNext(); }}
                  className={`relative p-4 rounded-xl transition-all duration-200 text-left flex items-center gap-4 ${
                    selectedServices.includes(service.id)
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500'
                      : 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    selectedServices.includes(service.id)
                      ? 'bg-amber-500 text-zinc-900 font-bold'
                      : 'bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-400'
                  }`}>
                    {selectedServices.includes(service.id) ? <Check className="w-5 h-5 text-zinc-900" /> : <span className="text-xl">✂️</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-zinc-900 dark:text-white truncate">{service.name}</h4>
                      <span className="font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1 line-clamp-1">{service.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration}min</span>
                      {service.popular && <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">Popular</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-amber-900 dark:text-amber-200">
              {selectedServices.length} serviço{selectedServices.length > 1 ? 's' : ''} selecionado{selectedServices.length > 1 ? 's' : ''}
            </span>
            <Button onClick={onNext} className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold">
              Continuar
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="text-zinc-700 dark:text-zinc-300 text-sm">
            Total estimado: <span className="font-bold text-amber-700 dark:text-amber-300">
              {formatCurrency(selectedServices.reduce((sum: number, id: string) => sum + (MOCK_SERVICES.find((s) => s.id === id)?.price || 0), 0))}
            </span> • 
            {selectedServices.reduce((sum: number, id: string) => sum + (MOCK_SERVICES.find((s) => s.id === id)?.duration || 0), 0)}min
          </div>
        </div>
      )}
    </div>
  );
}

function Step2DateTime({ selectedDate, onSelectDate, selectedTime, onSelectTime, availableSlots, loadingSlots, onNext }: { 
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  availableSlots: string[];
  loadingSlots: boolean;
  onNext: () => void;
}) {
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Escolha data e horário</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Atendimento com Naty Nascimento</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Data</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => { onSelectDate(e.target.value); onSelectTime(''); }}
            min={today}
            max={maxDate}
            className="mb-6"
          />
          
          {!selectedDate && (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center py-8">
              Selecione uma data para ver horários disponíveis
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Horário</label>
          
          {loadingSlots ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4" />
              <p className="text-zinc-500 dark:text-zinc-400">Carregando horários...</p>
            </div>
          ) : selectedDate && availableSlots.length === 0 ? (
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-8 text-center border border-zinc-200 dark:border-zinc-700">
              <Clock className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
              <p className="text-zinc-600 dark:text-zinc-300 font-medium">Nenhum horário disponível nesta data</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Tente outra data</p>
            </div>
          ) : selectedDate && availableSlots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => onSelectTime(slot)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedTime === slot
                      ? 'bg-amber-500 text-zinc-900 font-bold'
                      : 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedDate && selectedTime && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-200">{formatDate(selectedDate)}</p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{selectedTime}</p>
              </div>
            </div>
            <Button onClick={onNext} className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold">
              Continuar
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Step3ClientData({ clientData, onChange, errors, submitError, onNext }: { 
  clientData: ClientData;
  onChange: (data: ClientData) => void;
  errors: Record<string, string>;
  submitError: string;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Seus dados</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Para confirmar o agendamento com a Naty</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Nome completo"
          placeholder="Seu nome"
          value={clientData.name}
          onChange={(e) => onChange({ ...clientData, name: e.target.value })}
          error={errors.name}
          autoComplete="name"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="WhatsApp / Telefone"
            placeholder="(11) 99999-9999"
            type="tel"
            maxLength={11}
            value={clientData.phone}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 11);
              onChange({ ...clientData, phone: onlyNums });
            }}
            error={errors.phone}
            autoComplete="tel"
            helperText="Apenas números com DDD (ex: 11999999999)"
          />
          <Input
            label="E-mail (opcional)"
            placeholder="seu@email.com"
            type="email"
            value={clientData.email}
            onChange={(e) => onChange({ ...clientData, email: e.target.value })}
            error={errors.email}
            autoComplete="email"
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Onde será o atendimento?</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([
              ['espaco', 'Atendimento no meu Local'],
              ['domicilio', 'Atendimento Domiciliar'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ ...clientData, location_type: value })}
                className={`rounded-xl border p-4 text-left transition-colors ${clientData.location_type === value ? 'border-pink-500 bg-pink-500/10 text-pink-200' : 'border-zinc-700 bg-zinc-800 text-zinc-300'}`}
              >
                <span className="font-semibold">{label}</span>
                <span className="block text-xs mt-1 text-zinc-400">{value === 'domicilio' ? 'A Naty vai até sua residência' : 'Você vem até o local de atendimento'}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {clientData.location_type === 'domicilio' && <Input
          label="CEP da residência"
          placeholder="00000-000"
          type="text"
          inputMode="numeric"
          maxLength={9}
          value={clientData.cep}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
            const cep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
            onChange({ ...clientData, cep });
            if (digits.length === 8) {
              fetch(`https://viacep.com.br/ws/${digits}/json/`)
                .then((response) => response.json())
                .then((data) => {
                  if (!data.erro) onChange({ ...clientData, cep, address: data.logradouro || '', neighborhood: data.bairro || '', city: `${data.localidade || ''} - ${data.uf || ''}` });
                })
                .catch(() => {});
            }
          }}
          error={errors.cep}
          autoComplete="postal-code"
          helperText="Digite o CEP e a rua, bairro e cidade serão preenchidos automaticamente"
        />}

        {clientData.location_type === 'domicilio' && !clientData.address && (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">Digite um CEP válido para localizar a rua e o bairro. Se não encontrar, confira o CEP e tente novamente.</p>
        )}

        {clientData.location_type === 'domicilio' && clientData.address && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <p className="font-semibold">Endereço localizado pelo CEP</p>
            <p>{clientData.address} — {clientData.neighborhood}, {clientData.city}</p>
            <Input
              label="Número da residência"
              placeholder="Ex.: 123"
              value={clientData.addressNumber}
              onChange={(e) => onChange({ ...clientData, addressNumber: e.target.value })}
              autoComplete="street-address"
              error={errors.addressNumber}
            />
          </div>
        )}

        {clientData.location_type === 'domicilio' && (
          <div className="space-y-4 pt-2 border-t border-zinc-700">
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-zinc-300">Possui Tomada 220V disponível?</legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  [true, 'Sim, possui 220V'],
                  [false, 'Não possui 220V'],
                ].map(([val, label]) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => onChange({ ...clientData, has_220v: val as boolean })}
                    className={`rounded-xl border p-3 text-sm font-medium text-left transition-colors w-full ${clientData.has_220v === val ? 'border-amber-500 bg-amber-500/10 text-amber-200' : 'border-zinc-700 bg-zinc-800 text-zinc-300'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-zinc-300">Possui local adequado para lavar o cabelo?</legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  [true, 'Sim, local para lavar'],
                  [false, 'Não possui local'],
                ].map(([val, label]) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => onChange({ ...clientData, has_wash_place: val as boolean })}
                    className={`rounded-xl border p-3 text-sm font-medium text-left transition-colors w-full ${clientData.has_wash_place === val ? 'border-amber-500 bg-amber-500/10 text-amber-200' : 'border-zinc-700 bg-zinc-800 text-zinc-300'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-zinc-300">Ciente da taxa de deslocamento para domicílio?</legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  [true, 'Sim, estou ciente'],
                  [false, 'Não estou ciente'],
                ].map(([val, label]) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => onChange({ ...clientData, agrees_to_fee: val as boolean })}
                    className={`rounded-xl border p-3 text-sm font-medium text-left transition-colors w-full ${clientData.agrees_to_fee === val ? 'border-amber-500 bg-amber-500/10 text-amber-200' : 'border-zinc-700 bg-zinc-800 text-zinc-300'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        <div className="relative">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Mais informações (opcional)</label>
          <div className="mb-2 rounded-xl border border-pink-400/30 bg-pink-500/10 px-3 py-2 text-sm text-pink-200">💕 Quer contar algum detalhe para a Naty? Ex.: “Prefiro tons de marrom na fibra.”</div>
          <textarea
            value={clientData.notes}
            onChange={(e) => onChange({ ...clientData, notes: e.target.value })}
            placeholder="Alergias, preferências, se prefere no espaço ou domicílio..."
            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[100px] resize-none"
            rows={4}
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <Button onClick={onNext} className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold" size="lg">
          Confirmar agendamento
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
        {submitError && <p className="mt-3 text-center text-sm text-red-300" role="alert">{submitError}</p>}
      </div>
    </div>
  );
}

function Step4Confirmation({ confirmationData, clientData, totalPrice, totalDuration, onWhatsApp, onRestart }: { 
  confirmationData: ConfirmationData | null;
  clientData: ClientData;
  totalPrice: number;
  totalDuration: number;
  onWhatsApp: () => void;
  onRestart: () => void;
}) {
  if (!confirmationData) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Agendamento Confirmado!</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Seu horário com a Naty está garantido. Envie a confirmação no WhatsApp abaixo.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <span className="font-medium text-zinc-600 dark:text-zinc-400">Código de confirmação</span>
          <span className="font-mono text-xl font-bold text-amber-600 dark:text-amber-400">{confirmationData.code}</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Data e horário</p>
              <p className="font-medium text-zinc-900 dark:text-white">{formatDate(confirmationData.date)} às {confirmationData.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <span className="text-2xl">✂️</span>
            </div>
            <div className="flex-1">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Serviços</p>
              <p className="font-medium text-zinc-900 dark:text-white">{confirmationData.services.join(', ')}</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{totalDuration}min • {formatCurrency(totalPrice)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Profissional</p>
              <p className="font-medium text-zinc-900 dark:text-white">Naty Nascimento</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <User className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Cliente</p>
              <p className="font-medium text-zinc-900 dark:text-white">{clientData.name}</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{clientData.phone}{clientData.email ? ` • ${clientData.email}` : ''}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="w-full">
          <Button onClick={onWhatsApp} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold" size="lg">
            <MessageCircle className="w-5 h-5 mr-2" />
            Confirmar pelo WhatsApp
          </Button>
          <p className="mt-2 text-center text-xs text-zinc-400">Caso não tenha recebido a mensagem automática, clique acima.</p>
        </div>
        <Button variant="secondary" onClick={onRestart} className="w-full" size="lg">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Novo agendamento
        </Button>
      </div>
    </div>
  );
}