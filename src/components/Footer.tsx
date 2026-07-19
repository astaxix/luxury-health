import { Heart } from 'lucide-react';
import { useState } from 'react';
import { LegalModal } from './LegalModal';

export function Footer() {
  const [activeModal, setActiveModal] = useState<'impressum' | 'datenschutz' | null>(null);
  const [showTikTokLinks, setShowTikTokLinks] = useState(false);
  const [showPartner, setShowPartner] = useState(false);

  const impressumContent = (
    <div>
      <h3 className="text-lg font-bold mb-2 text-zinc-900">Angaben gemäß § 5 TMG</h3>
      <p className="mb-4">
        Robin Peters<br />
        Steuerstraße 2a<br />
        55411 Bingen am Rhein
      </p>
      <h3 className="text-lg font-bold mb-2 text-zinc-900">Kontakt</h3>
      <p className="mb-4">
        Telefon: 015237210664<br />
        E-Mail: robin.mikel18@web.de
      </p>
      <div className="mt-6 pt-6 border-t border-zinc-100">
        <button 
          onClick={() => setShowPartner(!showPartner)}
          className="w-full flex items-center justify-between py-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900 border border-zinc-200 rounded-lg px-4 bg-zinc-50 hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-400"
        >
          <span>Geschäftspartner</span>
          <span className="text-xs text-zinc-400">{showPartner ? '▲ Schließen' : '▼ Anzeigen'}</span>
        </button>
        {showPartner && (
          <div className="mt-3 p-4 bg-zinc-50 rounded-lg border border-zinc-100 text-sm text-zinc-800 animate-fadeIn">
            <p className="font-semibold text-zinc-900">Dennis Wink</p>
            <p className="text-zinc-600 mt-1">TikTok: <a href="https://www.tiktok.com/@denoistanders" target="_blank" rel="noopener noreferrer" className="text-[#df9f77] hover:underline">@denoistanders</a></p>
          </div>
        )}
      </div>
    </div>
  );

  const datenschutzContent = (
    <div>
      <h3 className="text-lg font-bold mb-2 text-zinc-900">1. Datenschutz auf einen Blick</h3>
      <p className="mb-4">
        Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
      </p>
      <h3 className="text-lg font-bold mb-2 text-zinc-900">2. Cookies & Analytics</h3>
      <p className="mb-4">
        Diese Website verwendet teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Sie dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
      </p>
      <h3 className="text-lg font-bold mb-2 text-zinc-900">3. Affiliate-Links und Amazon PartnerNet</h3>
      <p className="mb-4">
        Wir setzen auf unserer Website Links zu Partnernetzwerken ein (Affiliate-Links). Wenn Sie auf einen solchen Link klicken und auf der Zielseite etwas kaufen, erhalten wir vom jeweiligen Anbieter eine Provision. Für Sie verändert sich der Preis nicht. Wir sind Teilnehmer des Amazon-Partnerprogramms, das zur Bereitstellung eines Mediums für Websites konzipiert wurde, mittels dessen durch die Platzierung von Partner-Links zu Amazon.de Werbekostenerstattung verdient werden kann.
      </p>
      <p className="text-xs text-zinc-500 mt-8">
        Bitte lasse deine Datenschutzerklärung von einem Rechtsexperten prüfen oder erstelle eine vollständige Version mit einem Generator (z.B. eRecht24).
      </p>
    </div>
  );

  return (
    <>
      <footer className="bg-zinc-900 text-zinc-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
            <div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight block mb-4">
                Luxury Health
              </span>
              <p className="text-sm">
                Entdecke hochwertige Supplements, Vitamine und weitere Fitness-Produkte. Top Empfehlungen zu Amazon Artikeln für deine Gesundheit, Leistung und Fitness an einem Ort.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => setActiveModal('impressum')} className="hover:text-white transition-colors">
                    Impressum
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('datenschutz')} className="hover:text-white transition-colors">
                    Datenschutz
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Socials</h4>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={() => setShowTikTokLinks(!showTikTokLinks)}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors font-medium focus:outline-none"
                >
                  <span>TikTok</span>
                  <span className="text-[10px] text-zinc-500">{showTikTokLinks ? '▲' : '▼'}</span>
                </button>
                {showTikTokLinks && (
                  <ul className="pl-4 space-y-2 mt-2 border-l border-zinc-800 animate-fadeIn">
                    <li>
                      <a 
                        href="https://www.tiktok.com/@by.rubinxo" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-zinc-400 hover:text-white transition-colors block py-0.5"
                      >
                        @by.rubinxo
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.tiktok.com/@denoistanders" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-zinc-400 hover:text-white transition-colors block py-0.5"
                      >
                        @denoistanders
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-zinc-800 text-xs flex flex-col items-start gap-4">
            <p className="max-w-4xl leading-relaxed text-zinc-500">
              <strong>Werbehinweis / Affiliate-Kennzeichnung:</strong> Einige Links auf dieser Website sind Affiliate-Links. Wenn du über diese Links einkaufst, erhalten wir möglicherweise eine Provision. Für dich entstehen keine Mehrkosten. <br className="hidden md:block"/>
              Wir sind Teilnehmer des Amazon-Partnerprogramms, das zur Bereitstellung eines Mediums für Websites konzipiert wurde, mittels dessen durch die Platzierung von Partner-Links zu Amazon.de Werbekostenerstattung verdient werden kann. Amazon und das Amazon-Logo sind Warenzeichen von Amazon.com, Inc. oder eines seiner verbundenen Unternehmen.
            </p>
            <p className="flex items-center gap-1 shrink-0 mt-4 text-zinc-600">
              Made with <Heart className="w-3 h-3 text-red-500" /> by Luxury Health
            </p>
          </div>
        </div>
      </footer>

      <LegalModal
        isOpen={activeModal === 'impressum'}
        onClose={() => setActiveModal(null)}
        title="Impressum"
        content={impressumContent}
      />
      <LegalModal
        isOpen={activeModal === 'datenschutz'}
        onClose={() => setActiveModal(null)}
        title="Datenschutz"
        content={datenschutzContent}
      />
    </>
  );
}
