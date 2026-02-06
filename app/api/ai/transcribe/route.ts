import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "La URL del audio es requerida" }, { status: 400 });
    }

    const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      { url },
      {
        smart_format: true,
        model: "nova-2",
        language: "es",
        punctuation: true,
        paragraphs: true,
        diarize: true, // Ayuda a separar mejor las intervenciones
      }
    );

    if (error) {
      throw error;
    }

    // Usar párrafos y frases en lugar de "utterances" para obtener bloques con más sentido
    const channel = result.results?.channels[0];
    const alternative = channel?.alternatives[0];
    const paragraphs = alternative?.paragraphs?.paragraphs;
    
    if (!paragraphs || paragraphs.length === 0) {
        const transcript = alternative?.transcript;
        return NextResponse.json([{ time: "00:00", text: transcript || "" }]);
    }

    const transcription: { time: string; text: string }[] = [];

    paragraphs.forEach((p: any) => {
        if (p.sentences && p.sentences.length > 0) {
            // Tomamos el tiempo de inicio de la primera frase del párrafo
            const startTime = p.sentences[0].start;
            const minutes = Math.floor(startTime / 60);
            const seconds = Math.floor(startTime % 60);
            const time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Unimos todas las frases del párrafo en un solo bloque de texto
            const fullText = p.sentences.map((s: any) => s.text).join(" ");
            
            transcription.push({
                time,
                text: fullText
            });
        }
    });

    return NextResponse.json(transcription);

  } catch (error: any) {
    console.error("Error en API de Transcripción:", error);
    return NextResponse.json({ 
        error: "Error al transcribir audio", 
        message: error.message 
    }, { status: 500 });
  }
}
