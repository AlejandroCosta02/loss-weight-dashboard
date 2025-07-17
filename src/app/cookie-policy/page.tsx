"use client";
import { motion } from "framer-motion";
import { FaCookieBite, FaShieldAlt, FaCog, FaEye, FaTrash, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaCookieBite className="text-primary text-2xl" />
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Política de Cookies
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Última actualización: {new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-primary" />
                1. ¿Qué son las Cookies?
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando 
                  visitas un sitio web. Estas cookies nos ayudan a mejorar tu experiencia en KiloApp 
                  y a proporcionar funcionalidades esenciales.
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3">¿Cómo funcionan?</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Se almacenan en tu navegador cuando visitas KiloApp</li>
                    <li>• Contienen información sobre tu sesión y preferencias</li>
                    <li>• Se envían de vuelta al servidor en futuras visitas</li>
                    <li>• Nos permiten recordar tu configuración y estado de sesión</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Types of Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaCookieBite className="text-primary" />
                2. Tipos de Cookies que Utilizamos
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <FaShieldAlt className="text-green-500" />
                      Cookies Esenciales
                    </h3>
                    <p className="text-sm mb-3">
                      Estas cookies son necesarias para el funcionamiento básico de KiloApp.
                    </p>
                    <ul className="text-sm space-y-2">
                      <li>• <strong>Autenticación:</strong> Mantener tu sesión activa</li>
                      <li>• <strong>Seguridad:</strong> Proteger contra ataques y fraudes</li>
                      <li>• <strong>Funcionalidad:</strong> Características básicas de la app</li>
                      <li>• <strong>Preferencias:</strong> Recordar tu configuración</li>
                    </ul>
                    <p className="text-xs mt-3 text-muted-foreground">
                      No puedes desactivar estas cookies sin afectar la funcionalidad.
                    </p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <FaCog className="text-blue-500" />
                      Cookies de Rendimiento
                    </h3>
                    <p className="text-sm mb-3">
                      Nos ayudan a mejorar el rendimiento y la experiencia del usuario.
                    </p>
                    <ul className="text-sm space-y-2">
                      <li>• <strong>Análisis:</strong> Entender cómo usas la aplicación</li>
                      <li>• <strong>Optimización:</strong> Mejorar la velocidad y funcionalidad</li>
                      <li>• <strong>Errores:</strong> Identificar y solucionar problemas</li>
                      <li>• <strong>Uso:</strong> Estadísticas de uso anónimas</li>
                    </ul>
                    <p className="text-xs mt-3 text-muted-foreground">
                      Puedes desactivar estas cookies en tu navegador.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Specific Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Cookies Específicas de KiloApp</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Cookies de Sesión</h4>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Nombre:</strong> session_id</li>
                        <li>• <strong>Propósito:</strong> Mantener tu sesión activa</li>
                        <li>• <strong>Duración:</strong> Hasta que cierres el navegador</li>
                        <li>• <strong>Tipo:</strong> Esencial</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Cookies de Preferencias</h4>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Nombre:</strong> user_preferences</li>
                        <li>• <strong>Propósito:</strong> Recordar tu configuración</li>
                        <li>• <strong>Duración:</strong> 1 año</li>
                        <li>• <strong>Tipo:</strong> Esencial</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Cookies de Seguridad</h4>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Nombre:</strong> csrf_token</li>
                        <li>• <strong>Propósito:</strong> Proteger contra ataques CSRF</li>
                        <li>• <strong>Duración:</strong> Hasta que cierres el navegador</li>
                        <li>• <strong>Tipo:</strong> Esencial</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Third Party Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Cookies de Terceros</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Actualmente, KiloApp no utiliza cookies de terceros. Todas las cookies que utilizamos 
                  son propias y están diseñadas específicamente para el funcionamiento de nuestra aplicación.
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Política de Terceros</h3>
                  <ul className="text-sm space-y-2">
                    <li>• No compartimos datos con terceros para publicidad</li>
                    <li>• No utilizamos servicios de análisis externos</li>
                    <li>• No implementamos cookies de seguimiento de terceros</li>
                    <li>• Mantenemos el control total sobre tus datos</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookie Management */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaCog className="text-primary" />
                5. Gestión de Cookies
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Tienes varias opciones para gestionar las cookies en KiloApp:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Configuración del Navegador</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Bloquear todas las cookies</li>
                      <li>• Permitir solo cookies esenciales</li>
                      <li>• Eliminar cookies existentes</li>
                      <li>• Configurar notificaciones</li>
                    </ul>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Consideraciones</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Bloquear cookies puede afectar la funcionalidad</li>
                      <li>• Necesitarás iniciar sesión más frecuentemente</li>
                      <li>• Algunas características pueden no funcionar</li>
                      <li>• La experiencia puede ser menos personalizada</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* GDPR/CCPA Compliance */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-primary" />
                6. Cumplimiento GDPR/CCPA
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Cumplimos con las regulaciones de privacidad internacionales:
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">GDPR (Europa)</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Consentimiento explícito antes de usar cookies</li>
                        <li>• Derecho a retirar el consentimiento</li>
                        <li>• Información clara sobre el uso de cookies</li>
                        <li>• Acceso y control sobre tus datos</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">CCPA (California)</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Derecho a saber qué datos recopilamos</li>
                        <li>• Derecho a solicitar eliminación de datos</li>
                        <li>• Derecho a optar por no vender datos</li>
                        <li>• No discriminación por ejercer derechos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaEye className="text-primary" />
                7. Tus Derechos sobre Cookies
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Tienes derecho a:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Control de Cookies</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Rechazar cookies no esenciales</li>
                      <li>• Eliminar cookies existentes</li>
                      <li>• Configurar preferencias de cookies</li>
                      <li>• Solicitar información sobre cookies</li>
                    </ul>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Derechos de Datos</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Acceder a datos recopilados</li>
                      <li>• Solicitar eliminación de datos</li>
                      <li>• Portabilidad de datos</li>
                      <li>• Rectificación de datos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Actualizaciones de esta Política</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Podemos actualizar esta Política de Cookies ocasionalmente. Te notificaremos sobre 
                  cambios significativos a través de:
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <ul className="space-y-2 text-sm">
                    <li>• Notificación en la aplicación</li>
                    <li>• Email a tu dirección registrada</li>
                    <li>• Actualización de la fecha en esta página</li>
                    <li>• Banner de notificación en el sitio web</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Contacto</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Si tienes preguntas sobre nuestra Política de Cookies, contáctanos:
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> soporte@kiloapp.com</p>
                    <p><strong>Asunto:</strong> Consulta sobre Política de Cookies</p>
                    <p className="text-sm">
                      Responderemos a tu consulta dentro de los 30 días hábiles.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Back to Home */}
            <div className="pt-8 border-t border-border">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                ← Volver al Inicio
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 