"use client";
import { motion } from "framer-motion";
import { FaShieldAlt, FaUser, FaDatabase, FaLock, FaEye, FaTrash } from "react-icons/fa";
import Link from "next/link";

export default function PrivacyPolicy() {
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
              <FaShieldAlt className="text-primary text-2xl" />
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Política de Privacidad
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
                <FaUser className="text-primary" />
                1. Información que Recopilamos
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  En KiloApp, nos comprometemos a proteger tu privacidad. Esta política describe cómo recopilamos, 
                  utilizamos y protegemos tu información personal.
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Información Personal:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Nombre:</strong> Para personalizar tu experiencia</li>
                    <li>• <strong>Edad:</strong> Para calcular necesidades nutricionales</li>
                    <li>• <strong>Género:</strong> Para recomendaciones personalizadas</li>
                    <li>• <strong>Peso:</strong> Para seguimiento de progreso</li>
                    <li>• <strong>Nivel de Actividad:</strong> Para cálculos de calorías</li>
                    <li>• <strong>Email:</strong> Para autenticación y comunicación</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaDatabase className="text-primary" />
                2. Cómo Utilizamos tu Información
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Utilizamos tu información personal para:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Funcionalidad Principal</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Seguimiento de peso</li>
                      <li>• Registro de agua</li>
                      <li>• Planificación de comidas</li>
                      <li>• Seguimiento de ejercicios</li>
                    </ul>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Mejoras del Servicio</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Personalización de contenido</li>
                      <li>• Análisis de uso</li>
                      <li>• Mejoras de funcionalidad</li>
                      <li>• Soporte al cliente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaLock className="text-primary" />
                3. Protección de Datos
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Encriptación:</strong> Todos los datos se transmiten y almacenan de forma encriptada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Acceso Limitado:</strong> Solo personal autorizado puede acceder a datos personales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Monitoreo:</strong> Supervisamos constantemente nuestros sistemas de seguridad</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Actualizaciones:</strong> Mantenemos nuestros sistemas actualizados con las últimas medidas de seguridad</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaEye className="text-primary" />
                4. Tus Derechos (GDPR/CCPA)
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Tienes derecho a:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Acceso y Control</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Ver tus datos personales</li>
                      <li>• Corregir información incorrecta</li>
                      <li>• Solicitar copia de tus datos</li>
                      <li>• Limitar el procesamiento</li>
                    </ul>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Eliminación</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Solicitar eliminación de datos</li>
                      <li>• Cancelar tu cuenta</li>
                      <li>• Retirar consentimiento</li>
                      <li>• Portabilidad de datos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-primary" />
                5. Cookies y Tecnologías Similares
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Utilizamos cookies esenciales para el funcionamiento de la aplicación:
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Cookies Esenciales</h4>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Autenticación:</strong> Mantener tu sesión activa</li>
                        <li>• <strong>Preferencias:</strong> Recordar tu configuración</li>
                        <li>• <strong>Seguridad:</strong> Proteger contra ataques</li>
                        <li>• <strong>Funcionalidad:</strong> Características básicas de la app</li>
                      </ul>
                    </div>
                    <p className="text-sm">
                      Puedes gestionar las cookies en la configuración de tu navegador, pero esto puede afectar 
                      la funcionalidad de KiloApp.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Contacto</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Si tienes preguntas sobre esta política de privacidad o quieres ejercer tus derechos, 
                  contáctanos:
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> soporte@kiloapp.com</p>
                    <p><strong>Asunto:</strong> Consulta sobre Política de Privacidad</p>
                    <p className="text-sm">
                      Responderemos a tu solicitud dentro de los 30 días hábiles.
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