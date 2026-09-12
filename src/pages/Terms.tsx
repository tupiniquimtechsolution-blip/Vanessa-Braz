import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
            <FileText size={24} className="text-brand-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-primary">
              Termos de Uso
            </h1>
            <p className="text-sm text-brand-muted">Condições de utilização do site e serviços</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-brand-muted space-y-6">
          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar este site e nossos serviços, você concorda com estes Termos de Uso. 
              Caso não concorde com alguma disposição, pedimos que não utilize nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">2. Serviços</h2>
            <p>
              Oferecemos serviços de beleza e estética, incluindo mas não limitado a: design de sobrancelhas, 
              micropigmentação, extensão de cílios, tratamentos faciais e corporais.
            </p>
            <p>
              Os preços, disponibilidade e condições dos serviços estão sujeitos a alterações sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">3. Agendamentos</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Agendamentos devem ser realizados com antecedência mínima</li>
              <li>Cancelamentos devem ser comunicados com pelo menos 24 horas de antecedência</li>
              <li>Atrasos superiores a 15 minutos podem resultar em cancelamento automático</li>
              <li>Nos reservamos o direito de recusar atendimentos em caso de descumprimento das políticas</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">4. Pagamentos</h2>
            <p>
              O pagamento deverá ser realizado no momento do atendimento, salvo acordo prévio. 
              Aceitamos PIX, cartão de crédito, débito e dinheiro.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">5. Responsabilidades do Cliente</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Informar sobre alergias, condições de saúde ou medicamentos em uso</li>
              <li>Seguir orientações pré e pós-procedimento</li>
              <li>Comparecer pontualmente ao horário agendado</li>
              <li>Fornecer dados pessoais verdadeiros e atualizados</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">6. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo deste site (textos, imagens, logos, design) é de propriedade de 
              Vanessa Braz — Beleza & Autoestima e está protegido por leis de propriedade intelectual.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">7. Limitação de Responsabilidade</h2>
            <p>
              Não nos responsabilizamos por danos decorrentes do não cumprimento das orientações 
              pré e pós-procedimento pelo cliente.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-primary">8. Alterações</h2>
            <p>
              Estes termos podem ser modificados a qualquer momento. Recomendamos a consulta 
              periódica desta página.
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
