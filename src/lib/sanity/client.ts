import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;
import {
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_DATASET
} from '$env/static/public';

export const sanityClient = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: '2024-01-01',
	useCdn: false
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}
