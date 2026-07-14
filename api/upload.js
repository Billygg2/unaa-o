import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned } from "@vercel/blob/client";

const allowedContentTypes = [
  "audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg",
  "image/jpeg", "image/png", "image/webp", "application/json"
];

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Método no permitido" });
  }

  try {
    const result = await handleUploadPresigned({
      body: request.body,
      request,
      getSignedToken: async (pathname, clientPayload) => {
        const payload = JSON.parse(clientPayload || "{}");

        if (!process.env.UPLOAD_PIN) {
          throw new Error("UPLOAD_PIN no está configurado en Vercel");
        }
        if (payload.pin !== process.env.UPLOAD_PIN) {
          throw new Error("La clave no es correcta");
        }
        if (!/^(songs|memories)\/(media|metadata)\//.test(pathname)) {
          throw new Error("Ruta no permitida");
        }

        const maximumSizeInBytes = pathname.includes("/media/")
          ? 150 * 1024 * 1024
          : 100 * 1024;

        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes,
          maximumSizeInBytes
        });

        return {
          token,
          urlOptions: {
            allowedContentTypes,
            maximumSizeInBytes,
            addRandomSuffix: true
          }
        };
      },
      onUploadCompleted: async () => {}
    });

    return response.status(200).json(result);
  } catch (error) {
    console.error("Blob upload authorization failed:", error);
    return response.status(400).json({
      error: error.message || "No se pudo autorizar la subida"
    });
  }
}
