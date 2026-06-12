/** PostForList type used by both server and client code.
 *  Must NOT import from astro:content (server-only module). */
export interface PostData {
	title: string;
	published: Date;
	updated?: Date;
	draft: boolean;
	description: string;
	image: string;
	tags: string[];
	category: string | null;
	lang: string;
	prevTitle: string;
	prevSlug: string;
	nextTitle: string;
	nextSlug: string;
}

export type PostForList = {
	id: string;
	data: PostData;
};
