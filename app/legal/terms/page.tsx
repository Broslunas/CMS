
export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Términos de Servicio</h1>
      <p className="text-muted-foreground mb-8">Última actualización: 10 de Octubre, 2024</p>
      
      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Aceptación de los Términos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Al acceder y utilizar Broslunas CMS ("el Servicio"), usted acepta y acuerda estar obligado por los términos y disposiciones de este acuerdo. Además, al utilizar estos servicios particulares, usted estará sujeto a cualquier regla o guía de uso publicada aplicable a dichos servicios.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Descripción del Servicio</h2>
          <p className="text-muted-foreground leading-relaxed">
            Broslunas CMS es una herramienta de gestión de contenido para sitios web estáticos construidos con Astro. El Servicio se integra con GitHub para permitir la edición de contenido. Nos reservamos el derecho de modificar, suspender o discontinuar el Servicio en cualquier momento con aviso previo razonable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Conducta del Usuario</h2>
          <p className="text-muted-foreground leading-relaxed">
             Usted es el único responsable de todo el código, video, imágenes, información, datos, texto, software, música, sonido, gráficos, mensajes u otros materiales ("contenido") que usted cargue, publique o muestre a través del Servicio. Usted acepta no utilizar el Servicio para ningún propósito ilegal o no autorizado.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Propiedad Intelectual</h2>
          <p className="text-muted-foreground leading-relaxed">
            El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Broslunas y sus licenciantes. El Servicio está protegido por derechos de autor, marcas registradas y otras leyes tanto de España como de países extranjeros.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Limitación de Responsabilidad</h2>
          <p className="text-muted-foreground leading-relaxed">
            En ningún caso Broslunas, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo sin limitación, pérdida de beneficios, datos, uso, buena voluntad, u otras pérdidas intangibles, resultantes de su acceso o uso o incapacidad de acceder o usar el Servicio.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Ley Aplicable</h2>
          <p className="text-muted-foreground leading-relaxed">
            Estos Términos se regirán e interpretarán de acuerdo con las leyes de España, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
          </p>
        </section>
      </div>
    </div>
  );
}
