import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

// Barra superior: logo, enlaces y estado de la sesión
export default async function Encabezado() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const iniciales = (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <header className="border-b border-borde bg-white">
      <div className="mx-auto max-w-6xl px-6 py-3 flex flex-wrap items-center gap-x-7 gap-y-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-paprika text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 14h18M5 14a7 7 0 0 1 14 0M12 5v2M2 17h20" />
            </svg>
          </span>
          <span className="font-titulo text-2xl font-bold">RecetApp</span>
        </Link>

        <nav aria-label="Principal" className="ml-auto flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px]">
          <Link href="/" className="font-semibold">Explorar</Link>
          {user && <Link href="/favoritos" className="text-gris hover:text-tinta">Favoritos</Link>}
          <Link
            href={user ? "/publicar" : "/login"}
            className="flex h-11 items-center gap-2 rounded-xl bg-paprika px-4 font-semibold text-white hover:bg-paprika-oscuro"
          >
            + Publicar receta
          </Link>
          {user ? (
            <Link
              href="/perfil"
              aria-label="Mi perfil"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-paprika-suave text-sm font-semibold text-paprika"
            >
              {iniciales}
            </Link>
          ) : (
            <Link href="/login" className="font-semibold text-paprika hover:text-paprika-oscuro">
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
