import { list } from "@vercel/blob";
export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).json({ error: "Método no permitido" });
  try {
    const [s,m]=await Promise.all([list({prefix:"songs/metadata/",limit:1000}),list({prefix:"memories/metadata/",limit:1000})]);
    const read=(items)=>Promise.all(items.map(async b=>{const r=await fetch(b.url,{cache:"no-store"});return r.ok?r.json():null;}));
    const [songs,memories]=await Promise.all([read(s.blobs),read(m.blobs)]); response.setHeader("Cache-Control","no-store");
    return response.status(200).json({songs:songs.filter(Boolean),memories:memories.filter(Boolean)});
  } catch(error){return response.status(500).json({error:"No se pudo cargar el contenido"});}
}
