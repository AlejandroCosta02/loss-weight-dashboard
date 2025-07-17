"use client";
import { motion } from "framer-motion";
import { FaGavel, FaUserCheck, FaExclamationTriangle, FaHandshake, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";

export default function TermsOfService() {
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
              <FaGavel className="text-primary text-2xl" />
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Términos de Servicio
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
                <FaHandshake className="text-primary" />
                1. Aceptación de los Términos
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Al acceder y utilizar KiloApp, aceptas estar sujeto a estos Términos de Servicio. 
                  Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Definiciones:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>"Servicio":</strong> La aplicación KiloApp y todos sus componentes</li>
                    <li>• <strong>"Usuario":</strong> Cualquier persona que acceda o utilice el servicio</li>
                    <li>• <strong>"Contenido":</strong> Datos, información y materiales que proporcionas</li>
                    <li>• <strong>"Cuenta":</strong> Tu registro personal en KiloApp</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-primary" />
                2. Descripción del Servicio
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  KiloApp es una aplicación de seguimiento de salud y bienestar que te permite:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Funcionalidades Principales</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Registrar y seguir tu peso</li>
                      <li>• Controlar tu ingesta de agua</li>
                      <li>• Planificar y registrar comidas</li>
                      <li>• Seguir tus rutinas de ejercicio</li>
                    </ul>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Características Adicionales</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Análisis de progreso</li>
                      <li>• Recomendaciones personalizadas</li>
                      <li>• Metas y objetivos</li>
                      <li>• Comunidad de usuarios</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaUserCheck className="text-primary" />
                3. Responsabilidades del Usuario
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Como usuario de KiloApp, te comprometes a:
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Información Veraz:</strong> Proporcionar información precisa y actualizada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Seguridad de la Cuenta:</strong> Mantener tu contraseña segura y no compartirla</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Uso Apropiado:</strong> Utilizar el servicio solo para fines legales y apropiados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Respeto:</strong> No acosar, abusar o dañar a otros usuarios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Cumplimiento:</strong> Respetar todas las leyes aplicables</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-primary" />
                4. Actividades Prohibidas
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Está prohibido:
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <ul className="space-y-3 text-sm">
                    <li>• Intentar acceder a cuentas de otros usuarios</li>
                    <li>• Usar el servicio para actividades ilegales</li>
                    <li>• Interferir con el funcionamiento del servicio</li>
                    <li>• Distribuir malware o código malicioso</li>
                    <li>• Recopilar información de otros usuarios sin consentimiento</li>
                    <li>• Usar bots o scripts automatizados</li>
                    <li>• Intentar descompilar o ingeniería inversa del software</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Propiedad Intelectual</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  KiloApp y todo su contenido, incluyendo pero no limitado a software, diseño, 
                  gráficos y logotipos, son propiedad de KiloApp y están protegidos por leyes de 
                  propiedad intelectual.
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Derechos del Usuario</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Mantienes la propiedad de tus datos personales</li>
                        <li>• Puedes exportar tus datos en cualquier momento</li>
                        <li>• Tienes derecho a eliminar tu cuenta y datos</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Licencia de Uso</h4>
                      <p className="text-sm">
                        Te otorgamos una licencia limitada, no exclusiva y revocable para usar KiloApp 
                        de acuerdo con estos términos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Privacidad y Datos</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Tu privacidad es importante para nosotros. El uso de tu información personal se rige 
                  por nuestra Política de Privacidad.
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Recopilación de Datos</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Recopilamos datos necesarios para el funcionamiento del servicio</li>
                        <li>• No vendemos tus datos personales a terceros</li>
                        <li>• Utilizamos encriptación para proteger tu información</li>
                        <li>• Puedes solicitar la eliminación de tus datos en cualquier momento</li>
                      </ul>
                    </div>
                    <p className="text-sm">
                      Para más información sobre cómo manejamos tus datos, consulta nuestra{" "}
                      <Link href="/privacy-policy" className="text-primary hover:underline">
                        Política de Privacidad
                      </Link>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Descargos de Responsabilidad</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">No es Consejo Médico</h4>
                      <p className="text-sm">
                        KiloApp no proporciona consejos médicos. Siempre consulta con un profesional 
                        de la salud antes de comenzar cualquier programa de ejercicio o dieta.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Servicio "Tal Como Está"</h4>
                      <p className="text-sm">
                        El servicio se proporciona "tal como está" sin garantías de ningún tipo, 
                        expresas o implícitas.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Disponibilidad</h4>
                      <p className="text-sm">
                        Nos esforzamos por mantener el servicio disponible, pero no garantizamos 
                        disponibilidad continua o sin interrupciones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Terminación</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Puedes cancelar tu cuenta en cualquier momento desde la configuración de tu perfil. 
                  También podemos suspender o terminar tu acceso al servicio si:
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <ul className="space-y-2 text-sm">
                    <li>• Violas estos términos de servicio</li>
                    <li>• Realizas actividades fraudulentas</li>
                    <li>• No utilizas tu cuenta durante un período prolongado</li>
                    <li>• Por razones legales o de seguridad</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Contacto</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Si tienes preguntas sobre estos términos de servicio, contáctanos:
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> soporte@kiloapp.com</p>
                    <p><strong>Asunto:</strong> Consulta sobre Términos de Servicio</p>
                    <p className="text-sm">
                      Responderemos a tu consulta lo antes posible.
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