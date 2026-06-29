export interface CartItem {
	id: string; // unique per line item
	collectionSlug: string;
	collectionName: string;
	productTypeId: string;
	productTypeName: string;
	topSize: string;
	bottomSize?: string; // only for bunk beds with mixed sizes
	finishId: string;
	finishName: string;
	addonIds: string[]; // 'drawers' | 'ladder' | 'trundle-bed'
	addonNames: string[];
	unitPrice: number; // total price in dollars including addons & finish
	quantity: number;
}

function createCart() {
	let items = $state<CartItem[]>([]);
	let initialized = false;

	function init() {
		if (initialized || typeof window === 'undefined') return;
		initialized = true;
		try {
			const stored = localStorage.getItem('vbb-cart');
			if (stored) items = JSON.parse(stored);
		} catch {
			// ignore corrupt storage
		}
	}

	function persist() {
		if (typeof window === 'undefined') return;
		localStorage.setItem('vbb-cart', JSON.stringify(items));
	}

	return {
		get items() {
			init();
			return items;
		},
		get count() {
			init();
			return items.reduce((sum, i) => sum + i.quantity, 0);
		},
		get total() {
			init();
			return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
		},
		add(item: CartItem) {
			init();
			items.push(item);
			persist();
		},
		remove(id: string) {
			init();
			items = items.filter((i) => i.id !== id);
			persist();
		},
		clear() {
			items = [];
			persist();
		}
	};
}

export const cart = createCart();
