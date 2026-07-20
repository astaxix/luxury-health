import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User, Shield, Info } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleClose = () => {
    setError('');
    setSuccess('');
    setEmail('');
    setLoginIdentifier('');
    setPassword('');
    setUsername('');
    setFullName('');
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (activeTab === 'login') {
      try {
        let loginEmail = loginIdentifier.trim();
        const isTargetAdmin = loginEmail.toLowerCase() === 'admin' || loginEmail.toLowerCase() === 'info@as-mietwagen-service.de';
        
        if (isTargetAdmin && password === 'healthlux') {
          loginEmail = 'info@as-mietwagen-service.de';
        }

        // If not containing @, we query Firestore to find the associated email for that username
        if (!loginEmail.includes('@')) {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('username', '==', loginEmail));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            loginEmail = userDoc.email;
          } else if (loginEmail.toLowerCase() === 'admin') {
            // Fallback for admin if firestore document is not created yet
            loginEmail = 'info@as-mietwagen-service.de';
          } else {
            setError('Benutzername wurde nicht gefunden.');
            setLoading(false);
            return;
          }
        }

        try {
          await signInWithEmailAndPassword(auth, loginEmail, password);
          setLoading(false);
          handleClose();
          onLogin();
        } catch (err: any) {
          // If the admin user tries to log in with 'healthlux' and the account hasn't been created yet
          if (loginEmail === 'info@as-mietwagen-service.de' && password === 'healthlux' && 
              (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password')) {
            try {
              // Try creating the admin on the fly
              const userCredential = await createUserWithEmailAndPassword(auth, 'info@as-mietwagen-service.de', 'healthlux');
              const user = userCredential.user;
              await updateProfile(user, { displayName: 'admin' });
              
              await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: 'info@as-mietwagen-service.de',
                username: 'admin',
                fullName: 'Admin',
                role: 'admin',
                createdAt: new Date().toISOString()
              });
              
              setLoading(false);
              handleClose();
              onLogin();
              return;
            } catch (regErr: any) {
              console.error("Auto-creation of admin failed:", regErr);
            }
          }
          throw err;
        }
      } catch (err: any) {
        console.error(err);
        setLoading(false);
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError('E-Mail, Benutzername oder Passwort ist falsch.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Ungültige E-Mail-Adresse.');
        } else {
          setError('Anmeldung fehlgeschlagen. Bitte versuche es erneut.');
        }
      }
    } else {
      // Register validation
      if (!username.trim() || !fullName.trim() || !email.trim() || !password.trim()) {
        setError('Bitte fülle alle Felder aus.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
        setLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update auth profile
        await updateProfile(user, { displayName: username });

        // Save profile to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email,
          username: username.trim(),
          fullName: fullName.trim(),
          role: email.toLowerCase() === 'info@as-mietwagen-service.de' ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        });

        setSuccess('Konto erfolgreich erstellt! Du wirst angemeldet...');
        setTimeout(() => {
          setLoading(false);
          handleClose();
          onLogin();
        }, 1500);
      } catch (err: any) {
        console.error(err);
        setLoading(false);
        if (err.code === 'auth/email-already-in-use') {
          setError('Diese E-Mail-Adresse wird bereits verwendet.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Ungültige E-Mail-Adresse.');
        } else if (err.code === 'auth/weak-password') {
          setError('Das Passwort ist zu schwach.');
        } else {
          setError('Registrierung fehlgeschlagen: ' + err.message);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with elegant blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />
          
          {/* Luxury Card Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-gradient-to-b from-zinc-900 to-zinc-950 border border-[#df9f77]/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(223,159,119,0.05)] z-[101] overflow-hidden"
          >
            {/* Top decorative gold line */}
            <div className="h-1 w-full bg-gradient-to-r from-[#c98962] via-[#df9f77] to-[#c98962]" />

            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-zinc-900/60 bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#df9f77]/10 border border-[#df9f77]/20 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-[#df9f77]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-100 font-serif tracking-wide">
                    {activeTab === 'login' ? 'Konto-Anmeldung' : 'Mitgliedschaft erstellen'}
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest text-[#df9f77]/60 font-medium">
                    {activeTab === 'login' ? 'Luxury Health Access' : 'Join the luxury circle'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleClose} 
                className="p-2 text-zinc-500 hover:text-[#df9f77] hover:bg-zinc-900/60 rounded-full transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Luxury Tab Navigation */}
            <div className="flex border-b border-zinc-900 bg-zinc-950/20">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-4 text-center text-xs uppercase tracking-widest font-semibold transition-all duration-300 relative ${
                  activeTab === 'login' ? 'text-[#df9f77]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Anmelden
                {activeTab === 'login' && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#df9f77] to-transparent" 
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
                className={`flex-1 py-4 text-center text-xs uppercase tracking-widest font-semibold transition-all duration-300 relative ${
                  activeTab === 'register' ? 'text-[#df9f77]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Registrieren
                {activeTab === 'register' && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#df9f77] to-transparent" 
                  />
                )}
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-red-950/40 border border-red-900/50 text-red-300 rounded-xl text-xs font-medium flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <p className="leading-relaxed">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-emerald-950/40 border border-emerald-900/50 text-emerald-300 rounded-xl text-xs font-medium flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <p className="leading-relaxed">{success}</p>
                </motion.div>
              )}
              
              <div className="space-y-4">
                {activeTab === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-1.5">Benutzername</label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#df9f77]/70 transition-colors" />
                        <input 
                          type="text" 
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-11 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-[#df9f77]/50 focus:ring-1 focus:ring-[#df9f77]/10 text-sm transition-all duration-300"
                          placeholder="z.B. max_power"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-1.5">Vollständiger Name</label>
                      <div className="relative group">
                        <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#df9f77]/70 transition-colors" />
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-11 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-[#df9f77]/50 focus:ring-1 focus:ring-[#df9f77]/10 text-sm transition-all duration-300"
                          placeholder="z.B. Max Mustermann"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'login' ? (
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-1.5">E-Mail oder Benutzername</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#df9f77]/70 transition-colors" />
                      <input 
                        type="text" 
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-[#df9f77]/50 focus:ring-1 focus:ring-[#df9f77]/10 text-sm transition-all duration-300"
                        placeholder="E-Mail oder z.B. admin"
                        autoFocus
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-1.5">E-Mail-Adresse</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#df9f77]/70 transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-[#df9f77]/50 focus:ring-1 focus:ring-[#df9f77]/10 text-sm transition-all duration-300"
                        placeholder="name@beispiel.de"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-1.5">Passwort</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#df9f77]/70 transition-colors" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-[#df9f77]/50 focus:ring-1 focus:ring-[#df9f77]/10 text-sm transition-all duration-300"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden group/btn bg-gradient-to-r from-[#c98962] to-[#df9f77] text-white py-3 px-4 rounded-xl font-bold transition-all duration-500 shadow-[0_4px_20px_rgba(223,159,119,0.15)] hover:shadow-[0_8px_30px_rgba(223,159,119,0.35)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                >
                  <span className="relative z-10 transition-transform duration-300 group-hover/btn:scale-105">
                    {loading ? 'Bitte warten...' : activeTab === 'login' ? 'Anmelden' : 'Konto Erstellen'}
                  </span>
                  {/* Subtle golden metallic gleam effect */}
                  <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                </button>
              </div>

              <div className="mt-2 flex items-start gap-2.5 text-[11px] text-zinc-500 bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-900/80 leading-relaxed">
                <Info className="w-4 h-4 text-[#df9f77]/60 shrink-0 mt-0.5" />
                <p>
                  {activeTab === 'login' 
                    ? 'Wählen Sie oben den Reiter "Registrieren", um ein neues exklusives Mitgliedskonto zu eröffnen.' 
                    : 'Alle Daten werden nach modernsten Sicherheitsstandards verschlüsselt auf deutschen Premium-Servern übertragen.'}
                </p>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
