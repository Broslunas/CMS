
export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
      <p className="text-muted-foreground mb-8">Última actualización: 10 de Octubre, 2024</p>
      
      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introducción</h2>
          <p className="text-muted-foreground leading-relaxed">
            En Broslunas CMS ("nosotros", "nuestro" o "la Empresa"), respetamos su privacidad y estamos comprometidos a protegerla mediante el cumplimiento de esta política.
            Esta política describe los tipos de información que podemos recopilar de usted o que usted puede proporcionar cuando visita el sitio web broslunas.com (nuestro "Sitio Web") y nuestras prácticas para recopilar, usar, mantener, proteger y divulgar esa información.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Información que recopilamos</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Recopilamos varios tipos de información de y sobre los usuarios de nuestro Sitio Web, incluida información:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Por la cual se le puede identificar personalmente, como nombre, dirección postal, dirección de correo electrónico, número de teléfono ("información personal").</li>
            <li>Sobre su conexión a internet, el equipo que utiliza para acceder a nuestro Sitio Web y detalles de uso.</li>
            <li>Información de Repositorios: Para proporcionar nuestro servicio, accedemos a repositorios de GitHub según los permisos que usted otorgue. No almacenamos el contenido de sus repositorios, solo metadatos necesarios.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Cómo usamos su información</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Utilizamos la información que recopilamos sobre usted o que usted nos proporciona, incluida cualquier información personal:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Para presentarle nuestro Sitio Web y su contenido.</li>
            <li>Para proporcionarle información, productos o servicios que nos solicite.</li>
            <li>Para cumplir con cualquier otro propósito para el cual la proporcione.</li>
            <li>Para notificarle sobre cambios en nuestro Sitio Web o cualquier producto o servicio que ofrezcamos o proporcionemos a través de él.</li>
            <li>Para mejorar nuestro Sitio Web y ofrecerle una mejor experiencia personalizada.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Seguridad de los datos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hemos implementado medidas diseñadas para proteger su información personal de pérdidas accidentales y del acceso, uso, alteración y divulgación no autorizados. Toda la información que nos proporciona se almacena en nuestros servidores seguros detrás de cortafuegos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Contacto</h2>
          <p className="text-muted-foreground leading-relaxed">
            Para hacer preguntas o comentarios sobre esta política de privacidad y nuestras prácticas de privacidad, contáctenos en: privacy@broslunas.com
          </p>
        </section>
      </div>
    </div>
  );
}
