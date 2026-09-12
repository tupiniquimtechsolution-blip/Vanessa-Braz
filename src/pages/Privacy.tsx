import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
            <Shield size={24} className="text-brand-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-primary">
              Política de Privacidade
            </h1>
            <p className="text-sm text-brand-muted">Conforme a Lei Geral de Proteção de Dados (LGPD)</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-brand-muted space-y-6">
          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">1. Introdução</h2>
            <p>
              Esta Política de Privacidade descreve como Vanessa Braz — Beleza & Autoestima ("nós", "nosso") 
              coleta, usa, armazena e protege seus dados pessoais quando você utiliza nosso site e serviços.
            </p>
            <p>
              Estamos comprometidos com a proteção de seus dados pessoais em conformidade com a Lei Geral 
              de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">2. Dados Coletados</h2>
            <p>Coletamos os seguintes dados pessoais:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Dados de identificação:</strong> nome completo, e-mail, telefone/WhatsApp</li>
              <li><strong>Dados de agendamento:</strong> serviços solicitados, datas e horários preferidos</li>
              <li><strong>Dados de navegação:</strong> endereço IP, tipo de dispositivo, páginas visitadas</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">3. Finalidade do Tratamento</h2>
            <p>Seus dados são utilizados para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Processar e confirmar agendamentos</li>
              <li>Enviar comunicações sobre seus serviços</li>
              <li>Melhorar nossos serviços e experiência</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">4. Consentimentos</h2>
            <p>Trabalhamos com consentimentos separados para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Consentimento necessário:</strong> para funcionamento básico do serviço</li>
              <li><strong>Consentimento de marketing:</strong> para envio de promoções e novidades (opcional)</li>
              <li><strong>Consentimento de uso de imagem:</strong> para divulgação de resultados (opcional e separado)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">5. Seus Direitos (LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou incorretos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar consentimentos a qualquer momento</li>
              <li>Solicitar portabilidade dos dados</li>
              <li>Ser informado sobre o tratamento dos seus dados</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">6. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra 
              acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">7. Retenção de Dados</h2>
            <p>
              Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades para as 
              quais foram coletados, ou conforme exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">8. Contato</h2>
            <p>
              Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato:
            </p>
            <p className="mt-2">
              <strong>E-mail:</strong> contato@vanessabraz.com.br<br />
              <strong>WhatsApp:</strong> Disponível no site
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">9. Atualizações</h2>
            <p>
              Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre 
              disponível em nosso site com a data da última atualização.
            </p>
            <p className="mt-4 text-xs text-brand-muted italic">
              Última atualização: {new Date().toLocaleDateString('pt-BR')} — DADOS_DEMONSTRATIVOS
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
