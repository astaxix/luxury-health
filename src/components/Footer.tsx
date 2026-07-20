import { Heart } from 'lucide-react';
import { useState } from 'react';
import { LegalModal } from './LegalModal';

export function Footer() {
  const [activeModal, setActiveModal] = useState<'impressum' | 'datenschutz' | null>(null);
  const [showTikTokLinks, setShowTikTokLinks] = useState(false);
  const [showPartner, setShowPartner] = useState(false);

  const impressumContent = (
    <div>
      <h3 className="text-lg font-bold mb-2 text-zinc-100">Angaben gemäß § 5 TMG</h3>
      <p className="mb-4 text-zinc-400">
        Robin Peters<br />
        Steuerstraße 2a<br />
        55411 Bingen am Rhein
      </p>
      <h3 className="text-lg font-bold mb-2 text-zinc-100">Kontakt</h3>
      <p className="mb-4 text-zinc-400">
        Telefon: 015237210664<br />
        E-Mail: robin.mikel18@web.de
      </p>
      <div className="mt-6 pt-6 border-t border-zinc-800">
        <button 
          onClick={() => setShowPartner(!showPartner)}
          className="w-full flex items-center justify-between py-2 text-sm font-semibold text-zinc-300 hover:text-zinc-100 border border-zinc-800 rounded-lg px-4 bg-zinc-900 hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-600"
        >
          <span>Geschäftspartner</span>
          <span className="text-xs text-zinc-500">{showPartner ? '▲ Schließen' : '▼ Anzeigen'}</span>
        </button>
        {showPartner && (
          <div className="mt-3 p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-sm text-zinc-300 animate-fadeIn">
            <p className="font-semibold text-zinc-100">Dennis Wink</p>
            <p className="text-zinc-400 mt-1">TikTok: <a href="https://www.tiktok.com/@denoistanders" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">@denoistanders</a></p>
          </div>
        )}
      </div>
    </div>
  );

  const datenschutzContent = (
    <div>
      <h3 className="text-lg font-bold mb-2 text-zinc-100">1. Datenschutz auf einen Blick</h3>
      <p className="mb-4 text-zinc-400">
        Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
      </p>
      <h3 className="text-lg font-bold mb-2 text-zinc-100">2. Cookies & Analytics</h3>
      <p className="mb-4 text-zinc-400">
        Diese Website verwendet teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Sie dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
      </p>
      <h3 className="text-lg font-bold mb-2 text-zinc-100">3. Affiliate-Links und Amazon PartnerNet</h3>
      <p className="mb-4 text-zinc-400">
        Wir setzen auf unserer Website Links zu Partnernetzwerken ein (Affiliate-Links). Wenn Sie auf einen solchen Link klicken und auf der Zielseite etwas kaufen, erhalten wir vom jeweiligen Anbieter eine Provision. Für Sie verändert sich der Preis nicht. Wir sind Teilnehmer des Amazon-Partnerprogramms, das zur Bereitstellung eines Mediums für Websites konzipiert wurde, mittels dessen durch die Platzierung von Partner-Links zu Amazon.de Werbekostenerstattung verdient werden kann.
      </p>
      <p className="text-xs text-zinc-600 mt-8">
        Bitte lasse deine Datenschutzerklärung von einem Rechtsexperten prüfen oder erstelle eine vollständige Version mit einem Generator (z.B. eRecht24).
      </p>
    </div>
  );

  return (
    <>
      <footer className="bg-zinc-950 text-zinc-400 py-12 mt-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
            <div>
              <span className="font-serif text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight block mb-4">
                Luxury Health
              </span>
              <p className="text-sm md:text-base text-zinc-400">
                Entdecke hochwertige Supplements, Vitamine und weitere Fitness-Produkte. Top Empfehlungen zu Amazon Artikeln für deine Gesundheit, Leistung und Fitness an einem Ort.
              </p>
            </div>
            <div>
              <h4 className="text-zinc-100 font-medium mb-4 md:text-lg">Rechtliches</h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li>
                  <button onClick={() => setActiveModal('impressum')} className="hover:text-amber-500 transition-colors">
                    Impressum
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('datenschutz')} className="hover:text-amber-500 transition-colors">
                    Datenschutz
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-zinc-100 font-medium mb-4 md:text-lg">Socials</h4>
              <div className="space-y-2 text-sm md:text-base">
                <button 
                  onClick={() => setShowTikTokLinks(!showTikTokLinks)}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-500 transition-colors font-medium focus:outline-none"
                >
                  <span>TikTok</span>
                  <span className="text-[10px] md:text-xs text-zinc-500">{showTikTokLinks ? '▲' : '▼'}</span>
                </button>
                {showTikTokLinks && (
                  <ul className="pl-4 space-y-2 mt-2 border-l border-zinc-800 animate-fadeIn">
                    <li>
                      <a 
                        href="https://www.tiktok.com/@by.rubinxo" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-zinc-400 hover:text-amber-500 transition-colors block py-0.5"
                      >
                        @by.rubinxo
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.tiktok.com/@denoistanders" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-zinc-400 hover:text-amber-500 transition-colors block py-0.5"
                      >
                        @denoistanders
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-zinc-900 text-xs md:text-sm flex flex-col items-start gap-4">
            <p className="max-w-4xl leading-relaxed text-zinc-500">
              <strong className="text-zinc-400">Werbehinweis / Affiliate-Kennzeichnung:</strong> Einige Links auf dieser Website sind Affiliate-Links. Wenn du über diese Links einkaufst, erhalten wir möglicherweise eine Provision. Für dich entstehen keine Mehrkosten. <br className="hidden md:block"/>
              Wir sind Teilnehmer des Amazon-Partnerprogramms, das zur Bereitstellung eines Mediums für Websites konzipiert wurde, mittels dessen durch die Platzierung von Partner-Links zu Amazon.de Werbekostenerstattung verdient werden kann. Amazon und das Amazon-Logo sind Warenzeichen von Amazon.com, Inc. oder eines seiner verbundenen Unternehmen.
            </p>
            <p className="flex items-center gap-1 shrink-0 mt-4 text-zinc-600">
              Made with <Heart className="w-3 h-3 text-amber-500" /> by Luxury Health
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
