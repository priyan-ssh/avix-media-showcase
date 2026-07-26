import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import siteJson from "@/content/site.json";
import homeJson from "@/content/home.json";
import aboutJson from "@/content/about.json";
import contactJson from "@/content/contact.json";

const fallbacks = {
  site: siteJson,
  home: homeJson,
  about: aboutJson,
  contact: contactJson,
} as const;

export type PageKey = keyof typeof fallbacks;

export const contentQueryOptions = <K extends PageKey>(page: K) => ({
  queryKey: ["site_content", page],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("page", page)
      .maybeSingle();
    if (error) throw error;
    return (data?.data ?? fallbacks[page]) as (typeof fallbacks)[K];
  },
  placeholderData: fallbacks[page] as (typeof fallbacks)[K],
  staleTime: 60_000,
});

export function useContent<K extends PageKey>(page: K): (typeof fallbacks)[K] {
  const query = useQuery(contentQueryOptions(page));
  return (query.data ?? fallbacks[page]) as (typeof fallbacks)[K];
}

export type DbClip = {
  id: string;
  brand: string;
  title: string;
  title_accent: string;
  accent_color: "red" | "yellow" | "green" | string;
  views: string;
  image: string;
  position: number;
};

const clipsFallback: DbClip[] = (homeJson.clips.items ?? []).map((c, i) => ({
  id: String(i),
  brand: c.brand,
  title: c.title,
  title_accent: c.titleAccent,
  accent_color: c.accentColor,
  views: c.views,
  image: c.image ?? "",
  position: i + 1,
}));

export const clipsQueryOptions = {
  queryKey: ["clips"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("clips")
      .select("*")
      .order("position", { ascending: true });
    if (error) throw error;
    return (data ?? []) as DbClip[];
  },
  placeholderData: clipsFallback,
  staleTime: 60_000,
};

export function useClips(): DbClip[] {
  const query = useQuery(clipsQueryOptions);
  return (query.data ?? clipsFallback) as DbClip[];
}
