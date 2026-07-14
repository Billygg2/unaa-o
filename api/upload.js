import { handleUpload } from "@vercel/blob/client";
export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Método no permitido" });
  try {
    const result = await handleUpload({ body: request.body, request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = JSON.parse(clientPayload || "{}");
        if (!process.env.UPLOAD_PIN || payload.pin !== process.env.UPLOAD_PIN) throw new Error("La clave no es correcta");
        if (!/^(songs|memories)\/(media|metadata)\//.test(pathname)) throw new Error("Ruta no permitida");
        return { allowedContentTypes: ["audio/mpeg","audio/mp4","audio/wav","audio/ogg","image/jpeg","image/png","image/webp","application/json"], maximumSizeInBytes: pathname.includes("/media/") ? 150*1024*1024 : 100*1024, addRandomSuffix: true };
      }, onUploadCompleted: async () => {}
    });
    return response.status(200).json(result);
  } catch (error) { return response.status(400).json({ error: error.message || "No se pudo autorizar" }); }
}
