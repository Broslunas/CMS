
export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Política de Cookies</h1>
      <p className="text-muted-foreground mb-8">Última actualización: 10 de Octubre, 2024</p>
      
      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">1. ¿Qué son las cookies?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Las cookies son pequeños archivos de texto que los sitios web que visita colocan en su ordenador. Se utilizan ampliamente para hacer que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Cómo usamos las cookies</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Utilizamos cookies para los siguientes propósitos:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">Cookies Esenciales:</strong> Necesarias para el funcionamiento del sitio web. Nos permiten recordar sus preferencias de inicio de sesión y mantener su sesión segura.</li>
            <li><strong className="text-foreground">Cookies de Rendimiento:</strong> Nos ayudan a entender cómo los visitantes interactúan con el sitio web, recopilando y reportando información de forma anónima.</li>
            <li><strong className="text-foreground">Cookies de Funcionalidad:</strong> Permiten que el sitio web recuerde las elecciones que usted hace (como su nombre de usuario, idioma o la región en la que se encuentra) y proporcionan características mejoradas y más personales.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Gestión de Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            La mayoría de los navegadores web le permiten controlar las cookies a través de la configuración de sus preferencias. Sin embargo, si limita la capacidad de los sitios web para establecer cookies, puede empeorar su experiencia general de usuario, ya que ya no será personalizada para usted. También puede impedirle guardar configuraciones personalizadas como la información de inicio de sesión.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Cookies de Terceros</h2>
          <p className="text-muted-foreground leading-relaxed">
            En algunos casos especiales, también utilizamos cookies proporcionadas por terceros de confianza. El siguiente sitio detalla qué cookies de terceros puede encontrar a través de este sitio.
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
             <li>Este sitio utiliza Google Analytics, que es una de las soluciones de análisis más extendidas y confiables en la web para ayudarnos a comprender cómo utiliza el sitio y las formas en que podemos mejorar su experiencia.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
