import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

type Categoria = { id: number; nombre: string };
type Receta = {
  id: string;
  titulo: string;
  foto_url: string;
  tiempo_min: number;
  porciones: number;
  categorias: { nombre: string } | null;
};

// Página de inicio: buscador, filtros por categoría y recetas recientes
export default async function Inicio({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const busqueda = typeof params.q === "string" ? params.q.trim() : "";
  const categoria = typeof params.cat === "string" ? params.cat : "";

  const supabase = await createClient();

  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre")
    .order("id")
    .returns<Categoria[]>();

  let consulta = supabase
    .from("recetas")
    .select("id, titulo, foto_url, tiempo_min, porciones, categorias(nombre)")
    .order("fecha_creacion", { ascending: false })
    .limit(24);

  if (busqueda) consulta = consulta.ilike("titulo", `%${busqueda}%`);
  if (categoria) consulta = consulta.eq("categoria_id", Number(categoria));

  const { data: recetas, error } = await consulta.returns<Receta[]>();

  // Arma el enlace de cada categoría conservando la búsqueda
  const enlace = (cat?: number) => {
    const p = new URLSearchParams();
    if (busqueda) p.set("q", busqueda);
    if (cat) p.set("cat", String(cat));
    const texto = p.toString();
    return texto ? `/?${texto}` : "/";
  };

  return (
    <>
      {/* Portada */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-8">
        <h1 className="font-titulo text-4xl sm:text-5xl font-bold leading-tight max-w-2xl">
          Tus recetas, con foto y en un solo lugar
        </h1>
        <p className="mt-4 text-lg text-gris max-w-xl">
          Publica lo que cocinas, encuentra ideas para hoy y guarda tus favoritas.
        </p>

        <form action="/" className="mt-8 flex max-w-xl gap-3">
          {categoria && <input type="hidden" name="cat" value={categoria} />}
          <label htmlFor="q" className="sr-only">Buscar recetas</label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={busqueda}
            placeholder="Ajiaco, arepas, postres…"
            className="h-12 flex-1 rounded-xl border border-borde bg-crema px-4 text-[15px] outline-none focus:border-paprika"
          />
          <button type="submit" className="h-12 rounded-xl bg-paprika px-5 font-semibold text-white hover:bg-paprika-oscuro">
            Buscar
          </button>
        </form>
      </section>

      {/* Recetas */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-titulo text-2xl font-bold">
            {busqueda ? `Resultados para “${busqueda}”` : "Recetas recientes"}
          </h2>
          <nav aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
            <Chip href={enlace()} activa={!categoria}>Todas</Chip>
            {categorias?.map((c) => (
              <Chip key={c.id} href={enlace(c.id)} activa={categoria === String(c.id)}>
                {c.nombre}
              </Chip>
            ))}
          </nav>
        </div>

        {error && (
          <p className="mt-8 rounded-xl bg-paprika-suave p-4 text-paprika-oscuro">
            No se pudieron cargar las recetas: {error.message}
          </p>
        )}

        {!error && recetas?.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-borde bg-crema p-12 text-center">
            <p className="text-lg font-semibold">
              {busqueda || categoria ? "No hay recetas con ese filtro" : "Aún no hay recetas publicadas"}
            </p>
            <p className="mt-2 text-gris">Sé la primera persona en compartir una.</p>
            <Link
              href="/publicar"
              className="mt-6 inline-flex h-12 items-center rounded-xl bg-paprika px-6 font-semibold text-white hover:bg-paprika-oscuro"
            >
              Publicar receta
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
          {recetas?.map((r) => (
            <Link key={r.id} href={`/recetas/${r.id}`} className="group flex flex-col gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.foto_url}
                alt={`Foto de ${r.titulo}`}
                className="h-44 w-full rounded-2xl bg-crema object-cover transition group-hover:opacity-90"
              />
              <span className="text-sm font-semibold text-paprika">{r.categorias?.nombre}</span>
              <span className="text-lg font-semibold leading-snug">{r.titulo}</span>
              <span className="text-sm text-gris">
                {r.tiempo_min} min · {r.porciones} porciones
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function Chip({ href, activa, children }: { href: string; activa: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={activa ? "page" : undefined}
      className={
        activa
          ? "h-9 rounded-full bg-paprika px-4 text-sm font-semibold leading-9 text-white"
          : "h-9 rounded-full border border-borde bg-white px-4 text-sm leading-9 hover:border-paprika"
      }
    >
      {children}
    </Link>
  );
}
